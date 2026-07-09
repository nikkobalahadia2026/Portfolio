-- ============================================================
-- Portfolio schema for Supabase (Postgres)
-- Run this once in the Supabase SQL editor for your project.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- profile (singleton row) ----------
create table if not exists profile (
  id smallint primary key default 1 check (id = 1),
  name text not null default '',
  location text not null default '',
  title text not null default '',
  email text not null default '',
  avatar_url text,
  degree_program text not null default '',
  degree_class_year text not null default '',
  degree_full_name text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------- about paragraphs ----------
create table if not exists about_paragraphs (
  id uuid primary key default gen_random_uuid(),
  content text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- tech stack ----------
create table if not exists tech_categories (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  sort_order int not null default 0
);

create table if not exists tech_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references tech_categories(id) on delete cascade,
  label text not null default '',
  sort_order int not null default 0
);

-- ---------- projects ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  link text,
  link_label text,
  has_story boolean not null default false,
  sort_order int not null default 0
);

-- ---------- experience timeline ----------
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  org text not null default '',
  period text not null default '',
  is_current boolean not null default false,
  sort_order int not null default 0
);

-- ---------- certifications ----------
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  issuer text not null default '',
  url text,
  sort_order int not null default 0
);

-- ---------- gallery ----------
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  caption text,
  sort_order int not null default 0
);

-- ---------- "a member of" list ----------
create table if not exists member_of (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  url text,
  sort_order int not null default 0
);

-- ---------- social links ----------
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  url text not null default '',
  sort_order int not null default 0
);

-- ============================================================
-- Row Level Security
-- Anyone can READ (the public portfolio needs this).
-- Only authenticated users (your admin login) can WRITE.
-- ============================================================

alter table profile enable row level security;
alter table about_paragraphs enable row level security;
alter table tech_categories enable row level security;
alter table tech_items enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;
alter table certifications enable row level security;
alter table gallery_images enable row level security;
alter table member_of enable row level security;
alter table social_links enable row level security;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'profile','about_paragraphs','tech_categories','tech_items','projects',
    'experience','certifications','gallery_images','member_of','social_links'
  ])
  loop
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);

    execute format('drop policy if exists "admin write" on %I', t);
    execute format(
      'create policy "admin write" on %I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')',
      t
    );
  end loop;
end $$;

-- ============================================================
-- Storage bucket for avatar + gallery photo uploads
-- ============================================================

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'portfolio-media');

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects
  for insert with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- ============================================================
-- Seed data — starter content, edit freely from /admin afterwards
-- ============================================================

insert into profile (id, name, location, title, email, degree_program, degree_class_year, degree_full_name)
values (1, 'Your Name', 'Your City, Country', 'Full-Stack Web Developer', 'you@example.com',
        'BS Information Technology', 'Class of 2027', 'Your Name')
on conflict (id) do nothing;

insert into about_paragraphs (content, sort_order) values
  ('I''m a full-stack web developer building production-ready apps end to end.', 0),
  ('Edit this from the admin panel — /admin — once you''re signed in.', 1)
on conflict do nothing;

with cat as (
  insert into tech_categories (label, sort_order) values ('Frontend', 0) returning id
)
insert into tech_items (category_id, label, sort_order)
select id, item, row_number() over () from cat, unnest(array['React', 'TypeScript', 'Tailwind CSS']) as item;

insert into experience (title, org, period, is_current, sort_order) values
  ('Full-Stack Web Developer', 'Freelance / Personal Projects', '2025 – Present', true, 0),
  ('Hello World!', 'Wrote my first line of code', '2022', false, 1);

insert into social_links (label, url, sort_order) values
  ('GitHub', 'https://github.com/yourusername', 0),
  ('LinkedIn', 'https://linkedin.com/in/yourusername', 1);
