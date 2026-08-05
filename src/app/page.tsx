import Link from "next/link";
import HeroParticles from "./components/HeroParticles";
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
      <section className="relative overflow-hidden bg-teal-950 text-stone-50">
        <HeroParticles />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="uppercase tracking-widest text-xs text-copper-light font-medium mb-6">
              Telemedicine, done simply
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] font-medium mb-6">
              Talk to a real doctor in minutes, not weeks.
            </h1>
            <p className="text-stone-300 text-lg mb-10 max-w-md">
              Browse verified doctors, book a slot that works for you, and see
              them face-to-face from home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/doctors"
                className="bg-[var(--color-copper)] hover:bg-[var(--color-copper-light)] transition-colors text-white px-7 py-3.5 rounded-full font-medium"
              >
                Find a Doctor
              </Link>
              <Link
                href="/register"
                className="border border-stone-600 hover:border-stone-400 transition-colors px-7 py-3.5 rounded-full font-medium"
              >
                I&apos;m a Doctor
              </Link>
            </div>
          </div>

          {/* Signature element: a floating mockup of the product's own doctor card + a live-call indicator */}
          <div className="relative hidden md:block">
            <div className="absolute -inset-8 bg-[var(--color-copper)]/10 rounded-[2rem] blur-2xl" />
            <div className="relative bg-white text-stone-900 rounded-2xl shadow-2xl p-6 max-w-sm ml-auto">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-display text-lg">
                  AS
                </div>
                <div>
                  <p className="font-semibold">Dr. Atik Shahriar</p>
                  <p className="text-sm text-stone-500">Cardiology</p>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-stone-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In consultation
                </span>
                <span className="text-sm text-stone-400">6:10 PM</span>
              </div>
            </div>
            <div className="relative bg-teal-900 text-stone-100 rounded-2xl shadow-xl p-4 max-w-[220px] mt-[-2rem] mr-12">
              <p className="text-xs text-stone-400 mb-1">Chat</p>
              <p className="text-sm bg-teal-800/60 rounded-lg px-3 py-2">
                See you at your appointment time!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-50 border-y border-red-200">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-red-900">Need an Ambulance Urgently?</h2>
            <p className="text-red-700 mt-1">
              Request one of CuraLink's registered ambulance partners in a few taps.
            </p>
          </div>
          <Link
            href="/ambulance/request"
            className="bg-red-600 hover:bg-red-700 transition-colors text-white px-7 py-3.5 rounded-full font-medium whitespace-nowrap"
          >
            Request Ambulance
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display text-3xl mb-14 text-center">
          Three steps to your consultation
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="font-display text-3xl text-[var(--color-copper)] mb-3">
                {s.n}
              </p>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-stone-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
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
        </div>
      </section>

      {/* Medicines */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
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
        </div>
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
      <section className="bg-stone-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
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
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-3xl mb-6">
          Your health, on your schedule.
        </h2>
        <Link
          href="/doctors"
          className="inline-block bg-teal-950 hover:bg-teal-900 transition-colors text-white px-8 py-4 rounded-full font-medium"
        >
          Find a Doctor
        </Link>
      </section>
    </div>
  );
}