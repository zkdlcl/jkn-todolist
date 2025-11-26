# JKN-TODOLIST 프로젝트 구조 설계 원칙

## 문서 정보

**문서 버전**: 1.0
**작성일**: 2025-11-25
**작성자**: Architecture Reviewer
**상태**: 초안 (Draft)
**관련 문서**: [도메인 정의서](./1-domain-definition.md), [제품 요구사항 명세서](./2-product-requirements.md)

---

## 1. 최상위 설계 원칙 (Top-level Design Principles)

### 1.1 핵심 철학

**"3일 내 출시를 위한 실용적 품질"**

- 완벽함보다 **작동하는 제품**을 우선시
- 과도한 추상화 지양, **명확하고 단순한 구조** 추구
- 향후 확장을 고려하되 **현재 요구사항에 집중**
- 품질과 속도의 균형: **70% 테스트 커버리지로 안정성 확보**

### 1.2 SOLID 원칙 적용

#### 1.2.1 Single Responsibility Principle (단일 책임 원칙)

**적용 방식**:

- 각 모듈/컴포넌트는 **하나의 명확한 책임**만 가짐
- 백엔드: 라우터, 컨트롤러, 서비스, 리포지토리 계층 분리
- 프론트엔드: UI 컴포넌트와 비즈니스 로직 분리

**실전 예시**:

```javascript
// BAD: 여러 책임이 혼재
class TodoController {
  async createTodo(req, res) {
    const { title, content } = req.body;
    const query = "INSERT INTO todos..."; // DB 로직 혼재
    const result = await db.query(query);
    return res.json(result); // 응답 로직
  }
}

// GOOD: 책임 분리
class TodoController {
  constructor(todoService) {
    this.todoService = todoService;
  }

  async createTodo(req, res) {
    const todoData = req.body;
    const result = await this.todoService.createTodo(todoData);
    return res.json(result);
  }
}
```

#### 1.2.2 Open/Closed Principle (개방-폐쇄 원칙)

**적용 방식**:

- 확장에는 열려 있고, 수정에는 닫혀 있는 구조
- 미들웨어, 플러그인 패턴으로 기능 확장
- 인터페이스/추상화를 통한 구현 교체 가능

**실전 예시**:

```javascript
// 인증 미들웨어 체인 - 새로운 인증 방식 추가 시 기존 코드 수정 불필요
app.use("/api/todos", jwtAuthMiddleware);
app.use("/api/admin", [jwtAuthMiddleware, adminRoleMiddleware]);
```

#### 1.2.3 Liskov Substitution Principle (리스코프 치환 원칙)

**적용 방식**:

- 파생 클래스는 기본 클래스를 완전히 대체 가능
- 인터페이스 계약 준수

**실전 예시**:

```javascript
// 모든 Repository는 동일한 인터페이스 제공
class BaseRepository {
  async findById(id) {}
  async findAll() {}
  async create(data) {}
  async update(id, data) {}
  async delete(id) {}
}

class TodoRepository extends BaseRepository {
  // 동일한 시그니처로 구현
}
```

#### 1.2.4 Interface Segregation Principle (인터페이스 분리 원칙)

**적용 방식**:

- 클라이언트는 사용하지 않는 메서드에 의존하지 않음
- 작고 명확한 인터페이스 제공

#### 1.2.5 Dependency Inversion Principle (의존성 역전 원칙)

**적용 방식**:

- 상위 모듈은 하위 모듈에 의존하지 않고, 추상화에 의존
- 의존성 주입(DI) 패턴 사용

**실전 예시**:



### 1.3 DRY (Don't Repeat Yourself)

**적용 전략**:

- 공통 로직은 유틸리티 함수/모듈로 추출
- 중복 코드 발견 시 **즉시 리팩토링**
- 설정 값은 환경 변수나 상수 파일로 중앙 관리


### 1.4 KISS (Keep It Simple, Stupid)

**적용 전략**:

- 복잡한 디자인 패턴은 **필요할 때만** 도입
- 코드는 **읽기 쉽고 이해하기 쉽게** 작성
- 3일 개발 일정상 과도한 추상화 지양

**실전 가이드**:

