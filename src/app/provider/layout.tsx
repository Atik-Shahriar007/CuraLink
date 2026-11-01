"use client";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import { 
  LayoutDashboard, 
  Siren, 
  History, 
  Truck, 
  MapPin, 
  BarChart2, 
  LifeBuoy, 
  User 
} from "lucide-react";

const providerNavItems = [
  { href: "/provider/dashboard", label: "Fleet Dashboard", icon: LayoutDashboard },
  { href: "/provider/requests", label: "Live Requests", icon: Siren },
  { href: "/provider/history", label: "Request History", icon: History },
  { href: "/provider/fleet", label: "Vehicle Fleet", icon: Truck },
  { href: "/provider/service-zone", label: "Service Zone", icon: MapPin },
  { href: "/provider/performance", label: "Performance", icon: BarChart2 },
  { href: "/support/tickets", label: "Support", icon: LifeBuoy },
  { href: "/provider/profile", label: "Profile", icon: User },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <DashboardSidebar items={providerNavItems} />
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
