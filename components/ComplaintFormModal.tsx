"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import axios from "axios";
import AlertCard from "./ui/AlertCard";

const TAGS = ["MAINTENANCE", "NOISE", "SECURITY", "CLEANLINESS", "PARKING", "OTHER"];

const TAG_ICONS: Record<string, React.ReactNode> = {
  MAINTENANCE: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  NOISE:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>,
  SECURITY:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  CLEANLINESS: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
  PARKING:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  OTHER:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
};

export default function ComplaintModal({ societyId }: { societyId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("OTHER");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const submitComplaint = async () => {
    if (!subject.trim() || !body.trim()) {
      setAlert({ message: "Please fill in all fields", type: "error" });
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`,
        { subject, body, tag, societyId },
        { withCredentials: true }
      );
      setAlert({ message: "Complaint submitted successfully", type: "success" });
      setSubject(""); setBody(""); setTag("OTHER");
      setTimeout(() => { setIsOpen(false); setAlert(null); }, 1500);
    } catch {
      setAlert({ message: "Failed to submit complaint", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
        style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--secondary)")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Raise Complaint
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Raise a Complaint">
        <div className="space-y-4">
          {alert && <AlertCard message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

          <div>
            <label className="block mb-1.5" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.08em" }}>
              Subject
            </label>
            <input
              className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
              style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
              placeholder="Brief summary of the issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Tag selector */}
          <div>
            <label className="block mb-2" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.08em" }}>
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-all"
                  style={{
                    background: tag === t ? "var(--primary-subtle)" : "var(--secondary)",
                    color: tag === t ? "var(--primary)" : "var(--muted-foreground)",
                    border: `1.5px solid ${tag === t ? "var(--primary)" : "var(--border)"}`,
                  }}
                >
                  {TAG_ICONS[t]}
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1.5" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.08em" }}>
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all resize-none"
              style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
              placeholder="Describe the issue in detail…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <div className="pt-1">
            <button
              onClick={submitComplaint}
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "var(--primary)", color: "white" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {loading ? "Submitting…" : "Submit Complaint"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