- 클래스보다 함수 우선 (함수형 프로그래밍 지향)
- 중첩 깊이 최대 3단계
- 함수당 최대 50줄 이하

### 1.5 YAGNI (You Aren't Gonna Need It)

**적용 전략**:

- **현재 필요한 기능만** 구현
- 미래를 위한 확장 코드는 실제 필요 시 추가
- PRD에 명시되지 않은 기능은 구현하지 않음

### 1.6 프로젝트 가치

1. **속도**: 3일 내 MVP 출시 (Phase 0-2)
2. **품질**: 70% 테스트 커버리지로 안정성 보장
3. **확장성**: Phase 3-5 기능 추가를 위한 구조적 유연성
4. **유지보수성**: 명확한 코드 구조와 문서화
5. **보안**: JWT, bcrypt, HTTPS, CORS 등 기본 보안 강화

---

## 2. 의존성 및 레이어 원칙 (Dependency and Layer Principles)

### 2.1 계층 구조 (Layered Architecture)

```
┌─────────────────────────────────────┐
│   Presentation Layer (API/UI)       │  ← 사용자 인터페이스
├─────────────────────────────────────┤
│   Business Logic Layer (Service)    │  ← 비즈니스 규칙
├─────────────────────────────────────┤
│   Data Access Layer (Repository)    │  ← 데이터 접근
├─────────────────────────────────────┤
│   Database (PostgreSQL)              │  ← 데이터 저장소
└─────────────────────────────────────┘
```

### 2.2 백엔드 레이어 정의

#### 2.2.1 Presentation Layer (프레젠테이션 계층)

**책임**:

- HTTP 요청/응답 처리
- 입력 데이터 검증 (Validation)
- 라우팅

**구성 요소**:

- **Routes**: API 엔드포인트 정의
- **Controllers**: 요청 처리 및 응답 반환
- **Middlewares**: 인증, 로깅, 에러 처리

**규칙**:

- 비즈니스 로직 포함 금지
- Service Layer 호출만 수행
- HTTP 관련 로직만 처리

#### 2.2.2 Business Logic Layer (비즈니스 로직 계층)

**책임**:

- 핵심 비즈니스 규칙 구현
- 트랜잭션 관리
- 도메인 로직 처리

**구성 요소**:

- **Services**: 비즈니스 로직 구현
- **DTOs**: 데이터 전송 객체
- **Validators**: 비즈니스 규칙 검증

**규칙**:

- HTTP 요청/응답 객체 접근 금지
- Repository를 통해서만 데이터 접근
- 단위 테스트 가능하도록 순수 함수로 구현

#### 2.2.3 Data Access Layer (데이터 접근 계층)

**책임**:

- 데이터베이스 CRUD 작업
- SQL 쿼리 실행
- 데이터 매핑

**구성 요소**:

- **Repositories**: 데이터 접근 인터페이스
- **Models**: 데이터베이스 스키마 정의
- **Migrations**: 스키마 변경 관리

**규칙**:

- 비즈니스 로직 포함 금지
- SQL Injection 방지 (Parameterized Queries)
- 단순한 CRUD 인터페이스 제공

### 2.3 프론트엔드 레이어 정의

```
┌─────────────────────────────────────┐
│   Presentation (Components)          │  ← UI 컴포넌트
├─────────────────────────────────────┤
│   State Management (Zustand Stores)  │  ← 상태 관리
├─────────────────────────────────────┤
│   API Client (Axios Services)        │  ← 백엔드 통신
├─────────────────────────────────────┤
│   Backend API                         │  ← REST API
└─────────────────────────────────────┘
```

#### 2.3.1 Presentation Layer

**구성 요소**:

- **Pages**: 라우팅 단위 페이지
- **Components**: 재사용 가능한 UI 컴포넌트
- **Layouts**: 공통 레이아웃

**규칙**:

- API 직접 호출 금지 (Zustand Store 또는 API Service 사용)
- 비즈니스 로직 최소화
- 순수 프레젠테이션 로직만 포함

#### 2.3.2 State Management Layer

**구성 요소**:

- **Zustand Stores**: 전역 상태 관리
- **Hooks**: 커스텀 훅

