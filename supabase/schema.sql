-- Chainva AI MVP schema

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  latest_html text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  role text not null,
  content text not null,
  tokens integer,
  created_at timestamptz not null default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  prompt text not null,
  html text not null,
  model text,
  tokens integer,
  cost_usdc numeric(10,4),
  created_at timestamptz not null default now()
);

create table if not exists public.yellow_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  session_address text,
  balance_usdc numeric(10,4),
  status text default 'open',
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.yellow_sessions(id) on delete cascade,
  amount_usdc numeric(10,4),
  tx_hash text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.users disable row level security;
alter table public.projects disable row level security;
alter table public.messages disable row level security;
alter table public.generations disable row level security;
alter table public.yellow_sessions disable row level security;
alter table public.transactions disable row level security;
