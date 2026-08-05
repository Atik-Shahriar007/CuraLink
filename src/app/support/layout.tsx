"use client";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import { Ticket } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const staffNavItems = [
  { href: "/support/tickets", label: "Ticket Queue", icon: Ticket },
];

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const { account, loading } = useAuth();

  const isStaff = account?.role === "SUPPORT_AGENT" || account?.role === "ADMIN";

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>;
  }

  if (!isStaff) {
    // Regular users keep the normal top-navbar experience, no sidebar
    return <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <DashboardSidebar items={staffNavItems} />
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">{children}</main>
    </div>
  );
}