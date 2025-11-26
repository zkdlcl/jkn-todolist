# JKN-TODOLIST GitHub Issues 생성 스크립트
# PowerShell용

Write-Host "GitHub 이슈 생성을 시작합니다..." -ForegroundColor Green

# Phase 1: 인프라 및 기본 세팅
Write-Host "`n[Phase 1] 인프라 및 기본 세팅 이슈 생성 중..." -ForegroundColor Cyan

gh issue create `
  --title "[Phase 1] BE-01: Node.js/Express 프로젝트 초기화" `
  --label "setup,backend,complexity:low" `
  --body @"
## 📋 Todo
- Express, cors, dotenv, pg, nodemon 설치
- 기본 서버 설정 및 헬스체크 엔드포인트 구현
- 환경변수 설정 (.env 파일)
- PostgreSQL 연결 설정
- 개발 서버 실행 환경 구축

## ✅ 완료 조건
- ``http://localhost:3000/health`` 호출 시 200 OK 응답
- 환경변수를 통한 데이터베이스 연결 설정 완료
- nodemon을 통한 핫 리로드 개발 환경 구축

## 🔧 기술적 고려사항
- **백엔드 프레임워크**: Node.js + Express.js
- **데이터베이스 클라이언트**: pg (PostgreSQL 클라이언트)
- **필수 패키지**:
  - express: 웹 프레임워크
  - cors: CORS 미들웨어
  - dotenv: 환경변수 관리
  - pg: PostgreSQL 클라이언트
  - nodemon: 개발 서버 자동 재시작
- **보안**: CORS 설정, 환경변수 분리
- **개발 편의성**: nodemon으로 코드 변경 시 자동 재시작

## 🔗 의존성
- **선행 작업**: DB-01 (PostgreSQL 데이터베이스 생성 및 스키마 적용) ✅ 완료
- **후행 작업**: BE-02 (사용자 모델 및 리포지토리 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - 제품 요구사항 (8.1 기술 스택)
- ``docs/6-technical-architecture.md`` - 기술 아키텍처
"@

Write-Host "✓ BE-01 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 1] FE-01: React/Vite 프로젝트 초기화" `
  --label "setup,frontend,complexity:low" `
  --body @"
## 📋 Todo
- React 18 + Vite 프로젝트 생성
- axios, zustand, react-router-dom, tailwindcss 설치 및 설정
- Tailwind CSS 초기 설정 (tailwind.config.js)
- 기본 라우팅 구조 설정
- 개발 서버 실행 환경 구축

## ✅ 완료 조건
- ``npm run dev`` 실행 시 개발 서버 정상 작동
- Tailwind CSS 스타일이 정상적으로 적용됨
- 기본 라우팅 구조 확인 가능
- Axios 인스턴스 설정 완료

## 🔧 기술적 고려사항
- **프론트엔드 프레임워크**: React 18 + Vite
- **상태 관리**: Zustand
- **UI 라이브러리**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **라우팅**: react-router-dom
- **필수 패키지**:
  - react: 18.x
  - vite: 최신 버전
  - zustand: 상태 관리
  - axios: HTTP 클라이언트
  - react-router-dom: 라우팅
  - tailwindcss: CSS 프레임워크
- **개발 환경**: Vite의 빠른 HMR(Hot Module Replacement) 활용

## 🔗 의존성
- **선행 작업**: 없음 (독립적으로 진행 가능)
- **후행 작업**: FE-02 (Axios 인터셉터 및 인증 스토어 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - 제품 요구사항 (8.1 기술 스택)
- ``docs/4-project-structure-principles.md`` - 프로젝트 구조 설계 원칙
"@

Write-Host "✓ FE-01 이슈 생성 완료" -ForegroundColor Green

# Phase 2: 사용자 인증
Write-Host "`n[Phase 2] 사용자 인증 이슈 생성 중..." -ForegroundColor Cyan

