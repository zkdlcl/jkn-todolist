# [Phase 2] BE-03: 인증 서비스 및 컨트롤러 구현

**Labels**: `feature`, `backend`, `complexity:high`

## 📋 Todo
- bcrypt, jsonwebtoken 패키지 설치
- AuthService 클래스 구현:
  - 비밀번호 해싱 (bcrypt)
  - JWT 토큰 발급 (Access Token 15분, Refresh Token 7일)
  - 회원가입 로직
  - 로그인 로직
  - 로그아웃 로직 (Refresh Token 무효화)
- AuthController 구현:
  - POST /auth/register (회원가입)
  - POST /auth/login (로그인)
  - POST /auth/logout (로그아웃)
  - POST /auth/refresh (토큰 갱신)
- JWT 미들웨어 구현 (인증 검증)
- 입력 유효성 검사 (이메일 형식, 비밀번호 정책)

## ✅ 완료 조건
- 회원가입 API가 정상 동작하고 JWT 토큰 반환
- 로그인 API가 이메일/비밀번호 검증 후 토큰 발급
- 로그아웃 시 Refresh Token이 무효화됨
- 비밀번호 정책 준수 (최소 8자, 대소문자+숫자+특수문자)
- 중복 이메일 가입 차단
- JWT 토큰 검증 미들웨어 동작 확인

## 🔧 기술적 고려사항
- **인증 방식**: JWT (JSON Web Token)
  - Access Token: 15분 유효기간
  - Refresh Token: 7일 유효기간
- **비밀번호 보안**: bcrypt 해싱 (salt rounds: 10)
- **필수 패키지**:
  - bcrypt: 비밀번호 해싱
  - jsonwebtoken: JWT 토큰 생성/검증
- **입력 유효성 검사**:
  - 이메일: 정규식 검증
  - 비밀번호: 최소 8자, 대소문자+숫자+특수문자 포함
  - 이름: 1~50자
- **에러 처리**:
  - 401 Unauthorized: 인증 실패
  - 409 Conflict: 중복 이메일
  - 400 Bad Request: 유효성 검사 실패
- **보안**:
  - 비밀번호는 평문으로 저장하지 않음
  - JWT Secret은 환경변수로 관리
  - Refresh Token은 DB에 저장하여 관리

## 🔗 의존성
- **선행 작업**: BE-02 (사용자 모델 및 리포지토리 구현)
- **후행 작업**: FE-02 (Axios 인터셉터 및 인증 스토어 구현), BE-04 (할일 CRUD API 구현)

## 📚 참고 문서
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - Feature 1: 사용자 인증 및 계정 관리
- `docs/3-api-specification.md` - 인증 API 명세
- `docs/5-database-design.md` - users, refresh_tokens 테이블
