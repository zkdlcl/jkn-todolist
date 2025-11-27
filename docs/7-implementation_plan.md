# JKN-TODOLIST MVP 실행 계획 (Execution Plan)

## 1. 개요

본 문서는 `docs/` 디렉토리의 설계 문서를 바탕으로 **2일 내 MVP 완성**을 위한 구체적인 실행 계획을 정의합니다. 각 작업은 독립적으로 수행 가능하도록 분할되었으며, 의존성이 명시되어 있습니다.

## 2. 작업 분해 (Work Breakdown)

### 🟢 Phase 1: 인프라 및 기본 세팅 (Infrastructure & Setup)

> **목표**: 개발 환경을 구축하고 서버와 클라이언트가 통신 가능한 상태를 만든다.

- [x] **DB-01**: PostgreSQL 데이터베이스 생성 및 스키마 적용 <!-- id: db-01 -->
  - **입력**: `database/schema.sql`
  - **완료 조건**: `users`, `todos`, `refresh_tokens`, `public_events` 테이블 생성 확인
- [x] **BE-01**: Node.js/Express 프로젝트 초기화 <!-- id: be-01 -->
  - **설치**: `express`, `cors`, `dotenv`, `pg`, `nodemon`
  - **완료 조건**: `http://localhost:3000/health` 호출 시 200 OK 응답
- [x] **FE-01**: React/Vite 프로젝트 초기화 <!-- id: fe-01 -->
  - **설치**: `axios`, `zustand`, `react-router-dom`, `tailwindcss`
  - **완료 조건**: 개발 서버 실행 및 Tailwind 스타일 적용 확인

### 🔵 Phase 2: 사용자 인증 (Authentication)

> **목표**: 회원가입, 로그인, 로그아웃 기능을 구현하고 JWT 토큰을 관리한다.
> **의존성**: Phase 1 완료

- [x] **BE-02**: 사용자 모델 및 리포지토리 구현 (`UserRepository`) <!-- id: be-02 -->
  - **기능**: `create`, `findByEmail`, `findById`
  - **완료**: 데이터베이스 연결, Repository 패턴 구현, 테스트 통과
- [x] **BE-03**: 인증 서비스 및 컨트롤러 구현 (`AuthService`) <!-- id: be-03 -->
  - **기능**: 비밀번호 해싱(bcrypt), JWT 발급, 로그인/회원가입 API
  - **완료**: AuthService, AuthController, 인증 미들웨어, 라우트 구현, 9개 통합 테스트 통과
- [x] **FE-02**: Axios 인터셉터 및 인증 스토어 구현 (`useAuthStore`) <!-- id: fe-02 -->
  - **기능**: JWT 저장, 요청 헤더 자동 포함
  - **완료**: Axios 클라이언트, 인터셉터, Zustand 인증 스토어, authAPI 구현
- [x] **FE-03**: 로그인/회원가입 UI 구현 <!-- id: fe-03 -->
  - **기능**: 폼 유효성 검사, API 연동
  - **완료**: LoginPage, SignupPage, HomePage, React Router 설정, 폼 유효성 검사 구현

### 🟠 Phase 3: 할일 관리 핵심 (Todo Core)

> **목표**: 할일 생성, 조회, 수정, 삭제(Soft Delete) 기능을 구현한다.
> **의존성**: Phase 2 완료 (인증된 사용자만 접근 가능)

- [x] **BE-04**: 할일 CRUD API 구현 (`TodoController`) <!-- id: be-04 -->
  - **기능**: `POST /todos`, `GET /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`
  - **완료**: TodoRepository, TodoService, TodoController, 라우트 구현, 통합 테스트 통과
- [x] **FE-04**: 할일 스토어 구현 (`useTodoStore`) <!-- id: fe-04 -->
  - **기능**: 상태 관리, API 연동
  - **완료**: todoAPI 서비스, Zustand 스토어(CRUD, 필터링, 정렬) 구현
- [x] **FE-05**: 할일 목록 및 아이템 컴포넌트 구현 <!-- id: fe-05 -->
  - **기능**: 필터링, 정렬, 완료 토글 UI
  - **완료**: TodoItem, TodoList 컴포넌트, HomePage 통합, 반응형 레이아웃 구현
- [x] **FE-06**: 할일 추가/수정 모달 구현 <!-- id: fe-06 -->
  - **기능**: 폼 유효성 검사, 날짜 선택, 우선순위 설정
  - **완료**: TodoModal 컴포넌트, HomePage 연동, 유효성 검사 로직 구현

### 🟣 Phase 4: 휴지통 및 마무리 (Trash & Polish)

> **목표**: 삭제된 할일 복구 기능을 구현하고 UI/UX를 다듬는다.

- [x] **BE-05**: 휴지통 조회 및 복구 API 구현 <!-- id: be-05 -->
  - **기능**: `GET /todos/trash/all`, `PATCH /todos/:id/restore`, `DELETE /todos/:id/permanent`
  - **완료**: Repository, Service, Controller 메서드 추가, 라우트 설정, 통합 테스트 통과
