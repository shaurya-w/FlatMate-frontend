"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  role: string;
  email?: string;
  id?: number;
}

export function useAuth(requiredRole?: string) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        withCredentials: true, // send session cookie
      })
      .then((res) => {
        const data = res.data as User;
        if (!data) throw new Error("No user data returned");

        console.log("Logged in user:", data);

        if (requiredRole && data.role !== requiredRole) {
          console.warn("Unauthorized role:", data.role);
          router.push("/unauthorized");
        } else {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router, requiredRole]);

  return { user, loading, error };
}