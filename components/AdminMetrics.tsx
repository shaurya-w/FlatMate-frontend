"use client";

const metrics = [
  {
    label: "Active Notices",
    value: "2",
    sub: "Posted this month",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    color: "var(--primary)",
    bg: "var(--primary-subtle)",
  },
  {
    label: "Pending Dues",
    value: "4500",
    sub: "Across 3 residents",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    color: "#d97706",
    bg: "var(--warning-subtle)",
  },
  {
    label: "Residents",
    value: "120",
    sub: "Registered members",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: "var(--success)",
    bg: "var(--success-subtle)",
  },
  {
    label: "Monthly Report",
    value: "Ready",
    sub: "Summary available",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
];

export default function AdminMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="rounded-xl p-5 transition-all duration-200 cursor-default"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-xs)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-xs)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* Icon */}
          <div className="flex gap-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
            style={{ background: m.bg, color: m.color }}
          >
            {m.icon}
          </div>

          {/* Value */}
          <p
            className="text-2xl font-bold mb-0.5"
            style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}
          >
            {m.value}
          </p>
          </div>

          {/* Label + sub */}
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            {m.label}
          </p>
          {/* <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {m.sub}
          </p> */}
        </div>
      ))}
    </div>
  );
}
