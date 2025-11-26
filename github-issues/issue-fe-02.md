# [Phase 2] FE-02: Axios 인터셉터 및 인증 스토어 구현

**Labels**: `feature`, `frontend`, `complexity:medium`

## 📋 Todo
- Axios 인스턴스 생성 및 기본 설정
- Axios 요청 인터셉터 구현 (JWT 토큰 자동 포함)
- Axios 응답 인터셉터 구현 (401 에러 시 토큰 갱신)
- Zustand 기반 인증 스토어 구현 (useAuthStore)
  - 상태: user, accessToken, isAuthenticated
  - 액션: login, logout, setUser, refreshToken
- LocalStorage에 토큰 저장/불러오기
- 토큰 만료 시 자동 갱신 로직

## ✅ 완료 조건
- 모든 API 요청에 JWT 토큰이 자동으로 포함됨
- 401 에러 발생 시 토큰 갱신 후 재요청
- 로그인 상태가 페이지 새로고침 후에도 유지됨
- 로그아웃 시 토큰이 제거되고 상태가 초기화됨

## 🔧 기술적 고려사항
- **상태 관리**: Zustand
- **HTTP 클라이언트**: Axios
- **토큰 저장**: LocalStorage (보안 주의)
- **Axios 인터셉터**:
  - 요청 인터셉터: Authorization 헤더에 Bearer 토큰 추가
  - 응답 인터셉터: 401 에러 시 토큰 갱신 시도
- **토큰 갱신 로직**:
  - Access Token 만료 시 Refresh Token으로 새 토큰 발급
  - Refresh Token도 만료된 경우 로그아웃 처리
- **보안 고려사항**:
  - XSS 방지를 위한 토큰 관리
  - HTTPS 환경에서만 토큰 전송 (프로덕션)

## 🔗 의존성
- **선행 작업**:
  - FE-01 (React/Vite 프로젝트 초기화)
  - BE-03 (인증 서비스 및 컨트롤러 구현)
- **후행 작업**: FE-03 (로그인/회원가입 UI 구현)

## 📚 참고 문서
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - Feature 1: 사용자 인증
- `docs/4-project-structure-principles.md` - 프론트엔드 상태 관리
- `docs/6-technical-architecture.md` - 인증 흐름
