"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    return async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            router.push("/"); // ← login page is at root
        }
    };
}