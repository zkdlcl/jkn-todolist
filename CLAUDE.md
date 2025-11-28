# JKN-TODOLIST 프로젝트 가이드

## 1. 기본 원칙

- **언어**: 모든 입출력 및 주석은 **한국어**를 사용합니다.
- **철학**: 오버엔지니어링을 지양하고, 2일 내 개발 가능한 **실용적 품질**을 추구합니다.
- **목표**: 개인 할일 및 공통 일정 통합 관리 앱 MVP 개발.
- 모든 입출력은 한국어로 할 것
- 오버엔지니어링 금지

## 2. 기술 스택

### Frontend
- **Core**: React 19, Vite
- **상태 관리**: Zustand
- **스타일링**: Tailwind CSS 4, @tailwindcss/vite
- **HTTP 클라이언트**: Axios
- **라우팅**: React Router v7
- **폼 관리**: React Hook Form
- **알림**: SweetAlert2
- **달력**: React Big Calendar
- **날짜 처리**: date-fns, moment
- **Testing**: Playwright (E2E)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **인증**: JWT (jsonwebtoken), bcrypt
- **데이터베이스**: PostgreSQL, pg driver
- **API 문서**: Swagger UI Express
- **스케줄링**: node-cron
- **Testing**: Jest, Supertest

### Database
- **DBMS**: PostgreSQL (Supabase)
- **ORM**: 없음 (Raw SQL queries via pg)

## 3. 프로젝트 구조

```
/
├── client/                # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── api/          # API 클라이언트 (authAPI, todoAPI, calendarAPI, syncAPI)
│   │   ├── components/   # 재사용 컴포넌트 (TodoItem, TodoList, TodoModal, ConfirmModal)
│   │   ├── pages/        # 페이지 컴포넌트 (LoginPage, SignupPage, HomePage, TrashPage, CalendarPage)
│   │   ├── stores/       # Zustand 스토어 (useAuthStore, useTodoStore)
│   │   ├── utils/        # 유틸리티 함수 (notification.js)
│   │   ├── App.jsx       # 메인 앱 컴포넌트
│   │   └── main.jsx      # 앱 엔트리 포인트
│   └── package.json
│
├── server/                # 백엔드 (Node + Express)
│   ├── src/
│   │   ├── config/       # 설정 파일 (database.js)
│   │   ├── controllers/  # 컨트롤러 (authController, todoController, calendarController, syncController)
│   │   ├── services/     # 비즈니스 로직 (authService, todoService, calendarService, kasiAPIService, publicEventSyncService)
│   │   ├── repositories/ # 데이터 액세스 (userRepository, todoRepository, publicEventRepository)
│   │   ├── middlewares/  # 미들웨어 (authMiddleware)
│   │   ├── routes/       # 라우트 (authRoutes, todoRoutes, calendarRoutes, syncRoutes)
│   │   └── cron/         # 스케줄러 (publicEventScheduler, index)
│   ├── index.js          # 서버 엔트리 포인트
│   └── package.json
│
├── database/              # 데이터베이스 관련
│   ├── schema.sql        # 데이터베이스 스키마
│   └── migrations/       # 마이그레이션 스크립트
│
├── docs/                  # 프로젝트 문서
│   ├── 0-8번            # 기본 개발 문서
│   ├── API/              # API 연동 가이드
│   ├── extentions/       # 확장 기능 문서
│   └── debug-records/    # 디버깅 기록
│
├── swagger/               # API 문서
│   └── swagger.json
│
├── scripts/               # 유틸리티 스크립트
│   └── syncHolidays.js   # 공휴일 동기화 스크립트
│
├── tests/                 # E2E 테스트
│   └── e2e/              # Playwright 테스트
│
├── .env                   # 환경 변수
├── CLAUDE.md              # 이 파일
├── README.md              # 프로젝트 README
└── package.json           # 루트 package.json (Playwright)
```

## 4. 주요 명령어

### Frontend (client/)

```bash
npm run dev      # 개발 서버 실행 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
npm run lint     # ESLint 실행
```

### Backend (server/)

```bash
npm run dev      # 개발 서버 실행 (nodemon, http://localhost:3000)
npm test         # Jest 테스트 실행
```

### E2E 테스트 (루트)

```bash
npx playwright test              # 모든 E2E 테스트 실행
npx playwright test --headed     # 브라우저 UI와 함께 실행
npx playwright show-report       # 테스트 리포트 보기
```

### 공휴일 동기화

```bash
node scripts/syncHolidays.js 2025  # 2025년 공휴일 동기화
```

## 5. 코딩 컨벤션

- **변수/함수**: camelCase
- **컴포넌트/클래스**: PascalCase
- **상수**: UPPER_SNAKE_CASE
- **파일**: kebab-case (컴포넌트는 PascalCase 허용)
- **주석**: 복잡한 로직에 대해 "왜"를 설명하는 주석 작성 (한국어)

