-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create portfolio_content table for admin management
create table if not exists public.portfolio_content (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('about', 'skills', 'projects', 'contact')),
  title text not null,
  content jsonb not null,
  order_index integer not null default 0,
  is_visible boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.portfolio_content enable row level security;

-- Anyone can view visible content
create policy "content_select_visible"
  on public.portfolio_content for select
  using (is_visible = true);

-- Only authenticated users can manage content
create policy "content_insert_auth"
  on public.portfolio_content for insert
  with check (auth.uid() is not null);

create policy "content_update_auth"
  on public.portfolio_content for update
  using (auth.uid() is not null);

create policy "content_delete_auth"
  on public.portfolio_content for delete
  using (auth.uid() is not null);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  image_url text,
  project_url text,
  github_url text,
  order_index integer not null default 0,
  is_visible boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.projects enable row level security;

create policy "projects_select_visible"
  on public.projects for select
  using (is_visible = true);

create policy "projects_insert_auth"
  on public.projects for insert
  with check (auth.uid() is not null);

create policy "projects_update_auth"
  on public.projects for update
  using (auth.uid() is not null);

create policy "projects_delete_auth"
  on public.projects for delete
  using (auth.uid() is not null);

-- Create skills table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency integer check (proficiency between 1 and 100),
  icon text,
  order_index integer not null default 0,
  is_visible boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.skills enable row level security;

create policy "skills_select_visible"
  on public.skills for select
  using (is_visible = true);

create policy "skills_insert_auth"
  on public.skills for insert
  with check (auth.uid() is not null);

create policy "skills_update_auth"
  on public.skills for update
  using (auth.uid() is not null);

create policy "skills_delete_auth"
  on public.skills for delete
  using (auth.uid() is not null);
