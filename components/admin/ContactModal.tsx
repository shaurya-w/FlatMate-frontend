"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import AlertCard from "@/components/ui/AlertCard";

interface Props {
  onSuccess: () => void;
  editingContact?: any;
  onCloseEdit?: () => void;
}

export default function ContactModal({ onSuccess, editingContact, onCloseEdit }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState("");
  const [phones, setPhones] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (editingContact) {
      setIsOpen(true);
      setName(editingContact.name);
      setPurpose(editingContact.purpose);
      setEmail(editingContact.email || "");
      setPhones(editingContact.phoneNumbers.join(", "));
    }
  }, [editingContact]);

  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(t);
  }, [alert]);

  const handleSubmit = async () => {
    if (!name.trim() || !purpose.trim()) {
      setAlert({ message: "Name and purpose are required", type: "error" });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name, purpose,
        email: email || null,
        phoneNumbers: phones.split(",").map((p) => p.trim()).filter(Boolean),
      };
      if (editingContact) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/${editingContact.id}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts`, payload, { withCredentials: true });
      }
      setAlert({ message: editingContact ? "Contact updated" : "Contact added", type: "success" });
      setName(""); setPurpose(""); setEmail(""); setPhones("");
      onSuccess();
      if (onCloseEdit) onCloseEdit();
      setTimeout(() => setIsOpen(false), 1500);
    } catch {
      setAlert({ message: "Failed to save contact", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!editingContact;

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
          Add Contact
        </button>
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); if (onCloseEdit) onCloseEdit(); }} title={isEdit ? "Edit Contact" : "Add Contact"}>
        <div className="space-y-4">
          {alert && <AlertCard message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

          <Field label="Full Name">
            <SI placeholder="e.g. Rajesh Kumar" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field label="Role / Purpose">
            <SI placeholder="e.g. Plumber, Electrician" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </Field>

          <Field label="Email (optional)">
            <SI type="email" placeholder="contact@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>

          <Field label="Phone Numbers (comma-separated)">
            <SI placeholder="e.g. +91 98765 43210, +91 98765 43211" value={phones} onChange={(e) => setPhones(e.target.value)} />
          </Field>

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
              {loading ? "Saving…" : isEdit ? "Update Contact" : "Add Contact"}
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