gh issue create `
  --title "[Phase 2] BE-02: 사용자 모델 및 리포지토리 구현" `
  --label "feature,backend,complexity:medium" `
  --body @"
## 📋 Todo
- UserRepository 클래스 구현
- ``create(email, hashedPassword, name)`` 메서드 구현
- ``findByEmail(email)`` 메서드 구현
- ``findById(userId)`` 메서드 구현
- PostgreSQL 쿼리 작성 및 테스트
- 에러 핸들링 (중복 이메일, DB 연결 오류 등)

## ✅ 완료 조건
- UserRepository의 모든 메서드가 정상 동작
- 중복 이메일 가입 시 적절한 에러 반환
- 데이터베이스 연결 오류 시 에러 핸들링
- 단위 테스트 작성 (선택사항)

## 🔧 기술적 고려사항
- **아키텍처 패턴**: Repository 패턴 적용
- **데이터베이스**: PostgreSQL + pg 클라이언트
- **보안 고려사항**:
  - SQL Injection 방지 (Prepared Statement 사용)
  - 비밀번호는 해싱된 상태로만 저장
- **테이블**: ``users`` 테이블 사용
  - user_id (PK, UUID)
  - email (UNIQUE, NOT NULL)
  - password_hash (NOT NULL)
  - name (NOT NULL)
  - role (기본값: 'ROLE_USER')
  - created_at, updated_at
- **에러 처리**:
  - 중복 이메일: UNIQUE 제약 위반 처리
  - DB 연결 실패: 적절한 에러 메시지 반환

## 🔗 의존성
- **선행 작업**: BE-01 (Node.js/Express 프로젝트 초기화)
- **후행 작업**: BE-03 (인증 서비스 및 컨트롤러 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 1: 사용자 인증 및 계정 관리
- ``docs/5-database-design.md`` - users 테이블 스키마
- ``docs/4-project-structure-principles.md`` - Repository 패턴 가이드
"@

Write-Host "✓ BE-02 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 2] BE-03: 인증 서비스 및 컨트롤러 구현" `
  --label "feature,backend,complexity:high" `
  --body @"
## 📋 Todo
- bcrypt, jsonwebtoken 패키지 설치
- AuthService 클래스 구현:
  - 비밀번호 해싱 (bcrypt)
  - JWT 토큰 발급 (Access Token 15분, Refresh Token 7일)
  - 회원가입 로직
  - 로그인 로직
  - 로그아웃 로직 (Refresh Token 무효화)
- AuthController 구현:
  - POST /auth/register (회원가입)
  - POST /auth/login (로그인)
  - POST /auth/logout (로그아웃)
  - POST /auth/refresh (토큰 갱신)
- JWT 미들웨어 구현 (인증 검증)
- 입력 유효성 검사 (이메일 형식, 비밀번호 정책)

## ✅ 완료 조건
- 회원가입 API가 정상 동작하고 JWT 토큰 반환
- 로그인 API가 이메일/비밀번호 검증 후 토큰 발급
- 로그아웃 시 Refresh Token이 무효화됨
- 비밀번호 정책 준수 (최소 8자, 대소문자+숫자+특수문자)
- 중복 이메일 가입 차단
- JWT 토큰 검증 미들웨어 동작 확인

## 🔧 기술적 고려사항
- **인증 방식**: JWT (JSON Web Token)
  - Access Token: 15분 유효기간
  - Refresh Token: 7일 유효기간
- **비밀번호 보안**: bcrypt 해싱 (salt rounds: 10)
- **필수 패키지**:
  - bcrypt: 비밀번호 해싱
  - jsonwebtoken: JWT 토큰 생성/검증
- **입력 유효성 검사**:
  - 이메일: 정규식 검증
  - 비밀번호: 최소 8자, 대소문자+숫자+특수문자 포함
  - 이름: 1~50자
- **에러 처리**:
  - 401 Unauthorized: 인증 실패
  - 409 Conflict: 중복 이메일
  - 400 Bad Request: 유효성 검사 실패
- **보안**:
  - 비밀번호는 평문으로 저장하지 않음
  - JWT Secret은 환경변수로 관리
  - Refresh Token은 DB에 저장하여 관리

## 🔗 의존성
- **선행 작업**: BE-02 (사용자 모델 및 리포지토리 구현)
- **후행 작업**: FE-02 (Axios 인터셉터 및 인증 스토어 구현), BE-04 (할일 CRUD API 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 1: 사용자 인증 및 계정 관리
- ``docs/3-api-specification.md`` - 인증 API 명세
- ``docs/5-database-design.md`` - users, refresh_tokens 테이블
"@

Write-Host "✓ BE-03 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 2] FE-02: Axios 인터셉터 및 인증 스토어 구현" `
  --label "feature,frontend,complexity:medium" `
  --body @"
## 📋 Todo
- Axios 인스턴스 생성 및 기본 설정
- Axios 요청 인터셉터 구현 (JWT 토큰 자동 포함)
- Axios 응답 인터셉터 구현 (401 에러 시 토큰 갱신)
- Zustand 기반 인증 스토어 구현 (useAuthStore)
  - 상태: user, accessToken, isAuthenticated
  - 액션: login, logout, setUser, refreshToken
- LocalStorage에 토큰 저장/불러오기
- 토큰 만료 시 자동 갱신 로직

## ✅ 완료 조건
- 모든 API 요청에 JWT 토큰이 자동으로 포함됨
- 401 에러 발생 시 토큰 갱신 후 재요청
- 로그인 상태가 페이지 새로고침 후에도 유지됨
- 로그아웃 시 토큰이 제거되고 상태가 초기화됨

## 🔧 기술적 고려사항
- **상태 관리**: Zustand
- **HTTP 클라이언트**: Axios
- **토큰 저장**: LocalStorage (보안 주의)
- **Axios 인터셉터**:
  - 요청 인터셉터: Authorization 헤더에 Bearer 토큰 추가
  - 응답 인터셉터: 401 에러 시 토큰 갱신 시도
- **토큰 갱신 로직**:
  - Access Token 만료 시 Refresh Token으로 새 토큰 발급
  - Refresh Token도 만료된 경우 로그아웃 처리
- **보안 고려사항**:
  - XSS 방지를 위한 토큰 관리
  - HTTPS 환경에서만 토큰 전송 (프로덕션)

## 🔗 의존성
- **선행 작업**:
  - FE-01 (React/Vite 프로젝트 초기화)
  - BE-03 (인증 서비스 및 컨트롤러 구현)
- **후행 작업**: FE-03 (로그인/회원가입 UI 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 1: 사용자 인증
- ``docs/4-project-structure-principles.md`` - 프론트엔드 상태 관리
- ``docs/6-technical-architecture.md`` - 인증 흐름
"@

Write-Host "✓ FE-02 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 2] FE-03: 로그인/회원가입 UI 구현" `
  --label "feature,frontend,complexity:medium" `
  --body @"
## 📋 Todo
- 로그인 페이지 컴포넌트 구현
- 회원가입 페이지 컴포넌트 구현
- 폼 유효성 검사 (이메일 형식, 비밀번호 정책)
- 에러 메시지 표시 (입력 오류, API 에러)
- 로딩 상태 표시
- 인증 API 연동 (회원가입, 로그인)
- 성공 시 메인 페이지로 리다이렉트
- Tailwind CSS를 활용한 반응형 디자인

## ✅ 완료 조건
- 이메일/비밀번호 입력 시 실시간 유효성 검사
- 회원가입 성공 시 자동 로그인 및 메인 페이지 이동
- 로그인 성공 시 메인 페이지 이동
- 에러 발생 시 명확한 메시지 표시
- 중앙 정렬된 폼 레이아웃
- 모바일/데스크톱 반응형 지원

## 🔧 기술적 고려사항
- **UI 라이브러리**: Tailwind CSS
- **폼 관리**: react-hook-form (선택사항) 또는 React 상태 관리
- **유효성 검사**:
  - 이메일: 정규식 검증 (example@domain.com)
  - 비밀번호: 최소 8자, 대소문자+숫자+특수문자 포함
  - 이름: 1~50자
- **UI/UX 요구사항** (PRD 7.2.1):
  - 중앙 정렬된 폼
  - 이메일/비밀번호 입력 필드
  - "로그인" / "회원가입" 버튼
  - 에러 메시지 명확하게 표시
  - 로딩 스피너 표시
- **접근성**:
  - 키보드 네비게이션 지원
  - aria-label 적용

## 🔗 의존성
- **선행 작업**: FE-02 (Axios 인터셉터 및 인증 스토어 구현)
- **후행 작업**: FE-04 (할일 스토어 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 1, UI/UX 요구사항 (7.2.1)
- ``docs/3-user-scenarios.md`` - 시나리오 1: 회원가입 및 할일 추가
- ``docs/4-project-structure-principles.md`` - 컴포넌트 구조
"@

Write-Host "✓ FE-03 이슈 생성 완료" -ForegroundColor Green

# Phase 3: 할일 관리 핵심
Write-Host "`n[Phase 3] 할일 관리 핵심 이슈 생성 중..." -ForegroundColor Cyan

