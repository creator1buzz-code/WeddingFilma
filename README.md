# WeddingFilma.in

Premium cinematic wedding photography & filmmaking platform for India.
Marketing site + booking engine + admin dashboard, built to grow into a full
studio OS (client portal, CRM, blog, payments, e-sign, WhatsApp).

## Stack

| Concern       | Choice                                                     |
| ------------- | ---------------------------------------------------------- |
| Framework     | **Next.js 14 (App Router)** + TypeScript                   |
| Styling       | **Tailwind CSS** + custom design tokens (dark/light)       |
| Animation     | **Framer Motion**                                          |
| Database      | **PostgreSQL** via **Supabase**                            |
| ORM           | **Prisma**                                                 |
| Auth          | **Supabase Auth** (email/password, role in `profiles`)     |
| Storage       | **Supabase Storage** (`gallery`, `avatars` buckets)        |
| Email         | **Resend** (transactional)                                 |
| Hosting       | **Vercel**                                                 |
| Domain        | GoDaddy → Vercel                                           |
| Email domain  | Google Workspace (MX on `weddingfilma.in`)                 |

## Modular architecture

Each feature lives in its own folder so it can grow independently:

```
src/
├── app/
│   ├── (marketing)/         → home, portfolio, about, contact
│   ├── booking/             → public booking flow
│   ├── admin/               → studio console (guarded)
│   ├── api/                 → route handlers (bookings, contact, gallery…)
│   ├── sitemap.ts / robots.ts
│   └── globals.css
├── components/
│   ├── home/                → hero, films, portfolio, stats, faq…
│   ├── booking/             → BookingForm
│   ├── portfolio/           → gallery + lightbox
│   ├── admin/               → sidebar, tables
│   ├── layout/              → Navbar, Footer
│   ├── theme/               → ThemeProvider, ThemeToggle
│   └── ui/                  → primitives (accordion, form)
├── lib/
│   ├── prisma.ts            → singleton Prisma client
│   ├── supabase/{client,server}.ts
│   ├── resend.ts            → email templates + sender
│   └── utils.ts
└── middleware.ts            → admin route protection
```

## 1 · Local setup

```bash
git clone <your-repo-url> weddingfilma && cd weddingfilma
cp .env.example .env.local          # then fill in real values (see below)
yarn install
yarn db:migrate                     # applies prisma migrations
yarn db:seed                        # sample packages, testimonials, gallery
yarn dev
```

Open `http://localhost:3000`.

## 2 · Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. Pick a strong DB password. Region: closest to your traffic (e.g. `ap-south-1`).
3. In **Project Settings → API**, copy:
   * `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   * `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only, never expose!)
4. In **Project Settings → Database → Connection string**:
   * `Transaction / Pooler` (port `6543`) → `DATABASE_URL`
   * `Session / Direct` (port `5432`) → `DIRECT_URL`

## 3 · Database schema

You have two ways to apply the schema — pick one.

### Option A · SQL editor (recommended for Supabase)

1. In Supabase dashboard → **SQL Editor**.
2. Paste and run `supabase/migrations/001_initial.sql`.
3. Then run `supabase/migrations/002_rls_policies.sql`.

### Option B · Prisma migrate

```bash
yarn db:migrate           # or: npx prisma migrate deploy
```

