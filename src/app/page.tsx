import Link from "next/link";
import HeroParticles from "./components/HeroParticles";
import Reveal from "./components/Reveal";
import HeartbeatLine from "./components/HeartbeatLine";
import AmbulanceIllustration from "./components/AmbulanceIllustration";
import {
  ShieldCheck, Lock, Clock, Users, CalendarCheck, Search, ArrowRight,
  Mic, Video, PhoneOff, FileText, CalendarCheck2, ClipboardCheck, Star, Stethoscope,
  Heart, Baby, Brain, Briefcase, Pill, Newspaper,
} from "lucide-react";
const steps = [
  {
    n: "01",
    title: "Browse & choose",
    body: "Search doctors by specialty, hospital, or price, and read real reviews before you book.",
  },
  {
    n: "02",
    title: "Book & pay",
    body: "Pick a time that works for you and confirm instantly with secure checkout.",
  },
  {
    n: "03",
    title: "Consult live",
    body: "Join a private video call at the time of your appointment — no waiting room.",
  },
];

const specialties = [
  { name: "Cardiology", icon: Heart, color: "text-teal-800", bg: "bg-teal-50" },
  { name: "Dermatology", icon: Stethoscope, color: "text-red-600", bg: "bg-red-50" },
  { name: "Pediatrics", icon: Baby, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Psychiatry", icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
  { name: "General Medicine", icon: Briefcase, color: "text-emerald-700", bg: "bg-emerald-50" },
];

async function getLatestPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog`, { cache: "no-store" });
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const latestPosts = await getLatestPosts();
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
        <HeartbeatLine className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-[560px] h-24 text-teal-400/50 -translate-y-1/2 pointer-events-none" />

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
          <div className="relative w-56 h-32 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ambulance-hero.png"
              alt="Ambulance"
              className="w-full h-full object-contain"
            />
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
      <section className="bg-white py-24 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #0F3D3E20 1.6px, transparent 1.6px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 relative">
        <Reveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
            <Stethoscope size={13} /> How It Works
          </span>
          <h2 className="font-display text-3xl mb-3">Three steps to your consultation</h2>
          <p className="text-stone-500">
            Get quality healthcare from the comfort of your home — simple, fast and secure.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {[
            { icon: Search, badge: "01", badgeColor: "bg-teal-100 text-teal-800", iconColor: "text-teal-800", iconBg: "bg-teal-50" },
            { icon: ShieldCheck, badge: "02", badgeColor: "bg-blue-100 text-blue-800", iconColor: "text-blue-700", iconBg: "bg-blue-50" },
            { icon: Video, badge: "03", badgeColor: "bg-purple-100 text-purple-800", iconColor: "text-purple-700", iconBg: "bg-purple-50" },
          ].map((visual, i) => (
            <Reveal key={steps[i].n} delay={i * 0.12} className="relative">
              <div className="border border-stone-200 rounded-2xl p-6 bg-white h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${visual.iconBg}`}>
                    <visual.icon size={20} className={visual.iconColor} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${visual.badgeColor}`}>
                    {visual.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{steps[i].title}</h3>
                <p className="text-stone-500 text-sm">{steps[i].body}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-teal-50 border-2 border-teal-200 shadow-md items-center justify-center">
                  <ArrowRight size={18} className="text-teal-800" strokeWidth={2.75} />
                </div>
              )}
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="bg-[#EEF5F4] py-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[var(--color-copper)]/10 rounded-full blur-3xl" />
        <Reveal className="max-w-6xl mx-auto px-6 text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
            <Stethoscope size={13} /> Consult Across Specialties
          </span>
          <h2 className="font-display text-2xl mb-2">Quality care for every need</h2>
          <p className="text-stone-500">Connect with verified doctors across all major specialties</p>
        </Reveal>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {specialties.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <Link
                href={`/doctors?specialty=${encodeURIComponent(s.name)}`}
                className="group flex items-center justify-between gap-2 bg-white border border-stone-200 hover:border-teal-700 hover:shadow-md transition-all px-4 py-4 rounded-xl text-sm font-medium"
              >
                <span className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                    <s.icon size={17} className={s.color} />
                  </span>
                  {s.name}
                </span>
                <ArrowRight size={14} className="text-stone-300 group-hover:text-teal-800 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="text-center mt-8">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-teal-800 font-medium text-sm hover:underline underline-offset-4"
          >
            View all specialties <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>


      {/* Medicines */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#F4F9F8] via-white to-[#FBF6F0]">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%230F3D3E' fill-opacity='0.06'%3E%3Cpath d='M18 8h4v10h10v4H22v10h-4V22H8v-4h10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-200/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--color-copper)]/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 relative">
        <Reveal className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Pill size={22} className="text-teal-800" />
            </span>
            <div>
              <h2 className="font-display text-2xl mb-1">Medicine Directory</h2>
              <p className="text-stone-500 text-sm">
                Look up dosage, price, and side effects for common medications.
              </p>
            </div>
          </div>
          <Link
            href="/medicines"
            className="inline-flex items-center gap-1.5 border border-stone-300 hover:border-teal-700 transition-colors px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap"
          >
            Browse All <ArrowRight size={14} />
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Analgesic & Antipyretic", sub: "Pain relief and fever reduction", icon: Pill, color: "text-teal-800", bg: "bg-teal-50" },
            { name: "Antibiotic", sub: "Treat bacterial infections", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Antidiabetic", sub: "Manage blood sugar levels", icon: Heart, color: "text-purple-600", bg: "bg-purple-50" },
            { name: "Antihypertensive", sub: "Control high blood pressure", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
          ].map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.06}>
              <Link
                href={`/medicines?category=${encodeURIComponent(cat.name)}`}
                className="group flex items-start gap-3 bg-white border border-stone-200 hover:border-teal-800/30 hover:shadow-md transition-all rounded-2xl px-4 py-4 h-full"
              >
                <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cat.bg}`}>
                  <cat.icon size={17} className={cat.color} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center justify-between gap-1">
                    <span className="font-medium text-sm truncate">{cat.name}</span>
                    <ArrowRight size={13} className="text-stone-300 group-hover:text-teal-800 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </span>
                  <span className="text-xs text-stone-400 block mt-0.5">{cat.sub}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* Blog */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-[#FBF8F3] to-[#F3EEE6]">
        <div
          className="absolute inset-0 opacity-[0.6]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23B5541B' fill-opacity='0.05'%3E%3Cpath d='M12 2h2v10h10v2H14v10h-2V14H2v-2h10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[var(--color-copper)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <Reveal className="max-w-6xl mx-auto px-6">
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Newspaper size={22} className="text-teal-800" />
              </span>
              <div>
                <h2 className="font-display text-2xl mb-1">Health Articles</h2>
                <p className="text-stone-500 text-sm">
                  Written by our doctors, reviewed for accuracy before publishing.
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 border border-stone-300 hover:border-teal-700 transition-colors px-5 py-2.5 rounded-full text-sm font-medium bg-white whitespace-nowrap"
            >
              Read All Articles <ArrowRight size={14} />
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <p className="text-stone-400 text-sm">Articles will appear here once published.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-6">
              {latestPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all bg-white"
                >
                  <div className="w-full h-40 bg-stone-100">
                    {post.coverImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[var(--color-copper)] font-medium">{post.category}</span>
                    <h3 className="font-semibold mt-1 leading-snug group-hover:text-teal-900 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-stone-500 text-sm mt-1.5 line-clamp-2">{post.excerpt}</p>
                    )}
                    <p className="text-xs text-stone-400 mt-3">{post.readTimeMinutes} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-teal-950 py-28 text-center text-stone-50">
        <HeroParticles />
        <HeartbeatLine className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-[560px] h-24 text-[var(--color-copper-light)]/40 -translate-y-1/2 pointer-events-none" />
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