gh issue create `
  --title "[Phase 3] BE-04: 할일 CRUD API 구현" `
  --label "feature,backend,complexity:high" `
  --body @"
## 📋 Todo
- TodoRepository 클래스 구현
  - create, findByUserId, findById, update, softDelete, restore
- TodoService 클래스 구현
  - 비즈니스 로직 (권한 검사, 유효성 검사)
- TodoController 구현:
  - POST /todos (할일 생성)
  - GET /todos (할일 목록 조회 - 필터링/정렬)
  - GET /todos/:id (할일 상세 조회)
  - PATCH /todos/:id (할일 수정)
  - PATCH /todos/:id/complete (완료 토글)
  - DELETE /todos/:id (소프트 삭제)
- JWT 미들웨어를 통한 인증 검증
- 소유자 권한 검사 (본인 할일만 수정/삭제)

## ✅ 완료 조건
- 모든 CRUD API 엔드포인트가 정상 동작
- 인증된 사용자만 접근 가능
- 소유자만 자신의 할일 수정/삭제 가능
- 제목 필수 입력 (1~200자)
- 만료 일시는 시작 일시보다 이후여야 함
- 우선순위 선택 (LOW, MEDIUM, HIGH)
- 완료 시 완료 일시 자동 기록
- 삭제 시 deleted_status='DELETED'로 변경 (소프트 삭제)
- 필터링/정렬 기능 동작 (우선순위, 완료 여부, 만료일 등)

## 🔧 기술적 고려사항
- **아키텍처**: Repository → Service → Controller 계층 구조
- **데이터베이스**: todos 테이블 사용
  - todo_id (PK, UUID)
  - user_id (FK, users 테이블)
  - title (NOT NULL, 1~200자)
  - description (TEXT)
  - start_datetime, end_datetime
  - priority (LOW, MEDIUM, HIGH)
  - is_completed (BOOLEAN)
  - completed_at (TIMESTAMP)
  - deleted_status (ACTIVE, DELETED)
- **비즈니스 로직**:
  - 제목 필수, 1~200자
  - end_datetime >= start_datetime
  - 완료 토글 시 completed_at 자동 설정/해제
  - 소프트 삭제 (deleted_status = 'DELETED')
- **권한 검사**:
  - JWT 토큰으로 사용자 인증
  - user_id로 소유자 검증
- **필터링/정렬**:
  - 필터: priority, is_completed, deleted_status
  - 정렬: end_datetime, priority, created_at

## 🔗 의존성
- **선행 작업**: BE-03 (인증 서비스 및 컨트롤러 구현)
- **후행 작업**: FE-04 (할일 스토어 구현), BE-05 (휴지통 API 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 2: 할일 관리 (CRUD)
- ``docs/3-api-specification.md`` - 할일 API 명세
- ``docs/5-database-design.md`` - todos 테이블 스키마
"@

Write-Host "✓ BE-04 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 3] FE-04: 할일 스토어 구현" `
  --label "feature,frontend,complexity:medium" `
  --body @"
## 📋 Todo
- Zustand 기반 할일 스토어 구현 (useTodoStore)
- 상태 관리:
  - todos: 할일 목록
  - filter: 필터 상태 (우선순위, 완료 여부)
  - sortBy: 정렬 기준
  - isLoading, error
- 액션 구현:
  - fetchTodos: 할일 목록 조회
  - createTodo: 할일 생성
  - updateTodo: 할일 수정
  - toggleComplete: 완료 토글
  - deleteTodo: 할일 삭제 (소프트 삭제)
  - setFilter, setSortBy
- API 연동 (Axios 사용)
- 낙관적 업데이트 (Optimistic Update) 적용

## ✅ 완료 조건
- 모든 할일 CRUD 액션이 정상 동작
- API 요청 중 로딩 상태 표시
- 에러 발생 시 적절한 처리
- 필터링/정렬이 즉시 반영됨
- 완료 토글 시 UI가 즉시 업데이트됨 (낙관적 업데이트)

## 🔧 기술적 고려사항
- **상태 관리**: Zustand
- **HTTP 클라이언트**: Axios (FE-02에서 설정한 인스턴스 사용)
- **상태 구조**:
  \`\`\`typescript
  {
    todos: Todo[],
    filter: { priority?: string, isCompleted?: boolean },
    sortBy: 'end_datetime' | 'priority' | 'created_at',
    isLoading: boolean,
    error: string | null
  }
  \`\`\`
- **낙관적 업데이트**:
  - 완료 토글, 삭제 등 즉각적인 피드백이 필요한 액션에 적용
  - API 실패 시 롤백 처리
- **에러 처리**:
  - 401: 로그인 페이지로 리다이렉트
  - 403: 권한 없음 메시지
  - 404: 할일을 찾을 수 없음
  - 500: 서버 오류 메시지

## 🔗 의존성
- **선행 작업**:
  - FE-02 (Axios 인터셉터 및 인증 스토어 구현)
  - BE-04 (할일 CRUD API 구현)
- **후행 작업**: FE-05 (할일 목록 및 아이템 컴포넌트 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 2: 할일 관리
- ``docs/4-project-structure-principles.md`` - 상태 관리 패턴
- ``docs/6-technical-architecture.md`` - 데이터 흐름
"@

Write-Host "✓ FE-04 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 3] FE-05: 할일 목록 및 아이템 컴포넌트 구현" `
  --label "feature,frontend,complexity:medium" `
  --body @"
## 📋 Todo
- TodoList 컴포넌트 구현 (할일 목록 컨테이너)
- TodoItem 컴포넌트 구현 (개별 할일 카드)
- 필터링 UI (우선순위, 완료 여부)
- 정렬 UI (만료일, 우선순위, 생성일)
- 완료 토글 체크박스
- 우선순위 배지 표시
- 만료일 강조 표시 (임박한 경우 경고색)
- 수정/삭제 아이콘 버튼
- 빈 상태 UI (할일이 없을 때)
- Tailwind CSS 스타일링

## ✅ 완료 조건
- 할일 목록이 카드 형태로 표시됨
- 필터/정렬이 즉시 적용됨
- 완료 체크박스 토글 시 상태 변경
- 우선순위별 색상 배지 표시 (HIGH: 빨강, MEDIUM: 주황, LOW: 회색)
- 만료 임박 시 경고 표시 (24시간 내)
- 수정/삭제 버튼 클릭 가능
- 할일이 없을 때 안내 메시지 표시
- 반응형 레이아웃 (모바일/데스크톱)

## 🔧 기술적 고려사항
- **UI 라이브러리**: Tailwind CSS
- **컴포넌트 구조**:
  - TodoList (컨테이너)
    - FilterBar (필터/정렬 UI)
    - TodoItem (개별 할일 카드) x N
    - EmptyState (빈 상태)
- **UI/UX 요구사항** (PRD 7.2.2):
  - 체크박스 (완료 여부)
  - 제목 (클릭 시 상세)
  - 만료 일시 (강조)
  - 우선순위 배지
  - 수정/삭제 아이콘
- **색상 팔레트** (PRD 7.4):
  - Primary: #3B82F6 (파랑)
  - Success: #10B981 (초록) - 완료
  - Warning: #F59E0B (주황) - 만료 임박
  - Danger: #EF4444 (빨강) - HIGH 우선순위, 삭제
- **접근성**:
  - 체크박스 키보드 접근 가능
  - aria-label 적용

## 🔗 의존성
- **선행 작업**: FE-04 (할일 스토어 구현)
- **후행 작업**: FE-06 (할일 추가/수정 모달 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - UI/UX 요구사항 (7.2.2)
- ``docs/3-user-scenarios.md`` - 시나리오 2: 할일 완료
- ``docs/4-project-structure-principles.md`` - 컴포넌트 설계
"@

Write-Host "✓ FE-05 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 3] FE-06: 할일 추가/수정 모달 구현" `
  --label "feature,frontend,complexity:medium" `
  --body @"
## 📋 Todo
- TodoModal 컴포넌트 구현 (할일 추가/수정 모달)
- 모달 상태 관리 (열기/닫기)
- 입력 필드 구현:
  - 제목 (필수, 1~200자)
  - 내용 (선택)
  - 시작 일시
  - 만료 일시
  - 우선순위 선택 (LOW, MEDIUM, HIGH)
- 폼 유효성 검사
- 에러 메시지 표시
- 저장/취소 버튼
- ESC 키로 닫기
- 모달 외부 클릭 시 닫기
- API 연동 (할일 생성/수정)

## ✅ 완료 조건
- "새 할일 추가" 버튼 클릭 시 모달 열림
- 할일 아이템 수정 버튼 클릭 시 기존 데이터로 모달 열림
- 제목 필수 입력 검증 (1~200자)
- 만료 일시가 시작 일시보다 이후인지 검증
- 저장 시 API 호출 및 목록 업데이트
- ESC 키 또는 외부 클릭으로 모달 닫기
- 중앙 팝업 모달 레이아웃

## 🔧 기술적 고려사항
- **UI 라이브러리**: Tailwind CSS
- **모달 구현**: React Portal 사용 (선택사항) 또는 CSS로 구현
- **폼 관리**: React 상태 관리 또는 react-hook-form
- **유효성 검사**:
  - 제목: 필수, 1~200자
  - end_datetime >= start_datetime
  - 우선순위: LOW, MEDIUM, HIGH 중 선택
- **UI/UX 요구사항** (PRD 7.2.3):
  - 중앙 팝업 모달
  - 입력 필드: 제목(필수), 내용(선택), 시작/만료 일시, 우선순위
  - "저장" / "취소" 버튼
- **접근성**:
  - 모달 열릴 때 포커스 이동
  - ESC 키로 닫기
  - 키보드 트랩 (모달 내에서만 탭 이동)

## 🔗 의존성
- **선행 작업**: FE-05 (할일 목록 및 아이템 컴포넌트 구현)
- **후행 작업**: FE-07 (휴지통 페이지 UI 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - UI/UX 요구사항 (7.2.3)
- ``docs/3-user-scenarios.md`` - 시나리오 1: 할일 추가
- ``docs/4-project-structure-principles.md`` - 컴포넌트 설계
"@

Write-Host "✓ FE-06 이슈 생성 완료" -ForegroundColor Green

# Phase 4: 휴지통 및 마무리
Write-Host "`n[Phase 4] 휴지통 및 마무리 이슈 생성 중..." -ForegroundColor Cyan

