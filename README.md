# CuraLink

A full-stack telemedicine platform: patients find verified doctors, pay securely, and consult over video, with prescriptions, an online medicine catalog, ambulance requests, a support desk and health blogs.

**Live demo:** https://curalink-gold.vercel.app

---

## Features

**Patients**
- Browse and filter doctors by specialty, price, experience, rating and availability
- Book 30-minute slots from a doctor's weekly schedule (server-side conflict checks)
- Pay with Stripe Checkout; the consultation is created only after payment is confirmed
- HD video consultation (Daily.co) with live in-call chat (Pusher)
- View consultation notes and prescriptions, with live alerts when a doctor sends or updates one
- Rate and review doctors after a completed consultation
- Request an ambulance (GPS or manual address) and track its status live
- Browse the medicine catalog, read health blogs, open support tickets

**Doctors**
- Profile with degrees, certifications, hospital, price, and weekly schedule
- Approval flow by admin before appearing publicly
- Run consultations, write notes, issue and revise prescriptions, end consultations
- Write blog posts (reviewed by admin before publishing)
- Analytics dashboard: earnings, consultations, ratings

**Ambulance providers**
- Registration with admin approval, incoming request queue, status updates (Accepted → Dispatched → Arrived → Completed) with live updates to the patient

**Support agents**
- Ticket queue with categories, assignment, real-time replies and satisfaction ratings

**Admins**
- Approve doctors, ambulance providers and blog posts
- Platform analytics (revenue, users, consultations) and user management

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React, TypeScript |
| Styling / UI | Tailwind CSS v4, Lucide icons, Framer Motion, Three.js (@react-three/fiber), Recharts, Leaflet + OpenStreetMap |
| Database | PostgreSQL (Neon) with Prisma **v6** |
| Auth | Custom JWT in an httpOnly cookie, bcryptjs, zod, `jose` (Edge) |
| Payments | Stripe Checkout + signature-verified webhooks |
| Video | Daily.co |
| Realtime | Pusher Channels |
| Images | Cloudinary |
| Hosting | Vercel (+ cron-job.org for scheduled jobs) |

> **Important:** Prisma is pinned to v6. Do **not** upgrade to Prisma 7; it breaks `url` in `schema.prisma`.

---

## Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (e.g. a free Neon project)
- Accounts for Stripe, Daily.co, Pusher and Cloudinary
- [Stripe CLI](https://stripe.com/docs/stripe-cli) for local webhooks

### Install

```bash
git clone https://github.com/Atik-Shahriar007/CuraLink.git
cd CuraLink
npm install
```

### Environment variables

Create a `.env` file in the project root (never commit it):

```env
DATABASE_URL=
JWT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

DAILY_API_KEY=
DAILY_DOMAIN=

PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=
```

### Database

```bash
npx prisma migrate deploy
npx prisma generate
node prisma/seed-medicines.js   # optional: seeds sample medicines
```

### Run

```bash
npm run dev
```

Open http://localhost:3000.

For Stripe webhooks locally, in a second terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

---

## Special Accounts

Admin and Support Agent accounts cannot self-register. Register a normal account, then open Prisma Studio (`npx prisma studio`), and change the account's `role` to `ADMIN` or `SUPPORT_AGENT`.

---

## Consultation Lifecycle & Scheduled Jobs

`PENDING` → `IN_PROGRESS` (start job, at the scheduled time) → `COMPLETED` (doctor clicks **End Consultation**) or `CANCELED` (cleanup job, 60+ minutes past the scheduled time). Leaving a call never completes it.

| Endpoint | Purpose |
|---|---|
| `GET /api/jobs/start-consultations` | Moves due PENDING consultations to IN_PROGRESS |
| `GET /api/jobs/cleanup-consultations` | Cancels stale PENDING consultations |

Both require the header `Authorization: Bearer <CRON_SECRET>`. Vercel Hobby only allows daily crons (see `vercel.json`), so real-interval scheduling is done with [cron-job.org](https://cron-job.org). Manual trigger:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://curalink-gold.vercel.app/api/jobs/start-consultations
```

---

## Deployment (Vercel)

1. Import the GitHub repo into Vercel.
2. Add every variable from the `.env` template in **Project Settings → Environment Variables** (Vercel does not read `.env`). Set `NEXT_PUBLIC_APP_URL` to your production URL.
3. In Stripe, add a webhook destination `https://<your-domain>/api/webhooks/stripe` for `checkout.session.completed` and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Redeploy after any environment variable change.
5. Set up the two cron jobs on cron-job.org with the `Authorization` header.

### Operational notes
- After merging any Prisma schema change, run `npx prisma migrate deploy` against the production database.
- Pages using `useSearchParams` must be wrapped in `<Suspense>` or the production build fails.
- Neon's free tier has a monthly compute cap and scales to zero; avoid aggressive polling and very frequent cron schedules.
- Adding a role requires updating: `JwtPayload` (`src/lib/auth.ts`), the `Account` interface (`src/lib/AuthContext.tsx`), `roleProtectedPrefixes` (`src/proxy.ts`), and the `getCurrentAccount()` include (`src/lib/session.ts`).

---

## Project Structure

```
prisma/             Schema, migrations, seed scripts
public/images/      Static images
src/
  app/
    api/            Route handlers (auth, checkout, webhooks, jobs, ...)
    components/     Shared UI (Navbar, DashboardSidebar, ...)
    patient/ doctor/ admin/ provider/ support/   Role dashboards
    doctors/ medicines/ blog/ consultation/      Public & shared pages
  lib/              auth, session, Prisma client, Pusher, Cloudinary helpers
  proxy.ts          Route protection (Edge, JWT verified with jose)
vercel.json         Daily cron fallbacks
```

---

## Security

- Passwords hashed with bcrypt; sessions in httpOnly JWT cookies
- Role checks enforced server-side on every protected route and API
- Prices come from the database, never from the client
- Stripe webhook signatures verified; the session is re-fetched before creating a consultation
- Video room tokens are scoped to the specific consultation and participant
- Cron endpoints protected by `CRON_SECRET`
- The ambulance feature is a demo; in a real emergency call your local emergency number (999 in Bangladesh)

---

## License

Built for academic purposes. All rights reserved by the authors.
