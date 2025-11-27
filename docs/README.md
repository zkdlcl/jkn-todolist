# 문서 인덱스 (Documentation Index)

> 이 문서는 JKN-TODOLIST 프로젝트의 모든 문서를 한눈에 볼 수 있도록 정리한 인덱스입니다.

---

## 📂 문서 구조

```
docs/
├── 기본 개발 문서 (0-8)      # MVP 개발 관련
├── API/                      # 외부 API 연동
├── extentions/               # 확장 기능
├── debug-records/            # 디버깅 기록
├── etc-records/              # 기타 기록
└── wireframes/               # 와이어프레임 이미지
```

---

## 📖 기본 개발 문서 (MVP)

### 0. 도메인 정의 요청서

**파일**: `0-domain-definition-request.md`

도메인 정의서 작성을 위한 초기 요청 문서

### 1. 도메인 정의서

**파일**: `1-domain-definition.md`

비즈니스 용어, 규칙, 엔티티 정의

**주요 내용**:

- 핵심 도메인 개념
- 비즈니스 규칙
- 엔티티 및 속성 정의

### 2. PRD (제품 요구사항 명세서)

**파일**: `2-prd-product-requirements.md`

제품의 기능 명세 및 요구사항

**주요 내용**:

- 제품 비전 및 목표
- 기능 목록 (Feature 1-3)
- UI/UX 요구사항
- 기술 요구사항

### 3. 사용자 시나리오

**파일**: `3-user-scenarios.md`

사용자 관점에서의 기능 사용 흐름

**주요 시나리오**:

- 회원가입 및 로그인
- 할일 생성 및 관리
- 휴지통 사용
- 달력 사용 (확장)

### 4. 프로젝트 구조 설계 원칙

**파일**: `4-project-structure-principles.md`

코딩 컨벤션, 디렉토리 구조, 네이밍 규칙

**주요 내용**:

- React 컴포넌트 구조
- Node.js API 구조
- 파일 네이밍 규칙
- 코드 스타일 가이드

### 5. ERD & 데이터베이스 설계

**파일**: `5-erd-database-design.md`

데이터베이스 스키마 및 ERD

**주요 테이블**:

- `users`: 사용자
- `todos`: 할일
- `refresh_tokens`: 리프레시 토큰
- `public_events`: 공통 일정

### 6. 기술 아키텍처

**파일**: `6-technical-architecture.md`

시스템 구조 및 데이터 흐름

**주요 내용**:

- 기술 스택
- 시스템 아키텍처
- 인증 흐름
- API 설계 원칙

### 7. 실행 계획 (Implementation Plan) ⭐

**파일**: `7-implementation_plan.md`

**가장 중요한 문서**: 개발 순서 및 진행 상황 추적

**Phase 구성**:

- Phase 1: 인프라 및 기본 세팅 ✅
- Phase 2: 사용자 인증 ✅
- Phase 3: 할일 관리 핵심 ✅
- Phase 4: 휴지통 및 마무리 ✅
- Phase 5: 달력 기능 (확장) 🔄

### 8. 와이어프레임

**파일**: `8-wireframes.md`

UI/UX 디자인 가이드 및 와이어프레임

**주요 페이지**:

- 로그인/회원가입
- 할일 목록
- 할일 추가/수정 모달
- 휴지통
- 달력 (확장)

---

## 🔌 API 연동 문서

### 10. KASI 특일 정보 API 연동 가이드

**파일**: `API/10-kasi-api-integration.md`

한국천문연구원 특일 정보 API 연동 가이드

**주요 내용**:

- API 개요 및 인증
- 엔드포인트 명세
- 요청/응답 형식
- 백엔드 구현 예제
- 동기화 전략

**관련 파일**:

- `API/OpenAPI_활용가이드.md`: 공식 문서

---

## 🚀 확장 기능 문서

### 9. 달력 기능 명세서 (통합)

**파일**: `extentions/calendar-feature-consolidated.md`

달력 뷰 기능 통합 명세 (@--- 마커 기반)

**주요 내용**:

- 기능 목표
- 사용자 시나리오
- 기능 요구사항 (UI, 백엔드 API)
- 기술 명세 (react-calendar)
- 개발 순서
- API 연동 세부 정보
- 확장성 고려 사항

**@--- 마커 기반 섹션**:

- `@CalendarFeature-Overview` - 기능 개요
- `@CalendarFeature-API-Integration` - API 연동
- `@CalendarFeature-UserScenarios` - 사용자 시나리오
- `@CalendarFeature-Requirements` - 요구사항
- `@CalendarFeature-BackendAPI` - 백엔드 API
- `@CalendarFeature-Frontend` - 프론트엔드 구현
- `@CalendarFeature-Extensibility` - 확장성
- `@CalendarFeature-Implementation-Guidelines` - 구현 가이드

### 달력 개발 요약

**파일**: `extentions/calendar-development-summary.md`

달력 기능 개발을 위한 빠른 참조 문서

### KASI API 검토 요약

**파일**: `extentions/kasi-api-review-summary.md`

공식 KASI API 문서 검토 결과 및 비교

### 확장 목표

**파일**: `extentions/확장목표`

향후 확장 기능 아이디어

### 확장 문서 README

**파일**: `extentions/README.md`

확장 기능 문서 구조 및 사용법 안내

---

## 🐛 디버깅 기록

### 인증 상태 유지 문제 디버깅

**파일**: `debug-records/auth-persistence-issue-debug.md`

인증 상태 유지 이슈 및 해결 과정

**문제**: 새로고침 시 로그인 상태 손실
**해결**: JWT 페이로드 직접 검증, 토큰 리프레시 구현

---

## 🗂️ 기타 기록

### UI 개선 사항

**파일**: `etc-records/ui.md`

UI/UX 개선 요청 및 완료 기록

---

## 📊 문서 작성 가이드

### 새 문서 생성 시 규칙

1. **기본 개발 문서**: `docs/` 직접 하위에 번호 부여 (예: `11-xxx.md`)
2. **API 연동**: `docs/API/` 폴더에 저장
3. **확장 기능**: `docs/extentions/` 폴더에 저장
4. **디버깅 기록**: `docs/debug-records/` 폴더에 저장
5. **기타**: `docs/etc-records/` 폴더에 저장

### 문서 템플릿 구조

```markdown
# 제목

## 문서 정보

- 작성일:
- 버전:
- 관련 문서:

## 개요

(목적 및 범위)

## 상세 내용

(본문)

## 참고 자료

(링크 및 참조)
```

---

## 🔄 문서 업데이트 이력

| 날짜       | 변경 사항                     | 작성자 |
| ---------- | ----------------------------- | ------ |
| 2025-11-25 | MVP 기본 문서 작성 (0-8)      | JKN    |
| 2025-11-27 | 확장 기능 문서 추가 (9-10)    | JKN    |
| 2025-11-27 | 문서 구조 정리 및 인덱스 작성 | JKN    |

---

## 📌 바로가기

**개발 시작하기**: [7. 실행 계획](7-implementation_plan.md)

**API 문서**: [Swagger](../swagger/swagger.json)

**데이터베이스**: [5. ERD](5-erd-database-design.md)

**코딩 가이드**: [4. 프로젝트 구조 원칙](4-project-structure-principles.md)
