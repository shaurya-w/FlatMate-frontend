"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Contact {
  id: number;
  name: string;
  purpose: string;
  email?: string;
  phoneNumbers: string[];
}

const PURPOSE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  Plumber:      { bg: "#eff6ff", text: "#1d4ed8", ring: "#bfdbfe" },
  Electrician:  { bg: "#fef9c3", text: "#854d0e", ring: "#fde68a" },
  Security:     { bg: "#f0fdf4", text: "#166534", ring: "#bbf7d0" },
  Carpenter:    { bg: "#fff7ed", text: "#9a3412", ring: "#fed7aa" },
  Cleaner:      { bg: "#fdf4ff", text: "#7e22ce", ring: "#e9d5ff" },
};

function getPurposeStyle(purpose: string) {
  const key = Object.keys(PURPOSE_COLORS).find((k) => purpose.toLowerCase().includes(k.toLowerCase()));
  return key ? PURPOSE_COLORS[key] : { bg: "var(--secondary)", text: "var(--muted-foreground)", ring: "var(--border)" };
}

export default function ContactsSectionUser() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contacts/society/1`, { withCredentials: true })
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Failed to fetch contacts", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden mt-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none" }}>
            <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3.5 rounded w-28" />
              <div className="skeleton h-3 rounded w-16" />
            </div>
            <div className="skeleton h-4 rounded-lg w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 mt-4 rounded-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No contacts available</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Contact your society admin to add contacts</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden mt-4" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" }}>
      {contacts.map((contact, idx) => {
        const style = getPurposeStyle(contact.purpose);
        const phone = contact.phoneNumbers[0] || null;
        return (
          <div
            key={contact.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors"
            style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{ background: style.bg, color: style.text, border: `1px solid ${style.ring}` }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{contact.name}</p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md inline-block mt-0.5" style={{ background: style.bg, color: style.text }}>
                {contact.purpose}
              </span>
            </div>

            {/* Call button */}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex-shrink-0"
                style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--success-subtle)";
                  (e.currentTarget as HTMLElement).style.color = "#065f46";
                  (e.currentTarget as HTMLElement).style.borderColor = "#a7f3d0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--secondary)";
                  (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.5 19.79 19.79 0 0 1 1.71 2.18 2 2 0 0 1 3.7 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem" }}>{phone}</span>
              </a>
            )}

            {/* Email button */}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="p-2 rounded-lg transition-colors flex-shrink-0"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--primary-subtle)";
                  (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
                }}
                title={contact.email}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
