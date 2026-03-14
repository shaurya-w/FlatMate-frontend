"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InvoiceRow, { Invoice } from "../../../components/InvoicePayButton";


export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}


const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PaymentPage() {

  const { invoiceId } = useParams<{ invoiceId: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetch(`${API}/invoices/${invoiceId}`)
      .then(res => res.json())
      .then((data: Invoice) => setInvoice(data));
  }, [invoiceId]);

  const startPayment = async () => {

    const order: RazorpayOrderResponse = await fetch(
      `${API}/payments/create-order/${invoiceId}`,
      { method: "POST" }
    ).then(res => res.json());

    const options = {
      key: "rzp_test_xxxxx",
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,

      handler: async (response: RazorpayPaymentResponse) => {

        await fetch(`${API}/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          })
        });

        alert("Payment successful");
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="p-10">

      <h1 className="text-xl font-bold">
        Pay Invoice #{invoice.id}
      </h1>

      <div className="mt-5 space-y-2">
        <p>Amount: ₹{invoice.totalAmount}</p>
        <p>Status: {invoice.status}</p>
        <p>Due Date: {invoice.dueDate}</p>
      </div>

      <button
        onClick={startPayment}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>

    </div>
  );
}