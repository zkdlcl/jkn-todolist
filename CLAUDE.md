# JKN-TODOLIST 프로젝트 가이드

## 1. 기본 원칙

- **언어**: 모든 입출력 및 주석은 **한국어**를 사용합니다.
- **철학**: 오버엔지니어링을 지양하고, 2일 내 개발 가능한 **실용적 품질**을 추구합니다.
- **목표**: 개인 할일 및 공통 일정 통합 관리 앱 MVP 개발.
- 모든 입출력은 한국어로 할 것
- 오버엔지니어링 금지

## 2. 기술 스택

- **Frontend**: React 18, Zustand, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, JWT, bcrypt
- **Database**: PostgreSQL (Local/Supabase)
- **Testing**: Jest (Backend), Vitest (Frontend)

## 3. 프로젝트 구조

```
/
├── client/          # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── services/
├── server/          # 백엔드 (Node + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── models/
├── docs/            # 문서
│   ├── prd/         # 제품 요구사항 (분할됨)
│   └── ...
```

## 4. 주요 명령어 (예정)

### Frontend

- 실행: `cd client && npm run dev`
- 빌드: `cd client && npm run build`
- 테스트: `cd client && npm run test`

### Backend

- 실행: `cd server && npm run dev`
- 테스트: `cd server && npm run test`

## 5. 코딩 컨벤션

- **변수/함수**: camelCase
- **컴포넌트/클래스**: PascalCase
- **상수**: UPPER_SNAKE_CASE
- **파일**: kebab-case (컴포넌트는 PascalCase 허용)
- **주석**: 복잡한 로직에 대해 "왜"를 설명하는 주석 작성 (한국어)

## 6. 개발 워크플로우

1. **기획 확인**: `docs/prd/` 내의 요구사항 확인
2. **설계**: 구현 전 간단한 설계 (필요 시)
3. **구현**: 기능 단위 구현 (TDD 권장)
4. **테스트**: 단위/통합 테스트 수행
5. **커밋**: 의미 있는 단위로 커밋

## 7. 문서

- [PRD 개요](docs/prd/1-overview.md)
- [기능 명세](docs/prd/2-features.md)
- [UI/UX](docs/prd/3-uiux.md)
- [기술 스택](docs/prd/4-technical.md)
- [사용자 시나리오](docs/3-user-scenarios.md)
- [구조 원칙](docs/4-project-structure-principles.md)
