# Supabase PostgreSQL 신뢰 인증서

`supabase-ca.pem`은 공식 Supabase CLI에 포함된 운영용 2021·2025 CA 인증서를 합친 공개 파일이다. 비밀키는 포함하지 않는다. 운영체제의 인증서 저장소를 바꾸지 않고 해당 PostgreSQL 연결에만 사용한다.

- 출처 버전: `supabase/cli`의 `8803a3e90dd18ca14c857026da20f7a073bc6b22`
- [2021 원본](https://github.com/supabase/cli/blob/8803a3e90dd18ca14c857026da20f7a073bc6b22/apps/cli/src/commands/gen/types/templates/prod-ca-2021.ts)
- [2025 원본](https://github.com/supabase/cli/blob/8803a3e90dd18ca14c857026da20f7a073bc6b22/apps/cli/src/commands/gen/types/templates/prod-ca-2025.ts)
- 2021 SHA-256: `80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA`
- 2025 SHA-256: `5F:9B:77:95:1A:7A:A1:30:3F:9B:58:EE:A9:BF:A8:9E:35:8C:FD:C1:5F:97:86:FF:10:D4:93:0A:72:2C:9A:E2`

프로젝트 루트에서 실행하는 초기 SQL 명령에는 DB 접속 주소의 옵션으로 `sslmode=verify-full&sslrootcert=config/certs/supabase-ca.pem`을 사용한다. 실제 주소와 비밀번호는 `.env.local` 또는 비공개 환경변수에만 저장한다.

2026-10-21 Codex·Windows에서 두 인증서의 CA 여부·자체 서명·유효기간과 실제 읽기 전용 연결의 서버 인증서·암호화를 확인했다. 인증서를 갱신할 때도 공식 출처와 지문을 확인한 뒤 실제 연결을 다시 검사한다.

[Supabase 공식 SSL 안내](https://supabase.com/docs/guides/platform/ssl-enforcement)
