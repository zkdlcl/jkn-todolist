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

### ✨ Phase 7: 달력 기능 고도화 (Advanced Calendar Features)

> **목표**: 달력에서 직접 할일을 추가하는 기능을 구현하여 사용자 편의성을 극대화한다.
> **의존성**: Phase 5 완료

- [ ] **FE-18**: 달력 날짜 슬롯 클릭 이벤트 처리 <!-- id: fe-18 -->

  - **기능**: `CalendarPage.jsx`에서 `react-big-calendar`의 `onSelectSlot` 이벤트를 받아, 선택된 날짜 정보로 할일 추가 모달을 열도록 트리거링.
  - **완료 조건**: 달력의 특정 날짜를 클릭하면 `TodoModal`이 열림.

- [ ] **FE-19**: `TodoModal`에 날짜 기본값 설정 기능 추가 <!-- id: fe-19 -->

  - **기능**: `TodoModal.jsx`가 `defaultDate` prop을 받아서, 모달이 열릴 때 시작일/종료일 필드를 해당 날짜로 자동 채움.
  - **완료 조건**: 달력에서 날짜를 클릭해 모달을 열면, 해당 날짜가 폼에 미리 입력되어 있음.

- [ ] **FE-20**: 신규 할일 생성 후 달력 뷰 자동 업데이트 <!-- id: fe-20 -->
  - **기능**: `useTodoStore`의 할일 생성 액션 성공 후, 달력에 표시되는 데이터를 다시 불러와 UI에 즉시 반영.
  - **완료 조건**: 달력에서 할일을 추가하면, 페이지 새로고침 없이 새 이벤트가 달력에 나타남.

## 3. **중간 점검**: 각 Phase가 끝날 때마다 통합 테스트를 수행합니다.

## 4. 실제 테스트 시나리오 (Test Scenarios)

### 4.1 인증 관련 테스트 시나리오

#### TS-001: 회원가입 테스트

- **시나리오**: 신규 사용자가 이메일과 비밀번호로 회원가입
- **완료 조건**:
  - 유효한 이메일 형식 검증
  - 비밀번호 정책 검증 (8자 이상, 대소문자+숫자+특수문자)
  - 중복 이메일 방지
  - 사용자 데이터베이스 저장
  - JWT 토큰 발급 및 자동 로그인

#### TS-002: 로그인 테스트

- **시나리오**: 기존 사용자가 이메일과 비밀번호로 로그인
- **완료 조건**:
  - 사용자 존재 확인
  - 비밀번호 일치 검증
  - JWT 토큰 발급
  - 할일 목록 페이지 리다이렉트

#### TS-003: 로그아웃 테스트

- **시나리오**: 로그인된 사용자가 로그아웃
- **완료 조건**:
  - Refresh Token 무효화
  - 로그인 상태 해제
  - 로그인 페이지로 이동

### 4.2 할일 관리 테스트 시나리오

#### TS-004: 할일 생성 테스트

- **시나리오**: 사용자가 새 할일을 생성
- **완료 조건**:
  - 제목 필수 검증 (1~200자)
  - 날짜 형식 검증
  - 우선순위 값 검증
  - 데이터베이스 저장
  - 할일 목록 반영

#### TS-005: 할일 조회 테스트

- **시나리오**: 사용자가 본인의 할일 목록을 조회
- **완료 조건**:
  - 현재 사용자 소유의 할일만 조회
  - 필터/정렬 옵션 적용
  - 완료/미완료 상태 표시

#### TS-006: 할일 수정 테스트

- **시나리오**: 사용자가 본인의 할일을 수정
- **완료 조건**:
  - 권한 검증 (소유자만 수정 가능)
  - 수정된 값 저장
  - 목록에 반영

#### TS-007: 할일 완료 테스트

- **시나리오**: 사용자가 할일을 완료 상태로 변경
- **완료 조건**:
  - 완료 상태 반영
  - 완료 시간 기록
  - 시각적 표시 변경