Then run the RLS policies from `002_rls_policies.sql` in the SQL editor (Prisma
doesn't manage RLS).

Seed sample data:

```bash
yarn db:seed
```

## 4 · Supabase Auth

1. **Authentication → Providers** → enable **Email**.
2. **Authentication → Users → Add user** — create the studio admin, e.g.
   * email: `admin@weddingfilma.in`
   * password: strong random
3. Elevate role in SQL Editor:
   ```sql
   update public.profiles set role = 'ADMIN' where email = 'admin@weddingfilma.in';
   ```
4. Optional: enable Google OAuth for staff (add allowed redirect URL:
   `https://weddingfilma.in/auth/callback`).

## 5 · Supabase Storage

1. **Storage → New bucket** → `gallery` (public) and `avatars` (public).
2. Uncomment & run the storage policies at the bottom of
   `supabase/migrations/002_rls_policies.sql`.
3. From the admin console, uploads write to the `gallery` bucket and the URL is
   stored in `gallery_items.url`.

## 6 · Resend (email)

1. Go to [resend.com](https://resend.com) → **API Keys → Create** →
   `RESEND_API_KEY`.
2. **Domains → Add** `weddingfilma.in`, verify DKIM/SPF from your DNS.
3. Set `EMAIL_FROM="WeddingFilma <bookings@weddingfilma.in>"`.

## 7 · Environment variables

Fill in `.env.local` (dev) and Vercel (prod):

| Variable                          | Where              |
| --------------------------------- | ------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase → API     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase → API     |
| `SUPABASE_SERVICE_ROLE_KEY`       | Supabase → API     |
| `DATABASE_URL`                    | Supabase → DB pooler (6543) |
| `DIRECT_URL`                      | Supabase → DB direct (5432) |
| `RESEND_API_KEY`                  | Resend             |
| `EMAIL_FROM`                      | `WeddingFilma <bookings@weddingfilma.in>` |
| `EMAIL_ADMIN`                     | `info@weddingfilma.in` |
| `NEXT_PUBLIC_SITE_URL`            | `https://weddingfilma.in` |
| `NEXT_PUBLIC_SITE_NAME`           | `WeddingFilma`     |

## 8 · Deploy to Vercel

1. Push to GitHub.
2. [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset: **Next.js**. Root: `/`.
4. Paste every env var from step 7 into **Environment Variables**.
5. Deploy.

## 9 · Connect domain (GoDaddy → Vercel)

1. Vercel → **Settings → Domains → Add** `weddingfilma.in` and `www.weddingfilma.in`.
2. GoDaddy → **DNS Management**:
   * `A` record `@` → `76.76.21.21` (Vercel)
   * `CNAME` `www` → `cname.vercel-dns.com`
3. SSL is issued automatically.

## 10 · Google Workspace email

1. Buy Google Workspace on your `weddingfilma.in` domain.
2. Google will give you 5 MX records — paste them into GoDaddy DNS.
3. Add SPF: `v=spf1 include:_spf.google.com include:amazonses.com ~all`
   (the `amazonses.com` include is for Resend delivery).
4. Add DKIM keys from both **Google Admin → Apps → Gmail → Authenticate email**
   and **Resend → Domains**.

## 11 · Post-deployment checklist

- [ ] Booking form submits successfully → check DB row + email received.
- [ ] Admin login works and redirects to `/admin`.
- [ ] Gallery upload writes to Supabase Storage bucket.
- [ ] `sitemap.xml` and `robots.txt` resolve.
- [ ] Lighthouse ≥ 90 on mobile.
- [ ] Add favicon + `og.jpg` at `/public/`.

## Roadmap (Phase 2)

Modules already scaffolded to grow into:
* **Client portal** (`/portal`) — private galleries, invoices, favourites, chat.
* **Blog CMS** — `blog_posts` table already migrated.
* **Payments** — Stripe/Razorpay on `Package`.
* **E-signatures** — DocuSign/HelloSign hooked to `Booking.status`.
* **WhatsApp notifications** — Twilio/Interakt on booking events.
* **AI photo selection** — CLIP embeddings per gallery item.

## Scripts

```bash
yarn dev              # local dev
yarn build            # production build
yarn start            # production server
yarn lint             # eslint

yarn db:push          # push schema without migration files
yarn db:migrate       # deploy migrations
yarn db:seed          # sample data
yarn db:studio        # prisma studio at localhost:5555
```

## License

Proprietary © WeddingFilma. All rights reserved.
