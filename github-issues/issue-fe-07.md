# [Phase 4] FE-07: 휴지통 페이지 UI 구현

**Labels**: `feature`, `frontend`, `complexity:low`

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
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - Feature 3: 휴지통 관리, UI/UX 요구사항 (7.2.4)
- `docs/3-user-scenarios.md` - 시나리오 2: 휴지통 사용
- `docs/4-project-structure-principles.md` - 페이지 구조
