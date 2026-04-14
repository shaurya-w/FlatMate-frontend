"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const handleReset = async () => {
        if (!token) {
            setError("Invalid or missing reset token");
            return;
        }
        if (password !== confirm) {
            setError("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
                { token, password }
            );
            setDone(true);
            setTimeout(() => router.push("/"), 2000);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Reset failed. Link may have expired."
                );
            } else {
                setError("Reset failed. Link may have expired.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-8"
            style={{ background: "var(--background)" }}
        >
            <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-center mb-8">
                    <img src="/FlatMate_Logo.svg" alt="FlatMate" className="h-10 w-auto" />
                </div>

                {done ? (
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                            Password reset!
                        </h2>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            Redirecting to login…
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                                Reset password
                            </h1>
                            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                Enter your new password below.
                            </p>
                        </div>

                        <input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border"
                            style={{
                                background: "var(--card)",
                                border: "1.5px solid var(--border)",
                                color: "var(--foreground)",
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border"
                            style={{
                                background: "var(--card)",
                                border: "1.5px solid var(--border)",
                                color: "var(--foreground)",
                            }}
                        />

                        {error && (
                            <p
                                className="text-xs px-3 py-2 rounded-lg"
                                style={{ background: "#fef2f2", color: "var(--destructive)" }}
                            >
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="w-full py-2.5 text-sm font-semibold rounded-lg disabled:opacity-50"
                            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                        >
                            {loading ? "Resetting…" : "Reset password"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}