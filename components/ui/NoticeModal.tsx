"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import AlertCard from "./AlertCard";

interface NoticeModalProps {
  societyId: number;
}

interface NoticeRequest {
  title: string;
  content: string;
  societyId: number;
  durationInDays: number | "";
  tags: string[];
}

export default function NoticeModal({ societyId }: NoticeModalProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // auto-hide alert
  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      console.log("🧹 Clearing alert");
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  const submitNotice = async () => {
    try {
      console.log("🚀 Submitting notice...");

      setLoading(true);

      const payload: NoticeRequest = {
        title,
        content,
        societyId,
        durationInDays: duration,
        tags: tags.split(",").map((tag) => tag.trim()),
      };

      console.log("📦 Payload:", payload);
      console.log("🌐 URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/notices`);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/notices`,
        payload,
        { withCredentials: true }
      );

      console.log("✅ Notice created:", response.data);

      setAlert({
        message: "Notice posted successfully",
        type: "success",
      });

      // reset form
      setTitle("");
      setContent("");
      setDuration("");
      setTags("");

      // close modal after short delay
      setTimeout(() => {
        console.log("🔴 Closing modal after success");
        setIsOpen(false);
      }, 1500);

    } catch (error: any) {
      console.error("❌ Error submitting notice:", error);

      if (error.response) {
        console.error("📛 Backend response:", error.response.data);
        console.error("📛 Status:", error.response.status);
      }

      setAlert({
        message: "Failed to post notice",
        type: "error",
      });

    } finally {
      console.log("🔄 Request complete");
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-150";
  const inputStyle = {
    background: "var(--secondary)",
    border: "1.5px solid var(--border)",
    color: "var(--foreground)",
  };
  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "var(--primary)");
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "var(--border)");

  return (
    <>
      <button
        onClick={() => {
          console.log("🟢 Opening Notice Modal");
          setIsOpen(true);
        }}
        className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        + Create Notice
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          console.log("🔴 Closing Notice Modal");
          setIsOpen(false);
        }}
        title="Create Notice"
      >
        <div className="space-y-4">

          {alert && (
            <AlertCard
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
            >
              Title
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              placeholder="Enter notice title"
              value={title}
              onFocus={focusIn}
              onBlur={focusOut}
              onChange={(e) => {
                console.log("✏️ Title:", e.target.value);
                setTitle(e.target.value);
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
            >
              Content
            </label>
            <textarea
              rows={4}
              className={inputClass}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Enter notice content"
              value={content}
              onFocus={focusIn}
              onBlur={focusOut}
              onChange={(e) => {
                console.log("✏️ Content updated");
                setContent(e.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
              >
                Duration (days)
              </label>
              <input
                type="number"
                min={1}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. 7"
                value={duration}
                onFocus={focusIn}
                onBlur={focusOut}
                onChange={(e) => {
                  console.log("✏️ Duration:", e.target.value);
                  setDuration(Number(e.target.value));
                }}
              />
            </div>

          
          </div>

          <button
            onClick={submitNotice}
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 disabled:opacity-50"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {loading ? "Posting…" : "Post Notice"}
          </button>

        </div>
      </Modal>
    </>
  );
}