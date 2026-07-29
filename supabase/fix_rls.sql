-- Fix for existing quiz_submissions table (RLS insert blocked).
-- Paste into Supabase SQL Editor and Run.

grant usage on schema public to anon, authenticated;
grant insert on table public.quiz_submissions to anon, authenticated;

drop policy if exists "Allow public quiz lead inserts" on public.quiz_submissions;
create policy "Allow public quiz lead inserts"
  on public.quiz_submissions
  for insert
  to anon, authenticated
  with check (true);
