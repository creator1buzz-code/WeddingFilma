-- ================================================================
-- WeddingFilma · Year capacity (scarcity widget)
-- ================================================================

create table if not exists public.year_capacity (
  year        int primary key,
  total_slots int not null default 12,
  booked      int not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.year_capacity enable row level security;

-- Anyone can read (needed by the public hero widget)
create policy "capacity: public read" on public.year_capacity for select using (true);
-- Only staff can modify
create policy "capacity: staff write" on public.year_capacity for all using (public.is_staff()) with check (public.is_staff());

-- Seed the current + next year
insert into public.year_capacity (year, total_slots, booked)
values (extract(year from now())::int,      12, 9),
       (extract(year from now())::int + 1,  12, 2)
on conflict (year) do nothing;
