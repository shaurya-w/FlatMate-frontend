import { NextResponse } from "next/server";
import axios from "axios";
import { jsPDF } from "jspdf";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

console.log("Send Invoices API Route Loaded");

export async function POST(req: Request) {
  try {
    const { invoiceIds } = await req.json();

    console.log("==== SEND INVOICES START ====");
    console.log("Invoice IDs received:", invoiceIds);
    console.log("Cookie present:", !!req.headers.get("cookie"));

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

    console.log("SPRING STATUS:", springRes.status);
    console.log("IS ARRAY:", Array.isArray(invoices));
    console.log("TOTAL INVOICES RECEIVED:", Array.isArray(invoices) ? invoices.length : 0);

    if (!Array.isArray(invoices)) {
      return NextResponse.json(
        { error: "Invalid invoice data from backend" },
        { status: 500 }
      );
    }

    if (invoices.length > 0) {
      console.log("SAMPLE INVOICE STRUCTURE:", JSON.stringify(invoices[0], null, 2));
    }

    const emailPromises = invoices.map(async (invoice: any) => {
      try {
        console.log(`\n---- PROCESSING INVOICE #${invoice.invoiceId} ----`);
        console.log("Email:", invoice.email);
        console.log("Name:", invoice.name);
        console.log("Society:", invoice.societyName);
        console.log("LineItems count:", invoice.lineItems?.length ?? 0);

        if (!invoice.email) {
          return {
            invoiceId: invoice.invoiceId,
            status: "FAILED",
            reason: "No email found",
          };
        }

        if (!invoice.lineItems || invoice.lineItems.length === 0) {
          console.warn(`Invoice ${invoice.invoiceId} has no line items`);
        }

        await sendInvoiceEmail(invoice);

        return { invoiceId: invoice.invoiceId, status: "SUCCESS" };
      } catch (err: any) {
        console.error("==== EMAIL FAILED ====");
        console.error({
          invoiceId: invoice.invoiceId,
          error: err.message,
        });

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

    console.log("==== FINAL SUMMARY ====");
    console.log(JSON.stringify(summary, null, 2));

    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    console.error("ROUTE ERROR:", error.response?.data || error.message);
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
  } catch (err) {
    console.warn("Image fetch failed:", {
      url,
      error: (err as any).message,
    });
    return null;
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatBillingMonth(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function fmt(amount: number | null | undefined): string {
  if (amount == null) return "₹0.00";
  return `₹${Number(amount).toFixed(2)}`;
}

/* =========================
   PDF GENERATION
========================= */

async function generateInvoicePDF(invoice: any): Promise<ArrayBuffer> {
  console.log(`Rendering PDF for Invoice #${invoice.invoiceId}`);
  console.log("Line items passed to PDF:", invoice.lineItems?.length ?? 0);

  if (invoice.lineItems?.length > 0) {
    console.log("First line item:", invoice.lineItems[0]);
  }

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
  const DANGER = "#dc2626";
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

  /* ============================================================
     HEADER
  ============================================================ */
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PW, 42, "F");

  doc.setDrawColor(...hexToRGB(BORDER));
  doc.setLineWidth(0.4);
  doc.line(L, 42, R, 42);

  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", L, 8, 24, 24);
    } catch {
      console.warn("Logo render failed");
    }
  }

  const textStartX = logoData ? L + 30 : L;

  doc.setTextColor(...hexToRGB(PRIMARY));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(invoice.societyName ?? "Society Name", textStartX, 14);

  if (invoice.societyAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...hexToRGB(MUTED));
    const addrLines = doc.splitTextToSize(invoice.societyAddress, 95);
    doc.text(addrLines.slice(0, 2), textStartX, 20);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...hexToRGB(PRIMARY));
  doc.text("INVOICE", R, 13, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...hexToRGB(MUTED));
  doc.text(`Invoice #${invoice.invoiceId}`, R, 19, { align: "right" });
  doc.text(`Billing Month: ${formatBillingMonth(invoice.billingMonth)}`, R, 24, {
    align: "right",
  });

  y = 50;

  /* ============================================================
     INFO CARDS
  ============================================================ */
  const leftBoxX = L;
  const leftBoxY = y;
  const leftBoxW = CW * 0.48;
  const leftBoxH = 26;

  const rightBoxX = L + CW * 0.52;
  const rightBoxY = y;
  const rightBoxW = CW * 0.48;
  const rightBoxH = 26;

  doc.setDrawColor(...hexToRGB(BORDER));
  doc.setLineWidth(0.3);

  doc.roundedRect(leftBoxX, leftBoxY, leftBoxW, leftBoxH, 2, 2);
  doc.roundedRect(rightBoxX, rightBoxY, rightBoxW, rightBoxH, 2, 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...hexToRGB(PRIMARY));
  doc.text("BILLED TO", leftBoxX + 4, leftBoxY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...hexToRGB(TEXT));
  doc.text(invoice.name ?? "—", leftBoxX + 4, leftBoxY + 12);
  doc.text(
    `Flat ${invoice.wing ?? ""}-${invoice.flatNumber ?? ""}`,
    leftBoxX + 4,
    leftBoxY + 18
  );
  doc.text(invoice.email ?? "—", leftBoxX + 4, leftBoxY + 24);

  const infoRows: [string, string][] = [
    ["Due Date", formatDate(invoice.dueDate)],
    ["Issued On", formatDate((invoice.issuedAt ?? "").slice(0, 10))],
    ["Status", invoice.status ?? "—"],
  ];

  doc.setFontSize(8.5);
  infoRows.forEach(([label, value], index) => {
    const rowY = rightBoxY + 6 + index * 6;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRGB(PRIMARY));
    doc.text(label, rightBoxX + 4, rowY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...hexToRGB(TEXT));
    doc.text(value, rightBoxX + rightBoxW - 4, rowY, { align: "right" });
  });

  y += 36;

  /* ============================================================
     LINE ITEMS TABLE
  ============================================================ */
  const lineItems: { description: string; amount: number }[] = invoice.lineItems ?? [];
  const tableStartY = y;
  const rowHeight = 8;

  doc.setFillColor(...hexToRGB(ACCENT));
  doc.roundedRect(L, y, CW, rowHeight, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description", L + 4, y + 5.5);
  doc.text("Amount", R - 4, y + 5.5, { align: "right" });

  y += rowHeight;

  if (lineItems.length === 0) {
    doc.setFillColor(...hexToRGB(LIGHT_BG));
    doc.rect(L, y, CW, rowHeight, "F");

    doc.setTextColor(...hexToRGB(MUTED));
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("No charges available", L + 4, y + 5.5);

    y += rowHeight;
  } else {
    lineItems.forEach((item, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(...hexToRGB(LIGHT_BG));
        doc.rect(L, y, CW, rowHeight, "F");
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...hexToRGB(TEXT));

      const desc = item.description ?? "Charge";
      doc.text(desc, L + 4, y + 5.5);
      doc.text(fmt(item.amount), R - 4, y + 5.5, { align: "right" });

      y += rowHeight;
    });
  }

  doc.setDrawColor(...hexToRGB(BORDER));
  doc.roundedRect(L, tableStartY, CW, y - tableStartY, 2, 2);

  y += 10;

  /* ============================================================
     SUMMARY
  ============================================================ */
  const summaryX = L + CW * 0.55;
  const summaryW = CW * 0.45;
  const summaryRowGap = 7;

  const summaryRows: [string, string][] = [
    ["Base Amount", fmt(invoice.baseAmount)],
    ["Previous Arrears", fmt(invoice.previousArrears)],
    ["Late Fee", fmt(invoice.lateFeeAmount)],
  ];

  doc.setDrawColor(...hexToRGB(BORDER));
  doc.roundedRect(summaryX - 4, y - 4, summaryW + 4, 32, 2, 2);

  let sy = y + 2;
  summaryRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...hexToRGB(MUTED));
    doc.text(label, summaryX, sy);

    doc.setTextColor(...hexToRGB(TEXT));
    doc.text(value, R, sy, { align: "right" });

    sy += summaryRowGap;
  });

  doc.setFillColor(...hexToRGB(PRIMARY));
  doc.roundedRect(summaryX - 2, sy - 2, summaryW + 2, 10, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Total Amount", summaryX + 1, sy + 4.5);
  doc.text(fmt(invoice.totalAmount), R - 1, sy + 4.5, { align: "right" });

  y = sy + 16;

  if (invoice.status === "PAID") {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74);
    doc.text(`Amount Paid: ${fmt(invoice.amountPaid)}`, summaryX, y);
    y += 8;
  }

  /* ============================================================
     SIGNATORY
  ============================================================ */
  const sigY = PH - 50;

  if (stampData) {
    try {
      doc.addImage(stampData, "PNG", R - 42, sigY - 16, 36, 18);
    } catch {
      console.warn("Stamp render failed");
    }
  }

  if (invoice.authorizedSignatoryName) {
    doc.setDrawColor(...hexToRGB(BORDER));
    doc.line(R - 60, sigY + 5, R, sigY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...hexToRGB(PRIMARY));
    doc.text(invoice.authorizedSignatoryName, R, sigY + 10, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...hexToRGB(MUTED));
    doc.text("Authorized Signatory", R, sigY + 15, { align: "right" });
  }

  /* ============================================================
     FOOTER
  ============================================================ */
  doc.setFillColor(...hexToRGB(PRIMARY));
  doc.rect(0, PH - 14, PW, 14, "F");

  doc.setTextColor(230, 255, 236);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  const footer =
    invoice.invoiceFooterText ??
    "This is a system-generated invoice. Please contact the society office for any queries.";

  doc.text(footer, PW / 2, PH - 5, { align: "center" });

  return doc.output("arraybuffer");
}

