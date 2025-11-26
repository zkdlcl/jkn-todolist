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
- [ ] **FE-02**: Axios 인터셉터 및 인증 스토어 구현 (`useAuthStore`) <!-- id: fe-02 -->
  - **기능**: JWT 저장, 요청 헤더 자동 포함
- [ ] **FE-03**: 로그인/회원가입 UI 구현 <!-- id: fe-03 -->
  - **기능**: 폼 유효성 검사, API 연동

### 🟠 Phase 3: 할일 관리 핵심 (Todo Core)

> **목표**: 할일 생성, 조회, 수정, 삭제(Soft Delete) 기능을 구현한다.
> **의존성**: Phase 2 완료 (인증된 사용자만 접근 가능)

- [ ] **BE-04**: 할일 CRUD API 구현 (`TodoController`) <!-- id: be-04 -->
  - **기능**: `POST /todos`, `GET /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`
- [ ] **FE-04**: 할일 스토어 구현 (`useTodoStore`) <!-- id: fe-04 -->
  - **기능**: 상태 관리, API 연동
- [ ] **FE-05**: 할일 목록 및 아이템 컴포넌트 구현 <!-- id: fe-05 -->
  - **기능**: 필터링, 정렬, 완료 토글 UI
- [ ] **FE-06**: 할일 추가/수정 모달 구현 <!-- id: fe-06 -->

### 🟣 Phase 4: 휴지통 및 마무리 (Trash & Polish)

> **목표**: 삭제된 할일 복구 기능을 구현하고 UI/UX를 다듬는다.

- [ ] **BE-05**: 휴지통 조회 및 복구 API 구현 <!-- id: be-05 -->
  - **기능**: `GET /todos/trash`, `PATCH /todos/:id/restore`
- [ ] **FE-07**: 휴지통 페이지 UI 구현 <!-- id: fe-07 -->
- [x] **FE-08**: 공통 일정(국경일) 더미 데이터 표시 (MVP 범위) <!-- id: fe-08 -->
  - **기능**: 2025년 한국 공휴일 데이터를 `public_events` 테이블에 삽입
  - **완료 조건**: 20개의 공휴일 데이터 정상 삽입 확인

## 3. 실행 전략 (Execution Strategy)

1.  **순차적 진행**: 혼선을 방지하기 위해 **DB -> Backend -> Frontend** 순서로 기능을 완성해 나갑니다.
2.  **테스트 주도**: 각 API 구현 후 `curl`이나 `Postman` 대신 간단한 테스트 스크립트로 동작을 검증합니다.
3.  **중간 점검**: 각 Phase가 끝날 때마다 통합 테스트를 수행합니다.

## 4. 부록: 데이터베이스 세팅 정보

### 공통 일정(국경일) 데이터

- **설명**: 2025년 대한민국 공휴일 정보를 `public_events` 테이블에 삽입
