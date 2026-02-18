"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

interface User {
  name: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get("/auth/me", {
      withCredentials: true,
    })
      .then(res => {
        const data = res.data;
        if (!data) throw new Error();
        return data;
      })
      .then(data => {
        if (data.role !== "USER") {
          router.push("/unauthorized");
        } else {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (loading) return <h2>Checking access...</h2>;

  if (!user) return <h2>User not found</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>User Dashboard</h1>
      <p>Welcome, user {user.name}</p>
    </div>
  );
}
