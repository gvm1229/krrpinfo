begin;

create table if not exists public.cms_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('post','video','season','timeline','countdown','coupon','navigation','link','category','section','copy')),
  slug text not null,
  title text not null,
  published boolean not null default false,
  position integer not null default 0 check (position >= 0),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(kind, slug)
);
create unique index if not exists cms_unique_video on public.cms_entries ((data->>'videoId')) where kind = 'video';
create index if not exists cms_public_entries on public.cms_entries (kind, published, position);
create table if not exists public.cms_settings (
  id text primary key check (id = 'site'), data jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(), object_key text not null unique,
  url text not null unique, name text not null, alt text not null default '',
  content_type text not null, size bigint not null check (size > 0),
  created_at timestamptz not null default now()
);
create table if not exists public.cms_login_attempts (
  key text primary key, attempts integer not null, expires_at timestamptz not null
);
create or replace function public.cms_login_attempt(attempt_key text) returns boolean
language plpgsql security definer set search_path = public as $$
declare total integer;
begin
  delete from cms_login_attempts where expires_at < now();
  insert into cms_login_attempts(key, attempts, expires_at) values (attempt_key, 1, now() + interval '15 minutes')
  on conflict(key) do update set attempts = cms_login_attempts.attempts + 1
  returning attempts into total;
  return total <= 10;
end;
$$;
alter table public.cms_entries enable row level security;
alter table public.cms_settings enable row level security;
alter table public.cms_media enable row level security;
alter table public.cms_login_attempts enable row level security;
revoke all on public.cms_entries, public.cms_settings, public.cms_media, public.cms_login_attempts from anon, authenticated;
grant all on public.cms_entries, public.cms_settings, public.cms_media, public.cms_login_attempts to service_role;
revoke all on function public.cms_login_attempt(text) from public, anon, authenticated;
grant execute on function public.cms_login_attempt(text) to service_role;

commit;
