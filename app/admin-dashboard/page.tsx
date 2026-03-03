"use client";

import RenderUsers from "../../components/RenderUsers";
import AdminMetrics from "../../components/AdminMetrics";
// import Navbar from "../../components/layout/navbar";
import DashboardLayout from "../../components/layout/dashboardlayout";
import NoticeModal from "../../components/ui/NoticeModal";
import SearchBar from "../../components/SearchBar";

export default function AdminDashboard() {
  return (

      <DashboardLayout name={"Shaurya"}>

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