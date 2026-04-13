"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import AlertCard from "@/components/ui/AlertCard";

interface Props {
  onSuccess: (data: any) => void;
  editingCharge?: any;
  onCloseEdit?: () => void;
}

export default function ChargeModal({ onSuccess, editingCharge, onCloseEdit }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (editingCharge) {
      setIsOpen(true);
      setName(editingCharge.chargeTypeName);
      setDescription(editingCharge.chargeTypeDescription);
      setAmount(editingCharge.amount);
      setEffectiveFrom(editingCharge.effectiveFrom?.split("T")[0] || "");
      setEffectiveTo(editingCharge.effectiveTo?.split("T")[0] || "");
    }
  }, [editingCharge]);

  const handleSubmit = async () => {
    if (!name.trim() || !amount) {
      setAlert({ message: "Name and amount are required", type: "error" });
      return;
    }
    try {
      setLoading(true);
      let res;
      if (editingCharge) {
        res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1/${editingCharge.societyChargeId}`,
          { amount: Number(amount), calculationType: "FIXED", effectiveFrom, effectiveTo: effectiveTo || null },
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/charges/society/1/7`,
          { chargeTypeName: name, chargeTypeDescription: description, amount: Number(amount), calculationType: "FIXED", effectiveFrom, effectiveTo: effectiveTo || null },
          { withCredentials: true }
        );
      }
      onSuccess(res.data);
      setAlert({ message: editingCharge ? "Charge updated" : "Charge added", type: "success" });
      if (onCloseEdit) onCloseEdit();
      setName(""); setDescription(""); setAmount(""); setEffectiveFrom(""); setEffectiveTo("");
      setTimeout(() => setIsOpen(false), 1500);
    } catch {
      setAlert({ message: "Failed to save charge", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!editingCharge;

  return (
    <>
      {!isEdit && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
          style={{ background: "var(--primary)", color: "white" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Charge
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); if (onCloseEdit) onCloseEdit(); }}
        title={isEdit ? "Edit Charge" : "Add Charge"}
      >
        <div className="space-y-4">
          {alert && <AlertCard message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

          {!isEdit && (
            <>
              <Field label="Charge Name">
                <SI placeholder="e.g. Maintenance Fee" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Description">
                <SI placeholder="Brief description of the charge" value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
            </>
          )}

          <Field label="Amount (₹)">
            <SI type="number" placeholder="e.g. 1500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Effective From">
              <SI type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} />
            </Field>
            <Field label="Effective To">
              <SI type="date" value={effectiveTo} onChange={(e) => setEffectiveTo(e.target.value)} />
            </Field>
          </div>

          <div className="pt-1">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "var(--primary)", color: "white" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {loading ? "Saving…" : isEdit ? "Update Charge" : "Add Charge"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block mb-1.5"
        style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 500 }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SI(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
      style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)", borderRadius: "var(--radius-sm)" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; props.onBlur?.(e); }}
    />
  );
}