#### TS-008: 할일 삭제(소프트) 테스트

- **시나리오**: 사용자가 할일을 삭제
- **완료 조건**:
  - deleted_status 'DELETED'로 변경
  - 할일 목록에서 사라짐
  - 휴지통에서 확인 가능

### 4.3 휴지통 관리 테스트 시나리오

#### TS-009: 휴지통 조회 테스트

- **시나리오**: 사용자가 휴지통을 조회
- **완료 조건**:
  - deleted_status가 'DELETED'인 할일만 조회
  - 사용자별 데이터 격리

#### TS-010: 할일 복구 테스트

- **시나리오**: 사용자가 휴지통의 할일을 복구
- **완료 조건**:
  - deleted_status 'ACTIVE'로 변경
  - 할일 목록으로 복구
  - 원본 데이터 유지

#### TS-011: 영구 삭제 테스트

- **시나리오**: 사용자가 휴지통의 할일을 영구 삭제
- **완료 조건**:
  - 데이터베이스에서 완전 삭제
  - 복구 불가능

### 4.4 달력 기능 테스트 시나리오

#### TS-012: 달력 뷰 표시 테스트

- **시나리오**: 사용자가 달력 페이지를 방문
- **완료 조건**:
  - 월간 달력 표시
  - 할일 및 공휴일 표시
  - 이벤트 타입별 색상 구분

#### TS-013: 달력 보기 모드 전환 테스트

- **시나리오**: 사용자가 월/주/일 보기 모드를 전환
- **완료 조건**:
  - 각 모드별 정상 표시
  - 일정 정확하게 표시

#### TS-014: 날짜별 할일 목록 테스트

- **시나리오**: 사용자가 특정 날짜를 클릭하여 해당 일의 할일 확인
- **완료 조건**:
  - 날짜 클릭 시 사이드바 열림
  - 해당 날짜의 할일 목록 표시

#### TS-015: 달력 툴팁 표시 테스트

- **시나리오**: 사용자가 달력 이벤트에 마우스 오버
- **완료 조건**:
  - 상세 정보 툴팁 표시
  - 할일/공휴일 구분

### 4.5 알림 시스템 테스트 시나리오

#### TS-016: 할일 생성 알림 테스트

- **시나리오**: 사용자가 할일을 생성 시 알림 표시
- **완료 조건**:
  - SweetAlert2 기반 알림 표시
  - 성공 메시지 표시
  - 브라우저 기본 alert 대체

#### TS-017: 오류 알림 테스트

- **시나리오**: 사용자가 유효하지 않은 데이터 입력 시 오류 알림
- **완료 조건**:
  - 오류 타입의 알림 표시
  - 명확한 오류 메시지
  - UX 방해 최소화

#### TS-018: 공휴일 동기화 안내 알림 테스트

- **시나리오**: 사용자가 공휴일 동기화 버튼 클릭
- **완료 조건**:
  - CLI 명령어 포함된 안내 알림 표시
  - 복사 기능 제공
  - 브라우저 기본 alert 대체

### 4.6 KASI API 연동 테스트 시나리오

#### TS-019: KASI API 연동 테스트

- **시나리오**: 공휴일 정보를 KASI API에서 가져오기
- **완료 조건**:
  - API 인증 성공
  - 공휴일 정보 정상 수신
  - 데이터베이스 저장

#### TS-020: 공휴일 동기화 스크립트 테스트

- **시나리오**: CLI 스크립트를 통한 공휴일 정보 동기화
- **완료 조건**:
  - `node scripts/syncHolidays.js 2025` 명령어 실행
  - 지정 연도 공휴일 정보 동기화
  - 중복 방지 로직 동작

### 4.7 달력 기능 고도화 테스트 시나리오

#### TS-021: 달력에서 직접 할일 생성 테스트