## 6. 개발 워크플로우

1. **기획 확인**: `docs/` 내의 요구사항 확인
2. **설계**: 구현 전 간단한 설계 (필요 시)
3. **구현**: 기능 단위 구현 (TDD 권장)
4. **테스트**: 단위/통합/E2E 테스트 수행
5. **커밋**: 의미 있는 단위로 커밋

## 7. 현재 구현 상태 (MVP 완료)

### ✅ Phase 1: 인프라 및 기본 세팅
- ✅ PostgreSQL 데이터베이스 구축
- ✅ Node.js/Express 서버 구축
- ✅ React/Vite 클라이언트 구축

### ✅ Phase 2: 사용자 인증
- ✅ JWT 기반 인증 시스템
- ✅ 회원가입/로그인/로그아웃
- ✅ Refresh Token 자동 갱신
- ✅ 인증 상태 관리 (Zustand)

### ✅ Phase 3: 할일 관리 핵심
- ✅ 할일 CRUD (생성, 조회, 수정, 삭제)
- ✅ 필터링 (전체/완료/미완료)
- ✅ 정렬 (우선순위/만료일/생성일)
- ✅ 완료 상태 토글
- ✅ 우선순위 설정 (LOW/MEDIUM/HIGH)

### ✅ Phase 4: 휴지통
- ✅ 소프트 삭제
- ✅ 삭제된 할일 조회
- ✅ 할일 복구
- ✅ 영구 삭제
- ✅ 휴지통 전체 비우기

### ✅ Phase 5: 달력 기능
- ✅ 월/주/일 보기 모드
- ✅ 할일 시각화
- ✅ 공휴일 표시 (이벤트 타입별 색상 구분)
- ✅ 툴팁 (상세 정보 표시)
- ✅ KASI API 연동 (한국천문연구원 특일 정보)
- ✅ 자동/수동 공휴일 동기화

### ✅ Phase 6: 알림 시스템
- ✅ SweetAlert2 기반 사용자 정의 알림
- ✅ 브라우저 기본 alert 대체
- ✅ 성공/오류/정보/경고 타입 지원

### 📊 테스트 현황
- ✅ Backend Unit Tests: 30개 통과 (Jest + Supertest)
  - Auth API: 9개
  - Todo API: 15개
  - Trash API: 6개
- ⏳ E2E Tests: Playwright 설정 완료 (테스트 작성 중)

## 8. API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/refresh` - 토큰 갱신

### 할일 (Todos)
- `GET /api/todos` - 할일 목록 조회
- `POST /api/todos` - 할일 생성
- `GET /api/todos/:id` - 할일 상세 조회
- `PATCH /api/todos/:id` - 할일 수정
- `DELETE /api/todos/:id` - 할일 삭제 (소프트)
- `GET /api/todos/trash/all` - 휴지통 조회
- `PATCH /api/todos/:id/restore` - 할일 복구
- `DELETE /api/todos/:id/permanent` - 영구 삭제

### 달력 (Calendar)
- `GET /api/calendar/:year/:month` - 월별 일정 조회

### 동기화 (Sync)
- `POST /api/sync/holidays` - 공휴일 동기화

### 기타
- `GET /api/health` - 서버 상태 확인
- `GET /api-docs` - Swagger API 문서

## 9. 환경 변수 설정

### server/.env
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/jkn_todolist

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# KASI API
KASI_API_KEY=your-api-key
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

### client/.env.local
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 10. 문서

### 기본 개발 문서
- [0. 도메인 정의 요청서](docs/0-domain-definition-request.md)
- [1. 도메인 정의서](docs/1-domain-definition.md)
- [2. PRD (제품 요구사항 명세서)](docs/2-prd-product-requirements.md)
- [3. 사용자 시나리오](docs/3-user-scenarios.md) ⭐ (E2E 테스트 기준)
- [4. 프로젝트 구조 설계 원칙](docs/4-project-structure-principles.md)
- [5. ERD & 데이터베이스 설계](docs/5-erd-database-design.md)
- [6. 기술 아키텍처](docs/6-technical-architecture.md)
- [7. 실행 계획 (Implementation Plan)](docs/7-implementation_plan.md) ⭐
- [8. 와이어프레임](docs/8-wireframes.md)
- [9. 문서 정비용 프롬프트](docs/9-documentation-checklist.md)

### 확장 기능 문서
- [달력 기능 명세서](docs/extentions/9-calendar-feature.md)
- [달력 개발 요약](docs/extentions/calendar-development-summary.md)
- [KASI API 연동 가이드](docs/API/10-kasi-api-integration.md)

### 디버깅 기록
- [인증 상태 유지 문제 디버깅](docs/debug-records/auth-persistence-issue-debug.md)
