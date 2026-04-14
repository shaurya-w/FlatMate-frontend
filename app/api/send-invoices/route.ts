import { NextResponse } from "next/server";
import axios from "axios";
import { jsPDF } from "jspdf";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

console.log("Send Invoices API Route Loaded");

export async function POST(req: Request) {
  try {
    const { invoiceIds } = await req.json();

    const cookieHeader = req.headers.get("cookie");

    const springRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/internal/invoices/for-mail`,
      invoiceIds,
      {
        headers: {
          Cookie: cookieHeader ?? "",
        },
        withCredentials: true,
      }
    );

    const invoices = springRes.data;

    if (!Array.isArray(invoices)) {
      return NextResponse.json(
        { error: "Invalid invoice data from backend" },
        { status: 500 }
      );
    }

    const emailPromises = invoices.map(async (invoice: any) => {
      try {
        if (!invoice.email) {
          return {
            invoiceId: invoice.invoiceId,
            status: "FAILED",
            reason: "No email found",
          };
        }

        await sendInvoiceEmail(invoice);
        return { invoiceId: invoice.invoiceId, status: "SUCCESS" };
      } catch (err: any) {
        return {
          invoiceId: invoice.invoiceId,
          status: "FAILED",
          reason: err.message,
        };
      }
    });

    const results = await Promise.allSettled(emailPromises);

    const summary = results.map((result: any) =>
      result.status === "fulfilled"
        ? result.value
        : { status: "FAILED", reason: result.reason }
    );

    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    return NextResponse.json({ error: "Something broke" }, { status: 500 });
  }
}

/* =========================
   HELPERS
========================= */

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 8000,
    });
    const mime = res.headers["content-type"] ?? "image/png";
    const b64 = Buffer.from(res.data as ArrayBuffer).toString("base64");
    return `data:${mime};base64,${b64}`;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBillingMonth(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function fmt(amount: number | null | undefined): string {
  if (amount == null) return "₹0.00";
  return `₹${Number(amount).toFixed(2)}`;
}

/* =========================
   PDF GENERATION
========================= */

async function generateInvoicePDF(invoice: any): Promise<ArrayBuffer> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();

  const L = 15;
  const R = PW - 15;
  const CW = R - L;

  const PRIMARY = "#166534";
  const ACCENT = "#22c55e";
  const LIGHT_BG = "#f0fdf4";
  const BORDER = "#bbf7d0";
  const MUTED = "#6b7280";
  const TEXT = "#111827";

  const hexToRGB = (hex: string): [number, number, number] => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const [logoData, stampData] = await Promise.all([
    invoice.logoUrl ? fetchImageAsBase64(invoice.logoUrl) : Promise.resolve(null),
    invoice.stampImageUrl ? fetchImageAsBase64(invoice.stampImageUrl) : Promise.resolve(null),
  ]);

  let y = 0;

  /* HEADER */
  doc.setDrawColor(...hexToRGB(BORDER));
  doc.line(L, 42, R, 42);

  if (logoData) {
    doc.addImage(logoData, "PNG", L, 8, 24, 24);
  }

  const textStartX = logoData ? L + 30 : L;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...hexToRGB(PRIMARY));
  doc.text(invoice.societyName ?? "Society Name", textStartX, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...hexToRGB(MUTED));
  if (invoice.societyAddress) {
    const addr = doc.splitTextToSize(invoice.societyAddress, 95);
    doc.text(addr, textStartX, 22);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("INVOICE", R, 14, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Invoice #${invoice.invoiceId}`, R, 21, { align: "right" });
  doc.text(`Billing: ${formatBillingMonth(invoice.billingMonth)}`, R, 26, {
    align: "right",
  });

  y = 50;

  /* INFO CARDS */
  const padding = 5;

  doc.roundedRect(L, y, CW * 0.48, 28, 2, 2);
  doc.roundedRect(L + CW * 0.52, y, CW * 0.48, 28, 2, 2);

  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", L + padding, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(invoice.name ?? "—", L + padding, y + 14);
  doc.setFontSize(9);
  doc.text(`Flat ${invoice.wing}-${invoice.flatNumber}`, L + padding, y + 20);
  doc.text(invoice.email ?? "—", L + padding, y + 26);

  const infoRows = [
    ["Due Date", formatDate(invoice.dueDate)],
    ["Issued", formatDate(invoice.issuedAt)],
    ["Status", invoice.status],
  ];

  infoRows.forEach(([l, v], i) => {
    const ry = y + 7 + i * 7;
    doc.setFont("helvetica", "bold");
    doc.text(l, L + CW * 0.52 + padding, ry);
    doc.setFont("helvetica", "normal");
    doc.text(v, R - padding, ry, { align: "right" });
  });

  y += 40;

/* TABLE */
const rowHeight = 9;
const padX = 4;
const amountColW = 42; // fixed amount column width
const descColW = CW - amountColW - padX * 2;
const amountX = R - amountColW; // left edge of amount column

// safer money formatter: avoid ₹ if you're using helvetica
const money = (value: number | string | null | undefined) => {
  const n = Number(value ?? 0);
  return `Rs. ${n.toFixed(2)}`;
};

// header
doc.setFillColor(...hexToRGB(ACCENT));
doc.roundedRect(L, y, CW, rowHeight, 2, 2, "F");

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(255, 255, 255);
doc.text("Description", L + padX, y + 6);
doc.text("Amount", amountX + padX, y + 6); // LEFT aligned now

y += rowHeight;

// body
(invoice.lineItems ?? []).forEach((item: any, i: number) => {
  if (i % 2 === 0) {
    doc.setFillColor(...hexToRGB(LIGHT_BG));
    doc.rect(L, y, CW, rowHeight, "F");
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...hexToRGB(TEXT));

  // description stays inside description column
  doc.text(
    String(item.description ?? "-"),
    L + padX,
    y + 6,
    { maxWidth: descColW }
  );

  // amount stays inside amount column, LEFT aligned
  doc.text(
    money(item.amount),
    amountX + padX,
    y + 6,
    { maxWidth: amountColW - padX * 2 }
  );

  y += rowHeight;
});

y += 10;

/* SUMMARY */
const summaryW = 58;              // fixed width so it doesn't spill out
const summaryX = R - summaryW;    // anchor from right edge safely
const labelX = summaryX + 6;
const valueX = summaryX + 34;     // move values left inside box
const totalH = 11;
const summaryRows = [
  ["Base", money(invoice.baseAmount)],
  ["Arrears", money(invoice.previousArrears)],
  ["Late Fee", money(invoice.lateFeeAmount)],
];

const summaryBoxH = summaryRows.length * 8 + totalH + 10;

// outer summary box
doc.setDrawColor(220, 220, 220);
doc.roundedRect(summaryX, y - 4, summaryW, summaryBoxH, 3, 3);

let sy = y + 2;

summaryRows.forEach(([label, value]) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...hexToRGB(MUTED));
  doc.text(label, labelX, sy);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...hexToRGB(TEXT));
  doc.text(value, valueX, sy, {
    maxWidth: summaryW - 20
  }); // LEFT aligned, inside box

  sy += 8;
});

