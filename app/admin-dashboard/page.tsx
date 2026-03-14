"use client";

import RenderUsers from "../../components/RenderUsers";
import AdminMetrics from "../../components/AdminMetrics";
import DashboardLayout from "../../components/layout/dashboardlayout";
import NoticeModal from "../../components/ui/NoticeModal";
import SearchBar from "../../components/SearchBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import router from "next/router";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

interface User {
  name: string;
  role: string;
}

export default function AdminDashboard() {

  const { user, loading } = useAuth("ADMIN");

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;


  return (

      <DashboardLayout name={user.name}>

      {/* Users Section */}
      <AdminMetrics/>
      <div className="flex align-center justify-between mb-4 p-2">
         <SearchBar />
         <NoticeModal societyId={1} />
      </div>
      
     
      <RenderUsers />
      

    </DashboardLayout>  
  );

}

function setUser(data: { role: string; }) {
  throw new Error("Function not implemented.");
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

