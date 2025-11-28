# JKN-TODOLIST 프로젝트 유지보수를 위한 학습 가이드

## 1. 프로젝트 개요

JKN-TODOLIST는 개인 할일과 공통 일정을 통합 관리하는 스마트 할일 관리 애플리케이션입니다. 이 프로젝트는 2일 내 MVP 출시를 목표로 개발되었습니다.

### 주요 기능
- 사용자 인증 (회원가입, 로그인)
- 할일 관리 (CRUD, 필터링, 정렬)
- 휴지통 (삭제 복구, 영구 삭제)
- 달력 뷰 (확장 기능 개발 완료)
- 국경일 API 연동 (확장 기능 개발 완료)
- 알림 시스템 (브라우저 alert 대체)

---

## 2. 프로젝트 아키텍처

### 기술 스택
- **Frontend**: React 18 + Vite, Zustand (상태 관리), Tailwind CSS, SweetAlert2, React Router, React Hook Form, date-fns
- **Backend**: Node.js + Express, PostgreSQL (Supabase), JWT (인증), bcrypt (비밀번호 해싱)
- **Testing**: Jest + Supertest

### 프론트엔드 구조
```
client/
├── public/
├── src/
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── pages/          # 라우팅되는 페이지 컴포넌트
│   ├── stores/         # Zustand 상태 관리 스토어
│   ├── services/       # API 호출 로직
│   ├── utils/          # 유틸리티 함수
│   ├── hooks/          # 커스텀 React 훅
│   ├── styles/         # 스타일 관련 파일
│   └── App.jsx         # 루트 컴포넌트
├── package.json
└── vite.config.js
```

### 백엔드 구조
```
server/
├── src/
│   ├── config/         # 환경 설정 파일
│   ├── controllers/    # HTTP 요청/응답 처리
│   ├── services/       # 비즈니스 로직
│   ├── repositories/   # 데이터베이스 작업
│   ├── routes/         # API 라우팅
│   ├── middlewares/    # 미들웨어 (인증, 검증 등)
│   ├── cron/           # 주기적 작업 스케줄러
│   └── utils/          # 유틸리티 함수
├── swagger/
│   └── swagger.json    # API 명세서
├── index.js            # 서버 진입점
└── package.json
```

---

## 3. 유지보수를 위해 학습해야 할 기술 및 개념

### 3.1. 프론트엔드 (React 기반)

#### 3.1.1. React 기초
- **리액트 핵심 개념**: 컴포넌트, props, state, 라이프사이클
- **훅 (Hooks)**: useState, useEffect, useRef, useCallback, useMemo
- **함수형 컴포넌트 vs 클래스 컴포넌트**
- **JSX 문법 및 이벤트 처리**

#### 3.1.2. 상태 관리
- **Zustand**: 간단한 상태 관리 라이브러리
  - 스토어 생성 및 사용법
  - 상태 업데이트 로직
  - 미들웨어 사용법 (devtools 등)

#### 3.1.3. 라우팅
- **React Router DOM**: 페이지 이동 및 URL 파라미터 처리
  - Routes, Route, Link 컴포넌트
  - useNavigate, useParams 훅
  - Private Route 구현

#### 3.1.4. 비동기 처리
- **API 호출**: axios 또는 fetch 사용법
- **에러 처리**: try-catch 및 Promise 체이닝
- **로딩 상태 관리**

#### 3.1.5. UI 라이브러리
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **SweetAlert2**: 사용자 친화적인 알림 시스템
- **React Big Calendar**: 달력 뷰 구현

#### 3.1.6. 폼 관리
- **React Hook Form**: 폼 데이터 관리 및 검증

#### 3.1.7. 날짜/시간 처리
- **date-fns**: 날짜 관련 로직 처리
  - 날짜 파싱, 포맷, 연산 등

### 3.2. 백엔드 (Node.js/Express 기반)

#### 3.2.1. Node.js 기초
- **Node.js 핵심 개념**: 이벤트 루프, Non-blocking I/O
- **모듈 시스템**: require, import/export
- **npm/package.json**: 패키지 관리

#### 3.2.2. Express.js
- **Express 라우팅**: API 엔드포인트 정의
- **미들웨어**: 요청/응답 처리 중간단계
- **에러 처리**: 전역 에러 핸들러

#### 3.2.3. 데이터베이스 (PostgreSQL)
- **SQL 기초**: SELECT, INSERT, UPDATE, DELETE
- **관계형 데이터베이스**: JOIN, 인덱스, 트랜잭션
- **PostgreSQL**: 고급 기능, PL/pgSQL 트리거
- **Supabase**: 호스팅 PostgreSQL 서비스

#### 3.2.4. 인증 및 보안
- **JWT (JSON Web Token)**: 세션 없는 인증
- **bcrypt**: 비밀번호 해싱 (10라운드)
- **CORS, SQL Injection 방지**: 보안 최적화

#### 3.2.5. 환경 변수 관리
- **dotenv**: 민감한 정보 관리

