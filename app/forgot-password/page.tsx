"use client";

import { useState } from "react";
import { api } from "@/lib/axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setSent(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8"
             style={{ background: "var(--background)" }}>
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <img src="/FlatMate_Logo.svg" alt="FlatMate" className="h-10 w-auto" />
                </div>

                {sent ? (
                    <div className="text-center space-y-3">
                        <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Check your email</h2>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            If that email exists, a reset link has been sent. Check your inbox.
                        </p>
                        <a href="/" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
                            Back to login
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                                Forgot password?
                            </h1>
                            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                Enter your email and we'll send you a reset link.
                            </p>
                        </div>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border"
                            style={{ background: "var(--card)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !email}
                            className="w-full py-2.5 text-sm font-semibold rounded-lg disabled:opacity-50"
                            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                        >
                            {loading ? "Sending…" : "Send reset link"}
                        </button>

                        <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                            <a href="/" className="hover:underline" style={{ color: "var(--primary)" }}>
                                Back to login
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}