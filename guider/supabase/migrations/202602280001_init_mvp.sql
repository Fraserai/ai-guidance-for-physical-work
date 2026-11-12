-- No name yet MVP schema
-- Run with: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  role_category_id text,
  role_category_heading text,
  role_name text,
  custom_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  role_category_id text,
  role_category_heading text,
  role_name text,
  context_note text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.session_messages (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  image_storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_session_messages_session_id on public.session_messages(session_id);
create index if not exists idx_session_messages_created_at on public.session_messages(created_at);

alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.session_messages enable row level security;

-- Users can read/write only their own profile
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
for select using (auth.uid() = id);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
for insert with check (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
for update using (auth.uid() = id);

-- Sessions ownership policy
drop policy if exists "sessions_select_own" on public.sessions;
create policy "sessions_select_own" on public.sessions
for select using (auth.uid() = user_id);

drop policy if exists "sessions_insert_own" on public.sessions;
create policy "sessions_insert_own" on public.sessions
for insert with check (auth.uid() = user_id);

drop policy if exists "sessions_update_own" on public.sessions;
create policy "sessions_update_own" on public.sessions
for update using (auth.uid() = user_id);

-- Messages policy follows session ownership
drop policy if exists "messages_select_own" on public.session_messages;
create policy "messages_select_own" on public.session_messages
for select using (
  exists (
    select 1 from public.sessions s
    where s.id = session_messages.session_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "messages_insert_own" on public.session_messages;
create policy "messages_insert_own" on public.session_messages
for insert with check (
  exists (
    select 1 from public.sessions s
    where s.id = session_messages.session_id
      and s.user_id = auth.uid()
  )
);

-- Storage bucket for session photos
insert into storage.buckets (id, name, public)
values ('session-photos', 'session-photos', false)
on conflict (id) do nothing;

drop policy if exists "session_photos_select_own" on storage.objects;
create policy "session_photos_select_own" on storage.objects
for select using (
  bucket_id = 'session-photos'
  and auth.role() = 'authenticated'
);

drop policy if exists "session_photos_insert_own" on storage.objects;
create policy "session_photos_insert_own" on storage.objects
for insert with check (
  bucket_id = 'session-photos'
  and auth.role() = 'authenticated'
);
