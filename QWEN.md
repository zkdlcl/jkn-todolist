# JKN-TODOLIST Project Context

## 반드시 지켜야 할 것

- 모든 입출력은 한국어로 할 것
- 오버엔지니어링 금지

## Project Overview

JKN-TODOLIST는 개인 할일과 공통 일정을 통합 관리하는 스마트 할일 관리 애플리케이션입니다. 2일 내 MVP 출시를 목표로 개발되었습니다.

### 핵심 기능

- 사용자 인증 (회원가입, 로그인)
- 할일 관리 (CRUD, 필터링, 정렬)
- 휴지통 (삭제 복구, 영구 삭제)
- 달력 뷰 (확장 기능 개발 완료)
- 국경일 API 연동 (확장 기능 개발 완료)
- 알림 시스템 (브라우저 alert 대체)
- 알림 발생 액션 개선 (MVP 테스트 방해 방지)

## 기술 스택

### Frontend

- React 18 + Vite
- Zustand (상태 관리)
- Tailwind CSS
- SweetAlert2 (알림 시스템)
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

## 개발 컨벤션

### 코드 구조

프로젝트는 명확한 관심사 분리를 가진 계층화 아키텍처를 따릅니다:

- 컨트롤러: HTTP 요청/응답 처리
- 서비스: 비즈니스 로직 구현
- 리포지토리: 데이터베이스 작업 처리
- 미들웨어: 인증, 검증, 오류 처리

### 상태 관리

- React 컴포넌트에서 Zustand 사용
- 스토어는 기본 가져오기 사용 (예: `import useTodoStore from '../stores/useTodoStore'`)
- 컴포넌트 내에서 직접 스토어 훅의 필요한 함수와 상태 분해
- 모든 날짜 관련 기능은 적절한 로케일 설정과 함께 date-fns를 사용하여 지역화되어야 함

### 명명 규칙

- 변수와 함수: `camelCase`
- 클래스와 컴포넌트: `PascalCase`
- 상수: `UPPER_SNAKE_CASE`
- 파일과 디렉토리: `kebab-case`

### 테스트 전략

- 목표: 70% 코드 커버리지
- 단위 테스트: 70% (비즈니스 로직, 유틸리티)
- 통합 테스트: 20% (API 엔드포인트)
- E2E 테스트: 10% (주요 사용자 흐름)

## 주요 요구사항

### 기능 요구사항

1. 이메일/비밀번호를 사용한 사용자 등록 및 로그인
2. 할일 CRUD 작업 (생성, 읽기, 수정, 삭제)
3. 휴지통 기능을 통한 소프트 삭제
4. 할일 완료 토글
5. 우선순위 관리 (LOW/MEDIUM/HIGH)
6. 시작/마감 날짜를 포함한 날짜/시간 관리
7. 공공일정 관리 (관리자 전용)
8. 할일 필터링 및 정렬
9. 할일과 공공일정을 시각화하는 달력 뷰 (react-big-calendar 통합)

### 보안 요구사항

- bcrypt를 사용한 10라운드 비밀번호 해싱
- 올바른 만료 기간을 가진 JWT 토큰
- 입력 검증 및 정화
- SQL 인젝션 방지
- CORS 구성
- 요청 제한

### 비기능 요구사항

- API 응답 시간: P95 < 500ms
- 100명의 동시 사용자 지원
- 99% 시스템 가용성
- 70% 테스트 커버리지
- 운영 환경에서 HTTPS 강제 적용
