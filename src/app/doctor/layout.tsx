"use client";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import {
  LayoutDashboard, ClipboardList, User, CalendarClock, BarChart3, Newspaper, Pill, LifeBuoy,
} from "lucide-react";

const doctorNavItems = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/consultations", label: "Consultations", icon: ClipboardList },
  { href: "/doctor/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/doctor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/doctor/blog", label: "My Articles", icon: Newspaper },
  { href: "/medicines", label: "Medicines", icon: Pill },
  { href: "/support/tickets", label: "Support", icon: LifeBuoy },
  { href: "/doctor/profile", label: "Profile", icon: User },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <DashboardSidebar items={doctorNavItems} />
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}