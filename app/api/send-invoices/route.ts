import { NextResponse } from "next/server";
import axios from "axios";
import { jsPDF } from "jspdf";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

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

/* =========================
   PDF GENERATION
========================= */
function generateInvoicePDF(invoice: any): ArrayBuffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(invoice.societyName || "Society Billing", pageWidth / 2, 18, {
    align: "center",
  });

  doc.setTextColor(0, 0, 0);

  // Title
  doc.setFontSize(16);
  doc.text("INVOICE", 20, 50);

  doc.setFontSize(11);
  doc.text(`Invoice ID: #${invoice.invoiceId}`, 20, 60);
  doc.text(`Due Date: ${invoice.dueDate}`, pageWidth - 60, 60);

  // Customer Box
  doc.setDrawColor(200);
  doc.rect(20, 70, pageWidth - 40, 40);

  doc.text(`Billed To: ${invoice.name || "N/A"}`, 25, 80);
  doc.text(`Email: ${invoice.email || "N/A"}`, 25, 88);
  doc.text(`Flat: ${invoice.flatNumber}`, 25, 96);
  doc.text(`Billing Month: ${invoice.billingMonth}`, 25, 104);

  // Amount Box
  doc.setFillColor(240, 248, 255);
  doc.rect(20, 120, pageWidth - 40, 25, "F");

  doc.setFontSize(14);
  doc.text("Total Amount Due:", 25, 135);

  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0);
  doc.text(`₹ ${invoice.amount}`, pageWidth - 40, 135, {
    align: "right",
  });

  doc.setTextColor(0, 0, 0);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "This is a system generated invoice. Please pay before due date.",
    pageWidth / 2,
    280,
    { align: "center" }
  );

  return doc.output("arraybuffer");
}

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

  //console.log("EMAIL RESPONSE:", info.response);

  return info;
}

/* =========================
   API ROUTE
========================= */

export async function POST(req: Request) {
  try {
    const { invoiceIds } = await req.json();
    

    console.log("Fetching invoices for:", invoiceIds);

    // 🔥 Forward browser cookies to Spring
    const cookieHeader = req.headers.get("cookie");

    const springRes = await axios.post(
      "http://localhost:8080/internal/invoices/for-mail",
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