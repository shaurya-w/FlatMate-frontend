"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  role: string;
}

interface AdminTableRow {
  flatNumber: string;
  wing: string;
  residentName: string;
  phone: string;
  email: string;
  totalDues: number;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<AdminTableRow[]>([]);

  useEffect(() => {
    // 1️⃣ First check auth
    fetch("http://localhost:8080/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.role !== "ADMIN") {
          console.log("Unauthorized access attempt by user:", data);
          router.push("/unauthorized");
        } else {
          setUser(data);

          // 2️⃣ If ADMIN, fetch dashboard data
          return fetch("http://localhost:8080/api/admin/dashboard", {
            credentials: "include",
          });
        }
      })
      .then(res => {
        if (!res) return;
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then(data => {
        if (!data) return;
        console.log("Dashboard API Response:", data);
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        router.push("/login");
      });
  }, [router]);

  if (loading) return <h2>Checking access...</h2>;
  if (!user) return <h2>User not found</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, admin {user.name}</p>

      <h3>Check browser console for API response 👀</h3>
    </div>
  );
}
