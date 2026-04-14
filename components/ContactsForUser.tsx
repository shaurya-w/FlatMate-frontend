export default function ContactsForUser() {
  return (
    <div className="bg-[var(--card)] border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 px-6 py-3 text-xs font-semibold uppercase tracking-wide border-b bg-[var(--secondary)]">
        <div>Contact</div>
        <div>Phone</div>
        <div className="hidden sm:block">Role</div>
      </div>

      <div className="divide-y">
        <Row
          name="Kamala Devi"
          role="Maid"
          phone="8823194213"
          initial="K"
        />

        <Row
          name="Manoj Singh"
          role="Watchman"
          phone="8657449192"
          initial="M"
        />

        <Row
          name="Raju Kumar"
          role="Electrician"
          phone="9800112233"
          initial="⚡"
          highlight
        />
      </div>
    </div>
  );
}

/* ---------------- Row Component ---------------- */

function Row({
  name,
  role,
  phone,
  initial,
  highlight,
}: {
  name: string;
  role: string;
  phone: string;
  initial: string;
  highlight?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 items-center px-6 py-4">
      {/* Contact */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-sm font-semibold ${
            highlight
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {initial}
        </div>

        <div className="min-w-0">
          <div className="font-medium text-[var(--foreground)] truncate">
            {name}
          </div>

          {/* role badge on mobile only */}
          <span
            className={`sm:hidden inline-flex mt-1 text-xs px-2 py-0.5 rounded-full ${
              highlight
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {role}
          </span>
        </div>
      </div>

      {/* Phone */}
      <div className="text-sm text-[var(--foreground)]">{phone}</div>

      {/* Role */}
      <div className="hidden sm:block text-sm text-[var(--muted-foreground)]">
        {role}
      </div>
    </div>
  );
}