"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AlertCard from "@/components/ui/AlertCard";
import ChargeModal from "@/components/admin/ChargeModal";

interface Charge {
  societyChargeId: number;
  chargeTypeName: string;
  chargeTypeDescription: string;
  amount: number;
  calculationType: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  active: boolean;
}

function SkeletonRow() {
  return (
    <tr>
      {[100, 140, 70, 60, 50, 80].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="skeleton h-3.5 rounded" style={{ width: `${w}px` }} />
        </td>
      ))}
    </tr>
  );
}

export default function ChargesSection() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [editingCharge, setEditingCharge] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchCharges();
  }, []);

  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3500);
    return () => clearTimeout(t);
  }, [alert]);

  const fetchCharges = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1`, { withCredentials: true });
      setCharges(res.data.charges);
      setTotal(res.data.totalMonthlyCharges);
    } catch {
      setAlert({ message: "Failed to load charges", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1/${id}`, { withCredentials: true });
      setCharges(res.data.charges);
      setTotal(res.data.totalMonthlyCharges);
      setAlert({ message: "Charge deleted", type: "success" });
    } catch {
      setAlert({ message: "Failed to delete charge", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const fmt = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <section>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Charge Management</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Define monthly charges applied to all residents
          </p>
        </div>
        <ChargeModal
          onSuccess={(data) => { setCharges(data.charges); setTotal(data.totalMonthlyCharges); }}
          editingCharge={editingCharge}
          onCloseEdit={() => setEditingCharge(null)}
        />
      </div>

      {alert && <div className="mb-4"><AlertCard message={alert.message} type={alert.type} onClose={() => setAlert(null)} /></div>}

      {/* Total badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-5 text-sm font-medium"
        style={{ background: "var(--primary-subtle)", color: "var(--primary)", border: "1px solid #c7d2fe" }}
      >

        Total Monthly: <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>₹{total.toLocaleString()}</strong>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ background: "var(--muted)" }}>
                {["Charge", "Description", "Amount", "Status", "Effective", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left"
                    style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 500 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              ) : charges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No charges yet</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Add your first charge to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                charges.map((charge) => (
                  <tr
                    key={charge.societyChargeId}
                    className="transition-colors"
                    style={{
                      borderTop: "1px solid var(--border-subtle)",
                      opacity: charge.active ? 1 : 0.5,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{charge.chargeTypeName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{charge.chargeTypeDescription || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--foreground)" }}>
                        ₹{charge.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
                        style={charge.active
                          ? { background: "var(--success-subtle)", color: "#065f46" }
                          : { background: "var(--muted)", color: "var(--muted-foreground)" }
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: charge.active ? "var(--success)" : "#9ca3af" }} />
                        {charge.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmt(charge.effectiveFrom)}
                      </p>
                      {charge.effectiveTo && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                          → {fmt(charge.effectiveTo)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingCharge(charge)}
                          className="p-1.5 rounded-lg transition-colors text-xs font-medium"
                          style={{ color: "var(--primary)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-subtle)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(charge.societyChargeId)}
                          disabled={deletingId === charge.societyChargeId}
                          className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                          style={{ color: "var(--destructive)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--destructive-subtle)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {deletingId === charge.societyChargeId ? (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-red-300 border-t-red-500 animate-spin block" />
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}