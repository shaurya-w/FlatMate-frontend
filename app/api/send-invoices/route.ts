import { NextResponse } from "next/server";
import axios from "axios";
import { jsPDF } from "jspdf";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

console.log("Send Invoices API Route Loaded");


export async function POST(req: Request) {
  try {
    const { invoiceIds } = await req.json();    

    console.log("Fetching invoices for:", invoiceIds);

    // Forward browser cookies to Spring
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
    console.log(springRes.data);

    console.log("SPRING STATUS:", springRes.status);
    console.log("IS ARRAY:", Array.isArray(invoices));

    if (!Array.isArray(invoices)) {
      return NextResponse.json(
        { error: "Invalid invoice data from backend" },
        { status: 500 }
      );
    }

    // Run all emails in parallel
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

        return {
          invoiceId: invoice.invoiceId,
          status: "SUCCESS",
        };
      } catch (err: any) {
        console.error("EMAIL ERROR:", err.message);

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

    return NextResponse.json({
      success: true,
      summary,
    });

  } catch (error: any) {
    console.error("ROUTE ERROR:", error.response?.data || error.message);

    return NextResponse.json(
      { error: "Something broke" },
      { status: 500 }
    );
  }
}


/* =========================
   PDF GENERATION
========================= */
function generateInvoicePDF(invoice: any): ArrayBuffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 20;

  /* ================= LOGO ================= */

  if (invoice.logoUrl) {
    try {
      doc.addImage(invoice.logoUrl, "PNG", 20, 10, 25, 25);
    } catch (err) {
      console.warn("Logo load failed");
    }
  }

  /* ================= SOCIETY HEADER ================= */

  doc.setFontSize(18);
  doc.text("Maintenance Invoice", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Invoice ID: #${invoice.invoiceId}`, pageWidth - 20, 20, {
    align: "right",
  });

  y = 40;

  /* ================= BILLING INFO ================= */

  doc.setFontSize(11);

  doc.text(`Flat: ${invoice.wing}-${invoice.flatNumber}`, 20, y);
  doc.text(`Billing Month: ${invoice.billingMonth}`, 20, y + 8);
  doc.text(`Due Date: ${invoice.dueDate}`, 20, y + 16);

  doc.text(`Status: ${invoice.status}`, pageWidth - 20, y, { align: "right" });
  doc.text(`Issued At: ${invoice.issuedAt}`, pageWidth - 20, y + 8, {
    align: "right",
  });

  y += 30;

  /* ================= TABLE HEADER ================= */

  doc.setFontSize(12);
  doc.setDrawColor(180);

  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  doc.text("Description", 22, y);
  doc.text("Amount (₹)", pageWidth - 22, y, { align: "right" });

  y += 4;
  doc.line(20, y, pageWidth - 20, y);

  y += 10;

  /* ================= LINE ITEMS ================= */

  doc.setFontSize(11);

  invoice.lineItems?.forEach((item: any) => {
    doc.text(item.description, 22, y);
    doc.text(`${item.amount}`, pageWidth - 22, y, { align: "right" });

    y += 8;
  });

  y += 5;
  doc.line(20, y, pageWidth - 20, y);

  y += 12;

  /* ================= FINANCIAL SUMMARY ================= */

  const summaryStart = pageWidth - 90;

  doc.text("Base Amount:", summaryStart, y);
  doc.text(`${invoice.baseAmount}`, pageWidth - 20, y, { align: "right" });

  y += 8;

  doc.text("Previous Arrears:", summaryStart, y);
  doc.text(`${invoice.previousArrears}`, pageWidth - 20, y, {
    align: "right",
  });

  y += 8;

  doc.text("Late Fee:", summaryStart, y);
  doc.text(`${invoice.lateFeeAmount}`, pageWidth - 20, y, {
    align: "right",
  });

  y += 10;

  doc.setFontSize(13);
  doc.text("Total Amount:", summaryStart, y);

  doc.setTextColor(200, 0, 0);
  doc.text(`${invoice.totalAmount}`, pageWidth - 20, y, {
    align: "right",
  });

  doc.setTextColor(0, 0, 0);

  y += 10;

  doc.setFontSize(11);
  doc.text("Amount Paid:", summaryStart, y);
  doc.text(`${invoice.amountPaid}`, pageWidth - 20, y, {
    align: "right",
  });

  y += 25;

  /* ================= SIGNATORY ================= */

  if (invoice.stampImageUrl) {
    try {
      doc.addImage(invoice.stampImageUrl, "PNG", pageWidth - 60, y - 10, 35, 20);
    } catch (err) {
      console.warn("Stamp load failed");
    }
  }

  if (invoice.authorizedSignatoryName) {
    doc.setFontSize(11);
    doc.text(
      `Authorized Signatory`,
      pageWidth - 20,
      y + 10,
      { align: "right" }
    );

    doc.text(
      invoice.authorizedSignatoryName,
      pageWidth - 20,
      y + 18,
      { align: "right" }
    );
  }

  /* ================= FOOTER ================= */

  doc.setFontSize(9);
  doc.setTextColor(120);

  doc.text(
    "This is a system generated invoice from the society billing system.",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  return doc.output("arraybuffer");
}

console.log("PDF Generation Function Ready");


/* =========================
   TRANSPORTER (Create Once)
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


console.log("Email transporter configured");

/* =========================
   SEND EMAIL
========================= */
async function sendInvoiceEmail(invoice: any) {
  const pdfBuffer = generateInvoicePDF(invoice);

  const info = await transporter.sendMail({
    from: `"My Society Billing" <${process.env.SYSTEM_EMAIL}>`,
    to: invoice.email,
    subject: `Invoice #${invoice.invoiceId} ${invoice.societyName}`,
    text: `Dear ${invoice.name},\n\nPlease find your attached invoice.\n\nRegards,\nMy Society Billing`,
    attachments: [
      {
        filename: `Invoice-${invoice.invoiceId}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: "application/pdf",
      },
    ],
  });

  console.log("EMAIL RESPONSE:", info.response);

  return info;
}

