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

const STATUS_CONFIG = {
  PAID:    { bg: "#dcfce7", text: "#166534", dot: "#10b981", label: "Paid" },
  ISSUED:  { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6", label: "Due" },
  OVERDUE: { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444", label: "Overdue" },
};

export default function FetchInvoices({ userId }: { userId: number }) {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/user/${userId}/pending`,
          { credentials: "include" }
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
  }, [userId, refresh]);

  const handlePayNow = async (invoiceId: number) => {
    try {
      setPayingId(invoiceId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-order/${invoiceId}`,
        { method: "POST", credentials: "include" }
      );
      const order = await res.json();
      if (!order?.orderId) { console.error("Missing orderId"); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "FlatMate",
        description: "Maintenance Payment",
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                invoiceId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) setRefresh((p) => p + 1);
          } catch (err) { console.error("Verify error:", err); }
        },
        modal: { ondismiss: () => {} },
        theme: { color: "#4f6ef7" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setPayingId(null);
    }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const fmtMonth = (d: string) => new Date(d).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="space-y-3 mt-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-5 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="space-y-2">
              <div className="skeleton h-5 rounded w-20" />
              <div className="skeleton h-3.5 rounded w-32" />
              <div className="skeleton h-3 rounded w-24" />
            </div>
            <div className="skeleton h-9 rounded-lg w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 mt-4 rounded-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--success-subtle)", color: "var(--success)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>All clear!</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>No pending dues at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {invoices.map((inv) => {
        const cfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.ISSUED;
        const isPaying = payingId === inv.invoiceId;

        return (
          <div
            key={inv.invoiceId}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl transition-all"
            style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-xs)")}
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--foreground)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}
                >
                  ₹{inv.pendingAmount.toLocaleString()}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
                  style={{ background: cfg.bg, color: cfg.text }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                  {cfg.label}
                </span>
              </div>

              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {fmtMonth(inv.billingMonth)}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                Due: {fmtDate(inv.dueDate)}
              </p>
              {inv.amountPaid > 0 && (
                <p className="text-xs mt-0.5" style={{ color: "var(--success)" }}>
                  ₹{inv.amountPaid.toLocaleString()} paid
                </p>
              )}
            </div>

            {inv.status !== "PAID" && (
              <button
                onClick={() => handlePayNow(inv.invoiceId)}
                disabled={isPaying}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                style={{ background: "var(--primary)", color: "white" }}
                onMouseEnter={(e) => !isPaying && (e.currentTarget.style.background = "var(--primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
              >
                {isPaying ? (
                  <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Processing…</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> Pay Now</>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
