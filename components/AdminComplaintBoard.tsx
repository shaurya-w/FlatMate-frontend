"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Complaint {
  id: number;
  complaintNumber: string;
  subject: string;
  body: string;
  status: string;
  tag: string;
  adminMessage?: string;
  createdAt: string;
  residentName: string;
  flatNumber: string;
  wing: string;
  societyName: string;
}

const STATUSES = ["SUBMITTED", "LOOKED_AT", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  SUBMITTED:   { bg: "#dbeafe", text: "#1d4ed8" },
  LOOKED_AT:   { bg: "#fef9c3", text: "#854d0e" },
  IN_PROGRESS: { bg: "#ffedd5", text: "#c2410c" },
  RESOLVED:    { bg: "#dcfce7", text: "#15803d" },
  CLOSED:      { bg: "#f3f4f6", text: "#6b7280" },
};

export default function AdminComplaintBoard({ societyId }: { societyId: number }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [adminMessages, setAdminMessages] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, [societyId]);

  const fetchComplaints = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/complaints/society/${societyId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setComplaints(res.data);
        // Pre-fill admin messages
        const msgs: Record<number, string> = {};
        res.data.forEach((c: Complaint) => {
          if (c.adminMessage) msgs[c.id] = c.adminMessage;
        });
        setAdminMessages(msgs);
      })
      .catch((err) => console.error("Failed to fetch complaints", err))
      .finally(() => setLoading(false));
  };

  const updateComplaint = async (complaintId: number, status: string) => {
    try {
      setUpdating(complaintId);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/complaints/${complaintId}`,
        { status, adminMessage: adminMessages[complaintId] ?? "" },
        { withCredentials: true }
      );
      await fetchComplaints();
      setExpanded(null);
    } catch (err) {
      console.error("Failed to update complaint", err);
      alert("Failed to update complaint");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading complaints…</p>;
  if (complaints.length === 0)
    return <p className="text-sm text-gray-500">No complaints raised yet.</p>;

  return (
    <div className="space-y-4 mt-4">
      {complaints.map((c) => {
        const color = STATUS_COLORS[c.status] ?? STATUS_COLORS.CLOSED;
        const isExpanded = expanded === c.id;

        return (
          <div key={c.id} className="bg-white rounded-xl border shadow-sm p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400">{c.complaintNumber}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: color.bg, color: color.text }}>
                    {c.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{c.subject}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {c.residentName} · Wing {c.wing}, Flat {c.flatNumber}
                </p>
                <p className="text-sm text-gray-600 mt-2">{c.body}</p>
                {c.adminMessage && !isExpanded && (
                  <p className="text-xs text-blue-600 mt-2 italic">"{c.adminMessage}"</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setExpanded(isExpanded ? null : c.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  {isExpanded ? "Cancel" : "Update"}
                </button>
              </div>
            </div>

            {/* Update Panel */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">
                    Update Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => {
                      const sc = STATUS_COLORS[s];
                      const isActive = c.status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => updateComplaint(c.id, s)}
                          disabled={updating === c.id}
                          className="text-xs px-3 py-1.5 rounded-full font-medium border-2 transition-all disabled:opacity-50"
                          style={{
                            background: isActive ? sc.bg : "white",
                            color: sc.text,
                            borderColor: isActive ? sc.text : "#e5e7eb",
                          }}
                        >
                          {s.replace(/_/g, " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">
                    Admin Message (optional)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border resize-none"
                    style={{ border: "1.5px solid var(--border)" }}
                    placeholder="Leave a note for the resident…"
                    value={adminMessages[c.id] ?? ""}
                    onChange={(e) =>
                      setAdminMessages((prev) => ({ ...prev, [c.id]: e.target.value }))
                    }
                  />
                </div>

                <button
                  onClick={() => updateComplaint(c.id, c.status)}
                  disabled={updating === c.id}
                  className="px-4 py-2 text-sm font-semibold rounded-lg disabled:opacity-50"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  {updating === c.id ? "Saving…" : "Save Message"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
