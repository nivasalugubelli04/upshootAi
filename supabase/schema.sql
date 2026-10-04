-- ==============================================================================
-- UPSHOOT AI — Production Supabase Database Schema
-- ==============================================================================
-- Execute this script in your Supabase SQL Editor (Dashboard -> SQL Editor)

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Create RLS Policies
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- 3. Automatic user provisioning trigger from auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    coalesce(new.phone, ''),
    now(),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Create contact_inquiries table for audit & persistence
create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on contact_inquiries
alter table public.contact_inquiries enable row level security;

-- Policies for inquiries
drop policy if exists "Allow anonymous inquiries insert" on public.contact_inquiries;
drop policy if exists "Users can view their own inquiries" on public.contact_inquiries;

create policy "Allow anonymous inquiries insert"
  on public.contact_inquiries
  for insert
  with check (true);

create policy "Users can view their own inquiries"
  on public.contact_inquiries
  for select
  using (auth.uid() = user_id);

-- ==============================================================================
-- Schema setup complete
-- ==============================================================================
