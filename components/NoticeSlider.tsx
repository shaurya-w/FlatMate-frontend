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
      className="w-full rounded-2xl p-6 mt-4 relative overflow-visible mb-8"
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
        <span
          className="text-lg font-bold tracking-widest uppercase"
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

function NoteCard({
  notice,
  pinColor,
  tilt,
}: {
  notice: Notice;
  pinColor: string;
  tilt: string;
}) {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;

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
      className={`
        relative shrink-0 transition-all duration-200 cursor-default
        w-[78vw] max-w-[260px] sm:w-[210px] sm:max-w-[210px]
        pt-5 sm:pt-6
        ${tilt}
      `}
      style={{ filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.35))" }}
      onMouseEnter={(e) => {
        if (window.innerWidth < 640) return;
        (e.currentTarget as HTMLElement).style.transform =
          "rotate(0deg) translateY(-4px) scale(1.02)";
        (e.currentTarget as HTMLElement).style.filter =
          "drop-shadow(3px 8px 14px rgba(0,0,0,0.45))";
        (e.currentTarget as HTMLElement).style.zIndex = "10";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.filter =
          "drop-shadow(2px 4px 8px rgba(0,0,0,0.35))";
        (e.currentTarget as HTMLElement).style.zIndex = "auto";
      }}
    >
      {/* 3D push pin */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        {/* needle */}
        <div
          className="absolute left-1/2 top-[16px] -translate-x-1/2 rounded-full"
          style={{
            width: "2px",
            height: isMobile ? "16px" : "18px",
            background:
              "linear-gradient(to bottom, #d1d5db 0%, #9ca3af 45%, #6b7280 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
          }}
        />

        {/* pin shadow */}
        <div
          className="absolute left-1/2 top-[14px] -translate-x-1/2 rounded-full"
          style={{
            width: isMobile ? "20px" : "22px",
            height: "8px",
            background: "rgba(0,0,0,0.18)",
            filter: "blur(4px)",
          }}
        />

        {/* pin head */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: isMobile ? "24px" : "26px",
            height: isMobile ? "24px" : "26px",
            background: `
              radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0 14%, transparent 15%),
              radial-gradient(circle at 35% 30%, ${pinColor}ee 0%, ${pinColor} 55%, color-mix(in srgb, ${pinColor} 70%, black) 100%)
            `,
            boxShadow: `
              0 4px 8px rgba(0,0,0,0.35),
              inset -3px -4px 6px rgba(0,0,0,0.22),
              inset 2px 2px 4px rgba(255,255,255,0.35)
            `,
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: isMobile ? "6px" : "7px",
              height: isMobile ? "6px" : "7px",
              background: "rgba(255,255,255,0.45)",
              transform: "translate(-2px, -2px)",
              filter: "blur(0.2px)",
            }}
          />
        </div>
      </div>

      {/* Paper */}
      <div
        className="rounded-sm pt-6 sm:pt-7 px-3 sm:px-4 pb-4 relative overflow-hidden"
        style={{
          background: paper.bg,
          minHeight: isMobile ? "150px" : "160px",
        }}
      >
        {/* ruled lines */}
        {[0, 1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            className="absolute left-0 right-0"
            style={{
              height: "1px",
              background: paper.lines,
              top: `${52 + l * (isMobile ? 18 : 20)}px`,
              opacity: 0.6,
            }}
          />
        ))}

        {/* red margin */}
        <div
          className="absolute top-0 bottom-0 left-8 sm:left-10"
          style={{
            width: "1px",
            background: "#fca5a580",
            opacity: 0.7,
          }}
        />

        <div className="relative">
          <h3
            className="font-bold mb-2 leading-tight text-[15px] sm:text-sm line-clamp-2"
            style={{ color: "#1c1917", fontFamily: "'Outfit', sans-serif" }}
          >
            {notice.title}
          </h3>

          <p
            className="leading-relaxed text-[13px] sm:text-xs line-clamp-4"
            style={{ color: "#44403c" }}
          >
            {notice.content}
          </p>

          <div
            className="flex items-center justify-between mt-4 pt-2 gap-2"
            style={{ borderTop: `1px solid ${paper.lines}` }}
          >
            <span
              className="text-[12px] sm:text-xs font-semibold truncate"
              style={{ color: "#78716c" }}
            >
              by {notice.authorName}
            </span>

            <span
              className="text-[11px] sm:text-xs shrink-0"
              style={{
                color: "#a8a29e",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isMobile ? "0.68rem" : "0.65rem",
              }}
            >
              {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}