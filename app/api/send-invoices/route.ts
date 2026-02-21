import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { invoiceIds } = await req.json();

    console.log("Received IDs:", invoiceIds);

    const springRes = await axios.post(
      "http://localhost:8080/internal/invoices/for-mail",
      invoiceIds
    );

    console.log("Spring response:", springRes.data);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("ROUTE ERROR:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Something broke" },
      { status: 500 }
    );
  }
}