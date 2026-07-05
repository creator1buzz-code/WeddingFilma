# WeddingFilma – Product Requirements Document

**Original problem statement:** Build WeddingFilma.in — a premium, modern, cinematic wedding photography & filmmaking platform for India. Marketing site, booking system, admin dashboard, client portal, CRM, calendar, gallery mgmt, blog, automated emails, analytics; growable to payments, e-signatures, AI photo selection, WhatsApp.

**Tech chosen (user-directed):** Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion + Supabase (Postgres, Auth, Storage) + Prisma + Resend + Vercel.

## User personas
1. **Couple** browsing portfolio and booking a wedding shoot.
2. **Family** commissioning maternity / child photography.
3. **Brand marketer** needing a corporate film.
4. **Studio admin** managing bookings, gallery, testimonials, packages.

## Phase 1 – DONE (Feb 2026)
- Premium cinematic marketing site: Hero (autoplay video, **"Reserve your date" scarcity widget** in top-right), Portfolio (masonry + filter), Featured Films (carousel), Stats (animated counters), Why-Choose, Services, Testimonials, FAQ (accordion), Instagram feed, Contact CTA. Dark/light mode.
- Portfolio archive page with masonry, category filter, search, lightbox, load-more.
- Booking system: `/booking` form → validated Zod payload → Prisma → unique code → Resend confirmation to client + admin.
- Admin dashboard: `/admin` (stats), `/admin/bookings` (+ CSV export), `/admin/capacity` (scarcity engine), `/admin/gallery`, `/admin/testimonials`, `/admin/packages`, `/admin/clients`, `/admin/login` (Supabase Auth), middleware-guarded.
- Scarcity engine: `year_capacity` table + `/api/capacity` (5-min cached) + admin form to update `booked/total` per year — widget updates on save.
- About/Studio page, Contact page (with `/api/contact`), SEO (metadata, sitemap, robots, OG, Twitter card).
- Complete Prisma schema + Supabase SQL migrations (001 schema, 002 RLS, 003 year_capacity) + seed data.
- Comprehensive README covering Supabase setup, Prisma migrations, Resend, Vercel deploy, GoDaddy DNS, Google Workspace.

## Backlog (Phase 2)
- **P0 – Client portal** (`/portal`): private galleries, favourites, invoices, contract download, chat, album progress.
- **P0 – Real gallery uploads** wired to Supabase Storage from `/admin/gallery` (multer-style dropzone).
- **P1 – Blog CMS** (`/blog`) with MDX or rich text editor.
- **P1 – Payments** (Stripe/Razorpay) on packages.
- **P1 – WhatsApp notifications** (Interakt / Twilio).
- **P2 – Calendar view** for shoot scheduling.
- **P2 – E-signatures** (HelloSign) on booking confirm.
- **P2 – AI photo selection** with CLIP embeddings.
- **P2 – Analytics dashboard** (Plausible / PostHog).

## Next tasks
1. User plugs in Supabase, Resend, DATABASE_URL → runs `yarn db:migrate` + `yarn db:seed`.
2. Deploy to Vercel; connect `weddingfilma.in` DNS + Google Workspace MX.
3. Real photo uploads via admin.
4. Build Phase-2 Client Portal module.
