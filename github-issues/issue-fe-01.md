# [Phase 1] FE-01: React/Vite 프로젝트 초기화

**Labels**: `setup`, `frontend`, `complexity:low`

## 📋 Todo
- React 18 + Vite 프로젝트 생성
- axios, zustand, react-router-dom, tailwindcss 설치 및 설정
- Tailwind CSS 초기 설정 (tailwind.config.js)
- 기본 라우팅 구조 설정
- 개발 서버 실행 환경 구축

## ✅ 완료 조건
- `npm run dev` 실행 시 개발 서버 정상 작동
- Tailwind CSS 스타일이 정상적으로 적용됨
- 기본 라우팅 구조 확인 가능
- Axios 인스턴스 설정 완료

## 🔧 기술적 고려사항
- **프론트엔드 프레임워크**: React 18 + Vite
- **상태 관리**: Zustand
- **UI 라이브러리**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **라우팅**: react-router-dom
- **필수 패키지**:
  - react: 18.x
  - vite: 최신 버전
  - zustand: 상태 관리
  - axios: HTTP 클라이언트
  - react-router-dom: 라우팅
  - tailwindcss: CSS 프레임워크
- **개발 환경**: Vite의 빠른 HMR(Hot Module Replacement) 활용

## 🔗 의존성
- **선행 작업**: 없음 (독립적으로 진행 가능)
- **후행 작업**: FE-02 (Axios 인터셉터 및 인증 스토어 구현)

## 📚 참고 문서
- `docs/7-implementation_plan.md` - 실행 계획
- `docs/2-prd-product-requirements.md` - 제품 요구사항 (8.1 기술 스택)
- `docs/4-project-structure-principles.md` - 프로젝트 구조 설계 원칙
