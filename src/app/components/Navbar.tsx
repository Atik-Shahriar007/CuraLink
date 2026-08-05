"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState as useStateReact, useEffect as useEffectReact } from "react";

export default function Navbar() {
  const { account, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!account) return;

    function fetchCount() {
      fetch("/api/support/unread-count")
        .then((res) => res.json())
        .then((data) => setUnreadCount(data.count || 0))
        .catch(() => {});
    }

    fetchCount();
    const interval = setInterval(fetchCount, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [account]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href
        ? "text-teal-950"
        : "text-stone-500 hover:text-stone-900"
    }`;

const isStaffOnSupport =
    pathname.startsWith("/support") && (account?.role === "SUPPORT_AGENT" || account?.role === "ADMIN");

  if (
    pathname.startsWith("/patient") ||
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider") ||
    isStaffOnSupport
  )
    return null;

  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-teal-950">
          CuraLink
        </Link>

        <div className="flex items-center gap-6">
          {!loading && !account && (
            <>
              <Link href="/doctors" className={linkClass("/doctors")}>
                Find a Doctor
              </Link>
              <Link href="/medicines" className={linkClass("/medicines")}>
                Medicines
              </Link>
              <Link href="/login" className={linkClass("/login")}>
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-teal-950 hover:bg-teal-900 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
              >
                Sign up
              </Link>
            </>
          )}

          {!loading && account?.role === "PATIENT" && (
            <>
              <Link href="/doctors" className={linkClass("/doctors")}>
                Find a Doctor
              </Link>
              <Link href="/medicines" className={linkClass("/medicines")}>
                Medicines
              </Link>
              <Link href="/blog" className={linkClass("/blog")}>
                Blog
              </Link>
              <Link href="/support/tickets" className={linkClass("/support/tickets")}>
                Support{unreadCount > 0 && ` (${unreadCount})`}
              </Link>
              <Link
                href="/patient/consultations"
                className={linkClass("/patient/consultations")}
              >
                My Consultations
              </Link>
              <Link href="/ambulance/status" className={linkClass("/ambulance/status")}>
                Ambulance
               </Link>

              <Link href="/patient/profile" className={linkClass("/patient/profile")}>
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-stone-500 hover:text-stone-900"
              >
                Log out
              </button>
            </>
          )}

          {!loading && account?.role === "DOCTOR" && (
            <>
              <Link href="/medicines" className={linkClass("/medicines")}>
                Medicines
              </Link>

              <Link href="/blog" className={linkClass("/blog")}>
                Blog
              </Link>

              <Link href="/doctor/blog" className={linkClass("/doctor/blog")}>
                My Articles
              </Link>
              <Link href="/support/tickets" className={linkClass("/support/tickets")}>
                Support{unreadCount > 0 && ` (${unreadCount})`}
              </Link>
              <Link
                href="/doctor/consultations"
                className={linkClass("/doctor/consultations")}
              >
                My Consultations
              </Link>
              <Link href="/doctor/schedule" className={linkClass("/doctor/schedule")}>
                Schedule
              </Link>
              <Link href="/doctor/profile" className={linkClass("/doctor/profile")}>
                My Profile
              </Link>
              <Link href="/doctor/analytics" className={linkClass("/doctor/analytics")}>
                Analytics
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-stone-500 hover:text-stone-900"
              >
                Log out
              </button>
            </>
          )}

          {!loading && account?.role === "ADMIN" && (
            <>
              <Link href="/admin" className={linkClass("/admin")}>
                Doctors
              </Link>
              <Link href="/admin/patients" className={linkClass("/admin/patients")}>
                Patients
              </Link>
              <Link href="/admin/medicines" className={linkClass("/admin/medicines")}>
                Medicines
              </Link>
              <Link href="/admin/blog" className={linkClass("/admin/blog")}>
                Articles
              </Link>
              <Link href="/admin/providers" className={linkClass("/admin/providers")}>
                Providers
              </Link>
              <Link href="/admin/analytics" className={linkClass("/admin/analytics")}>
                Analytics
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-stone-500 hover:text-stone-900"
              >
                Log out
              </button>
            </>
          )}
          {!loading && account?.role === "AMBULANCE_PROVIDER" && (
            <>
              <Link href="/provider/requests" className={linkClass("/provider/requests")}>
                Requests
              </Link>
              <Link href="/support/tickets" className={linkClass("/support/tickets")}>
                Support{unreadCount > 0 && ` (${unreadCount})`}
              </Link>

              <Link href="/provider/profile" className={linkClass("/provider/profile")}>
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-stone-500 hover:text-stone-900"
              >
                Log out
              </button>
            </>
          )}

           {!loading && account?.role === "SUPPORT_AGENT" && (
            <>
              <Link href="/support/tickets" className={linkClass("/support/tickets")}>
                Support Queue{unreadCount > 0 && ` (${unreadCount})`}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-stone-500 hover:text-stone-900"
              >
                Log out
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
    

  );
}