"use client";

import { useAuth, User } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboardlayout";
import ComplaintModal from "@/components/ComplaintFormModal";
import NoticeSlider from "@/components/NoticeSlider";
import FetchInvoices from "@/components/FetchInvoices";
import Script from "next/script";

export default function UserDashboard() {
  const { user, loading } = useAuth("USER");

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <>
    
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="lazyOnload" />
      
      <DashboardLayout name={user.name}>
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-orange-500 text-sm">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {user.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening in your society
          </p>
        </div>

        {/* Flat Details */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900">A-404</h2>
          <p className="text-gray-600">Tower A, Sunrise Apartments</p>

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
              <p className="font-medium text-gray-900">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Community Notices */}
        <h2 className="text-black text-xl font-semibold">Community Notices</h2>
        <div className="flex items-center justify-between mb-7">
          <NoticeSlider societyId={1} />
        </div>

        {/* Complaint Button */}
        <div className="flex justify-end">
          <ComplaintModal />
        </div>

        {/* Invoices Section */}
        <div className="mb-8">
          <h2 className="text-black text-xl font-semibold">Your Invoices</h2>
          <FetchInvoices userId={2} />
        </div>
      </DashboardLayout></>
  );
}