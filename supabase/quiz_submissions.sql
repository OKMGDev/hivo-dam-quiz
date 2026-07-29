-- Run this once in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Creates a backup table for quiz lead submissions + insert-only public access.
-- Client uses the publishable key (maps to the anon role). Never expose the secret key.

create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text not null,
  score integer not null check (score >= 0 and score <= 100),
  breakdown text not null,
  page_uri text,
  page_name text,
  hubspot_ok boolean,
  source text not null default 'hivo-dam-quiz'
);

-- Needed so the publishable/anon key can write (RLS alone is not enough).
grant usage on schema public to anon, authenticated;
grant insert on table public.quiz_submissions to anon, authenticated;

alter table public.quiz_submissions enable row level security;

drop policy if exists "Allow public quiz lead inserts" on public.quiz_submissions;
create policy "Allow public quiz lead inserts"
  on public.quiz_submissions
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT/UPDATE/DELETE policy for anon → leads stay private from the browser.
