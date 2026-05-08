# 충북 정책 한입브리프

모바일에서 가볍게 정책동향을 훑어볼 수 있는 카드형 정책 브리핑 웹사이트입니다. PDF 업로드, PDF 자동요약, PDF 파싱, 이미지 업로드 기능은 없습니다. 모든 콘텐츠는 관리자 페이지에서 직접 텍스트로 입력하고 수정합니다.

## 사용 기술

- React + Vite
- React Router
- CSS
- Supabase Free Plan: Auth, Database, Row Level Security
- Vercel 무료 배포

## 파일 구조

```text
chungbuk-policy-brief/
  src/
    components/        공통 화면 요소
    lib/               Supabase 연결, 데이터 변환, 상수
    pages/             일반 화면과 관리자 화면
    App.jsx            라우팅 설정
    styles.css         전체 디자인
  supabase/
    schema.sql         테이블, RLS, 샘플 데이터 SQL
  .env.example         환경변수 예시
  package.json
```

## Supabase 프로젝트 생성 방법

1. [Supabase](https://supabase.com)에 가입합니다.
2. New project를 누릅니다.
3. 프로젝트 이름과 데이터베이스 비밀번호를 입력합니다.
4. 무료 플랜으로 생성합니다.

## Supabase 테이블 생성 SQL 실행 방법

1. Supabase 프로젝트에서 SQL Editor로 이동합니다.
2. `supabase/schema.sql` 파일 내용을 붙여넣습니다.
3. Run을 눌러 실행합니다.
4. `policy_items` 테이블과 `site_settings` 테이블이 생성됩니다.

## 관리자 계정 생성 방법

1. Supabase 왼쪽 메뉴에서 Authentication으로 이동합니다.
2. Users 메뉴에서 Add user를 누릅니다.
3. 관리자 이메일과 비밀번호를 입력합니다.
4. 이 이메일과 비밀번호로 `/admin/login`에서 로그인합니다.

현재 RLS 정책은 로그인한 Supabase 사용자를 관리자로 취급합니다. 실제 운영에서는 관리자 이메일만 만들고 외부 회원가입은 열지 않는 방식이 가장 단순합니다.

## .env 설정 방법

`.env.example`을 참고해 프로젝트 루트에 `.env` 파일을 만듭니다.

```env
VITE_SUPABASE_URL=Supabase Project URL
VITE_SUPABASE_ANON_KEY=Supabase anon public key
```

Supabase service role key는 프론트엔드에 절대 넣지 마세요.

## 로컬 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 표시되는 로컬 주소로 접속합니다.

## Vercel 무료 배포 방법

1. 이 프로젝트를 GitHub 저장소에 업로드합니다.
2. [Vercel](https://vercel.com)에서 New Project를 선택합니다.
3. GitHub 저장소를 연결합니다.
4. Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 입력합니다.
5. Deploy를 누릅니다.

## 콘텐츠 등록 방법

1. `/admin/login`으로 이동합니다.
2. 관리자 이메일과 비밀번호로 로그인합니다.
3. 관리자 메뉴에서 신규 등록을 누릅니다.
4. 제목, 출처, 카테고리, 섹션유형, 발표일, 요약, 핵심 내용, 본문, 충북 시사점, 태그, 중요도, 공개 여부를 입력합니다.
5. 저장을 누르면 메인, 목록, 상세, 검색 화면에 자동 반영됩니다.

## 콘텐츠 수정 방법

1. 관리자 메뉴에서 콘텐츠 관리를 누릅니다.
2. 수정할 콘텐츠의 수정 버튼을 누릅니다.
3. 기존 내용을 바꾼 뒤 저장합니다.

## 콘텐츠 삭제 방법

1. 관리자 메뉴에서 콘텐츠 관리를 누릅니다.
2. 삭제할 콘텐츠의 삭제 버튼을 누릅니다.
3. 확인창에서 확인을 누르면 Supabase 데이터에서 삭제됩니다.

## 공개/비공개 설정 방법

콘텐츠 등록 또는 수정 화면의 공개 상태 체크박스를 사용합니다. 공개 상태인 콘텐츠만 일반 방문자 화면에 표시되고, 비공개 콘텐츠는 관리자 화면에서만 보입니다.

## 검색 기능 설명

일반 화면 우측 상단 검색 아이콘을 누르면 검색창이 열립니다. 검색어는 공개 콘텐츠의 제목, 출처, 카테고리, 요약, 본문, 핵심 내용, 충북 시사점, 태그에서 대소문자 구분 없이 검색됩니다. 한글 검색도 브라우저에서 정상 작동합니다.

## 무료 운영 시 주의사항

- Supabase Free Plan의 데이터베이스 용량과 요청량을 확인하세요.
- Vercel 무료 플랜은 개인 또는 소규모 운영에 적합합니다.
- 외부 유료 API와 서버리스 함수는 사용하지 않습니다.
- 콘텐츠가 많아지면 검색을 데이터베이스 검색으로 바꾸는 개선을 검토할 수 있습니다.

## PDF 연동 없음

이 사이트는 PDF 파일과 연동하지 않습니다. PDF 업로드, PDF 자동요약, PDF 파싱 기능이 없으며, 모든 콘텐츠는 관리자 페이지에서 직접 입력하는 방식입니다.

## 완성 후 해야 할 일

1. Supabase 가입
2. 새 프로젝트 생성
3. SQL Editor에서 `supabase/schema.sql` 실행
4. Authentication에서 관리자 이메일 생성
5. `.env`에 Supabase URL과 anon key 입력
6. `npm install`
7. `npm run dev`로 확인
8. GitHub에 업로드
9. Vercel에 연결
10. 관리자 페이지에서 콘텐츠 입력
