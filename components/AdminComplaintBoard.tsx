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
  residentName: string;
  flatNumber: string;
  wing: string;
  societyName: string;
}

const STATUSES = ["SUBMITTED", "LOOKED_AT", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  SUBMITTED:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  LOOKED_AT:   { bg: "#fef9c3", text: "#854d0e", dot: "#f59e0b" },
  IN_PROGRESS: { bg: "#ffedd5", text: "#c2410c", dot: "#f97316" },
  RESOLVED:    { bg: "#dcfce7", text: "#166534", dot: "#10b981" },
  CLOSED:      { bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af" },
};

const TAG_COLORS: Record<string, string> = {
  MAINTENANCE: "#dbeafe",
  NOISE: "#fef9c3",
  SECURITY: "#fce7f3",
  CLEANLINESS: "#d1fae5",
  PARKING: "#ede9fe",
  OTHER: "#f3f4f6",
};

export default function AdminComplaintBoard({ societyId }: { societyId: number }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [adminMessages, setAdminMessages] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => { fetchComplaints(); }, [societyId]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/complaints/society/${societyId}`, { withCredentials: true });
      setComplaints(res.data);
      const msgs: Record<number, string> = {};
      res.data.forEach((c: Complaint) => { if (c.adminMessage) msgs[c.id] = c.adminMessage; });
      setAdminMessages(msgs);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaint = async (complaintId: number, status: string) => {
    try {
      setUpdating(complaintId);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/complaints/${complaintId}`,
        { status, adminMessage: adminMessages[complaintId] ?? "" },
        { withCredentials: true }
      );
      await fetchComplaints();
      setExpanded(null);
    } catch {
      console.error("Failed to update complaint");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filterStatus === "ALL" ? complaints : complaints.filter((c) => c.status === filterStatus);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex gap-3 mb-3">
              <div className="skeleton h-4 rounded w-24" />
              <div className="skeleton h-4 rounded w-16" />
            </div>
            <div className="skeleton h-4 rounded w-48 mb-2" />
            <div className="skeleton h-3 rounded w-64" />
          </div>
        ))}
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No complaints yet</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Resident complaints will appear here</p>
      </div>
    );
  }

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
        {["ALL", ...STATUSES].map((s) => {
          const cfg = s === "ALL" ? null : STATUS_CONFIG[s];
          const active = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: active ? (cfg ? cfg.bg : "var(--primary-subtle)") : "var(--card)",
                color: active ? (cfg ? cfg.text : "var(--primary)") : "var(--muted-foreground)",
                border: `1px solid ${active ? (cfg ? cfg.dot + "60" : "var(--primary)") : "var(--border)"}`,
              }}
            >
              {cfg && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />}
              {s === "ALL" ? "All" : s.replace(/_/g, " ")}
              {s !== "ALL" && (
                <span
                  className="ml-0.5 px-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(0,0,0,0.08)", minWidth: "18px", textAlign: "center" }}
                >
                  {complaints.filter((c) => c.status === s).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--muted-foreground)" }}>No complaints with this status</p>
        ) : (
          filtered.map((c) => {
            const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.CLOSED;
            const isExpanded = expanded === c.id;
            const tagBg = TAG_COLORS[c.tag] || "#f3f4f6";

            return (
              <div
                key={c.id}
                className="rounded-2xl overflow-hidden transition-all"
                style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" }}
              >
                {/* Card content */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {c.complaintNumber}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full"
                          style={{ background: cfg.bg, color: cfg.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                          {c.status.replace(/_/g, " ")}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full" style={{ background: tagBg, color: "#374151" }}>
                          {c.tag}
                        </span>
                      </div>

                      {/* Subject & resident */}
                      <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>{c.subject}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}>
                          {c.residentName.charAt(0)}
                        </div>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {c.residentName} · Wing {c.wing}, Flat {c.flatNumber}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{c.body}</p>

                      {/* Admin reply preview */}
                      {c.adminMessage && !isExpanded && (
                        <div
                          className="mt-3 px-3.5 py-2.5 rounded-lg text-xs"
                          style={{ background: "var(--primary-subtle)", color: "var(--primary)", border: "1px solid #c7d2fe" }}
                        >
                          <span className="font-semibold">Your reply: </span>{c.adminMessage}
                        </div>
                      )}
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : c.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                        style={{
                          background: isExpanded ? "var(--muted)" : "var(--secondary)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {isExpanded ? (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> Cancel</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> Update</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded update panel */}
                {isExpanded && (
                  <div
                    className="px-5 pb-5 space-y-4 animate-fade-in"
                    style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}
                  >
                    {/* Status pills */}
                    <div>
                      <p className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Update Status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map((s) => {
                          const sc = STATUS_CONFIG[s];
                          const isActive = c.status === s;
                          return (
                            <button
                              key={s}
                              onClick={() => updateComplaint(c.id, s)}
                              disabled={updating === c.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all disabled:opacity-50"
                              style={{
                                background: isActive ? sc.bg : "transparent",
                                color: sc.text,
                                border: `2px solid ${isActive ? sc.dot : "#e5e7eb"}`,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                              {s.replace(/_/g, " ")}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Admin message */}
                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Reply to Resident (optional)
                      </p>
                      <textarea
                        rows={2}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all resize-none"
                        style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
                        placeholder="Leave a note for the resident…"
                        value={adminMessages[c.id] ?? ""}
                        onChange={(e) => setAdminMessages((prev) => ({ ...prev, [c.id]: e.target.value }))}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>

                    <button
                      onClick={() => updateComplaint(c.id, c.status)}
                      disabled={updating === c.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
                      style={{ background: "var(--primary)", color: "white" }}
                      onMouseEnter={(e) => !updating && (e.currentTarget.style.background = "var(--primary-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
                    >
                      {updating === c.id && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
                      {updating === c.id ? "Saving…" : "Save Reply"}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
