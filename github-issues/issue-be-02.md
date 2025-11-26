# [Phase 2] BE-02: 사용자 모델 및 리포지토리 구현

**Labels**: `feature`, `backend`, `complexity:medium`

## 📋 Todo
- UserRepository 클래스 구현
- `create(email, hashedPassword, name)` 메서드 구현
- `findByEmail(email)` 메서드 구현
- `findById(userId)` 메서드 구현
- PostgreSQL 쿼리 작성 및 테스트
- 에러 핸들링 (중복 이메일, DB 연결 오류 등)

## ✅ 완료 조건
- UserRepository의 모든 메서드가 정상 동작
- 중복 이메일 가입 시 적절한 에러 반환
- 데이터베이스 연결 오류 시 에러 핸들링
- 단위 테스트 작성 (선택사항)

## 🔧 기술적 고려사항
- **아키텍처 패턴**: Repository 패턴 적용
- **데이터베이스**: PostgreSQL + pg 클라이언트
- **보안 고려사항**:
  - SQL Injection 방지 (Prepared Statement 사용)
  - 비밀번호는 해싱된 상태로만 저장
- **테이블**: `users` 테이블 사용
  - user_id (PK, UUID)
  - email (UNIQUE, NOT NULL)
  - password_hash (NOT NULL)
  - name (NOT NULL)
  - role (기본값: 'ROLE_USER')
  - created_at, updated_at
- **에러 처리**:
  - 중복 이메일: UNIQUE 제약 위반 처리
  - DB 연결 실패: 적절한 에러 메시지 반환

## 🔗 의존성
- **선행 작업**: BE-01 (Node.js/Express 프로젝트 초기화)
- **후행 작업**: BE-03 (인증 서비스 및 컨트롤러 구현)

## 📚 참고 문서
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - Feature 1: 사용자 인증 및 계정 관리
- `docs/5-database-design.md` - users 테이블 스키마
- `docs/4-project-structure-principles.md` - Repository 패턴 가이드
