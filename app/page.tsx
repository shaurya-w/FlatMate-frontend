"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/axios";
import axios from "axios";
import { p } from "framer-motion/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
        setLoading(true);   // ← add this
        setError("");       // ← clear previous errors
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
                withCredentials: true,
            });

            if (data.role === "ADMIN") {
                router.push("/admin-dashboard");
            } else if (data.role === "USER") {
                router.push("/user-dashboard");
            } else {
                router.push("/unauthorized");
            }

        } catch (err: unknown) {
            console.error("Login error:", err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || "Login failed");
            } else {
                setError("Login failed");
            }
        }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--background)" }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        <div className="flex items-center gap-3">
          <img src="FlatMate_Logo.svg" alt="FlatMate" className="h-8 w-auto brightness-0 invert" />
        </div>

        <div>
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Resident Management
          </p>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Your society,<br />
            <span style={{ color: "var(--primary)" }}>beautifully managed.</span>
          </h2>
          <p className="opacity-60 text-base leading-relaxed max-w-xs">
            One platform to power smarter residential and commercial spaces.
          </p>
        </div>

        <p className="text-xs opacity-30" style={{ fontFamily: "'Space Mono', monospace" }}>
          © 2025 FlatMate. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src="FlatMate_Logo.svg" alt="FlatMate" className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Sign in to your FlatMate account
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-150"
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--muted-foreground)", fontFamily: "'Space Mono', monospace" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-150"
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            {error && (
              <div
                className="text-xs px-3.5 py-2.5 rounded-lg border-l-4"
                style={{
                  background: "#fef2f2",
                  borderLeftColor: "var(--destructive)",
                  color: "var(--destructive)",
                }}
              >
                {error}
              </div>
            )}

              <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 disabled:opacity-50"
                  style={{
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                  {loading ? "Signing in..." : "Sign in"}
              </button>

              {/* ← ADD THIS */}
              <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  <a href="/forgot-password" className="hover:underline" style={{ color: "var(--primary)" }}>
                      Forgot your password?
                  </a>
              </p>
          </div>

        </div>
      </div>
    </div>
  );

}