gh issue create `
  --title "[Phase 4] BE-05: 휴지통 조회 및 복구 API 구현" `
  --label "feature,backend,complexity:low" `
  --body @"
## 📋 Todo
- TodoController에 휴지통 관련 엔드포인트 추가:
  - GET /todos/trash (휴지통 조회)
  - PATCH /todos/:id/restore (할일 복구)
  - DELETE /todos/:id/permanent (영구 삭제 - 선택사항)
- TodoRepository에 복구/영구삭제 메서드 추가
- 권한 검사 (본인 할일만 복구/삭제)
- 복구 시 deleted_status='ACTIVE'로 변경
- 영구 삭제 시 DB에서 완전히 제거

## ✅ 완료 조건
- 휴지통 조회 API가 deleted_status='DELETED'인 할일만 반환
- 소유자만 자신의 휴지통 조회 가능
- 복구 API 호출 시 할일이 활성 상태로 복원
- 복구된 할일의 모든 속성이 유지됨
- 영구 삭제 시 DB에서 완전히 제거

## 🔧 기술적 고려사항
- **데이터베이스**: todos 테이블의 deleted_status 컬럼 사용
  - 'ACTIVE': 활성 할일
  - 'DELETED': 삭제된 할일 (휴지통)
- **비즈니스 로직**:
  - 휴지통 조회: WHERE deleted_status = 'DELETED' AND user_id = ?
  - 복구: UPDATE todos SET deleted_status = 'ACTIVE' WHERE todo_id = ?
  - 영구 삭제: DELETE FROM todos WHERE todo_id = ?
- **권한 검사**:
  - JWT 토큰으로 사용자 인증
  - user_id로 소유자 검증
- **에러 처리**:
  - 404: 할일을 찾을 수 없음
  - 403: 권한 없음

## 🔗 의존성
- **선행 작업**: BE-04 (할일 CRUD API 구현)
- **후행 작업**: FE-07 (휴지통 페이지 UI 구현)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 3: 휴지통 관리
- ``docs/3-api-specification.md`` - 휴지통 API 명세
- ``docs/5-database-design.md`` - todos 테이블 스키마
"@

Write-Host "✓ BE-05 이슈 생성 완료" -ForegroundColor Green

gh issue create `
  --title "[Phase 4] FE-07: 휴지통 페이지 UI 구현" `
  --label "feature,frontend,complexity:low" `
  --body @"
