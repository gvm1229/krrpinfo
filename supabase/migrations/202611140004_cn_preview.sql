begin;

insert into public.cms_entries (kind, slug, title, published, position, data) values
  ('copy', 'cn.title', 'cn.title', true, 0, '{"value":"중국 서버 미래시"}'::jsonb),
  ('copy', 'cn.description', 'cn.description', true, 0, '{"value":"중국 서버는 한국 서버보다 몇 달 앞서 있습니다. 중국 서버에서 확인된 시즌과 이벤트로 한국 서버에 올 콘텐츠를 미리 봅니다."}'::jsonb),
  ('copy', 'cn.more', 'cn.more', true, 0, '{"value":"자세히 보기"}'::jsonb),
  ('copy', 'cn.eta', 'cn.eta', true, 0, '{"value":"한국 서버 예상"}'::jsonb),
  ('copy', 'cn.source', 'cn.source', true, 0, '{"value":"원문 보기"}'::jsonb),
  ('copy', 'cn.empty', 'cn.empty', true, 0, '{"value":"아직 확인된 중국 서버 소식이 없습니다."}'::jsonb),
  ('copy', 'cn.archive', 'cn.archive', true, 0, '{"value":"지난 시즌 타임라인"}'::jsonb),
  ('navigation', 'nav-cn-preview', '중국 서버 미래시', true, 2, '{"href":"/cn-preview"}'::jsonb)
on conflict (kind, slug) do nothing;

commit;
