"use client";

import axios from "axios";
import { useState, useEffect} from "react";

interface AdminTableRow {
  flatId: number;
  flatNumber: string;
  wing: string;

  userId: number;
  name: string;
  phone: string;
  email: string;

  totalPendingAmount: number;
  status: string;
}

export default function RenderUsers() {

const [users, setUsers] = useState<AdminTableRow[]>([]);
const [loadingUsers, setLoadingUsers] = useState(true);

useEffect(() => {
  let isMounted = true;

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard`,
        { withCredentials: true }
      );

      if (!response.data) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.data;

      if (isMounted) {
        setUsers(data);
      }

    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      if (isMounted) {
        setLoadingUsers(false);
      }
    }
  };

  fetchUsers();

  return () => {
    isMounted = false;
  };
}, []);

 //console.log("Fetched users:", users);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: number) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter((i) => i !== id)
      : [...prev, id]
  );
};

const selectAll = () => {
  if (selectedIds.length === users.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(users.map((u) => u.userId));
  }
};

const sendusers = async () => {
    console.log("Selected user IDs:", selectedIds);

  if (selectedIds.length === 0) {
    alert("Select at least one user");
    return;
  }

  try {
    setLoading(true);

    console.log("Sending invoice IDs to NEXT backend:", selectedIds);
    const response = axios.post(`/api/send-invoices`, {
      invoiceIds: selectedIds
    }, {
      headers: { "Content-Type": "application/json" }
    });

    const { data } = await response;

    if (data.success) {
      alert("Users sent successfully!");
      setSelectedIds([]);
    } else {
      alert("Failed to send users");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending users");
  } finally {
    setLoading(false);
  }
};

const statusStyle = (status: string) => {
  if (status === "OVERDUE") return { background: "#fef2f2", color: "#dc2626" };
  if (status === "PENDING") return { background: "#fffbeb", color: "#d97706" };
  return { background: "#f0fdf4", color: "#16a34a" };
};

return (
  <div
    className="rounded-xl border overflow-hidden"
    style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
  >
    {/* Header */}
    <div
      className="flex justify-between items-center px-6 py-4 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          Manage Residents
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          {users.length} residents total
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={selectAll}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-150"
          style={{
            background: "var(--secondary)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--secondary)")}
        >
          {selectedIds.length === users.length && users.length > 0 ? "Unselect All" : "Select All"}
        </button>

        <button
          onClick={sendusers}
          disabled={loading || selectedIds.length === 0}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 disabled:opacity-40"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {loading ? "Sending…" : `Send Invoices${selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}`}
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr style={{ background: "var(--muted)" }}>
            <th className="p-3 w-10"></th>
            {["Wing", "Flat", "Name", "Phone", "Email", "Pending", "Status"].map((h) => (
              <th
                key={h}
                className="p-3 text-left text-xs font-mono uppercase tracking-wider"
                style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loadingUsers ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Loading residents…
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-sm" style={{ color: "var(--muted-foreground)" }}>
                No residents found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.userId}
                className="border-t transition-colors duration-100"
                style={{
                  borderColor: "var(--border)",
                  background: selectedIds.includes(user.userId) ? "rgba(232,93,38,0.04)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!selectedIds.includes(user.userId))
                    e.currentTarget.style.background = "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedIds.includes(user.userId)
                    ? "rgba(232,93,38,0.04)"
                    : "transparent";
                }}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.userId)}
                    onChange={() => toggleSelect(user.userId)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "var(--primary)" }}
                  />
                </td>

                <td className="p-3 font-medium" style={{ color: "var(--foreground)" }}>{user.wing}</td>
                <td className="p-3" style={{ color: "var(--foreground)" }}>{user.flatNumber}</td>
                <td className="p-3 font-medium" style={{ color: "var(--foreground)" }}>{user.name}</td>
                <td className="p-3" style={{ color: "var(--muted-foreground)" }}>{user.phone}</td>
                <td className="p-3" style={{ color: "var(--muted-foreground)" }}>{user.email}</td>

                <td className="p-3 font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Space Mono', monospace", fontSize: "0.8rem" }}>
                  ₹{user.totalPendingAmount}
                </td>

                <td className="p-3">
                  <span
                    className="px-2.5 py-1 text-xs font-semibold rounded-full"
                    style={statusStyle(user.status)}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}