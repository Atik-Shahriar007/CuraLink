import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Navbar from "./components/Navbar";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CuraLink",
  description: "Telemedicine consultations, simplified.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" },
};

export const viewport = {
  themeColor: "#0F3D3E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Browser extensions inject attributes into <html> and <body> before React
  // hydrates (crxemulator, bis_register, __processed_*), which React reports as
  // a hydration mismatch. suppressHydrationWarning only covers the element it is
  // placed on, so both need it.
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ServiceWorkerRegister />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}