# GitHub Issues 요약

이 문서는 생성될 11개 이슈의 요약 정보를 제공합니다.

## 전체 개요

- **총 이슈 수**: 11개
- **예상 소요 시간**: 약 16-20시간 (2일)
- **Phase**: 4개 (인프라 → 인증 → 할일 관리 → 휴지통)

## Phase별 요약

### Phase 1: 인프라 및 기본 세팅 (2개 이슈)

| ID | 제목 | Label | 복잡도 | 예상 시간 |
|----|------|-------|--------|-----------|
| BE-01 | Node.js/Express 프로젝트 초기화 | setup, backend | Low | 1-2시간 |
| FE-01 | React/Vite 프로젝트 초기화 | setup, frontend | Low | 1-2시간 |

**목표**: 개발 환경 구축 및 서버/클라이언트 통신 준비
**완료 조건**: 헬스체크 API 동작, Tailwind CSS 적용

---

### Phase 2: 사용자 인증 (4개 이슈)

| ID | 제목 | Label | 복잡도 | 예상 시간 |
|----|------|-------|--------|-----------|
| BE-02 | 사용자 모델 및 리포지토리 구현 | feature, backend | Medium | 3-4시간 |
| BE-03 | 인증 서비스 및 컨트롤러 구현 | feature, backend | High | 6-7시간 |
| FE-02 | Axios 인터셉터 및 인증 스토어 구현 | feature, frontend | Medium | 3-4시간 |
| FE-03 | 로그인/회원가입 UI 구현 | feature, frontend | Medium | 3-4시간 |

**목표**: JWT 기반 회원가입, 로그인, 로그아웃 구현
**완료 조건**: 인증 플로우 완성, 토큰 자동 갱신

---

### Phase 3: 할일 관리 핵심 (4개 이슈)

| ID | 제목 | Label | 복잡도 | 예상 시간 |
|----|------|-------|--------|-----------|
| BE-04 | 할일 CRUD API 구현 | feature, backend | High | 6-7시간 |
| FE-04 | 할일 스토어 구현 | feature, frontend | Medium | 3-4시간 |
| FE-05 | 할일 목록 및 아이템 컴포넌트 구현 | feature, frontend | Medium | 4-5시간 |
| FE-06 | 할일 추가/수정 모달 구현 | feature, frontend | Medium | 3-4시간 |

**목표**: 할일 생성, 조회, 수정, 완료, 삭제 기능 구현
**완료 조건**: 할일 CRUD 완성, 필터링/정렬 동작

---

### Phase 4: 휴지통 및 마무리 (2개 이슈)

| ID | 제목 | Label | 복잡도 | 예상 시간 |
|----|------|-------|--------|-----------|
| BE-05 | 휴지통 조회 및 복구 API 구현 | feature, backend | Low | 2-3시간 |
| FE-07 | 휴지통 페이지 UI 구현 | feature, frontend | Low | 2-3시간 |

**목표**: 삭제된 할일 복구 기능 구현
**완료 조건**: 휴지통 조회, 복구, 영구 삭제 동작

---

## 의존성 그래프

```
Phase 1
├─ DB-01 (완료) ✅
├─ BE-01 (Node.js/Express 초기화)
└─ FE-01 (React/Vite 초기화)
    │
    ↓
Phase 2
├─ BE-02 (사용자 리포지토리) ← BE-01
│   │
│   ↓
├─ BE-03 (인증 서비스) ← BE-02
│   │
│   ↓
├─ FE-02 (인증 스토어) ← FE-01, BE-03
│   │
│   ↓
└─ FE-03 (로그인 UI) ← FE-02
    │
    ↓
Phase 3
├─ BE-04 (할일 CRUD API) ← BE-03
│   │
│   ↓
├─ FE-04 (할일 스토어) ← FE-02, BE-04
│   │
│   ↓
├─ FE-05 (할일 목록 UI) ← FE-04
│   │
│   ↓
└─ FE-06 (할일 모달) ← FE-05
    │
    ↓
Phase 4
├─ BE-05 (휴지통 API) ← BE-04
│   │
│   ↓
└─ FE-07 (휴지통 UI) ← BE-05
    │
    ↓
    MVP 완료! 🎉
```

---

## Label 통계

### 종류별
- `setup`: 2개
- `feature`: 9개

### 영역별
- `backend`: 5개
- `frontend`: 6개

### 복잡도별
- `complexity:low`: 4개 (약 6-10시간)
- `complexity:medium`: 5개 (약 15-20시간)
- `complexity:high`: 2개 (약 12-14시간)

---

## 체크리스트

### Phase 1: 인프라 및 기본 세팅
- [ ] BE-01: Node.js/Express 프로젝트 초기화
- [ ] FE-01: React/Vite 프로젝트 초기화

### Phase 2: 사용자 인증
- [ ] BE-02: 사용자 모델 및 리포지토리 구현
- [ ] BE-03: 인증 서비스 및 컨트롤러 구현
- [ ] FE-02: Axios 인터셉터 및 인증 스토어 구현
- [ ] FE-03: 로그인/회원가입 UI 구현

### Phase 3: 할일 관리 핵심
- [ ] BE-04: 할일 CRUD API 구현
- [ ] FE-04: 할일 스토어 구현
- [ ] FE-05: 할일 목록 및 아이템 컴포넌트 구현
- [ ] FE-06: 할일 추가/수정 모달 구현

### Phase 4: 휴지통 및 마무리
- [ ] BE-05: 휴지통 조회 및 복구 API 구현
- [ ] FE-07: 휴지통 페이지 UI 구현

---

## 참고 문서

각 이슈는 다음 문서들을 참조합니다:

1. **실행 계획**: `docs/7-implementation_plan.md`
2. **제품 요구사항**: `docs/2-prd-product-requirements.md`
3. **API 명세**: `docs/3-api-specification.md`
4. **데이터베이스 설계**: `docs/5-database-design.md`
5. **프로젝트 구조**: `docs/4-project-structure-principles.md`
6. **기술 아키텍처**: `docs/6-technical-architecture.md`
7. **사용자 시나리오**: `docs/3-user-scenarios.md`

---

## 일정 예상

### 최적 시나리오 (2일)

**Day 1** (8시간)
- Phase 1 완료 (2시간)
- Phase 2 시작 (6시간)

**Day 2** (8-10시간)
- Phase 2 완료 (2시간)
- Phase 3 완료 (6시간)
- Phase 4 완료 (2시간)

### 여유 시나리오 (3일)

**Day 1** (6시간)
- Phase 1 완료
- Phase 2 진행 중

**Day 2** (8시간)
- Phase 2 완료
- Phase 3 진행 중

**Day 3** (6시간)
- Phase 3 완료
- Phase 4 완료

---

## 주요 마일스톤

| 마일스톤 | 완료 조건 | 검증 방법 |
|----------|-----------|-----------|
| M1: 인프라 세팅 완료 | BE-01, FE-01 완료 | 헬스체크 API 호출 성공 |
| M2: 인증 구현 완료 | BE-02, BE-03, FE-02, FE-03 완료 | 회원가입/로그인 성공 |
| M3: 할일 관리 완료 | BE-04, FE-04, FE-05, FE-06 완료 | 할일 CRUD 동작 확인 |
| M4: MVP 출시 | BE-05, FE-07 완료 | 전체 기능 통합 테스트 |

---

**프로젝트 성공을 기원합니다!** 🚀
