"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Complaint {
  id: number;
  complaintNumber: string;
  subject: string;
  body: string;
  status: string;
  tag: string;
  adminMessage?: string;
  createdAt: string;
  flatNumber: string;
  wing: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  SUBMITTED:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  LOOKED_AT:   { bg: "#fef9c3", text: "#854d0e", dot: "#f59e0b" },
  IN_PROGRESS: { bg: "#ffedd5", text: "#c2410c", dot: "#f97316" },
  RESOLVED:    { bg: "#dcfce7", text: "#166534", dot: "#10b981" },
  CLOSED:      { bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af" },
};

export default function MyComplaints({ societyId }: { societyId: number }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/society/${societyId}`, { withCredentials: true })
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Failed to fetch complaints", err))
      .finally(() => setLoading(false));
  }, [societyId]);

  if (loading) {
    return (
      <div className="space-y-3 mt-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex gap-2 mb-3">
              <div className="skeleton h-4 rounded w-20" /><div className="skeleton h-4 rounded w-16" />
            </div>
            <div className="skeleton h-4 rounded w-40 mb-1.5" />
            <div className="skeleton h-3 rounded w-56" />
          </div>
        ))}
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 mt-4 rounded-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No complaints raised</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Use the button above to raise a complaint</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {complaints.map((c) => {
        const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.CLOSED;
        return (
          <div
            key={c.id}
            className="rounded-2xl p-5 transition-all"
            style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-xs)")}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {c.complaintNumber}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full"
                    style={{ background: cfg.bg, color: cfg.text }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                    {c.status.replace(/_/g, " ")}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                    {c.tag}
                  </span>
                </div>

                <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--foreground)" }}>{c.subject}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{c.body}</p>

                {/* Admin reply */}
                {c.adminMessage && (
                  <div
                    className="mt-3 px-3.5 py-2.5 rounded-xl"
                    style={{ background: "var(--primary-subtle)", border: "1px solid #c7d2fe" }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "var(--primary)" }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>Admin Response</p>
                    </div>
                    <p className="text-sm" style={{ color: "#1e40af" }}>{c.adminMessage}</p>
                  </div>
                )}
              </div>

              <p className="text-xs flex-shrink-0" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
