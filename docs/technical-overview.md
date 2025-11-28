# JKN-TODOLIST 프로젝트 기술적 요약

## 1. 프로젝트 개요

JKN-TODOLIST는 개인 할일과 공통 일정을 통합 관리하는 스마트 할일 관리 애플리케이스입니다. 이 프로젝트는 2025년 11월 28일 기준으로 완성된 상태로, 2일 내 MVP 출시를 목표로 개발되었습니다.

### 핵심 기능
- 사용자 인증 (회원가입, 로그인)
- 할일 관리 (CRUD, 필터링, 정렬)
- 휴지통 (삭제 복구, 영구 삭제)
- 달력 뷰 (확장 기능 개발 완료)
- 국경일 API 연동 (확장 기능 개발 완료)
- 알림 시스템 (브라우저 alert 대체)

---

## 2. 아키텍처

### 2.1. 기술 스택
- **Frontend**: React 18 + Vite, Zustand (상태 관리), Tailwind CSS, SweetAlert2 (알림 시스템), React Router, React Hook Form, date-fns
- **Backend**: Node.js + Express, PostgreSQL (Supabase), JWT (인증), bcrypt (비밀번호 해싱)
- **Testing**: Jest + Supertest
- **Documentation**: Swagger (OpenAPI 3.0)

### 2.2. 폴더 구조
```
jkn-todolist/
├── client/                 # 프론트엔드 React 애플리케이션
│   ├── public/
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── pages/          # 라우팅 페이지
│   │   ├── stores/         # Zustand 스토어
│   │   ├── services/       # API 통신
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── utils/          # 유틸리티 함수
│   │   └── styles/         # 스타일 파일
│   └── ...
├── server/                 # 백엔드 Express 서버
│   ├── src/
│   │   ├── config/         # 환경 설정
│   │   ├── controllers/    # HTTP 요청 처리
│   │   ├── services/       # 비즈니스 로직
│   │   ├── repositories/   # DB 작업
│   │   ├── routes/         # API 라우팅
│   │   ├── middlewares/    # 미들웨어
│   │   └── utils/          # 유틸리티 함수
│   ├── index.js            # 서버 진입점
│   └── ...
├── database/               # 데이터베이스 관련 파일
│   └── schema.sql          # DB 스키마
├── swagger/                # API 문서
│   └── swagger.json        # Swagger 명세
└── docs/                   # 프로젝트 문서
```

---

## 3. 데이터베이스 설계

### 3.1. 테이블 구조

#### 3.1.1. users 테이블
- id: SERIAL (PK)
- email: VARCHAR(255) NOT NULL UNIQUE
- password_hash: VARCHAR(255) NOT NULL
- name: VARCHAR(100) NOT NULL
- role: VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN'))
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

#### 3.1.2. todos 테이블
- id: SERIAL (PK)
- user_id: INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- title: VARCHAR(200) NOT NULL
- content: TEXT
- start_date: TIMESTAMP
- due_date: TIMESTAMP
- priority: VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'))
- is_completed: BOOLEAN DEFAULT FALSE
- completed_at: TIMESTAMP
- deleted_status: VARCHAR(10) DEFAULT 'ACTIVE' CHECK (deleted_status IN ('ACTIVE', 'DELETED'))
- deleted_at: TIMESTAMP
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

#### 3.1.3. refresh_tokens 테이블
- id: SERIAL (PK)
- user_id: INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- token: VARCHAR(512) NOT NULL
- expires_at: TIMESTAMP NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()

#### 3.1.4. public_events 테이블
- id: SERIAL (PK)
- title: VARCHAR(200) NOT NULL
- date: DATE NOT NULL
- type: VARCHAR(20) DEFAULT 'HOLIDAY' CHECK (type IN ('HOLIDAY', 'NOTICE', 'SOLAR_TERM', 'SEASONAL_DAY'))
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

### 3.2. 인덱스
- idx_users_email ON users(email)
- idx_todos_user_id ON todos(user_id)
- idx_todos_deleted_status ON todos(deleted_status)
- idx_refresh_tokens_token ON refresh_tokens(token)
- idx_refresh_tokens_user_id ON refresh_tokens(user_id)

### 3.3. 트리거
- update_users_updated_at: 사용자 테이블 갱신 시 updated_at 자동 갱신
- update_todos_updated_at: 할일 테이블 갱신 시 updated_at 자동 갱신
- update_public_events_updated_at: 공공 이벤트 테이블 갱신 시 updated_at 자동 갱신

