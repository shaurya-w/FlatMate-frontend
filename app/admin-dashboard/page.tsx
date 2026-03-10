"use client";

import RenderUsers from "../../components/RenderUsers";
import AdminMetrics from "../../components/AdminMetrics";
// import Navbar from "../../components/layout/navbar";
import DashboardLayout from "../../components/layout/dashboardlayout";
import NoticeModal from "../../components/ui/NoticeModal";
import SearchBar from "../../components/SearchBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import router from "next/router";
import { api } from "@/lib/axios";

interface User {
  name: string;
  role: string;
}

export default function AdminDashboard() {

  const[user, setUser] = useState<User | null>(null);
  const[loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //     api.get(`${process.env.BASE_URL}/auth/me`, {
  //       withCredentials: true,
  //     })
  //       .then((res: { data: any; }) => {
  //         const data = res.data;
  //         if (!data) throw new Error();
  //         return data;
  //       })
  //       .then((data: { role: string; }) => {
  //         if (data.role !== "USER") {
  //           router.push("/unauthorized");
  //         } else {
  //           setUser(data);
  //           setLoading(false);
  //         }
  //       })
  //       .catch(() => router.push("/login"));
  //   }, [router]);
  
  //   if (loading) return <h2>Checking access...</h2>;
  
  //   if (!user) return <h2>User not found</h2>;
  

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

function setUser(data: { role: string; }) {
  throw new Error("Function not implemented.");
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

