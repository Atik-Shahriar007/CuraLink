import Link from "next/link";
import HeroParticles from "./components/HeroParticles";
import Reveal from "./components/Reveal";
import HeartbeatLine from "./components/HeartbeatLine";
import {
  ShieldCheck, Lock, Clock, Users, CalendarCheck, Search, ArrowRight,
  Mic, Video, PhoneOff, FileText, CalendarCheck2, ClipboardCheck, Star,
} from "lucide-react";
const steps = [
  {
    n: "01",
    title: "Browse & choose",
    body: "Search doctors by specialty, hospital, or price, and read real profiles before you book.",
  },
  {
    n: "02",
    title: "Book & pay",
    body: "Pick a time that works for you and confirm instantly with secure checkout.",
  },
  {
    n: "03",
    title: "Consult live",
    body: "Join a private video call the moment your appointment starts — no waiting room.",
  },
];

const specialties = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Psychiatry",
  "General Medicine",
];

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      {/* Hero */}
      <section className="relative overflow-hidden bg-teal-950 text-stone-50">
        <HeroParticles />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <HeartbeatLine className="hidden md:block absolute top-1/2 left-[38%] w-72 h-16 text-teal-400/40 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 bg-teal-900/60 border border-teal-700/50 text-teal-100 text-xs font-medium px-4 py-2 rounded-full mb-6">
                <ShieldCheck size={14} className="text-emerald-400" />
                Verified, Admin-Approved Doctors Only
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display text-4xl md:text-5xl leading-[1.1] font-medium mb-6">
                Talk to a real doctor in{" "}
                <span className="text-[var(--color-copper-light)]">minutes,</span> not weeks.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-stone-300 text-lg mb-8 max-w-md">
                Browse verified doctors, book a slot that works for you, and see them
                face-to-face from home.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 bg-[var(--color-copper)] hover:bg-[var(--color-copper-light)] transition-colors text-white px-6 py-3.5 rounded-full font-medium"
                >
                  <CalendarCheck size={17} /> Book an Appointment <ArrowRight size={15} />
                </Link>
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 border border-stone-600 hover:border-stone-400 transition-colors px-6 py-3.5 rounded-full font-medium"
                >
                  <Search size={16} /> Browse Doctors
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-sm">
                {[
                  { icon: ShieldCheck, label: "Verified\nDoctors" },
                  { icon: Lock, label: "Secure &\nPrivate" },
                  { icon: Clock, label: "24/7\nSupport" },
                  { icon: Users, label: "Better Health\nFor Everyone" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <item.icon size={18} className="text-teal-400 flex-shrink-0" />
                    <span className="text-stone-300 whitespace-pre-line leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Call card + floating notifications */}
          <Reveal delay={0.2} className="hidden lg:flex items-start gap-4">
            <div className="bg-white text-stone-900 rounded-2xl shadow-2xl p-5 w-full max-w-sm flex-shrink-0">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-3 bg-stone-100">
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur text-xs font-medium text-emerald-700 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online Now
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-doctor.png"
                    alt="Doctor on a video consultation"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <p className="font-semibold">Dr. Atik Shahriar</p>
                <p className="text-sm text-stone-500">Cardiology</p>
                <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                  <Star size={12} fill="currentColor" /> 4.9
                  <span className="text-stone-400">(1,200+ consultations)</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                  <Mic size={16} className="text-stone-600" />
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                  <Video size={16} className="text-stone-600" />
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <PhoneOff size={16} className="text-white" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 flex-1 min-w-0">
              {[
                { icon: FileText, title: "Prescription Sent", sub: "Sent to your email" },
                { icon: CalendarCheck2, title: "Appointment Confirmed", sub: "Today, 6:10 PM" },
                { icon: ClipboardCheck, title: "Medical Record Updated", sub: "View in your dashboard" },
              ].map((n, i) => (
                <div key={i} className="bg-white text-stone-900 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                  <n.icon size={16} className="text-teal-700 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{n.title}</p>
                    <p className="text-xs text-stone-400 truncate">{n.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-50 border-y border-red-200">
        <Reveal className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="absolute inset-0 bg-red-200 rounded-full blur-xl opacity-60" />
            <svg viewBox="0 0 64 64" className="relative w-20 h-20 text-red-600">
              <rect x="6" y="26" width="40" height="18" rx="3" fill="currentColor" opacity="0.12" />
              <rect x="6" y="26" width="40" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M46 32h8l4 6v6h-12z" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="46" r="4" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="46" cy="46" r="4" fill="white" stroke="currentColor" strokeWidth="2" />
              <path d="M22 30v10M17 35h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">Emergency?</p>
            <h2 className="font-display text-xl text-red-950">Need an ambulance urgently?</h2>
            <p className="text-red-700 text-sm mt-0.5">
              Request one of CuraLink's registered ambulance partners in a few taps.
            </p>
          </div>

          <div className="flex items-center gap-3 border-l border-red-200 pl-6 hidden sm:flex">
            <Clock size={22} className="text-red-500" />
            <div>
              <p className="text-xs text-red-500">Average dispatch</p>
              <p className="font-semibold text-red-950">5–10 min</p>
            </div>
          </div>

          <Link
            href="/ambulance/request"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white px-6 py-3 rounded-full font-medium whitespace-nowrap"
          >
            Request Ambulance <ArrowRight size={15} />
          </Link>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <h2 className="font-display text-3xl mb-14 text-center">
            Three steps to your consultation
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <p className="font-display text-3xl text-[var(--color-copper)] mb-3">
                {s.n}
              </p>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-stone-600">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="bg-stone-100 py-20">
        <Reveal className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-2xl mb-8 text-center">
            Consult across specialties
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {specialties.map((s) => (
              <Link
                key={s}
                href={`/doctors?specialty=${encodeURIComponent(s)}`}
                className="bg-white border border-stone-200 hover:border-teal-700 transition-colors px-5 py-2.5 rounded-full text-sm font-medium"
              >
                {s}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Medicines */}

      {/* Medicines */}
      {/* Medicines */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl mb-2">Medicine Directory</h2>
            <p className="text-stone-600">
              Look up dosage, price, and side effects for common medications.
            </p>
          </div>
          <Link
            href="/medicines"
            className="hidden sm:inline-block border border-stone-300 hover:border-teal-700 transition-colors px-5 py-2.5 rounded-full text-sm font-medium"
          >
            Browse All
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Analgesic & Antipyretic", "Antibiotic", "Antidiabetic", "Antihypertensive"].map((cat) => (
            <Link
              key={cat}
              href={`/medicines?category=${encodeURIComponent(cat)}`}
              className="bg-white border border-stone-200 hover:border-teal-800/30 hover:shadow-md transition-all rounded-2xl px-5 py-6 text-center font-medium text-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Blog */}
      {/* Blog */}
      <section className="bg-stone-100 py-20">
        <Reveal className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl">Health Articles</h2>
            <Link
              href="/blog"
              className="hidden sm:inline-block border border-stone-300 hover:border-teal-700 transition-colors px-5 py-2.5 rounded-full text-sm font-medium bg-white"
            >
              Read All
            </Link>
          </div>
          <p className="text-stone-600 mb-2">
            Written by our doctors, reviewed for accuracy before publishing.
          </p>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-teal-950 py-28 text-center text-stone-50">
        <HeroParticles />
        <Reveal className="relative z-10 max-w-2xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl mb-6">
            Your health, on your schedule.
          </h2>
          <Link
            href="/doctors"
            className="inline-block bg-[var(--color-copper)] hover:bg-[var(--color-copper-light)] transition-colors text-white px-8 py-4 rounded-full font-medium"
          >
            Find a Doctor
          </Link>
        </Reveal>
      </section>
    </div>
  );
}