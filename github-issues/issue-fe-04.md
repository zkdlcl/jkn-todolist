# [Phase 3] FE-04: 할일 스토어 구현

**Labels**: `feature`, `frontend`, `complexity:medium`

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
  ```typescript
  {
    todos: Todo[],
    filter: { priority?: string, isCompleted?: boolean },
    sortBy: 'end_datetime' | 'priority' | 'created_at',
    isLoading: boolean,
    error: string | null
  }
  ```
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
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - Feature 2: 할일 관리
- `docs/4-project-structure-principles.md` - 상태 관리 패턴
- `docs/6-technical-architecture.md` - 데이터 흐름
