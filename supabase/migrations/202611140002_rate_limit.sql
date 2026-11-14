begin;

create or replace function public.cms_rate_limit(limit_key text, max_attempts integer, window_seconds integer) returns boolean
language plpgsql security definer set search_path = public as $$
declare total integer;
begin
  delete from cms_login_attempts where expires_at < now();
  insert into cms_login_attempts(key, attempts, expires_at)
  values (limit_key, 1, now() + make_interval(secs => window_seconds))
  on conflict(key) do update set attempts = cms_login_attempts.attempts + 1
  returning attempts into total;
  return total <= max_attempts;
end;
$$;
revoke all on function public.cms_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.cms_rate_limit(text, integer, integer) to service_role;

commit;
