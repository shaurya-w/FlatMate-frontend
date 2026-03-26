"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import axios from "axios";

export default function ComplaintModal() {

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComplaint = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`, {
        title,
        description
      });

      if (!response.data) throw new Error();

      setIsOpen(false);
      setTitle("");
      setDescription("");

    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-150";
  const inputStyle = {
    background: "var(--secondary)",
    border: "1.5px solid var(--border)",
    color: "var(--foreground)",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-150"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
      >
        Raise Complaint
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Raise a Complaint"
      >
        <div className="space-y-4">

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
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
            >
              Description
            </label>
            <textarea
              rows={4}
              className={inputClass}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Describe the issue in detail…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <button
            onClick={submitComplaint}
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 disabled:opacity-50"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {loading ? "Submitting…" : "Submit Complaint"}
          </button>

        </div>
      </Modal>
    </>
  );
}