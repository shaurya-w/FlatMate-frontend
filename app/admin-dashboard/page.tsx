"use client";

import RenderUsers from "../../components/RenderUsers";
import AdminMetrics from "../../components/AdminMetrics";
import DashboardLayout from "../../components/layout/dashboardlayout";
import NoticeModal from "../../components/ui/NoticeModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import router from "next/router";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import AdminComplaintBoard from "@/components/AdminComplaintBoard";

interface User {
  name: string;
  role: string;
}

export default function AdminDashboard() {

  const { user, loading } = useAuth("ADMIN");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading dashboard…</p>
      </div>
    </div>
  );
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <p style={{ color: "var(--muted-foreground)" }}>User not found</p>
    </div>
  );


  return (

      <DashboardLayout name={user.name}>

      {/* Page header */}
      <div className="mb-6">
        <p
          className="text-xs font-mono uppercase tracking-widest mb-1"
          style={{ color: "var(--primary)", fontFamily: "'Space Mono', monospace" }}
        >
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Society Dashboard
        </h1>
      </div>

      {/* Metrics */}
      <AdminMetrics/>
      <div className="flex align-center justify-between mb-4 p-2">
         <NoticeModal societyId={1} />
      </div>


          <RenderUsers />

          <div className="mb-8 mt-8">
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
                  Complaint Board
              </h2>
              <AdminComplaintBoard societyId={1} />
          </div>

    </DashboardLayout>  
  );

}

function setUser(data: { role: string; }) {
  throw new Error("Function not implemented.");
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

