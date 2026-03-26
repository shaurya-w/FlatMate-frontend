"use client";

interface AlertCardProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function AlertCard({
  message,
  type = "success",
  onClose,
}: AlertCardProps) {

  const styles =
    type === "success"
      ? { background: "#f0fdf4", borderColor: "#22c55e", color: "#15803d" }
      : { background: "#fef2f2", borderColor: "#ef4444", color: "#dc2626" };

  return (
    <div
      className="px-4 py-3 rounded-lg border-l-4 flex justify-between items-center text-sm"
      style={styles}
    >
      <div className="flex items-center gap-2">
        <span>{type === "success" ? "✓" : "✕"}</span>
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="opacity-60 hover:opacity-100 text-xs ml-3 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
