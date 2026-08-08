-- ============================================================
-- SemiRestore AI — Supabase Database Schema (SAFE RE-RUN VERSION)
-- Drops existing policies before re-creating them.
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Enable UUID extension ────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. PROFILES ─────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  role         text default 'Metrology Engineer',
  foundry      text default 'TSMC',
  avatar_url   text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile"   on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── 2. MODEL CONFIGS ─────────────────────────────────────────
create table if not exists public.model_configs (
  id                          uuid primary key default uuid_generate_v4(),
  user_id                     uuid references auth.users(id) on delete cascade not null,
  model_name                  text default 'Restormer',
  accuracy_level              text default 'high_accuracy',
  use_gpu_acceleration        boolean default true,
  super_res_multiplier        int default 4,
  defect_detection_threshold  numeric default 0.85,
  auto_report_generation      boolean default true,
  theme                       text default 'light',
  created_at                  timestamptz default now(),
  updated_at                  timestamptz default now()
);

alter table public.model_configs enable row level security;

drop policy if exists "Users manage own model config" on public.model_configs;

create policy "Users manage own model config"
  on public.model_configs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── 3. WAFER SAMPLES ─────────────────────────────────────────
create table if not exists public.wafer_samples (
  id              text primary key,
  user_id         uuid references auth.users(id) on delete cascade not null,
  title           text not null,
  category        text not null,
  wafer_lot       text,
  foundry         text,
  resolution      text,
  original_image  text,
  noisy_image     text,
  restored_image  text,
  defects         jsonb default '[]',
  metrics         jsonb default '{}',
  timestamp       text,
  created_at      timestamptz default now()
);

alter table public.wafer_samples enable row level security;

drop policy if exists "Users manage own wafer samples"          on public.wafer_samples;
drop policy if exists "Authenticated users can read all samples" on public.wafer_samples;

create policy "Users manage own wafer samples"
  on public.wafer_samples for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated users can read all samples"
  on public.wafer_samples for select
  using (auth.role() = 'authenticated');

-- ─── 4. INSPECTION REPORTS ────────────────────────────────────
create table if not exists public.inspection_reports (
  id                      uuid primary key default uuid_generate_v4(),
  report_id               text unique not null,
  user_id                 uuid references auth.users(id) on delete cascade not null,
  wafer_sample_id         text references public.wafer_samples(id) on delete set null,
  operator                text,
  foundry_facility        text,
  overall_quality_score   numeric,
  verdict                 text,
  recommendations         jsonb default '[]',
  model_config            jsonb default '{}',
  generated_at            text,
  created_at              timestamptz default now()
);

alter table public.inspection_reports enable row level security;

drop policy if exists "Users manage own inspection reports" on public.inspection_reports;

create policy "Users manage own inspection reports"
  on public.inspection_reports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