// total row
doc.setFillColor(...hexToRGB(PRIMARY));
doc.roundedRect(summaryX + 1, sy - 3, summaryW - 2, totalH, 2, 2, "F");

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(255, 255, 255);
doc.text("Total", labelX, sy + 4);
doc.text(money(invoice.totalAmount), valueX, sy + 4, {
  maxWidth: summaryW - 20
});

  /* FOOTER */
  doc.setFillColor(...hexToRGB(PRIMARY));
  doc.rect(0, PH - 16, PW, 16, "F");

  doc.setFontSize(8);
  doc.setTextColor(220, 255, 230);
  doc.text(
    invoice.invoiceFooterText ??
      "This is a system-generated invoice.",
    PW / 2,
    PH - 6,
    { align: "center" }
  );

  return doc.output("arraybuffer");
}

/* =========================
   MAIL
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SYSTEM_EMAIL,
    pass: process.env.SYSTEM_EMAIL_APP_PASSWORD,
  },
});

async function sendInvoiceEmail(invoice: any) {
  const pdfBuffer = await generateInvoicePDF(invoice);

  await transporter.sendMail({
    from: process.env.SYSTEM_EMAIL,
    to: invoice.email,
    subject: `Invoice #${invoice.invoiceId}`,
    text: `Invoice attached`,
    attachments: [
      {
        filename: `invoice-${invoice.invoiceId}.pdf`,
        content: Buffer.from(pdfBuffer),
      },
    ],
  });
}