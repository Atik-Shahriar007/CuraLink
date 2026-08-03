"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const { account, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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
                Support
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
                Support
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
                Support
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
                Support Queue
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