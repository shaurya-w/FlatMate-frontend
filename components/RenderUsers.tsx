"use client";

import axios from "axios";
import { useState, useEffect } from "react";

interface AdminTableRow {
  flatId: number;
  flatNumber: string;
  wing: string;
  userId: number;
  name: string;
  phone: string;
  email: string;
  totalPendingAmount: number;
  status: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  OVERDUE:  { bg: "#fef2f2", text: "#dc2626", dot: "#dc2626" },
  PENDING:  { bg: "#fffbeb", text: "#b45309", dot: "#f59e0b" },
  PAID:     { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
  CLEAR:    { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { bg: "#f4f5f8", text: "#6b7280", dot: "#9ca3af" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="skeleton h-4 rounded" style={{ width: i === 0 ? "16px" : i === 3 ? "100px" : "60px" }} />
        </td>
      ))}
    </tr>
  );
}

export default function RenderUsers() {
  const [users, setUsers] = useState<AdminTableRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard`,
          { withCredentials: true }
        );
        if (isMounted) setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    };
    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const selectAll = () =>
    setSelectedIds(selectedIds.length === users.length ? [] : users.map((u) => u.userId));

  const sendInvoices = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      const response = await axios.post(`/api/send-invoices`, { invoiceIds: selectedIds }, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        setToast({ msg: `Invoices sent to ${selectedIds.length} resident(s)`, type: "success" });
        setSelectedIds([]);
      } else {
        setToast({ msg: "Failed to send invoices", type: "error" });
      }
    } catch (err) {
      setToast({ msg: "Error sending invoices", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
          style={{
            background: toast.type === "success" ? "var(--success-subtle)" : "var(--destructive-subtle)",
            border: `1px solid ${toast.type === "success" ? "#a7f3d0" : "#fecaca"}`,
            color: toast.type === "success" ? "#065f46" : "var(--destructive)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {toast.type === "success" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Table header bar */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                Residents
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {loadingUsers ? "Loading…" : `${users.length} total`}
                {selectedIds.length > 0 && (
                  <span style={{ color: "var(--primary)" }}> · {selectedIds.length} selected</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{
                background: "var(--secondary)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--secondary)")}
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>

            <button
              onClick={sendInvoices}
              disabled={loading || selectedIds.length === 0}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--primary)", color: "white" }}
              onMouseEnter={(e) => !loading && selectedIds.length > 0 && (e.currentTarget.style.background = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              {loading ? (
                <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
              {loading ? "Sending…" : `Send Invoices${selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}`}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ background: "var(--muted)" }}>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={selectAll}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </th>
                {["Wing / Flat", "Resident", "Contact", "Pending", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wider"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "'JetBrains Mono', monospace",
                      textTransform: "uppercase",
                      fontSize: "0.68rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loadingUsers ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No residents found</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Residents will appear here once registered</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelected = selectedIds.includes(user.userId);
                  return (
                    <tr
                      key={user.userId}
                      className="group transition-colors cursor-pointer"
                      style={{
                        borderTop: "1px solid var(--border-subtle)",
                        background: isSelected ? "var(--primary-subtle)" : "transparent",
                      }}
                      onClick={() => toggleSelect(user.userId)}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "var(--muted)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isSelected ? "var(--primary-subtle)" : "transparent";
                      }}
                    >
                      <td className="w-12 px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(user.userId)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                      </td>

                      {/* Wing / Flat */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 text-xs font-semibold rounded-md"
                            style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {user.wing}-{user.flatNumber}
                          </span>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{user.phone}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{user.email}</p>
                        </div>
                      </td>

                      {/* Pending */}
                      <td className="px-4 py-3.5">
                        <span
                          className="text-sm font-semibold"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: user.totalPendingAmount > 0 ? "#b45309" : "var(--success)",
                          }}
                        >
                          ₹{user.totalPendingAmount.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={user.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
