"use client";

interface AlertCardProps {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
}

export default function AlertCard({ message, type, onClose }: AlertCardProps) {
  const isSuccess = type === "success";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
      style={{
        background: isSuccess ? "var(--success-subtle)" : "var(--destructive-subtle)",
        border: `1px solid ${isSuccess ? "#a7f3d0" : "#fecaca"}`,
        color: isSuccess ? "#065f46" : "var(--destructive)",
      }}
    >
      {/* Icon */}
      <span className="flex-shrink-0">
        {isSuccess ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </span>

      <span className="flex-1">{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
