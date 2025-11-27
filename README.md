# JKN-TODOLIST

개인 할일과 공통 일정을 통합 관리하는 스마트 할일 관리 애플리케이션

## 🎯 프로젝트 개요

**목표**: 2일 내 MVP 출시 완료 ✅

**핵심 기능**:

- ✅ 사용자 인증 (회원가입, 로그인)
- ✅ 할일 관리 (CRUD, 필터링, 정렬)
- ✅ 휴지통 (삭제 복구, 영구 삭제)
- 🔄 달력 뷰 (확장 기능 개발 중)
- 🔄 국경일 API 연동 (확장 기능 개발 중)

## 🛠️ 기술 스택

### Frontend

- React 18 + Vite
- Zustand (상태 관리)
- Tailwind CSS
- React Router
- React Hook Form
- date-fns

### Backend

- Node.js + Express
- PostgreSQL (Supabase)
- JWT (인증)
- bcrypt (비밀번호 해싱)

### Testing

- Jest + Supertest

## 📁 프로젝트 구조

```
jkn-todolist/
├── client/          # React 프론트엔드
├── server/          # Node.js 백엔드
├── database/        # DB 스키마
├── docs/            # 프로젝트 문서
│   ├── 0-8번        # 기본 개발 문서
│   ├── API/         # API 연동 가이드
│   ├── extentions/  # 확장 기능 문서
│   └── debug-records/ # 디버깅 기록
├── swagger/         # API 문서
└── tests/           # 통합 테스트
```

## 📚 문서

### 기본 개발 문서 (MVP)

- [0. 도메인 정의 요청서](docs/0-domain-definition-request.md)
- [1. 도메인 정의서](docs/1-domain-definition.md)
- [2. PRD (제품 요구사항 명세서)](docs/2-prd-product-requirements.md)
- [3. 사용자 시나리오](docs/3-user-scenarios.md)
- [4. 프로젝트 구조 설계 원칙](docs/4-project-structure-principles.md)
- [5. ERD & 데이터베이스 설계](docs/5-erd-database-design.md)
- [6. 기술 아키텍처](docs/6-technical-architecture.md)
- [7. 실행 계획 (Implementation Plan)](docs/7-implementation_plan.md) ⭐
- [8. 와이어프레임](docs/8-wireframes.md)

### 확장 기능 문서

- [9. 달력 기능 명세서](docs/extentions/9-calendar-feature.md)
- [달력 개발 요약](docs/extentions/calendar-development-summary.md)
- [확장 목표](docs/extentions/확장목표)

### API 연동 문서

- [10. KASI 특일 정보 API 연동 가이드](docs/API/10-kasi-api-integration.md)
- [KASI API 검토 요약](docs/extentions/kasi-api-review-summary.md)

### 디버깅 기록

- [인증 상태 유지 문제 디버깅](docs/debug-records/auth-persistence-issue-debug.md)

## 🚀 시작하기

### 1. 환경 변수 설정

**server/.env**

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/jkn_todolist

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# KASI API (확장 기능)
KASI_API_KEY=your-api-key
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

**client/.env.local**

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성
createdb jkn_todolist

# 스키마 적용
psql -d jkn_todolist -f database/schema.sql
```

### 3. 서버 실행

```bash
cd server
npm install
npm run dev
```

### 4. 클라이언트 실행

```bash
cd client
npm install
npm run dev
```

## ✅ MVP 완료 현황

### Phase 1: 인프라 및 기본 세팅 ✅

- ✅ DB-01: PostgreSQL 데이터베이스 생성 및 스키마 적용
- ✅ BE-01: Node.js/Express 프로젝트 초기화
- ✅ FE-01: React/Vite 프로젝트 초기화

### Phase 2: 사용자 인증 ✅

- ✅ BE-02: 사용자 모델 및 리포지토리
- ✅ BE-03: 인증 서비스 및 컨트롤러
- ✅ FE-02: Axios 인터셉터 및 인증 스토어
- ✅ FE-03: 로그인/회원가입 UI

### Phase 3: 할일 관리 핵심 ✅

- ✅ BE-04: 할일 CRUD API
- ✅ FE-04: 할일 스토어
- ✅ FE-05: 할일 목록 및 아이템 컴포넌트
- ✅ FE-06: 할일 추가/수정 모달

### Phase 4: 휴지통 및 마무리 ✅

- ✅ BE-05: 휴지통 조회 및 복구 API
- ✅ FE-07: 휴지통 페이지 UI
- ✅ FE-08: 공통 일정(국경일) 더미 데이터

### Phase 5: 달력 기능 (확장) 🔄

- ⏳ BE-06: 달력 데이터 조회 API
- ⏳ FE-09: 달력 UI 구현
- ⏳ FE-10: 달력 인터랙션 구현
- ⏳ BE-07: KASI 특일 정보 API 연동

## 🧪 테스트

```bash
cd server
npm test
```

**테스트 현황**: 30개 통과 ✅

- Auth API: 9개
- Todo API: 15개
- Trash API: 6개

## 📊 API 문서

Swagger UI: http://localhost:3000/api-docs

## 🔧 개발 가이드

자세한 개발 가이드는 각 문서를 참고하세요:

- 코딩 컨벤션: [4. 프로젝트 구조 설계 원칙](docs/4-project-structure-principles.md)
- API 명세: [Swagger](swagger/swagger.json)
- 데이터베이스: [5. ERD & 데이터베이스 설계](docs/5-erd-database-design.md)

## 📝 라이선스

MIT

## 👥 개발자

- **Frontend & Backend**: JKN Team
- **문서화**: 2025-11-25 ~ 2025-11-27