---

## 4. API 설계

### 4.1. 인증 API
- POST /api/auth/signup - 회원가입
- POST /api/auth/login - 로그인
- POST /api/auth/logout - 로그업 (인증 필요)

### 4.2. 할일 API
- GET /api/todos - 할일 목록 조회
- POST /api/todos - 할일 생성
- GET /api/todos/:id - 할일 상세 조회
- PATCH /api/todos/:id - 할일 수정
- DELETE /api/todos/:id - 할일 삭제 (Soft Delete)

### 4.3. 휴지통 API
- GET /api/todos/trash/all - 휴지통 목록 조회
- PATCH /api/todos/:id/restore - 할일 복구
- DELETE /api/todos/:id/permanent - 할일 영구 삭제

### 4.4. 달력 API
- GET /api/calendar/:year/:month - 달력 데이터 조회 (할일 및 공공 일정)

### 4.5. 동기화 API (관리자용)
- POST /api/sync/holidays - 공휴일 데이터 동기화

### 4.6. 자동 스케줄 API
- GET /api/cron/weekly-sync - 주간 동기화 (올해 데이터 갱신)
- GET /api/cron/annual-sync - 연간 동기화 (내후년 데이터 확보)

---

## 5. 주요 기술 구현

### 5.1. 인증 시스템
- JWT 토큰 기반 인증
- Refresh 토큰 관리
- bcrypt를 통한 비밀번호 10라운드 해싱

### 5.2. Soft Delete 구현
- 할일 삭제 시 실제로 레코드 삭제하지 않고 deleted_status를 DELETED로 변경
- 복구 기능: deleted_status를 ACTIVE로 변경하여 복구
- 영구 삭제 기능: 실제로 DB에서 레코드 삭제

### 5.3. 외부 API 통합
- KASI API (한국천문연구원 특일 정보) 연동
- 공휴일 데이터 자동 동기화 기능
- 주간 및 연간 동기화 스케줄러

### 5.4. 달력 기능
- react-big-calendar을 통한 달력 뷰 구현
- 사용자 할일과 공공 일정 통합 표시

### 5.5. 상태 관리
- 프론트엔드: Zustand를 통한 전역 상태 관리
- 백엔드: 비즈니스 로직과 데이터 접근 계층 분리

---

## 6. 배포 및 운영

### 6.1. 배포 환경
- Frontend: Vercel
- Backend: Vercel Serverless Functions
- Database: Supabase (PostgreSQL)

### 6.2. 환경 변수
- PORT: 서버 포트 (기본값 3000)
- DATABASE_URL: PostgreSQL 연결 문자열
- JWT_SECRET: JWT 서명 키
- JWT_REFRESH_SECRET: Refresh Token 서명 키
- KASI_API_KEY: KASI API 인증 키
- KASI_API_BASE_URL: KASI API 기본 URL

### 6.3. 자동화
- Vercel Cron을 통한 주기적 공휴일 동기화
- node-cron 라이브러리 사용

---

## 7. 테스트 전략

### 7.1. 목표
- 전체 코드 커버리지: 70%
- 단위 테스트: 70% (비즈니스 로직, 유틸리티)
- 통합 테스트: 20% (API 엔드포인트)
- E2E 테스트: 10% (주요 사용자 흐름)

### 7.2. 테스트 도구
- Jest: JavaScript 테스트 프레임워크
- Supertest: Express API 테스트

### 7.3. 주요 테스트 대상
- API 엔드포인트 응답 검증
- 인증 로직 테스트
- 데이터베이스 연동 테스트
- 비즈니스 로직 단위 테스트

---

## 8. 유지보수 포인트

### 8.1. 주의해야 할 부분
- 데이터 무결성 유지 (Soft Delete 제대로 구현)
- 보안 취약점 방지 (JWT, SQL Injection 등)
- API 일관성 유지 (Swagger와 실제 구현 일치)
- 백엔드/프론트엔드 인터페이스 일관성

### 8.2. 성능 최적화 포인트
- DB 쿼리 최적화
- 불필요한 API 호출 제거
- 캐싱 전략 적용 가능 여부

### 8.3. 확장성 고려
- 모듈화된 아키텍처 유지
- 새로운 기능 추가를 위한 확장 가능 구조
- 외부 서비스 통합을 위한 유연한 설계