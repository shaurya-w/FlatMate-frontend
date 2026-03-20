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
  const [refresh, setRefresh] = useState(0);

  // =========================
  // 1. FETCH INVOICES
  // =========================
  useEffect(() => {
  const fetchInvoices = async () => {
    console.log("Fetching invoices for user:", userId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/user/${userId}/pending`,
        { credentials: "include" }
      );

      console.log("Invoice API status:", res.status);

      const data = await res.json();

      console.log("Invoices received:", data);

      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    } finally {
      setLoading(false);
    }
  };

  fetchInvoices();
}, [userId, refresh]);

  // =========================
  // 2. HANDLE PAYMENT
  // =========================
  const handlePayNow = async (invoiceId: number) => {
   // console.log("Pay Now clicked for invoice:", invoiceId);

    try {
      setPayingId(invoiceId);

      // =========================
      // STEP 1: CREATE ORDER
      // =========================

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-order/${invoiceId}`,
        { method: "POST", credentials: "include" }
      );

     // console.log(" Order API status:", res.status);

      const order = await res.json();

      if (!order?.orderId) {
        console.error("Missing orderId! Backend issue.");
        return;
      }

      // =========================
      // STEP 2: OPEN RAZORPAY
      // =========================

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "SocietyPay",
        description: "Maintenance Payment",
        order_id: order.orderId,

        // =========================
        // STEP 3: PAYMENT SUCCESS HANDLER
        // =========================
       handler: async function (response: any) {

  try {
    console.log("Verifying payment on backend...");

    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      }
    );

   // console.log("Verify API status:", verifyRes.status);

    const verifyData = await verifyRes.json();

    if (verifyData.success) {
     // console.log("Payment verified and DB updated");

      // trigger refetch
      setRefresh((prev) => prev + 1);

      alert("Payment successful");
    } else {
      console.error("Verification failed");
      alert("Payment verification failed. Please contact support.");
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
  }
},

        // =========================
        // USER CLOSED PAYMENT
        // =========================
        modal: {
          ondismiss: function () {
            console.log("User closed Razorpay popup");
          },
        },

        theme: {
          color: "#f97316",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("❌ Payment failed:", err);
      alert("Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  // =========================
  // UI
  // =========================
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
          <div>
            <p className="text-gray-800 font-semibold">
              ₹{inv.pendingAmount}
            </p>

            <p className="text-sm text-gray-500">
              Due: {inv.dueDate}
            </p>

            <span className="text-xs px-2 py-1 rounded-full mt-1 inline-block">
              {inv.status}
            </span>
          </div>

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