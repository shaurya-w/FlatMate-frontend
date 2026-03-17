"use client";

import { useEffect, useState } from "react";

interface InvoiceSummary {
  invoiceId: number;
  totalAmount: number;
  amountPaid: number;
  pendingAmount: number;
  status: "ISSUED" | "OVERDUE" | "PAID";
  billingMonth: string;
  dueDate: string;
}

export default function FetchInvoices({ userId }: { userId: number }) {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/user/${userId}/pending`, 
          {
            credentials: "include"
          }
        );
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [userId]);

  const handlePayNow = async (invoiceId: number) => {
  try {
    setPayingId(invoiceId);

    // Create order
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-order/${invoiceId}`,
      { method: "POST", credentials: "include" }
    );

    const order = await res.json();

    // Open Razorpay
    const options = {
      key:  `${process.env.NEXT_PUBLIC_RAZORPAY_KEY}`, 
      amount: order.amount,
      currency: order.currency,
      name: "SocietyPay",
      description: "Maintenance Payment",
      order_id: order.id,

      handler: async function (response: any) {
        console.log("Payment success:", response);

        // Verify payment
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });

        alert("Payment successful 🎉");

        // optional: refresh invoices
      },

      theme: {
        color: "#f97316",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  } finally {
    setPayingId(null);
  }
};

  if (loading) return <p className="text-gray-500 mt-4">Loading invoices...</p>;

  if (invoices.length === 0)
    return (
      <p className="text-green-600 mt-4 font-medium">
        No pending dues.
      </p>
    );

  return (
    <div className="mt-4 space-y-4">
      {invoices.map((inv) => (
        <div
          key={inv.invoiceId}
          className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center"
        >
          {/* LEFT */}
          <div>
            <p className="text-gray-800 font-semibold">
              ₹{inv.pendingAmount}
            </p>

            <p className="text-sm text-gray-500">
              Due: {inv.dueDate}
            </p>

            <span
              className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                inv.status === "OVERDUE"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {inv.status}
            </span>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => handlePayNow(inv.invoiceId)}
            disabled={payingId === inv.invoiceId}
            className={`px-4 py-2 rounded-lg text-sm text-white ${
              payingId === inv.invoiceId
                ? "bg-gray-400"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {payingId === inv.invoiceId ? "Processing..." : "Pay Now"}
          </button>
        </div>
      ))}
    </div>
  );
}