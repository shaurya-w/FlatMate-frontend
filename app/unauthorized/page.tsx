export default function Unauthorized() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--background)" }}
    >
      <div className="text-center">
        <p
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: "var(--primary)", fontFamily: "'Space Mono', monospace" }}
        >
          403
        </p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Access Denied
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          You are not allowed to view this page.
        </p>
      </div>
    </div>
  );
}