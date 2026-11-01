"use client";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Pill,
  Newspaper,
  Truck,
  BarChart3,
  LifeBuoy,
  Megaphone,
  ClipboardList,
  DollarSign,
  Settings,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/medicines", label: "Medicines", icon: Pill },
  { href: "/admin/blog", label: "Articles", icon: Newspaper },
  { href: "/admin/providers", label: "Providers", icon: Truck },
  { href: "/admin/ambulance-oversight", label: "Amb. Oversight", icon: Truck },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/audit-log", label: "Audit Log", icon: ClipboardList },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/support/tickets", label: "Support", icon: LifeBuoy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <DashboardSidebar items={adminNavItems} />
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
