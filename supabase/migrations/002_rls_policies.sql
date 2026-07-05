-- ================================================================
-- WeddingFilma · Row Level Security policies
-- ================================================================

alter table public.profiles         enable row level security;
alter table public.bookings         enable row level security;
alter table public.packages         enable row level security;
alter table public.gallery_items    enable row level security;
alter table public.testimonials     enable row level security;
alter table public.contact_messages enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.audit_logs       enable row level security;

-- Helper: check if current user is an admin/manager/editor
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('ADMIN','MANAGER','EDITOR','PHOTOGRAPHER')
  );
$$;

-- PROFILES ---------------------------------------------------------
create policy "profiles: self read"   on public.profiles for select using (auth.uid() = id or public.is_staff());
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: staff all"   on public.profiles for all using (public.is_staff()) with check (public.is_staff());

-- BOOKINGS ---------------------------------------------------------
-- Anyone can create a booking (public form). Only staff & the owning client can read.
create policy "bookings: public insert" on public.bookings for insert with check (true);
create policy "bookings: client read"   on public.bookings for select using (auth.uid() = client_id or public.is_staff());
create policy "bookings: staff update"  on public.bookings for update using (public.is_staff());
create policy "bookings: staff delete"  on public.bookings for delete using (public.is_staff());

-- PACKAGES (public read, staff manage) -----------------------------
create policy "packages: public read" on public.packages for select using (true);
create policy "packages: staff write" on public.packages for all using (public.is_staff()) with check (public.is_staff());

-- GALLERY (public read, staff manage) ------------------------------
create policy "gallery: public read" on public.gallery_items for select using (true);
create policy "gallery: staff write" on public.gallery_items for all using (public.is_staff()) with check (public.is_staff());

-- TESTIMONIALS -----------------------------------------------------
create policy "testimonials: public read" on public.testimonials for select using (true);
create policy "testimonials: staff write" on public.testimonials for all using (public.is_staff()) with check (public.is_staff());

-- CONTACT MESSAGES -------------------------------------------------
create policy "contacts: public insert" on public.contact_messages for insert with check (true);
create policy "contacts: staff read"    on public.contact_messages for select using (public.is_staff());
create policy "contacts: staff update"  on public.contact_messages for update using (public.is_staff());

-- BLOG -------------------------------------------------------------
create policy "blog: public read published" on public.blog_posts for select using (published or public.is_staff());
create policy "blog: staff write"           on public.blog_posts for all using (public.is_staff()) with check (public.is_staff());

-- AUDIT LOGS (staff only) ------------------------------------------
create policy "audit: staff read" on public.audit_logs for select using (public.is_staff());
create policy "audit: system insert" on public.audit_logs for insert with check (true);

-- ================================================================
-- Storage bucket policies (Supabase Storage)
-- Create these buckets from the dashboard: gallery, avatars
-- Then run the policies below.
-- ================================================================

-- (Run only after creating the buckets)
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true)
--   on conflict (id) do nothing;
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
--   on conflict (id) do nothing;

-- Public read for gallery bucket
-- create policy "gallery read" on storage.objects for select using (bucket_id = 'gallery');
-- Staff uploads
-- create policy "gallery upload" on storage.objects for insert with check (bucket_id = 'gallery' and public.is_staff());
-- create policy "gallery update" on storage.objects for update using (bucket_id = 'gallery' and public.is_staff());
-- create policy "gallery delete" on storage.objects for delete using (bucket_id = 'gallery' and public.is_staff());
