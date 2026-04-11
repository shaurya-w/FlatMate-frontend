"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import axios from "axios";

const TAGS = ["MAINTENANCE", "NOISE", "SECURITY", "CLEANLINESS", "PARKING", "OTHER"];

export default function ComplaintModal({ societyId }: { societyId: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [tag, setTag] = useState("OTHER");
    const [loading, setLoading] = useState(false);

    const submitComplaint = async () => {
        if (!subject.trim() || !body.trim()) {
            alert("Please fill in all fields");
            return;
        }
        try {
            setLoading(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`,
                { subject, body, tag, societyId },
                { withCredentials: true }
            );
            setIsOpen(false);
            setSubject("");
            setBody("");
            setTag("OTHER");
            alert("Complaint submitted successfully!");
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

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Raise a Complaint">
                <div className="space-y-4">

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                               style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}>
                            Subject
                        </label>
                        <input
                            className={inputClass}
                            style={inputStyle}
                            placeholder="Brief summary of the issue"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                               style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}>
                            Category
                        </label>
                        <select
                            className={inputClass}
                            style={inputStyle}
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        >
                            {TAGS.map((t) => (
                                <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                               style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}>
                            Description
                        </label>
                        <textarea
                            rows={4}
                            className={inputClass}
                            style={{ ...inputStyle, resize: "none" }}
                            placeholder="Describe the issue in detail…"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                        />
                    </div>

                    <button
                        onClick={submitComplaint}
                        disabled={loading}
                        className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 disabled:opacity-50"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                        {loading ? "Submitting…" : "Submit Complaint"}
                    </button>
                </div>
            </Modal>
        </>
    );
}