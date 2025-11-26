# [Phase 4] BE-05: 휴지통 조회 및 복구 API 구현

**Labels**: `feature`, `backend`, `complexity:low`

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
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - Feature 3: 휴지통 관리
- `docs/3-api-specification.md` - 휴지통 API 명세
- `docs/5-database-design.md` - todos 테이블 스키마