#### 3.2.6. API 문서화
- **Swagger (OpenAPI)**: API 명세서 작성 및 문서화

#### 3.2.7. 자동화 작업
- **node-cron**: 주기적 작업 스케줄러
- **Vercel Cron Jobs**: 서버리스 환경에서 주기적 작업

### 3.3. 테스팅

#### 3.3.1. 단위 테스트
- **Jest**: JavaScript 테스트 프레임워크
- **단위 테스트 작성**: 함수, 유틸리티, 컴포넌트 테스트

#### 3.3.2. 통합 테스트
- **Supertest**: Express API 테스트
- **API 엔드포인트 테스트**: 응답 검증, 상태 코드 확인

#### 3.3.3. 테스트 커버리지
- **목표**: 70% 커버리지
- **단위 테스트**: 70% (비즈니스 로직, 유틸리티)
- **통합 테스트**: 20% (API 엔드포인트)
- **E2E 테스트**: 10% (주요 사용자 흐름)

---

## 4. 유지보수 시 주의사항

### 4.1. 코드 컨벤션
- **명명 규칙**:
  - 변수/함수: `camelCase`
  - 클래스/컴포넌트: `PascalCase`
  - 상수: `UPPER_SNAKE_CASE`
  - 파일/디렉토리: `kebab-case`
- **주석**: 중요한 로직에만 설명 추가
- **가독성**: 코드는 다른 사람이 쉽게 이해할 수 있도록 작성

### 4.2. 데이터 무결성
- **Soft Delete**: 할일 삭제 시 실제 DB 레코드는 유지 (deleted_status 필드 사용)
- **외래 키 제약**: 데이터 관계 보장
- **UNIQUE 제약**: 중복 방지

### 4.3. 보안
- **입력 검증**: 모든 사용자 입력 검증
- **SQL Injection 방지**: 파라미터 바인딩 사용
- **JWT 토큰 관리**: 적절한 만료 시간 및 갱신
- **비밀번호 해싱**: bcrypt로 10라운드 해싱

### 4.4. 성능
- **DB 인덱스**: 자주 검색하는 필드에 인덱스 생성
- **API 최적화**: 불필요한 쿼리 최소화
- **응답 시간**: P95 기준 500ms 이내 목표

### 4.5. 오류 처리
- **에러 코드**: 명확한 에러 코드 사용
- **로그 기록**: 시스템 오류 추적을 위한 로깅
- **사용자 피드백**: 사용자에게 친절한 오류 메시지 제공

---

## 5. 실무에서 자주 사용하는 패턴

### 5.1. MVC 패턴 (Model-View-Controller)
- **백엔드**: Controller → Service → Repository 패턴
- **프론트엔드**: Component → Store (State) → Service (API) 패턴

### 5.2. 미들웨어 패턴
- **인증 미들웨어**: 각 요청에 대한 사용자 인증
- **로깅 미들웨어**: 요청/응답 로깅
- **오류 처리 미들웨어**: 전역 오류 처리

### 5.3. 상태 관리 패턴
- **Zustand**: 상태를 중앙에서 관리하여 컴포넌트 간 데이터 공유
- **Context API**: 간단한 전역 상태 관리

---

## 6. 학습 계획 제안

### 주 1-2: JavaScript 및 React 기초 복습
- JavaScript ES6+ 문법
- React Hooks (useState, useEffect 등)
- 컴포넌트 설계 및 통신

### 주 3-4: 상태 관리 및 라우팅
- Zustand 상태 관리
- React Router DOM 사용법
- 프로젝트 구조 이해

### 주 5-6: 비동기 처리 및 API 통신
- API 호출 구조
- 에러 처리 및 로딩 상태 관리
- 데이터 흐름 이해

### 주 7-8: 백엔드 기초
- Node.js 및 Express 이해
- REST API 설계 원칙
- 데이터베이스 연동

### 주 9-10: 보안 및 테스팅
- 인증 및 권한 관리
- JWT 토큰 처리
- 단위 테스트 작성

### 주 11-12: 유지보수 실습
- 실제 코드 개선
- 버그 수정 실습
- 성능 개선

---

## 7. 참고 자료

### 7.1. 공식 문서
- React: [https://react.dev](https://react.dev)
- Zustand: [https://docs.pmnd.rs/zustand/getting-started/introduction](https://docs.pmnd.rs/zustand/getting-started/introduction)
- Express: [https://expressjs.com/](https://expressjs.com/)
- PostgreSQL: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
- Swagger: [https://swagger.io/specification/](https://swagger.io/specification/)

### 7.2. 학습 사이트
- MDN Web Docs: [https://developer.mozilla.org/](https://developer.mozilla.org/)
- Node.js 교과서: [https://nodejs.org/en](https://nodejs.org/en)
- PostgreSQL 튜토리얼: [https://www.postgresqltutorial.com/](https://www.postgresqltutorial.com/)

### 7.3. 강의 추천
- React: 인프런, Udemy의 React 기본 강의
- Node.js: 인프런의 Node.js 교과서
- PostgreSQL: edwith의 데이터베이스 강의