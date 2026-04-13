"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface Notice {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  expirationDate: string;
}

// Pin colours cycle across cards
const PIN_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"];

// Subtle card tilt for pinboard feel
const TILTS = ["rotate-[-1.2deg]", "rotate-[0.8deg]", "rotate-[-0.5deg]", "rotate-[1.4deg]", "rotate-[-0.9deg]", "rotate-[0.4deg]"];

export default function NoticeSlider({ societyId }: { societyId: number }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notices/society/${societyId}`, { withCredentials: true })
      .then((res) => setNotices(res.data))
      .catch((err) => console.error("Failed to fetch notices", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="w-full rounded-2xl p-6 mt-4 relative overflow-hidden"
      style={{
        // Cork-board green texture base
        background: "#4a7c59",
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%234a7c59'/%3E%3Crect x='0' y='0' width='1' height='1' fill='%23507f5e' opacity='0.6'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23426e4f' opacity='0.5'/%3E%3Crect x='1' y='3' width='1' height='1' fill='%235a8f68' opacity='0.4'/%3E%3Crect x='3' y='1' width='1' height='1' fill='%23406b4c' opacity='0.5'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at 0% 0%, rgba(90,143,104,0.6) 0%, transparent 50%),
          radial-gradient(ellipse at 100% 100%, rgba(58,100,70,0.5) 0%, transparent 50%)
        `,
        boxShadow: "inset 0 2px 12px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.12)",
        border: "3px solid #3d6648",
        minHeight: "220px",
      }}
    >
      {/* Wooden frame inner shadow */}
      <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.18), inset 0 0 8px rgba(0,0,0,0.1)"
      }} />

      {/* Board title */}
      <div className="flex items-center gap-2 mb-5 relative z-10">
        <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "#ef4444", boxShadow: "0 2px 4px rgba(0,0,0,0.4)" }} />
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}
        >
          Notice Board
        </span>
      </div>

      {loading ? (
        <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="min-w-[220px] h-36 rounded-sm animate-pulse"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 relative z-10">
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>No notices pinned yet</p>
        </div>
      ) : (
        <div
          className="flex gap-5 overflow-x-auto pb-3 relative z-10"
          style={{ scrollbarWidth: "none" }}
        >
          {notices.map((notice, i) => (
            <NoteCard
              key={notice.id}
              notice={notice}
              pinColor={PIN_COLORS[i % PIN_COLORS.length]}
              tilt={TILTS[i % TILTS.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ notice, pinColor, tilt }: { notice: Notice; pinColor: string; tilt: string }) {
  const daysLeft = Math.max(0, Math.ceil((new Date(notice.expirationDate).getTime() - Date.now()) / 86400000));
  const isExpiringSoon = daysLeft <= 3;

  // Paper colour — warm yellows / cream / pale blue
  const paperColors = [
    { bg: "#fef9c3", lines: "#e5e1a8" },
    { bg: "#fef3c7", lines: "#e8dea0" },
    { bg: "#fffbeb", lines: "#eee5b5" },
    { bg: "#f0f9ff", lines: "#c8e3f0" },
    { bg: "#fdf4ff", lines: "#e8d5ee" },
  ];
  const paper = paperColors[notice.id % paperColors.length];

  return (
    <div
      className={`min-w-[210px] max-w-[210px] relative transition-all duration-200 cursor-default ${tilt}`}
      style={{ filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.35))" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) translateY(-4px) scale(1.02)";
        (e.currentTarget as HTMLElement).style.filter = "drop-shadow(3px 8px 14px rgba(0,0,0,0.45))";
        (e.currentTarget as HTMLElement).style.zIndex = "10";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.filter = "drop-shadow(2px 4px 8px rgba(0,0,0,0.35))";
        (e.currentTarget as HTMLElement).style.zIndex = "auto";
      }}
    >
      {/* Pushpin */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${pinColor}dd, ${pinColor})`,
          boxShadow: `0 2px 6px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3)`,
        }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
      </div>

      {/* Paper */}
      <div
        className="rounded-sm pt-5 px-4 pb-4 relative overflow-hidden"
        style={{ background: paper.bg, minHeight: "160px" }}
      >
        {/* Ruled lines */}
        {[0,1,2,3,4,5].map((l) => (
          <div
            key={l}
            className="absolute left-0 right-0"
            style={{
              height: "1px",
              background: paper.lines,
              top: `${52 + l * 20}px`,
              opacity: 0.6,
            }}
          />
        ))}

        {/* Red margin line */}
        <div className="absolute top-0 bottom-0 left-10" style={{ width: "1px", background: "#fca5a580", opacity: 0.7 }} />

        {/* Content */}
        <div className="relative">
          {isExpiringSoon && (
            <span
              className="inline-block text-xs font-bold px-1.5 py-0.5 rounded mb-2"
              style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontSize: "0.62rem" }}
            >
              ⏰ {daysLeft === 0 ? "Expires today" : `${daysLeft}d left`}
            </span>
          )}
          <h3
            className="text-sm font-bold mb-2 leading-tight"
            style={{ color: "#1c1917", fontFamily: "'Outfit', sans-serif" }}
          >
            {notice.title}
          </h3>
          <p
            className="text-xs leading-relaxed line-clamp-4"
            style={{ color: "#44403c" }}
          >
            {notice.content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-2" style={{ borderTop: `1px solid ${paper.lines}` }}>
            <span className="text-xs font-semibold" style={{ color: "#78716c" }}>
              — {notice.authorName}
            </span>
            <span className="text-xs" style={{ color: "#a8a29e", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>
              {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