**규칙**:

- 상태 업데이트 로직 캡슐화
- API 호출은 별도 Service Layer에서 처리

#### 2.3.3 API Client Layer

**구성 요소**:

- **API Services**: Axios 기반 HTTP 클라이언트
- **Interceptors**: 요청/응답 가로채기 (JWT 주입, 에러 처리)

### 2.4 의존성 방향 규칙

**핵심 원칙**: **의존성은 항상 상위 계층에서 하위 계층으로만 흐른다**

```
Presentation → Business Logic → Data Access → Database
```

**금지 사항**:

- 하위 계층이 상위 계층 참조 금지
- 계층 건너뛰기 금지 (Presentation → Data Access 직접 접근)

**예외 사항**:

- 공통 유틸리티/헬퍼 함수는 모든 계층에서 사용 가능
- 타입 정의는 모든 계층에서 공유 가능

### 2.5 순환 참조 방지 전략

#### 2.5.1 모듈 구조 설계

**규칙**:

- 각 모듈은 독립적으로 동작 가능하도록 설계
- 공통 의존성은 별도 모듈로 분리

**예시**:

```
src/
├── modules/
│   ├── todo/
│   │   ├── todo.controller.js
│   │   ├── todo.service.js
│   │   └── todo.repository.js
│   ├── user/
│   │   ├── user.controller.js
│   │   ├── user.service.js
│   │   └── user.repository.js
│   └── shared/  ← 공통 의존성
│       ├── utils/
│       └── types/
```

#### 2.5.2 의존성 주입 활용

**방식**:

- 생성자 주입으로 의존성 명시
- 순환 참조 발생 시 인터페이스/이벤트로 해결

#### 2.5.3 순환 참조 감지

**도구**:

- ESLint 플러그인: `eslint-plugin-import` 사용
- `import/no-cycle` 규칙 활성화

```json
// .eslintrc.json
{
  "rules": {
    "import/no-cycle": "error"
  }
}
```

---

## 3. 코드 및 네이밍 원칙 (Code and Naming Principles)

### 3.1 네이밍 컨벤션

#### 3.1.1 변수 및 함수

**규칙**:

- **camelCase** 사용
- 동사 + 명사 조합 (함수)
- 명사 조합 (변수)
- Boolean 변수는 `is`, `has`, `can`, `should` 접두사

#### 3.1.2 클래스 및 컴포넌트

**규칙**:

- **PascalCase** 사용
- 명사 조합
- 단수형 사용

#### 3.1.3 상수

**규칙**:

- **UPPER_SNAKE_CASE** 사용
- 의미 있는 이름

#### 3.1.4 파일 및 디렉토리

**규칙**:

- **kebab-case** 사용 (파일)
- **camelCase** 사용 (디렉토리 - 선택적)
- 단수형 사용
- 확장자 명시

**예시**:

```
src/
├── controllers/
│   ├── todo.controller.js
│   ├── user.controller.js
│   └── auth.controller.js
├── services/
│   ├── todo.service.js
│   └── user.service.js
├── repositories/
│   ├── todo.repository.js
│   └── user.repository.js
├── middlewares/
│   ├── auth.middleware.js
│   └── error-handler.middleware.js
├── utils/
│   ├── jwt-util.js
│   ├── bcrypt-util.js
│   └── validation-util.js
└── config/
    ├── database.config.js
    └── jwt.config.js
```

**프론트엔드**:

```
src/
├── pages/
│   ├── TodoListPage.jsx
│   ├── LoginPage.jsx
│   └── TrashPage.jsx
├── components/
│   ├── TodoItem.jsx
│   ├── TodoForm.jsx
│   └── Header.jsx
├── stores/
│   ├── useTodoStore.js
│   └── useAuthStore.js
├── services/
│   ├── todo.service.js
│   └── auth.service.js
└── utils/
    ├── date-formatter.js
    └── validator.js
```

### 3.2 코드 포맷팅 및 스타일 가이드

#### 3.2.1 Prettier 설정

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### 3.2.2 ESLint 설정

```json
// .eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "arrow-body-style": ["error", "as-needed"],
    "import/no-cycle": "error"
  }
}
```

