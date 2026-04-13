"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
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
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || "Invalid credentials. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>

      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: "var(--foreground)" }}
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Gradient orb */}
        <div
          className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base"
            style={{ background: "var(--primary)", color: "white" }}
          >
            F
          </div>
          <span className="font-semibold text-lg" style={{ color: "white" }}>FlatMate</span>
        </div>

        {/* Hero text */}
        <div className="relative">
          <p
            className="text-xs font-medium mb-5 tracking-widest opacity-40"
            style={{ color: "white", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}
          >
            Society Management
          </p>
          <h2
            className="text-4xl font-bold leading-tight mb-5"
            style={{ color: "white", letterSpacing: "-0.02em" }}
          >
            Your society,<br />
            <span style={{ color: "var(--primary)" }}>smartly managed.</span>
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            One platform to manage residents, dues, notices, and complaints — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {["Resident Management", "Invoice Generation", "Complaint Tracking", "Notice Board"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs relative opacity-20" style={{ color: "white", fontFamily: "'JetBrains Mono', monospace" }}>
          © 2025 FlatMate. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 justify-center mb-10 lg:hidden">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
              style={{ background: "var(--primary)", color: "white" }}
            >
              F
            </div>
            <span className="font-bold text-lg" style={{ color: "var(--foreground)" }}>FlatMate</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1.5" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5 tracking-widest"
                style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem" }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs font-medium tracking-widest"
                  style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", fontSize: "0.68rem" }}
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs transition-colors"
                  style={{ color: "var(--primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all pr-12"
                  style={{
                    background: "var(--card)",
                    border: "1.5px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-subtle)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm animate-fade-in"
                style={{
                  background: "var(--destructive-subtle)",
                  border: "1px solid #fecaca",
                  color: "var(--destructive)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "var(--primary)", color: "white", marginTop: "8px" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              {loading && (
                <span
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.6)", borderTopColor: "transparent" }}
                />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
