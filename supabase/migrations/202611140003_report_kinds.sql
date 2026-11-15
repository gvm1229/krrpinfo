begin;

alter table public.cms_entries drop constraint if exists cms_entries_kind_check;
alter table public.cms_entries add constraint cms_entries_kind_check check (kind in (
  'post','video','season','timeline','countdown','coupon','navigation','link','category','section','copy',
  'coupon_report','cn_update'
));

insert into public.cms_entries (kind, slug, title, published, data) values
  ('copy', 'redeem.report.title', 'redeem.report.title', true, '{"value":"쿠폰 제보"}'::jsonb),
  ('copy', 'redeem.report.help', 'redeem.report.help', true, '{"value":"게임 공지에서 본 쿠폰을 알려주세요. 운영자 확인 후 모두에게 표시됩니다."}'::jsonb),
  ('copy', 'redeem.report.code', 'redeem.report.code', true, '{"value":"쿠폰 코드"}'::jsonb),
  ('copy', 'redeem.report.expires', 'redeem.report.expires', true, '{"value":"만료일 (선택)"}'::jsonb),
  ('copy', 'redeem.report.submit', 'redeem.report.submit', true, '{"value":"제보하기"}'::jsonb)
on conflict (kind, slug) do nothing;

commit;
