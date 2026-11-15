begin;

insert into public.cms_entries (kind, slug, title, published, data) values
  ('copy', 'redeem.delete', 'redeem.delete', true, '{"value":"삭제"}'::jsonb),
  ('copy', 'redeem.done', 'redeem.done', true, '{"value":"사용 완료"}'::jsonb)
on conflict (kind, slug) do nothing;

commit;
