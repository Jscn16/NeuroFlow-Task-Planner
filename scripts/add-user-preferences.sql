-- User preferences table for app settings
-- Run this migration in Supabase SQL Editor

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- RLS policies
create policy "Users can view own preferences" on public.user_preferences
  for select using (auth.uid() = user_id);

create policy "Users can update own preferences" on public.user_preferences  
  for update using (auth.uid() = user_id);

create policy "Users can insert own preferences" on public.user_preferences
  for insert with check (auth.uid() = user_id);

-- Index for faster lookups
create index if not exists user_preferences_user_id_idx on public.user_preferences (user_id);
