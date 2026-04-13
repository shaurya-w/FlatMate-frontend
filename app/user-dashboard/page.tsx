"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboardlayout";
import ComplaintModal from "@/components/ComplaintFormModal";
import NoticeSlider from "@/components/NoticeSlider";
import FetchInvoices from "@/components/FetchInvoices";
import ContactsSectionUser from "../admin-dashboard/settings/ContactsSectionUser";
import Script from "next/script";
import MyComplaints from "@/components/MyComplaints";

export default function UserDashboard() {
  const { user, loading } = useAuth("USER");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
          />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <DashboardLayout name={user.name}>
        {/* Welcome header */}
        <div className="mb-8 animate-fade-in">
          <p
            className="text-xs font-medium mb-1"
            style={{ color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Resident Portal
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}
          >
            Hello, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Here's what's happening in your society today
          </p>
        </div>

  

        {/* Notices */}
        <Section title="Community Notices" subtitle="Latest announcements from management">
          <NoticeSlider societyId={1} />
        </Section>

        {/* Invoices */}
        <Section title="Your Invoices" subtitle="Pending dues and payment history">
          <FetchInvoices userId={2} />
        </Section>

        {/* Complaints */}
        <Section
          title="My Complaints"
          subtitle="Track your raised issues"
          action={<ComplaintModal societyId={1} />}
        >
          <MyComplaints societyId={1} />
        </Section>

        {/* Contacts */}
        <Section title="Society Contacts" subtitle="Service providers and emergency numbers">
          <ContactsSectionUser />
        </Section>
      </DashboardLayout>
    </>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>{title}</h2>
        {action}
      </div>
      {subtitle && <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>{subtitle}</p>}
      {children}
    </div>
  );
}