### 3.3 Node.js/Express Best Practices

#### 3.3.1 비동기 처리

**규칙**:

- `async/await` 사용 (Promise 체이닝 지양)
- 에러 핸들링 필수

**예시**:

```javascript
// GOOD
async function getTodos(req, res, next) {
  try {
    const todos = await todoService.getAllTodos(req.user.id);
    return res.json(successResponse(todos));
  } catch (error) {
    next(error); // 에러 미들웨어로 전달
  }
}
```

#### 3.3.2 에러 처리

**규칙**:

- 중앙 집중식 에러 핸들러 사용
- 커스텀 에러 클래스 정의

#### 3.3.3 환경 변수 관리

**규칙**:

- `.env` 파일 사용
- `dotenv` 라이브러리 활용
- `.env.example` 제공

**예시**:

```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jkn_todolist

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3.4 React 18 Best Practices

#### 3.4.1 함수형 컴포넌트

**규칙**:

- 클래스 컴포넌트 사용 금지
- Hooks 사용

**예시**:

```javascript
// GOOD
import { useState, useEffect } from "react";

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

#### 3.4.2 Hooks 규칙

**규칙**:

- 최상위 레벨에서만 호출
- 조건문, 반복문 내부 금지
- 커스텀 훅은 `use` 접두사

#### 3.4.3 Props 전달

**규칙**:

- Props 구조 분해 할당
- PropTypes 또는 TypeScript 타입 정의 (선택)
- Props drilling 최소화 (Zustand 활용)

#### 3.4.4 조건부 렌더링

**규칙**:

- 삼항 연산자 또는 `&&` 연산자 사용
- 복잡한 조건은 별도 변수/함수로 추출
### 3.5 주석 및 문서화

#### 3.5.1 JSDoc 주석

**규칙**:

- 공개 API/함수에는 JSDoc 주석 작성
- 복잡한 비즈니스 로직은 설명 추가

#### 3.5.2 인라인 주석

**규칙**:

- 복잡한 로직에만 사용
- "왜"를 설명 ("무엇"이 아님)
- 주석 대신 명확한 함수/변수명 우선

---

## 4. 테스트 및 품질 원칙 (Test and Quality Principles)

### 4.1 테스트 전략

#### 4.1.1 테스트 피라미드

```
        /\
       /E2E\        10% - 주요 사용자 시나리오
      /------\
     /  Int   \     20% - API 통합 테스트
    /----------\
   /   Unit     \   70% - 단위 테스트
  /--------------\
```

**목표**:

- **전체 커버리지 70% 이상**
- 단위 테스트: 70%
- 통합 테스트: 20%
- E2E 테스트: 10%

#### 4.1.2 테스트 도구

**백엔드**:

- **테스트 프레임워크**: Jest
- **HTTP 테스트**: Supertest
- **Mock**: jest.mock()

**프론트엔드**:

- **테스트 프레임워크**: Vitest (React 18 권장)
- **컴포넌트 테스트**: React Testing Library
- **Mock**: MSW (Mock Service Worker)

### 4.2 단위 테스트 (Unit Test)

#### 4.2.1 백엔드 단위 테스트

**대상**:

- Service Layer 비즈니스 로직
- 유틸리티 함수
- 검증 로직


#### 4.2.2 프론트엔드 단위 테스트

**대상**:

- 컴포넌트 렌더링
- 이벤트 핸들러
- 커스텀 훅

### 4.3 통합 테스트 (Integration Test)

#### 4.3.1 백엔드 API 통합 테스트

**대상**:

- API 엔드포인트 전체 흐름
- 데이터베이스 연동
- 인증/인가

### 4.4 E2E 테스트 (End-to-End Test)

**대상**:

- 주요 사용자 시나리오
- 회원가입 → 로그인 → 할일 생성 → 완료 → 삭제 → 복구

**도구**: Playwright 또는 Cypress (선택)

### 4.5 70% 커버리지 목표 달성 방법

#### 4.5.1 우선순위 기반 테스트 작성

**High Priority** (반드시 테스트):

