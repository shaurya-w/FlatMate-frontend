"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import AlertCard from "./AlertCard";

interface NoticeModalProps {
  societyId: number;
}

export default function NoticeModal({ societyId }: NoticeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  const submitNotice = async () => {
    if (!title.trim() || !content.trim()) {
      setAlert({ message: "Title and content are required", type: "error" });
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/notices`,
        { title, content, societyId, durationInDays: duration, tags: tags.split(",").map((t) => t.trim()) },
        { withCredentials: true }
      );
      setAlert({ message: "Notice posted successfully", type: "success" });
      setTitle(""); setContent(""); setDuration(""); setTags("");
      setTimeout(() => setIsOpen(false), 1500);
    } catch {
      setAlert({ message: "Failed to post notice", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
        style={{ background: "var(--primary)", color: "white" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Create Notice
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Notice">
        <div className="space-y-4">
          {alert && <AlertCard message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

          <FieldLabel label="Title">
            <StyledInput placeholder="e.g. Maintenance on Sunday" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FieldLabel>

          <FieldLabel label="Content">
            <StyledTextarea rows={4} placeholder="Write the full notice here…" value={content} onChange={(e) => setContent(e.target.value)} />
          </FieldLabel>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Duration (days)">
              <StyledInput type="number" min={1} placeholder="e.g. 7" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </FieldLabel>
            <FieldLabel label="Tags (comma-separated)">
              <StyledInput placeholder="e.g. URGENT, WATER" value={tags} onChange={(e) => setTags(e.target.value)} />
            </FieldLabel>
          </div>

          <div className="pt-1">
            <button
              onClick={submitNotice}
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "var(--primary)", color: "white" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {loading ? "Posting…" : "Post Notice"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.08em" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all"
      style={{
        background: "var(--secondary)",
        border: "1.5px solid var(--border)",
        color: "var(--foreground)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-all resize-none"
      style={{
        background: "var(--secondary)",
        border: "1.5px solid var(--border)",
        color: "var(--foreground)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}
