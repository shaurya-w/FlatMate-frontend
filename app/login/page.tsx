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

  } catch (err: any) {
    console.error("Login error:", err);
    setError(err.response?.data || "Login failed");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">

          <img
            src="FlatMate_Logo.svg"
            alt="FlatMate Logo"
            className="h-12 w-auto mb-4"
          />

          <h1 className="text-2xl font-bold text-gray-900">
            Login to FlatMate
          </h1>

          <p className="text-sm text-gray-600 mt-1 text-center">
            One platform to power smarter residential and commercial spaces.
          </p>

        </div>

        {/* Form Section */}
        <div className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="text-black w-full border rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="text-black w-full border rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

      </div>

    </div>
  );

}
