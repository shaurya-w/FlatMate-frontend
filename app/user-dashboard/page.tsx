"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import DashboardLayout from "@/components/layout/dashboardlayout";
import ComplaintModal from "@/components/ComplaintFormModal";

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
  <DashboardLayout name={user.name}>

    {/* Welcome Section */}
    <div className="mb-8">
      <p className="text-orange-500 text-sm">Welcome back,</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {user.name}
      </h1>
      <p className="text-gray-600 mt-1">
        Here's what's happening in your society
      </p>
    </div>

    {/* Notice Board */}
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Notice Board
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="font-semibold text-gray-900">
            Elevator Maintenance
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Tower A elevators will be under maintenance tomorrow.
          </p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="font-semibold text-gray-900">
            Water Supply Cut
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Water supply interruption from 12 PM to 4 PM.
          </p>
        </div>
      </div>
    </div>

    {/* Flat Details */}
    <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900">
        A-404
      </h2>
      <p className="text-gray-600">
        Tower A, Sunrise Apartments
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm">
        <div>
          <p className="text-gray-500">Floor</p>
          <p className="font-medium text-gray-900">4th Floor</p>
        </div>

        <div>
          <p className="text-gray-500">Residents</p>
          <p className="font-medium text-gray-900">4 Members</p>
        </div>

        <div>
          <p className="text-gray-500">Registered Owner</p>
          <p className="font-medium text-gray-900">
            {user.name}
          </p>
        </div>
      </div>
    </div>

    {/* Complaint Button */}
    <div className="flex justify-end">
      <ComplaintModal />
    </div>

  </DashboardLayout>
);
}
