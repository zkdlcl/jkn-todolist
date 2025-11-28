# 배포 체크리스트

## 🚀 빠른 배포 가이드

### 1단계: Supabase 데이터베이스 설정 ✅

- [ ] Supabase 프로젝트 생성 (Region: Seoul)
- [ ] `database/deploy-schema.sql` 내용을 SQL Editor에서 실행
- [ ] Connection String 복사 (Transaction Pooling Mode)
- [ ] 테이블 생성 확인 (users, todos, refresh_tokens, public_events)

### 2단계: 백엔드 배포 (Vercel) ✅

- [ ] GitHub에 코드 푸시
- [ ] Vercel 프로젝트 생성
- [ ] Root Directory: `server` 설정
- [ ] 환경 변수 설정:
  ```
  NODE_ENV=production
  PORT=3000
  DATABASE_URL=[Supabase Connection String]
  KASI_API_KEY=[KASI API Key]
  KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
  ```
- [ ] 배포 완료 후 URL 복사 (예: https://jkn-todolist-server.vercel.app)
- [ ] `/api/health` 엔드포인트 테스트

### 3단계: 프론트엔드 배포 (Vercel) ✅

- [ ] Vercel 새 프로젝트 생성
- [ ] Root Directory: `client` 설정
- [ ] Framework: Vite 선택
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] 환경 변수 설정:
  ```
  VITE_API_BASE_URL=https://[백엔드-도메인]/api
  ```
- [ ] 배포 완료 후 웹사이트 접속 테스트

### 4단계: 공휴일 데이터 동기화 ✅

- [ ] 로컬에서 스크립트 실행:
  ```bash
  DATABASE_URL=[Supabase URL] node scripts/syncHolidays.js 2025
  ```
- [ ] 또는 API 호출:
  ```bash
  curl -X POST https://[백엔드-도메인]/api/sync/holidays \
    -H "Content-Type: application/json" \
    -d '{"year": 2025}'
  ```

### 5단계: 배포 확인 ✅

- [ ] 회원가입 테스트
- [ ] 로그인 테스트
- [ ] 할일 생성/수정/삭제 테스트
- [ ] 휴지통 기능 테스트
- [ ] 달력에서 공휴일 표시 확인
- [ ] 알림 시스템 작동 확인

---

## 🔧 MCP 연결 설정

### 로컬 개발용 MCP 설정

`.mcp.json` 파일 사용 중 (현재 설정됨)

### 배포용 MCP 설정

`.mcp.deploy.json` 파일 참고:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    },
    "postgresql-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "${POSTGRES_CONNECTION_STRING}"
      ]
    }
  }
}
```

루트 `.env` 파일에 환경 변수 설정:

```env
POSTGRES_CONNECTION_STRING=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
```

---

## 📝 환경 변수 빠른 참조

### 루트 `.env` (MCP용)

```env
POSTGRES_CONNECTION_STRING=[Supabase Connection String]
KASI_API_KEY=[KASI API Key]
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

### `server/.env` (백엔드)

```env
PORT=3000
DATABASE_URL=[Supabase Connection String]
JWT_SECRET=[강력한 랜덤 문자열]
JWT_REFRESH_SECRET=[강력한 랜덤 문자열]
KASI_API_KEY=[KASI API Key]
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

### `client/.env.local` (프론트엔드 로컬)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### `client/.env.production` (프론트엔드 배포)

```env
VITE_API_BASE_URL=https://[백엔드-도메인]/api
```

---

## 🔒 보안 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] 실제 `.env` 파일이 Git에 커밋되지 않음
- [ ] JWT_SECRET이 32자 이상의 강력한 랜덤 문자열
- [ ] JWT_REFRESH_SECRET이 JWT_SECRET과 다른 값
- [ ] Supabase RLS(Row Level Security) 활성화됨
- [ ] CORS origin이 프로덕션 도메인으로 설정됨
- [ ] HTTPS 사용 확인

---

## 🛠️ 트러블슈팅

### 데이터베이스 연결 실패

- Supabase Connection String 확인 (Pooling Mode)
- DATABASE_URL 환경 변수 확인
- 방화벽 설정 확인

### CORS 오류

- `server/index.js`에서 CORS origin 설정 확인
- 프론트엔드 도메인이 허용 목록에 있는지 확인

### JWT 인증 실패

- JWT_SECRET 환경 변수가 설정되었는지 확인
- 토큰 만료 시간 확인

---

## 📚 추가 문서

상세한 배포 가이드는 `docs/deployment-guide.md` 참고
