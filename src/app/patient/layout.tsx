"use client";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import {
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  Pill,
  Newspaper,
  Siren,
  LifeBuoy,
  User,
  Activity,
  Heart,
  Truck,
  FileCheck,
  Bell,
} from "lucide-react";

const patientNavItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Find a Doctor", icon: Stethoscope },
  { href: "/patient/favorites", label: "Favorite Doctors", icon: Heart },
  { href: "/patient/consultations", label: "Consultations", icon: ClipboardList },
  { href: "/patient/prescriptions", label: "Prescriptions", icon: Pill },
  { href: "/patient/vitals", label: "Health Vitals", icon: Activity },
  { href: "/patient/medical-records", label: "Medical Documents", icon: FileCheck },
  { href: "/patient/health-summary", label: "Health Summary", icon: FileCheck },
  { href: "/patient/ambulance-history", label: "Amb. History", icon: Truck },
  { href: "/ambulance/status", label: "Live Ambulance", icon: Siren },
  { href: "/medicines", label: "Medicines", icon: Pill },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/patient/notifications", label: "Notifications", icon: Bell },
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
