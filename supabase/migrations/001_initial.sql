-- ================================================================
-- WeddingFilma · Initial schema
-- Apply from Supabase SQL editor OR via `prisma migrate deploy`.
-- ================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type role as enum ('ADMIN','MANAGER','EDITOR','PHOTOGRAPHER','CLIENT');
create type booking_status as enum ('NEW','CONTACTED','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED');
create type event_type as enum ('WEDDING','PRE_WEDDING','ENGAGEMENT','MATERNITY','CHILD','CORPORATE','PRODUCT','EVENT','OTHER');
create type media_type as enum ('IMAGE','VIDEO');
create type gallery_category as enum ('WEDDINGS','PRE_WEDDING','CHILD','MATERNITY','CORPORATE','PRODUCT','EVENT');

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role role not null default 'CLIENT',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on new auth.users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- BOOKINGS ----------
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_code text unique not null,
  client_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  event_type event_type not null,
  event_date date not null,
  venue text,
  city text not null,
  budget text,
  guest_count int,
  services text[] default '{}',
  notes text,
  status booking_status not null default 'NEW',
  package_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_date_idx on public.bookings (event_date);

-- ---------- PACKAGES ----------
create table if not exists public.packages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  tagline text,
  description text,
  price_from int not null,
  currency text default 'INR',
  duration text,
  includes text[] default '{}',
  popular boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings
  add constraint bookings_package_fk foreign key (package_id) references public.packages(id) on delete set null;

-- ---------- GALLERY ----------
create table if not exists public.gallery_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category gallery_category not null,
  media_type media_type not null default 'IMAGE',
  url text not null,
  thumbnail text,
  tags text[] default '{}',
  featured boolean default false,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_category_idx on public.gallery_items (category);
create index if not exists gallery_featured_idx on public.gallery_items (featured);

-- ---------- TESTIMONIALS ----------
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text,
  event_type event_type not null,
  rating int default 5,
  quote text not null,
  avatar_url text,
  featured boolean default false,
  created_at timestamptz not null default now()
);

-- ---------- CONTACT MESSAGES ----------
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  handled boolean default false,
  created_at timestamptz not null default now()
);

-- ---------- BLOG ----------
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image text,
  author_id uuid,
  published boolean default false,
  published_at timestamptz,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- AUDIT LOGS ----------
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_entity_idx on public.audit_logs (entity, entity_id);
