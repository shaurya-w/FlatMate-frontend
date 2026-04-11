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
    flatNumber: string;
    wing: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    SUBMITTED:   { bg: "#dbeafe", text: "#1d4ed8" },
    LOOKED_AT:   { bg: "#fef9c3", text: "#854d0e" },
    IN_PROGRESS: { bg: "#ffedd5", text: "#c2410c" },
    RESOLVED:    { bg: "#dcfce7", text: "#15803d" },
    CLOSED:      { bg: "#f3f4f6", text: "#6b7280" },
};

export default function MyComplaints({ societyId }: { societyId: number }) {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/society/${societyId}`, {
                withCredentials: true,
            })
            .then((res) => setComplaints(res.data))
            .catch((err) => console.error("Failed to fetch complaints", err))
            .finally(() => setLoading(false));
    }, [societyId]);

    if (loading) return <p className="text-sm text-gray-500">Loading complaints…</p>;
    if (complaints.length === 0)
        return <p className="text-sm text-gray-500">You haven't raised any complaints yet.</p>;

    return (
        <div className="space-y-4 mt-4">
            {complaints.map((c) => {
                const color = STATUS_COLORS[c.status] ?? STATUS_COLORS.CLOSED;
                return (
                    <div key={c.id} className="bg-white rounded-xl border shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-gray-400">{c.complaintNumber}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                          style={{ background: color.bg, color: color.text }}>
                    {c.status.replace("_", " ")}
                  </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {c.tag}
                  </span>
                                </div>
                                <h3 className="font-semibold text-gray-900">{c.subject}</h3>
                                <p className="text-sm text-gray-600 mt-1">{c.body}</p>
                                {c.adminMessage && (
                                    <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                        <p className="text-xs font-semibold text-blue-700 mb-1">Admin Response</p>
                                        <p className="text-sm text-blue-800">{c.adminMessage}</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
