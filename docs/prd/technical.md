# 8. 기술 요구사항

### 8.1 기술 스택

> 상세 아키텍처는 [6-technical-architecture.md](../6-technical-architecture.md) 문서를 참고하세요.

**Backend**:

- 언어/프레임워크: Node.js + Express.js
- 데이터베이스: PostgreSQL 15+(개발환경에서는 로컬 PostgreSQL을 설치하여 사용) / 호스팅은 Supabase
- 캐싱기능 미사용
- 인증: JWT (jsonwebtoken)
- RESTful API 기반 개발
- bcrypt 비밀번호 해싱

**Frontend**:

- 프레임워크: React 18
- 상태 관리: Zustand
- UI 라이브러리: Tailwind CSS
- HTTP Client: Axios
- 라우팅: react-router-dom
- 폼 관리: react-hook-form

**DevOps**:

- 버전 관리: Git + GitHub
- CI/CD: GitHub Actions (옵션 - 우선 고려하지않음. 향후 확장 시)
- 배포: Vercel (Frontend), Vercel (Backend), Supabase의 PostgreSQL(DB) Serverless Functions

**개발도구**

- vsc

### 8.2 API 설계 원칙

- RESTful API 준수
- JSON 형식 요청/응답
- HTTP 상태 코드 표준 사용
- API 문서 자동 생성 (Swagger/OpenAPI)

### 8.3 보안 요구사항

- HTTPS 필수 (프로덕션)
- CORS 설정
- SQL Injection 방지
- XSS 방지
- CSRF 토큰 (필요 시)
- Rate Limiting (API 호출 제한)

### 8.4 성능 요구사항

- API 응답 시간 P95 < 500ms
- 페이지 로딩 시간 < 2초
- 동시 사용자 100명 지원

### 8.5 호환성

- **브라우저**: Chrome, Edge (최신 2개 버전)
- **디바이스**: Desktop, Mobile

---

# 9. 비기능적 요구사항

### 9.1 사용성 (Usability)

- 신규 사용자가 5분 내에 첫 할일 추가 가능
- 주요 기능이 3클릭 이내에 접근 가능
- 직관적인 UI로 별도 매뉴얼 불필요

### 9.2 신뢰성 (Reliability)

- 시스템 가용성 99% 이상
- 데이터 백업 일 1회
- 에러 발생 시 로깅 및 추적

### 9.3 유지보수성 (Maintainability)

- 코드 커버리지 70% 이상
- 린트 규칙 준수
- 명확한 주석 및 문서화
