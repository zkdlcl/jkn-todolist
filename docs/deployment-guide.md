# JKN-TODOLIST 배포 가이드

## 목차
1. [Supabase 데이터베이스 설정](#1-supabase-데이터베이스-설정)
2. [MCP 연결 설정](#2-mcp-연결-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [백엔드 배포 (Vercel/Railway)](#4-백엔드-배포)
5. [프론트엔드 배포 (Vercel)](#5-프론트엔드-배포)
6. [배포 후 확인 사항](#6-배포-후-확인-사항)

---

## 1. Supabase 데이터베이스 설정

### 1.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
   - Organization 선택
   - Project Name: `jkn-todolist`
   - Database Password: 안전한 비밀번호 설정
   - Region: **Northeast Asia (Seoul)** 선택
3. 프로젝트 생성 완료 대기 (약 2분)

### 1.2 데이터베이스 스키마 적용

#### 방법 1: SQL Editor 사용 (권장)
1. Supabase 대시보드에서 **SQL Editor** 메뉴 선택
2. **New Query** 클릭
3. `database/deploy-schema.sql` 파일 내용 전체 복사
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭하여 실행
6. 성공 메시지 확인

#### 방법 2: MCP 연결 사용
```bash
# .env 파일에 연결 문자열 설정
POSTGRES_CONNECTION_STRING=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# MCP 연결 확인
# .mcp.deploy.json 파일이 올바르게 설정되어 있는지 확인
```

### 1.3 데이터베이스 연결 정보 확인
1. Supabase 대시보드에서 **Settings** → **Database** 메뉴
2. **Connection string** 섹션에서 정보 복사
   - **Connection pooling** 탭 선택 (권장)
   - Mode: **Transaction**
   - 연결 문자열 형식:
     ```
     postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
     ```

---

## 2. MCP 연결 설정

### 2.1 `.mcp.deploy.json` 설정 확인

현재 프로젝트의 `.mcp.deploy.json` 파일:

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
      ],
      "disabled": false
    }
  }
}
```

### 2.2 환경 변수 설정
루트 `.env` 파일에 다음 추가:
```env
POSTGRES_CONNECTION_STRING=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
```

### 2.3 MCP 연결 테스트
```bash
# Claude Code에서 MCP 도구 사용 가능 여부 확인
# SQL 쿼리 실행 테스트
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

---

## 3. 환경 변수 설정

### 3.1 로컬 개발 환경

**`server/.env`**
```env
PORT=3000
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# KASI API (한국천문연구원 특일 정보)
KASI_API_KEY=your-kasi-api-key
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

**`client/.env.local`**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3.2 프로덕션 환경 변수

#### 백엔드 (Vercel/Railway)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=[Supabase Connection String - Pooling Mode]
JWT_SECRET=[강력한 랜덤 문자열]
JWT_REFRESH_SECRET=[강력한 랜덤 문자열]
KASI_API_KEY=[KASI API Key]
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

#### 프론트엔드 (Vercel)
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

---

## 4. 백엔드 배포

### 4.1 Vercel 배포 (권장)

#### 사전 준비
1. `server/vercel.json` 파일 생성:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. `server/package.json`에 엔진 설정 추가:
```json
{
  "engines": {
    "node": ">=18.x"
  }
}
```

#### 배포 단계
1. [Vercel](https://vercel.com) 로그인
2. **Add New Project**
3. GitHub 리포지토리 연결
4. **Root Directory**: `server` 선택
5. **Environment Variables** 설정 (3.2 참고)
6. **Deploy** 클릭
7. 배포 완료 후 URL 복사 (예: `https://jkn-todolist-server.vercel.app`)

### 4.2 Railway 배포 (대안)

1. [Railway](https://railway.app) 로그인
2. **New Project** → **Deploy from GitHub repo**
3. 리포지토리 선택
4. **Root Directory**: `/server` 설정
5. **Start Command**: `node index.js`
6. **Environment Variables** 설정
7. 배포 확인

---

## 5. 프론트엔드 배포

### 5.1 Vercel 배포

#### 사전 준비
1. `client/.env.production` 파일 생성:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

#### 배포 단계
1. [Vercel](https://vercel.com) 로그인
2. **Add New Project**
3. GitHub 리포지토리 연결
4. **Root Directory**: `client` 선택
5. **Framework Preset**: Vite
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Environment Variables** 설정:
   ```
   VITE_API_BASE_URL=https://jkn-todolist-server.vercel.app/api
   ```
9. **Deploy** 클릭
10. 배포 완료 후 URL 확인 (예: `https://jkn-todolist.vercel.app`)

---

## 6. 배포 후 확인 사항

### 6.1 백엔드 API 확인
```bash
# Health Check
curl https://your-backend-domain.com/api/health

# 응답 예시
{
  "status": "OK",
  "message": "Server is running"
}
```

### 6.2 데이터베이스 연결 확인
1. Supabase 대시보드 → **Table Editor**
2. 테이블 목록 확인:
   - `users`
   - `todos`
   - `refresh_tokens`
   - `public_events`
   - `schema_version`

### 6.3 프론트엔드 기능 테스트
1. 회원가입 테스트
2. 로그인 테스트
3. 할일 CRUD 테스트
4. 달력 기능 테스트
5. 휴지통 기능 테스트

### 6.4 공휴일 동기화 실행
```bash
# 로컬에서 실행 (배포 환경 DATABASE_URL 사용)
DATABASE_URL=postgresql://... node scripts/syncHolidays.js 2025

# 또는 백엔드 서버에서 API 호출
curl -X POST https://your-backend-domain.com/api/sync/holidays \
  -H "Content-Type: application/json" \
  -d '{"year": 2025}'
```

---

## 7. CORS 설정 확인

### 7.1 백엔드 CORS 설정
`server/index.js`에서 CORS 설정 확인:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',  // 로컬 개발
    'https://jkn-todolist.vercel.app'  // 프로덕션
  ],
  credentials: true
}));
```

---

## 8. 보안 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] JWT_SECRET이 강력한 랜덤 문자열인지 확인 (최소 32자 이상)
- [ ] DATABASE_URL이 환경 변수로 관리되는지 확인
- [ ] API 키가 노출되지 않았는지 확인
- [ ] CORS origin이 프로덕션 도메인으로 제한되어 있는지 확인
- [ ] Supabase RLS(Row Level Security)가 활성화되어 있는지 확인
- [ ] HTTPS 사용 확인

---

## 9. 트러블슈팅

### 문제: 데이터베이스 연결 실패
**해결책**:
- Supabase 연결 문자열 확인 (Pooling Mode 사용)
- 방화벽 설정 확인
- DATABASE_URL 환경 변수 확인

### 문제: CORS 오류
**해결책**:
- 백엔드 CORS origin에 프론트엔드 URL 추가
- credentials: true 설정 확인

### 문제: JWT 인증 실패
**해결책**:
- JWT_SECRET 환경 변수 확인
- 토큰 만료 시간 확인
- Refresh Token 로직 확인

### 문제: API 응답 느림
**해결책**:
- Supabase Connection Pooling 사용
- 데이터베이스 인덱스 확인
- 쿼리 최적화

---

## 10. 참고 링크

- [Supabase 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Railway 배포 가이드](https://docs.railway.app)
- [Node.js Express 프로덕션 모범 사례](https://expressjs.com/en/advanced/best-practice-performance.html)
