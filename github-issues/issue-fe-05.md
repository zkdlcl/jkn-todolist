# [Phase 3] FE-05: 할일 목록 및 아이템 컴포넌트 구현

**Labels**: `feature`, `frontend`, `complexity:medium`

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
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - UI/UX 요구사항 (7.2.2)
- `docs/3-user-scenarios.md` - 시나리오 2: 할일 완료
- `docs/4-project-structure-principles.md` - 컴포넌트 설계
