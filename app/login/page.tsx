"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await api.post("/auth/login", { email, password });


      const { data } = await api.get("/auth/me");

      if (data.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (data.role === "USER") {
        router.push("/user-dashboard");
      } else {
        router.push("/unauthorized");
      }

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
