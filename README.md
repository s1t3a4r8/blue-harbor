# Blue Harbor 웹사이트 시작하기

## 들어 있는 기능
- 다크 네이비 반응형 홈페이지
- 후원 계좌 안내 영역(직접 정보 입력)
- 신고, 건의사항, 일반 문의 접수 폼
- Supabase Auth 기반 관리자 로그인
- 승인된 여러 관리자가 접수 내역을 확인할 수 있는 구조

## 1. 무료로 서버 준비하기
1. https://supabase.com 에서 프로젝트를 만듭니다.
2. 프로젝트의 SQL Editor에서 `sql/schema.sql` 내용을 실행합니다.
3. Project Settings → API에서 Project URL과 anon/public key를 복사합니다.
4. `config.js`의 `YOUR_SUPABASE_PROJECT_URL`, `YOUR_SUPABASE_ANON_KEY`를 교체합니다.
5. Authentication 설정에서 이메일/비밀번호 로그인을 활성화합니다.

## 2. 관리자 여러 명 등록하기
1. Supabase Authentication → Users에서 각 관리자의 계정을 초대/생성합니다.
2. SQL Editor에서 아래 쿼리를 관리자마다 실행합니다. 이메일 주소를 실제 계정으로 바꾸세요.

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'admin@example.com'
on conflict do nothing;
```

관리자 계정은 신뢰할 수 있는 사람에게만 부여하세요. 관리자 추가/삭제는 SQL Editor에서만 하세요.

## 3. 사이트 공개하기
정적 파일 호스팅 서비스(예: Cloudflare Pages 또는 Netlify)에 이 폴더를 배포하면 됩니다.
빌드 명령은 비워두고, 배포 디렉터리는 프로젝트 루트로 설정하세요.
`index.html`, `admin.html`, `style.css`, `config.js`, `app.js`, `admin.js`가 같은 폴더에 있어야 합니다.

## 4. 후원 계좌 안내
`index.html`의 `[은행명 입력]`, `[예금주 입력]`, `[계좌번호 입력]`을 운영 주체가 공개해도 되는 정보로 교체하세요.
미성년자가 운영하는 사이트라면 본인 계좌 정보를 공개하거나 후원금을 직접 관리하기 전에 보호자와 먼저 상의하고, 보호자 관리 아래에서 진행하세요. 이 템플릿은 송금 결제를 처리하지 않고 안내만 제공합니다.

## 보안 및 개인정보 주의
- `service_role` 키를 절대 `config.js`나 브라우저 코드에 넣지 마세요.
- 관리자 권한은 SQL Editor에서 승인된 계정에만 부여하세요.
- 문의 폼에는 비밀번호, 주민등록번호, 계좌 비밀번호 등 민감한 정보를 받지 마세요.
- 신고/문의 내용은 운영 목적에 필요한 기간만 보관하고, 접근 권한을 제한하세요.
- 공개 서비스 전 개인정보 처리방침, 이용 안내, 신고 처리 기준을 준비하세요.
- 이 예제는 접수/조회용 출발 템플릿입니다. 파일 업로드, 답변 발송, 상태 변경 UI, 스팸 방지는 별도 구현이 필요합니다.