## 📋 Todo
- TrashPage 컴포넌트 구현
- 삭제된 할일 목록 표시
- 각 할일마다 "복구" / "영구 삭제" 버튼
- 일괄 비우기 버튼 (선택사항)
- 확인 모달 (영구 삭제 시)
- 빈 상태 UI (휴지통이 비어있을 때)
- 휴지통 API 연동
- 사이드바 메뉴에 휴지통 링크 추가

## ✅ 완료 조건
- 휴지통 페이지에 삭제된 할일 목록 표시
- "복구" 버튼 클릭 시 할일이 목록으로 복원
- "영구 삭제" 버튼 클릭 시 확인 모달 표시 후 삭제
- 영구 삭제 후 복구 불가 안내
- 휴지통이 비어있을 때 안내 메시지
- 반응형 레이아웃

## 🔧 기술적 고려사항
- **UI 라이브러리**: Tailwind CSS
- **라우팅**: react-router-dom (/trash 경로)
- **컴포넌트 구조**:
  - TrashPage (컨테이너)
    - TrashItem (삭제된 할일 카드) x N
    - ConfirmModal (영구 삭제 확인)
    - EmptyState (빈 상태)
- **UI/UX 요구사항** (PRD 7.2.4):
  - 삭제된 할일 목록
  - 각 항목마다 "복구" / "영구 삭제" 버튼
  - 일괄 비우기 버튼
