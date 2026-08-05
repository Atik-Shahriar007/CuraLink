"use client";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import { User, Siren, LifeBuoy } from "lucide-react";

const providerNavItems = [
  { href: "/provider/requests", label: "Requests", icon: Siren },
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