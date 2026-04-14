export default function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="flex-1 h-px bg-[var(--border)]" />
      {label && (
        <span
          className="text-xs uppercase tracking-wider px-3 py-1 rounded-full"
          style={{
            color: "var(--muted-foreground)",
            background: "var(--secondary)",
          }}
        >
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}