- **확인 모달**:
  - "정말 영구 삭제하시겠습니까?" 메시지
  - "영구 삭제 후 복구할 수 없습니다" 경고
  - "확인" / "취소" 버튼
- **접근성**:
  - 위험한 작업(영구 삭제)은 확인 절차 필수

## 🔗 의존성
- **선행 작업**: BE-05 (휴지통 조회 및 복구 API 구현)
- **후행 작업**: 없음 (MVP 완료)

## 📚 참고 문서
- ``docs/7-implementation_plan.md`` - 실행 계획
- ``docs/2-prd-product-requirements.md`` - Feature 3: 휴지통 관리, UI/UX 요구사항 (7.2.4)
- ``docs/3-user-scenarios.md`` - 시나리오 2: 휴지통 사용
- ``docs/4-project-structure-principles.md`` - 페이지 구조
"@

Write-Host "✓ FE-07 이슈 생성 완료" -ForegroundColor Green

Write-Host "`n================================================" -ForegroundColor Yellow
Write-Host "모든 GitHub 이슈 생성이 완료되었습니다!" -ForegroundColor Green
Write-Host "총 11개의 이슈가 생성되었습니다." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Yellow

Write-Host "`n생성된 이슈 확인:" -ForegroundColor Cyan
Write-Host "gh issue list" -ForegroundColor White
