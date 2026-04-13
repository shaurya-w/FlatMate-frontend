"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AlertCard from "@/components/ui/AlertCard";
import ContactModal from "@/components/admin/ContactModal";

interface Contact {
  id: number;
  name: string;
  purpose: string;
  email?: string;
  phoneNumbers: string[];
}

const PURPOSE_ICONS: Record<string, React.ReactNode> = {
  Plumber: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Electrician: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Security: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Carpenter: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Cleaner: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
};

const PURPOSE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  Plumber:      { bg: "#eff6ff", text: "#1d4ed8", ring: "#bfdbfe" },
  Electrician:  { bg: "#fef9c3", text: "#854d0e", ring: "#fde68a" },
  Security:     { bg: "#f0fdf4", text: "#166534", ring: "#bbf7d0" },
  Carpenter:    { bg: "#fff7ed", text: "#9a3412", ring: "#fed7aa" },
  Cleaner:      { bg: "#fdf4ff", text: "#7e22ce", ring: "#e9d5ff" },
};

function getPurposeStyle(purpose: string) {
  const key = Object.keys(PURPOSE_COLORS).find((k) => purpose.toLowerCase().includes(k.toLowerCase()));
  return key
    ? { ...PURPOSE_COLORS[key], icon: PURPOSE_ICONS[key] }
    : { bg: "var(--secondary)", text: "var(--muted-foreground)", ring: "var(--border)", icon: null };
}

export default function ContactsSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/society/1`, { withCredentials: true });
      setContacts(res.data);
    } catch {
      setAlert({ message: "Failed to load contacts", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3500);
    return () => clearTimeout(t);
  }, [alert]);

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/${id}`, { withCredentials: true });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setAlert({ message: "Contact deleted", type: "success" });
    } catch {
      setAlert({ message: "Failed to delete contact", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Society Contacts</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Directory of service providers and emergency contacts
          </p>
        </div>
        <ContactModal onSuccess={fetchContacts} editingContact={editingContact} onCloseEdit={() => setEditingContact(null)} />
      </div>

      {alert && <div className="mb-4"><AlertCard message={alert.message} type={alert.type} onClose={() => setAlert(null)} /></div>}

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" }}>
        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3" style={{ background: "var(--muted)", borderBottom: "1px solid var(--border-subtle)" }}>
          {[["col-span-4","Contact"],["col-span-3","Phone"],["col-span-3","Email"],["col-span-2","Actions"]].map(([cls, label]) => (
            <div key={label} className={cls}>
              <span style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 500 }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none" }}>
              <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 rounded w-28" />
                <div className="skeleton h-3 rounded w-16" />
              </div>
              <div className="skeleton h-3.5 rounded w-28" />
              <div className="skeleton h-3.5 rounded w-32" />
            </div>
          ))
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No contacts yet</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Add service providers for residents to call</p>
          </div>
        ) : (
          contacts.map((contact, idx) => {
            const style = getPurposeStyle(contact.purpose);
            const phone = contact.phoneNumbers[0] || null;
            return (
              <div
                key={contact.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-5 py-4 group transition-colors"
                style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Name + badge */}
                <div className="sm:col-span-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: style.bg, color: style.text, border: `1px solid ${style.ring}` }}
                  >
                    {style.icon ?? <span className="text-sm font-bold">{contact.name.charAt(0).toUpperCase()}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{contact.name}</p>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md inline-block mt-0.5" style={{ background: style.bg, color: style.text }}>
                      {contact.purpose}
                    </span>
                  </div>
                </div>

                {/* Phone — first only */}
                <div className="sm:col-span-3">
                  {phone ? (
                    <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:underline transition-colors"
                      style={{ color: "var(--foreground)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--muted-foreground)", flexShrink: 0 }}>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.5 19.79 19.79 0 0 1 1.71 2.18 2 2 0 0 1 3.7 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {phone}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>—</span>
                  )}
                </div>

                {/* Email */}
                <div className="sm:col-span-3">
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="text-sm hover:underline truncate block transition-colors"
                      style={{ color: "var(--muted-foreground)", maxWidth: "180px" }}>
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="sm:col-span-2 flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingContact(contact)} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--primary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")} title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(contact.id)} disabled={deletingId === contact.id}
                    className="p-1.5 rounded-lg transition-colors disabled:opacity-40" style={{ color: "var(--destructive)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--destructive-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")} title="Delete">
                    {deletingId === contact.id
                      ? <span className="w-3.5 h-3.5 rounded-full border-2 border-red-300 border-t-red-500 animate-spin block" />
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
