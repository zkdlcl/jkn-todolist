# [Phase 3] BE-04: 할일 CRUD API 구현

**Labels**: `feature`, `backend`, `complexity:high`

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
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - Feature 2: 할일 관리 (CRUD)
- `docs/3-api-specification.md` - 할일 API 명세
- `docs/5-database-design.md` - todos 테이블 스키마
