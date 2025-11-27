# 확장 기능 문서 (Extension Features Documentation)

## 📚 문서 개요

이 디렉토리는 JKN-TODOLIST의 확장 기능 관련 문서를 보관합니다. 현재는 달력 기능 확장을 위한 문서들이 포함되어 있습니다.

## 🗂️ 문서 구조

### 주요 문서

- `calendar-feature-consolidated.md` - 달력 기능에 대한 통합 명세서 (@--- 마커 기반)
- `calendar-development-summary.md` - 달력 기능 개발 빠른 참조 가이드
- `kasi-api-review-summary.md` - 한국천문연구원 API 검토 결과
- `documentation-cleanup-report.md` - 문서화 정리 완료 보고서

### @--- 마커 기반 문서화

새로운 `calendar-feature-consolidated.md` 문서는 @--- 마커 기반 구조를 사용하여 특정 기능에 대한 모든 정보를 한 곳에서 쉽게 찾을 수 있도록 구성되어 있습니다.

#### 주요 섹션:

- `@CalendarFeature-Overview` - 달력 기능 개요
- `@CalendarFeature-API-Integration` - API 연동 정보
- `@CalendarFeature-UserScenarios` - 사용자 시나리오
- `@CalendarFeature-Requirements` - 기능 요구사항
- `@CalendarFeature-BackendAPI` - 백엔드 API 명세
- `@CalendarFeature-Frontend` - 프론트엔드 구현 정보
- `@CalendarFeature-Backend-Implementation` - 백엔드 구현 세부 정보
- `@CalendarFeature-KASI-API-Integration` - KASI API 연동 세부 정보
- `@CalendarFeature-UIUX` - UI/UX 설계
- `@CalendarFeature-Development-Phases` - 개발 단계
- `@CalendarFeature-Database` - 데이터베이스 정보
- `@CalendarFeature-Acceptance-Criteria` - 인수 조건
- `@CalendarFeature-Extensibility` - 확장성 고려 사항
- `@CalendarFeature-Implementation-Guidelines` - 구현 가이드

## 🚀 시작하기

### 달력 기능 개발 시작

1. 통합 문서 참조: `docs/extentions/calendar-feature-consolidated.md`
2. 필요한 섹션(@--- 마커)을 찾아 개발 진행
3. `@CalendarFeature-Implementation-Guidelines` 섹션의 시작하기 가이드 참조

### @--- 마커를 사용한 개발 팁

- IDE에서 `Ctrl+Shift+F` 또는 `Cmd+Shift+F`를 사용하여 @--- 마커를 검색
- 예: `@CalendarFeature-Backend-Implementation` 또는 `@CalendarFeature-Frontend` 검색
- 관련된 모든 정보를 빠르게 파악하고 개발에 활용

## 📋 확장 기능 개발 가이드

### 새 확장 기능을 위한 문서화

1. `docs/extentions/` 디렉토리에 새로운 통합 문서 생성
2. @--- 마커 기반 구조 사용
3. 관련 문서 및 참고 자료 함께 정리
4. `docs/7-implementation_plan.md`에 새로운 Phase 추가

### 확장 기능의 구현 순서

1. 기능 명세서 작성 (기능, 사용자 시나리오, 요구사항)
2. 기술 아키텍처 설계 (백엔드, 프론트엔드, DB)
3. 개발 단계 정의 및 이슈 분리
4. 인수 조건 정의
5. 확장성 고려

---

## 🎯 현재 확장 기능: 달력 기능

- **상태**: 설계 완료, 개발 진행 가능
- **주요 기능**: 월간 달력 뷰, 날짜별 할일 표시, 국경일 표시
- **API 연동**: 한국천문연구원 특일 정보 API
- **참조 문서**: `docs/extentions/calendar-feature-consolidated.md`

## 🔄 향후 확장

이 구조는 향후 새로운 확장 기능(예: 알림 기능, 공유 기능 등) 추가 시에도 동일한 방식으로 확장 가능하도록 설계되었습니다.