- 인증/인가 로직
- 핵심 비즈니스 로직 (할일 CRUD, 휴지통)
- 데이터 검증 로직
- 에러 처리

**Medium Priority**:

- API 엔드포인트
- 상태 관리 로직
- 주요 컴포넌트

**Low Priority** (선택적):

- UI 스타일링
- 간단한 유틸리티 함수

#### 4.5.2 테스트 커버리지 측정

**설정**:

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    },
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js",
      "!src/config/**",
      "!src/migrations/**"
    ]
  }
}
```

**CI/CD 통합**:

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:coverage
      - name: Coverage Report
        uses: codecov/codecov-action@v3
```

### 4.6 품질 검증 프로세스

#### 4.6.1 Linting

**ESLint 실행**:

```json
{
  "scripts": {
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix"
  }
}
```

**Pre-commit Hook** (Husky):

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test
```

#### 4.6.2 Code Review 체크리스트

**리뷰어 확인 사항**:

- [ ] 코드가 요구사항을 충족하는가?
- [ ] 네이밍이 명확하고 일관성 있는가?
- [ ] 에러 처리가 적절한가?
- [ ] 테스트 코드가 작성되었는가?
- [ ] 보안 취약점이 없는가? (SQL Injection, XSS 등)
- [ ] 성능 이슈가 없는가?
- [ ] 주석이 필요한 곳에 작성되었는가?
- [ ] 중복 코드가 없는가?

---

## 5. 설정/보안/운영 원칙 (Configuration/Security/Operations Principles)

### 5.1 환경 설정 관리

#### 5.1.1 .env 파일 구조

**백엔드**:

```bash
# .env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jkn_todolist_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# JWT
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**프론트엔드**:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=JKN-TODOLIST
VITE_ENV=development
```

#### 5.1.2 환경별 설정

**개발 환경** (`.env.development`):

- 로컬 데이터베이스
- 상세한 로깅
- CORS 허용

**프로덕션 환경** (`.env.production`):

- Supabase PostgreSQL
- 에러 로깅만
- CORS 제한
- HTTPS 강제

**설정 로드**:

```javascript
// config/index.js
import dotenv from "dotenv";

dotenv.config();

