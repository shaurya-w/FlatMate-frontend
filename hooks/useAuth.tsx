"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export function useAuth(requiredRole?: "ADMIN" | "USER") {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        const user = res.data;

        if (requiredRole && user.role !== requiredRole) {
          router.push("/unauthorized");
          return;
        }

        setUser(user);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, []);

  return { user, loading };
}