- [x] **FE-07**: 휴지통 페이지 UI 구현 <!-- id: fe-07 -->
  - **기능**: 삭제된 할일 조회, 복구, 영구 삭제
  - **완료**: TrashPage 컴포넌트, API 연동, 라우트 설정, 확인 다이얼로그 구현
- [x] **FE-08**: 공통 일정(국경일) 더미 데이터 표시 (MVP 범위) <!-- id: fe-08 -->
  - **기능**: 2025년 한국 공휴일 데이터를 `public_events` 테이블에 삽입

### 🟡 Phase 5: 달력 기능 확장 (Calendar Feature Extension)

> **목표**: 월간 달력 뷰를 통해 할일을 시각적으로 관리하고, 국경일 정보를 함께 표시
> **의존성**: Phase 4 완료, 공공데이터포털 API 키 확보

- [x] **BE-06**: 달력 데이터 조회 API 구현 <!-- id: be-06 -->
  - **기능**: `GET /api/calendar/:year/:month`, 해당 월의 할일 및 공휴일 통합 조회
  - **완료**: CalendarRepository, CalendarService, CalendarController, 통합 테스트
  - **참조**: `docs/extentions/calendar-feature-consolidated.md#calendarfeature-backend-implementation`
- [x] **FE-09**: 달력 UI 구현 <!-- id: fe-09 -->
  - **기능**: 월간 달력 표시, 날짜별 할일 표시, react-big-calendar 통합
  - **완료**: CalendarPage, CalendarView, DayCell, TodoSidebar 컴포넌트 구현
  - **참조**: `docs/extentions/calendar-feature-consolidated.md#calendarfeature-frontend`
- [x] **FE-10**: 달력 인터랙션 구현 <!-- id: fe-10 -->
  - **기능**: 날짜 클릭 시 사이드바 표시, 할일 CRUD 인터랙션
  - **완료**: 날짜 클릭 로직, 사이드바 인터랙션, 실시간 업데이트
  - **참조**: `docs/extentions/calendar-feature-consolidated.md#calendarfeature-frontend`
- [x] **FE-12**: 달력 툴팁 상세 정보 표시 <!-- id: fe-12 -->
  - **기능**: 할일 마우스 오버 시 제목 외 내용, 마감일 등 상세 정보 표시 (Portal 기반 Custom Event Component)
  - **완료**: React Portal을 사용한 툴팁 구현, z-index 문제 해결, 할일/공휴일 분기 처리
  - **참조**: `docs/extentions/calendar-feature-consolidated.md#calendarfeature-uiux`
- [x] **FE-13**: 주별/일별 보기 구현 <!-- id: fe-13 -->
  - **기능**: 월간 뷰 외에 주간(Week), 일간(Day) 뷰 스타일링 및 기능 점검
  - **완료**: allDay 플래그 자동 설정 로직 구현, Week/Day 뷰에서 시간대별 일정 표시 지원
  - **참조**: `docs/extentions/calendar-feature-consolidated.md#calendarfeature-uiux`
- [x] **BE-07**: KASI API 연동 및 동기화 구현 <!-- id: be-07 -->
  - **기능**: 한국천문연구원 특일 정보 API 연동, 자동/수동 동기화
  - **완료**: KasiAPIService, PublicEventSyncService, 동기화 스크립트, 환경변수 설정
  - **참조**: `docs/extentions/calendar-feature-consolidated.md#calendarfeature-kasi-api-integration`
  - **사용법**: `node scripts/syncHolidays.js 2025`

### 🟢 Phase 6: 달력 기능 개선 (Calendar Feature Enhancement)

> **목표**: 달력에서 이벤트 타입에 따라 색상 구분이 가능하도록 기능 개선
> **의존성**: Phase 5 완료

- [x] **BE-08**: 공공 일정 타입 정보 반영 <!-- id: be-08 -->
  - **기능**: `publicEventRepository`가 이벤트 타입 정보를 프론트엔드에 전달하도록 수정
  - **완료**: 데이터베이스 쿼리에서 `type` 필드를 `event_type`으로 매핑하여 반환
- [x] **FE-14**: 이벤트 타입별 색상 구분 <!-- id: fe-14 -->
  - **기능**: 달력에서 공휴일/기념일/24절기/잡절별로 다른 색상으로 표시
  - **완료**: `eventStyleGetter` 함수에서 이벤트 타입에 따라 색상 구분 로직 구현
- [x] **DB-02**: 데이터베이스 스키마 업데이트 <!-- id: db-02 -->
  - **기능**: `public_events` 테이블에 `SOLAR_TERM`, `SEASONAL_DAY` 타입 추가 및 UNIQUE 제약 조건 반영
  - **완료**: 스키마 파일 및 마이그레이션 스크립트 업데이트

## 3.  **중간 점검**: 각 Phase가 끝날 때마다 통합 테스트를 수행합니다.

## 4. 부록: 데이터베이스 세팅 정보

### 공통 일정(국경일) 데이터

- **설명**: 2025년 대한민국 공휴일 정보를 `public_events` 테이블에 삽입
