"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(26,20,16,0.5)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-lg rounded-xl p-6 z-10"
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--border)",
          boxShadow: "0 20px 60px rgba(26,20,16,0.18)",
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors duration-150"
            style={{ color: "var(--muted-foreground)", background: "var(--muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--muted)")}
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}