- **시나리오**: 사용자가 달력의 빈 날짜를 클릭하여 할일을 생성
- **완료 조건**:
  - 달력의 날짜 클릭 시 할일 추가 모달이 열림
  - 모달의 날짜 필드에 클릭한 날짜가 자동으로 입력됨
  - 할일 저장 시, 해당 날짜에 새 이벤트가 달력에 즉시 표시됨 (페이지 새로고침 없음)

### 🔴 Phase 8: 위치 확인 기능 (Location Tracking) - MVP

> **목표**: QR 코드를 통해 모바일 기기의 위치를 PC 화면의 지도에 실시간으로 표시한다.
> **의존성**: Phase 2 완료 (인증된 사용자만 접근)
> **참고**: `docs/extentions/location-tracking-feature.md`

#### Backend

- [ ] **BE-15**: Socket.io 서버 설정 및 세션 관리 <!-- id: be-15 -->

  - **기능**: WebSocket 서버 초기화, 세션 생성/관리, 클라이언트 연결 처리
  - **완료 조건**:
    - Socket.io 서버 실행
    - 세션 ID 생성 및 관리 로직
    - `join-session`, `send-location` 이벤트 핸들러 구현

- [ ] **BE-16**: 위치 정보 중계 로직 구현 <!-- id: be-16 -->
  - **기능**: 모바일에서 받은 위치 정보를 PC 클라이언트로 전송
  - **완료 조건**:
    - 모바일 → 서버 → PC 데이터 흐름 구현
    - 세션별 연결 관리
    - 연결 해제 처리

#### Frontend - PC View

- [ ] **FE-21**: 위치 확인 페이지 구현 (`LocationPage.jsx`) <!-- id: fe-21 -->

  - **기능**: QR 코드 생성, 지도 표시, 실시간 위치 업데이트
  - **완료 조건**:
    - `/location` 라우트 추가
    - 세션 ID 생성 및 QR 코드 표시 (`qrcode.react` 사용)
    - Kakao Map 초기화 및 마커 표시
    - WebSocket 연결 및 위치 업데이트 수신

- [ ] **FE-22**: Kakao Map 통합 <!-- id: fe-22 -->
  - **기능**: Kakao Map API를 이용한 지도 표시 및 마커 업데이트
  - **완료 조건**:
    - Kakao Map SDK 로드
    - 지도 컴포넌트 구현
    - 위치 마커 생성 및 실시간 업데이트
    - 지도 중심 자동 이동

#### Frontend - Mobile View

- [ ] **FE-23**: 모바일 위치 전송 페이지 구현 (`MobileLocationPage.jsx`) <!-- id: fe-23 -->
  - **기능**: 위치 권한 요청, 위치 정보 전송
  - **완료 조건**:
    - `/mobile/location/:sessionId` 라우트 추가
    - Geolocation API를 통한 위치 권한 요청
    - 위치 정보 실시간 전송 (watchPosition 사용)
    - 연결 상태 UI 표시

#### Configuration

- [ ] **CF-03**: 환경 변수 및 설정 추가 <!-- id: cf-03 -->
  - **추가 항목**:
    - `VITE_KAKAO_MAP_API_KEY`: Kakao Map API 키
    - `SOCKET_PORT`: WebSocket 포트 (기본값: 3001)
  - **완료 조건**:
    - `.env.example` 업데이트
    - 환경 변수 문서화

#### Testing

- [ ] **TS-022**: 위치 확인 기능 통합 테스트 <!-- id: ts-022 -->
  - **시나리오**: PC에서 QR 생성 → 모바일에서 스캔 → 위치 정보 전송 → PC 지도에 표시
  - **완료 조건**:
    - QR 코드 생성 확인
    - 모바일에서 위치 권한 허용 및 전송 성공
    - PC 화면에 마커 정상 표시
    - 실시간 업데이트 동작 확인

## 5. 부록: 데이터베이스 세팅 정보

### 공통 일정(국경일) 데이터

- **설명**: 2025년 대한민국 공휴일 정보를 `public_events` 테이블에 삽입
