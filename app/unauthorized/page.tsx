"use client";

import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,110,247,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative text-center max-w-md animate-fade-in">
        {/* Icon */}
        <div className="inline-flex items-center justify-center mb-8">
          <div className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ background: "var(--destructive-subtle)", border: "1px solid #fecaca",
              boxShadow: "0 0 0 8px rgba(239,68,68,0.06), 0 0 0 16px rgba(239,68,68,0.03)" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <p className="text-xs font-bold tracking-widest mb-3 uppercase"
          style={{ color: "#ef4444", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.2em" }}>
          Error 403
        </p>

        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }}>
          Access Denied
        </h1>

        <p className="text-sm leading-relaxed mb-8 mx-auto" style={{ color: "var(--muted-foreground)", maxWidth: "300px" }}>
          You don't have permission to view this page. Please sign in with an authorised account.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => router.push("/")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all"
            style={{ background: "var(--primary)", color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign in
          </button>
          <button onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all"
            style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--secondary)")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Go back
          </button>
        </div>

        <p className="text-xs mt-8" style={{ color: "var(--muted-foreground)" }}>
          If you believe this is a mistake, contact your society administrator.
        </p>
      </div>
    </div>
  );
}