export default {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      min: parseInt(process.env.DATABASE_POOL_MIN, 10) || 2,
      max: parseInt(process.env.DATABASE_POOL_MAX, 10) || 10,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    rateLimitMaxRequests:
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
};
```

### 5.2 보안 Best Practices

#### 5.2.1 JWT 인증

**구현 원칙**:

- Access Token: 짧은 만료 시간 (15분)
- Refresh Token: 긴 만료 시간 (7일), HttpOnly 쿠키 저장
- 토큰 갱신 엔드포인트 제공

#### 5.2.2 bcrypt 비밀번호 해싱

**구현 원칙**:

- Salt Rounds: 10 (개발), 12 (프로덕션)
- 비밀번호 정책: 최소 8자, 대소문자+숫자+특수문자

#### 5.2.3 HTTPS 강제

**Vercel 배포 시 자동 HTTPS 적용**

**프로덕션 환경 체크**:

```javascript
// middlewares/security.middleware.js
export function enforceHTTPS(req, res, next) {
  if (
    config.env === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
}
```

#### 5.2.4 CORS 설정

#### 5.2.5 SQL Injection 방지

**원칙**:

- Parameterized Queries 사용
- ORM/Query Builder 활용 (pg 라이브러리)


#### 5.2.6 XSS 방지

**원칙**:

- 사용자 입력 데이터 이스케이프
- Content Security Policy (CSP) 헤더 설정
- DOMPurify 라이브러리 사용 (프론트엔드)

**백엔드 헤더 설정**:

#### 5.2.7 Rate Limiting

### 5.3 로깅 및 모니터링

#### 5.3.1 로깅 전략

**로그 레벨**:

- **ERROR**: 에러 발생 (즉시 조치 필요)
- **WARN**: 경고 (잠재적 문제)
- **INFO**: 중요 이벤트 (사용자 로그인, 할일 생성)
- **DEBUG**: 디버깅 정보 (개발 환경만)

#### 5.3.2 에러 로깅

**구현**:


#### 5.3.3 모니터링

**Vercel 배포 시**:

- Vercel Analytics 자동 통합
- 성능 메트릭 수집
- 에러 추적

**추가 도구 (선택)**:

- **Sentry**: 에러 추적 및 알림
- **LogRocket**: 세션 리플레이
- **Datadog**: 통합 모니터링

### 5.4 배포 전략 (Vercel + Supabase)

#### 5.4.1 백엔드 배포 (Vercel Serverless Functions)

**디렉토리 구조**:

```
backend/
├── api/
│   └── index.js  ← Vercel Serverless Function 엔트리포인트
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   └── ...
├── vercel.json
└── package.json
```

**vercel.json**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**api/index.js**:

```javascript
import app from "../src/app.js";

export default app;
```

#### 5.4.2 프론트엔드 배포 (Vercel)

**vercel.json**:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 5.4.3 데이터베이스 배포 (Supabase)

**설정**:

1. Supabase 프로젝트 생성
2. PostgreSQL 연결 문자열 획득
3. 환경 변수에 `DATABASE_URL` 설정

**마이그레이션**:

```bash
# 로컬에서 마이그레이션 SQL 생성
psql -h localhost -U user -d jkn_todolist_dev -f migrations/001_initial_schema.sql

# Supabase SQL Editor에서 실행
```

#### 5.4.4 환경 변수 설정

**Vercel Dashboard**:

- Settings > Environment Variables
- Production, Preview, Development 환경별 설정

**필수 환경 변수**:

```
DATABASE_URL=postgresql://...supabase.co:5432/postgres
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://jkn-todolist.vercel.app
NODE_ENV=production
```

#### 5.4.5 배포 체크리스트

**배포 전**:

- [ ] 모든 테스트 통과 확인
- [ ] 린트 에러 해결
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 마이그레이션 완료
- [ ] HTTPS 설정 확인
- [ ] CORS 설정 확인

**배포 후**:

- [ ] API 엔드포인트 동작 확인
- [ ] 프론트엔드 페이지 로딩 확인
- [ ] 로그인/회원가입 테스트
- [ ] 할일 CRUD 테스트
- [ ] 에러 로그 모니터링
- [ ] 성능 메트릭 확인

---

## 6. 백엔드 디렉토리 구조 (Backend Directory Structure)

### 6.1 전체 구조

```
backend/
├── api/
│   └── index.js                    # Vercel Serverless Function 엔트리
├── src/
│   ├── controllers/                # 컨트롤러 (HTTP 요청 처리)
│   │   ├── auth.controller.js
│   │   ├── todo.controller.js
│   │   └── trash.controller.js
│   ├── services/                   # 비즈니스 로직
│   │   ├── auth.service.js
│   │   ├── todo.service.js
│   │   └── trash.service.js
│   ├── repositories/               # 데이터 접근
│   │   ├── user.repository.js
│   │   └── todo.repository.js
│   ├── middlewares/                # 미들웨어
│   │   ├── auth.middleware.js
│   │   ├── error-handler.middleware.js
│   │   ├── request-logger.middleware.js
│   │   ├── cors.middleware.js
│   │   └── rate-limit.middleware.js
│   ├── routes/                     # 라우팅
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── todo.routes.js
│   │   └── trash.routes.js
│   ├── models/                     # 데이터 모델 (선택적, 타입 정의)
│   │   ├── user.model.js
│   │   └── todo.model.js
│   ├── utils/                      # 유틸리티
│   │   ├── jwt-util.js
│   │   ├── bcrypt-util.js
│   │   ├── validation-util.js
│   │   ├── response-util.js
│   │   └── logger.js
│   ├── errors/                     # 커스텀 에러
│   │   └── custom-error.js
│   ├── config/                     # 설정
│   │   ├── index.js
│   │   └── database.js
│   ├── validators/                 # 입력 검증
│   │   ├── auth.validator.js
│   │   └── todo.validator.js
│   ├── constants/                  # 상수
│   │   └── index.js
│   └── app.js                      # Express 앱 설정
├── migrations/                     # 데이터베이스 마이그레이션
│   ├── 001_initial_schema.sql
│   └── 002_add_indexes.sql
├── tests/                          # 테스트
│   ├── unit/
│   │   ├── services/
│   │   │   ├── auth.service.test.js
│   │   │   └── todo.service.test.js
│   │   └── utils/
│   │       └── jwt-util.test.js
│   ├── integration/
│   │   ├── auth.api.test.js
│   │   └── todo.api.test.js
│   └── helpers/
│       ├── db-helper.js
│       └── test-data.js
├── logs/                           # 로그 파일
│   ├── error.log
│   └── combined.log
├── .env.example                    # 환경 변수 예시
├── .env                            # 환경 변수 (git ignore)
├── .gitignore
├── .eslintrc.json                  # ESLint 설정
├── .prettierrc                     # Prettier 설정
├── vercel.json                     # Vercel 배포 설정
├── package.json
└── README.md
```

### 6.4 JWT 인증 미들웨어 배치


### 6.5 RESTful API 라우팅 구조

#### 6.5.1 API 엔드포인트 설계

**인증 API**:

- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/logout` - 로그아웃
- `POST /api/v1/auth/refresh` - 토큰 갱신

**할일 API**:

- `GET /api/v1/todos` - 할일 목록 조회
- `GET /api/v1/todos/:id` - 할일 상세 조회
- `POST /api/v1/todos` - 할일 생성
- `PUT /api/v1/todos/:id` - 할일 수정
- `PATCH /api/v1/todos/:id/complete` - 할일 완료 토글
- `DELETE /api/v1/todos/:id` - 할일 삭제 (소프트 삭제)

**휴지통 API**:

- `GET /api/v1/trash` - 휴지통 조회
- `POST /api/v1/trash/:id/restore` - 할일 복구
- `DELETE /api/v1/trash/:id` - 영구 삭제
- `DELETE /api/v1/trash` - 휴지통 비우기

#### 6.5.2 HTTP 상태 코드

- `200 OK` - 성공 (GET, PUT, PATCH)
- `201 Created` - 생성 성공 (POST)
- `204 No Content` - 성공 (DELETE, 응답 본문 없음)
- `400 Bad Request` - 잘못된 요청
- `401 Unauthorized` - 인증 실패
- `403 Forbidden` - 권한 없음
- `404 Not Found` - 리소스 없음
- `500 Internal Server Error` - 서버 에러

#### 6.5.3 응답 포맷

**성공**:

```json
{
  "success": true,
  "message": "할일이 생성되었습니다",
  "data": {
    "id": 1,
    "title": "테스트 할일",
    "content": "내용",
    "priority": "HIGH",
    "status": "TODO",
    "createdAt": "2025-11-25T10:00:00Z"
  }
}
```

**에러**:

```json
{
  "success": false,
  "error": "제목은 필수입니다",
  "statusCode": 400
}
```

---

## 7. 프론트엔드 디렉토리 구조 (Frontend Directory Structure)

### 7.1 전체 구조

```
frontend/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── pages/                      # 페이지 컴포넌트 (라우팅 단위)
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── TodoListPage.jsx
│   │   └── TrashPage.jsx
│   ├── components/                 # 재사용 가능한 컴포넌트
│   │   ├── common/                 # 공통 컴포넌트
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── Badge.jsx
│   │   ├── layout/                 # 레이아웃 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MainLayout.jsx
│   │   └── todo/                   # 할일 관련 컴포넌트
│   │       ├── TodoList.jsx
│   │       ├── TodoItem.jsx
│   │       ├── TodoForm.jsx
│   │       └── TodoFilter.jsx
│   ├── stores/                     # Zustand 상태 관리
│   │   ├── useAuthStore.js
│   │   ├── useTodoStore.js
│   │   └── useUIStore.js
│   ├── services/                   # API 서비스
│   │   ├── api-client.js           # Axios 인스턴스
│   │   ├── auth.service.js
│   │   ├── todo.service.js
│   │   └── trash.service.js
│   ├── hooks/                      # 커스텀 훅
│   │   ├── useTodos.js
│   │   ├── useAuth.js
│   │   └── useForm.js
│   ├── utils/                      # 유틸리티
│   │   ├── date-formatter.js
│   │   ├── validator.js
│   │   └── storage.js
│   ├── constants/                  # 상수
│   │   └── index.js
│   ├── styles/                     # 스타일
│   │   └── index.css               # Tailwind CSS 진입점
│   ├── router/                     # 라우팅
│   │   └── index.jsx
│   ├── App.jsx                     # 루트 컴포넌트
│   └── main.jsx                    # 진입점
├── tests/                          # 테스트
│   ├── unit/
│   │   ├── components/
│   │   │   ├── TodoItem.test.jsx
│   │   │   └── TodoForm.test.jsx
│   │   └── utils/
│   │       └── validator.test.js
│   └── e2e/
│       └── todo-flow.spec.js
├── .env.example
├── .env
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

### 7.2 React 18 프로젝트 구조

#### 7.2.1 main.jsx (진입점)

#### 7.2.2 App.jsx (루트 컴포넌트)

#### 7.2.3 router/index.jsx


#### 7.2.4 PrivateRoute.jsx (인증 보호 라우트)

### 7.3 Zustand 상태 관리

#### 7.3.1 stores/useAuthStore.js

#### 7.3.2 stores/useTodoStore.js


### 7.4 Tailwind CSS 설정

#### 7.4.1 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};
```

#### 7.4.2 styles/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }

  .btn-primary {
    @apply btn bg-primary text-white hover:bg-blue-600;
  }

  .btn-danger {
    @apply btn bg-danger text-white hover:bg-red-600;
  }

  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  }

  .card {
    @apply bg-white rounded-lg shadow-sm p-4;
  }
}
```

## 8. 결론 및 실천 가이드

### 8.1 3일 개발 로드맵

**Day 1: 설계 및 환경 설정**

- [ ] 프로젝트 구조 생성
- [ ] 데이터베이스 스키마 작성 및 마이그레이션
- [ ] 백엔드 기본 설정 (Express, PostgreSQL 연동)
- [ ] 프론트엔드 기본 설정 (Vite, React, Tailwind CSS)
- [ ] 인증 API 구현 (회원가입, 로그인)

**Day 2: 핵심 기능 개발**

- [ ] 할일 CRUD API 구현
- [ ] 휴지통 API 구현
- [ ] 프론트엔드 페이지 구현 (로그인, 할일 목록, 휴지통)
- [ ] Zustand 상태 관리 통합
- [ ] 단위 테스트 작성 (핵심 로직)

**Day 3: 테스트 및 배포**

- [ ] 통합 테스트 작성
- [ ] E2E 테스트 작성 (주요 플로우)
- [ ] 테스트 커버리지 70% 확인
- [ ] Vercel 배포 (프론트엔드, 백엔드)
- [ ] Supabase 데이터베이스 설정
- [ ] 프로덕션 환경 검증

### 8.2 품질 체크리스트

**코드 품질**:

- [ ] ESLint 에러 0개
- [ ] Prettier 포맷팅 완료
- [ ] 테스트 커버리지 70% 이상
- [ ] 모든 테스트 통과

**보안**:

- [ ] JWT 인증 구현
- [ ] bcrypt 비밀번호 해싱
- [ ] HTTPS 설정
- [ ] CORS 설정
- [ ] SQL Injection 방지 (Parameterized Queries)
- [ ] XSS 방지 (입력 검증)
- [ ] Rate Limiting 적용

**성능**:

- [ ] API 응답 시간 < 500ms
- [ ] 페이지 로딩 시간 < 2초
- [ ] 데이터베이스 인덱스 설정

**배포**:

- [ ] 환경 변수 설정 완료
- [ ] 프로덕션 빌드 성공
- [ ] 배포 후 기능 검증

### 8.3 지속적 개선

**Phase 1 이후 개선 사항**:

1. 알림 기능 추가
2. 태그 기능 추가
3. 검색 기능 추가
4. 다크모드 구현
5. 모바일 앱 개발 고려
6. 팀 협업 기능 추가

**기술 부채 관리**:

- 주 1회 코드 리뷰
- 월 1회 리팩토링 세션
- 분기별 아키텍처 리뷰

---

**문서 종료**
