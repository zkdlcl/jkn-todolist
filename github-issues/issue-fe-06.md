# [Phase 3] FE-06: 할일 추가/수정 모달 구현

**Labels**: `feature`, `frontend`, `complexity:medium`

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
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - UI/UX 요구사항 (7.2.3)
- `docs/3-user-scenarios.md` - 시나리오 1: 할일 추가
- `docs/4-project-structure-principles.md` - 컴포넌트 설계
