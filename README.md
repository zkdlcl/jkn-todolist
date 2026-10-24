# JKN-TODOLIST

> 개인 할일과 **공휴일·기념일·24절기** 같은 공통 일정을 한 달력에서 함께 보는 할일 관리 웹앱입니다.
> 기획 문서(도메인 정의 → PRD → ERD → 아키텍처 → 실행 계획)부터 시작해 **MVP를 2일 만에 배포**까지 마친 풀스택 프로젝트입니다.

## 핵심 기능
- **인증**: 회원가입·로그인, JWT access/refresh 토큰, 만료 시 401 인터셉터가 자동 갱신
- **할일 관리**: CRUD, 우선순위(LOW/MEDIUM/HIGH), 시작·마감일, 완료 처리, 필터링·정렬
- **휴지통**: 삭제는 소프트 삭제(`deleted_status`)로 처리해 복구·영구 삭제 지원
- **달력 뷰**: 월별로 내 할일과 공통 일정을 함께 표시
- **공휴일 자동 동기화**: 한국천문연구원(KASI) 특일 정보 API를 서버 스케줄러가 주기적으로 가져와 DB에 반영
- **알림 UX**: 브라우저 `alert`를 SweetAlert2/Toastify 컴포넌트로 전부 대체

## 설계에서 신경 쓴 부분
- **계층 분리 백엔드**: `routes → controllers → services → repositories` 로 나눠 비즈니스 로직과 SQL을 분리했습니다.
- **공통 일정 데이터 파이프라인**: KASI는 매년 6~8월경 차차년도 데이터를 공개하므로, 매주 월요일 동기화와 매년 7월 1일 연간 동기화를 Vercel Cron으로 나눠 걸었습니다. `(date, title)` 유니크 제약으로 중복 없이 갱신합니다.
- **문서 우선 개발**: 요구사항·ERD·와이어프레임·실행 계획을 코드보다 먼저 작성했고, 디버깅 과정도 `docs/debug-records/`에 남겼습니다.
- **테스트**: 서버 API·리포지토리에 Jest + Supertest 테스트 30개, 인증 상태 유지는 Playwright 시나리오로 확인합니다.
- **CI/CD**: GitHub Actions로 Vercel에 백엔드·프런트를 각각 배포합니다.

## 기술 스택
| 영역 | 사용 기술 |
|---|---|
| Frontend | React 19, Vite, Zustand, React Router, React Hook Form, Tailwind CSS 4, react-big-calendar, date-fns, SweetAlert2 |
| Backend | Node.js, Express 5, node-cron, bcrypt, JWT, Swagger UI |
| Database | PostgreSQL (Supabase) — `users`, `todos`, `refresh_tokens`, `public_events` |
| Test / Infra | Jest, Supertest, Playwright, GitHub Actions, Vercel |

## 프로젝트 구조
```
jkn-todolist/
├── client/          # React 프런트엔드 (pages, components, stores, api)
├── server/          # Express 백엔드 (routes, controllers, services, repositories, cron)
├── database/        # DB 스키마·마이그레이션
├── docs/            # 도메인·PRD·ERD·아키텍처·와이어프레임, API 연동, 디버깅 기록
├── swagger/         # API 명세
├── tests/           # Playwright 시나리오
└── .github/         # CI/CD 워크플로우
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
- [9. 문서 정비용 프롬프트](docs/9-documentation-checklist.md)

### 확장 기능 문서

- [달력 기능 명세서](docs/extentions/9-calendar-feature.md)
- [달력 개발 요약](docs/extentions/calendar-development-summary.md)
- [확장 목표](docs/extentions/확장목표)

### API 연동 문서

- [10. KASI 특일 정보 API 연동 가이드](docs/API/10-kasi-api-integration.md)
- [KASI API 검토 요약](docs/extentions/kasi-api-review-summary.md)

### 배포 문서

- [배포 체크리스트](DEPLOYMENT_CHECKLIST.md) ⭐
- [배포 가이드 (상세)](docs/deployment-guide.md)

### 디버깅 기록

- [인증 상태 유지 문제 디버깅](docs/debug-records/auth-persistence-issue-debug.md)

## 🚀 시작하기

### 로컬 개발 환경

#### 1. 환경 변수 설정

**루트 `.env`** (MCP 연결용)
```env
POSTGRES_CONNECTION_STRING=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
KASI_API_KEY=your-api-key
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

**`server/.env`**
```env
PORT=3000
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
KASI_API_KEY=your-api-key
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

**`client/.env.local`**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### 2. 데이터베이스 설정 (Supabase)

1. [Supabase](https://supabase.com)에서 프로젝트 생성 (Region: Seoul)
2. Supabase SQL Editor에서 `database/deploy-schema.sql` 실행
3. Connection String 복사 (Transaction Pooling Mode)

#### 3. 서버 실행

```bash
cd server
npm install
npm run dev
```

#### 4. 클라이언트 실행

```bash
cd client
npm install
npm run dev
```

#### 5. 공휴일 데이터 동기화

```bash
# 2025년 공휴일 동기화
node scripts/syncHolidays.js 2025
```

### 배포 (Vercel)

**빠른 배포**: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) 참고
**상세 가이드**: [`docs/deployment-guide.md`](docs/deployment-guide.md) 참고

**핵심 단계**:
1. Supabase에 `database/deploy-schema.sql` 실행
2. Vercel에 백엔드 배포 (Root: `server`)
3. Vercel에 프론트엔드 배포 (Root: `client`)
4. 환경 변수 설정
5. 공휴일 데이터 동기화

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

### Phase 5: 달력 기능 (확장) ✅

- ✅ BE-06: 달력 데이터 조회 API
- ✅ FE-09: 달력 UI 구현
- ✅ FE-10: 달력 인터랙션 구현
- ✅ BE-07: KASI 특일 정보 API 연동

### Phase 6: 알림 시스템 (개선) ✅

- ✅ FE-15: 공휴일 동기화 버튼 기능 개선
- ✅ FE-16: 알림 라이브러리 도입
- ✅ FE-17: 기존 alert 모두 알림 컴포넌트로 대체

## 🧪 테스트

```bash
cd server
npm test
```

**테스트 현황**: 30개 통과 ✅

- Auth API: 9개
- Todo API: 9개
- Trash API: 6개
- UserRepository: 6개

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