/* =========================
   TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: process.env.SYSTEM_EMAIL,
    pass: process.env.SYSTEM_EMAIL_APP_PASSWORD,
  },
});

/* =========================
   SEND EMAIL
========================= */
async function sendInvoiceEmail(invoice: any) {
  console.log("==== PDF GENERATION START ====");
  console.log({
    invoiceId: invoice.invoiceId,
    email: invoice.email,
    lineItems: invoice.lineItems?.length ?? 0,
    society: invoice.societyName,
    logoUrl: invoice.logoUrl ?? null,
    stampUrl: invoice.stampImageUrl ?? null,
    totalAmount: invoice.totalAmount,
  });

  const pdfBuffer = await generateInvoicePDF(invoice);

  const billingLabel = invoice.billingMonth
    ? new Date(invoice.billingMonth).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Invoice";

  const info = await transporter.sendMail({
    from: `"${invoice.societyName ?? "Society Billing"}" <${process.env.SYSTEM_EMAIL}>`,
    to: invoice.email,
    subject: `Invoice #${invoice.invoiceId} - ${billingLabel} | ${invoice.societyName ?? ""}`,
    text: `Dear ${invoice.name ?? "Resident"},\n\nPlease find attached your maintenance invoice for ${billingLabel}.\n\nTotal Due: ₹${invoice.totalAmount}\nDue Date: ${invoice.dueDate}\n\nKindly ensure timely payment to avoid late fees.\n\nRegards,\n${invoice.societyName ?? "Society Management"}`,
    attachments: [
      {
        filename: `Invoice-${invoice.invoiceId}-${billingLabel.replace(/ /g, "-")}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: "application/pdf",
      },
    ],
  });

  console.log("==== EMAIL SENT SUCCESS ====");
  console.log({
    invoiceId: invoice.invoiceId,
    response: info.response,
  });

  return info;
}