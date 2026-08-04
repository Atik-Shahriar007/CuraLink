"use client";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import { LayoutDashboard, Stethoscope, ClipboardList, Pill, Newspaper, Siren, LifeBuoy, User } from "lucide-react";

const patientNavItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Find a Doctor", icon: Stethoscope },
  { href: "/patient/consultations", label: "Consultations", icon: ClipboardList },
  { href: "/medicines", label: "Medicines", icon: Pill },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/ambulance/status", label: "Ambulance", icon: Siren },
  { href: "/support/tickets", label: "Support", icon: LifeBuoy },
  { href: "/patient/profile", label: "Profile", icon: User },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <DashboardSidebar items={patientNavItems} />
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}