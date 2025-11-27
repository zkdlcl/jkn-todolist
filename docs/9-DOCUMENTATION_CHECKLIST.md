# 문서화 & 파일 정리 체크리스트

> 이 문서는 개발 완료 후 문서 업데이트 및 파일 정리를 위한 체크리스트입니다.
> 새로운 기능을 개발하거나 마일스톤 완료 시 이 체크리스트를 참조하세요.

---

## 📋 실행 명령어

```
"docs/DOCUMENTATION_CHECKLIST.md 를 참조해서 문서 업데이트 및 파일 정리해줘"
```

---

## ✅ 문서 업데이트 체크리스트

### 1. 핵심 개발 문서 (필수)

#### 1.1 Implementation Plan 업데이트

- [ ] `docs/7-implementation_plan.md` 업데이트
  - [ ] 완료된 태스크 체크 표시 (`[ ]` → `[x]`)
  - [ ] 완료 조건 및 구현 내용 기록
  - [ ] 새로운 Phase/태스크 추가 (확장 기능 시)

#### 1.2 PRD 업데이트 (기능 추가 시)

- [ ] `docs/2-prd-product-requirements.md` 확인
  - [ ] 새 기능이 PRD에 명시되어 있는지 확인
  - [ ] 없으면 Feature 섹션에 추가

#### 1.3 와이어프레임 업데이트 (UI 추가 시)

- [ ] `docs/8-wireframes.md` 확인
  - [ ] 새 페이지/컴포넌트 와이어프레임 추가
  - [ ] 색상/스타일 가이드 확인

### 2. API 문서 업데이트 (백엔드 개발 시)

#### 2.1 Swagger 문서

- [ ] `swagger/swagger.json` 업데이트
  - [ ] 새 엔드포인트 추가 (`paths` 섹션)
  - [ ] 스키마 정의 추가/수정 (`components.schemas`)
  - [ ] 요청/응답 예시 추가
  - [ ] 에러 코드 문서화

**확인 방법**:

```bash
# Swagger UI 확인
curl http://localhost:3000/api-docs
```

#### 2.2 외부 API 연동 문서

- [ ] `docs/API/` 폴더에 연동 가이드 작성
  - [ ] API 키 정보 (환경변수로 관리)
  - [ ] 엔드포인트 명세
  - [ ] 요청/응답 형식
  - [ ] 구현 예제 코드
  - [ ] 에러 처리 가이드

### 3. 확장 기능 문서 (확장 개발 시)

#### 3.1 기능 명세서

- [ ] `docs/extentions/` 폴더에 상세 명세서 작성
  - [ ] 기능 목표 및 범위
  - [ ] 사용자 시나리오
  - [ ] 기능 요구사항 (UI, 백엔드)
  - [ ] 기술 명세
  - [ ] 개발 순서

#### 3.2 개발 요약

- [ ] Quick Start 가이드 작성
  - [ ] 주요 파일 목록
  - [ ] 환경 설정
  - [ ] 실행 방법

### 4. 디버깅 기록 (이슈 해결 시)

- [ ] `docs/debug-records/` 폴더에 디버깅 과정 기록
  - [ ] 문제 상황 및 증상
  - [ ] 원인 분석
  - [ ] 해결 방법
  - [ ] 재발 방지 대책

---

## 🗂️ 파일 정리 체크리스트

### 1. 문서 파일 정리

#### 1.1 문서 위치 확인

- [ ] **기본 문서 (0-8)**: `docs/` 직접 하위
- [ ] **API 문서**: `docs/API/`
- [ ] **확장 기능**: `docs/extentions/`
- [ ] **디버깅 기록**: `docs/debug-records/`
- [ ] **기타 기록**: `docs/etc-records/`

#### 1.2 중복 문서 제거

```bash
# 중복 파일 찾기
find docs/ -name "*.md" -type f
```

#### 1.3 문서 링크 검증

- [ ] Implementation Plan 링크 확인
- [ ] README.md 링크 확인
- [ ] 상대 경로 링크 정상 작동 확인

### 2. 코드 파일 정리

#### 2.1 불필요한 파일 삭제

- [ ] 테스트/디버그용 파일 제거

  ```bash
  find . -name "debug-*.js" -type f
  find . -name "test-*.js" ! -path "*/tests/*" -type f
  find . -name "*.test.backup.js" -type f
  ```

- [ ] 템플릿/샘플 파일 제거
  ```bash
  find . -name "*template*.md" -type f
  find . -name "*example*.md" -type f
  ```

#### 2.2 주석 처리된 코드 정리

- [ ] 서버 코드 확인 (`server/src/**/*.js`)
- [ ] 클라이언트 코드 확인 (`client/src/**/*.jsx`)
- [ ] 불필요한 console.log 제거

#### 2.3 미사용 의존성 확인

```bash
# 서버
cd server
npx depcheck

# 클라이언트
cd client
npx depcheck
```

### 3. 환경 파일 정리

#### 3.1 .env 파일 확인

- [ ] `.env.example` 파일과 `.env` 동기화
- [ ] 필수 환경변수 주석 추가
- [ ] 민감 정보 제거 확인

#### 3.2 .gitignore 확인

- [ ] `.env` 파일 무시 확인
- [ ] `node_modules/` 무시 확인
- [ ] 빌드 결과물 무시 확인 (`dist/`, `build/`)

---

## 📝 README 업데이트 체크리스트

### 루트 README.md

- [ ] 프로젝트 개요 업데이트
- [ ] 기능 목록 업데이트 (✅, 🔄 표시)
- [ ] 기술 스택 업데이트
- [ ] 설치 및 실행 가이드 확인
- [ ] 문서 링크 업데이트

### docs/README.md (문서 인덱스)

- [ ] 새 문서 추가 시 인덱스에 반영
- [ ] 문서 설명 업데이트
- [ ] 링크 정상 작동 확인

---

## 🧪 테스트 코드 체크리스트

### 1. 통합 테스트 확인

- [ ] 모든 테스트 통과 확인
  ```bash
  cd server
  npm test
  ```

### 2. 테스트 파일 정리

- [ ] 불필요한 테스트 파일 제거
- [ ] 테스트 설명 명확히 작성
- [ ] 테스트 커버리지 확인 (선택)

---

## 🔧 빌드 & 배포 체크리스트

### 1. 빌드 확인

- [ ] 프론트엔드 빌드 성공

  ```bash
  cd client
  npm run build
  ```

- [ ] 빌드 경고/에러 없음

### 2. Linting 확인

- [ ] ESLint 에러 없음
  ```bash
  cd client
  npm run lint
  ```

---

## 📦 Git 반영 체크리스트

### 1. 변경사항 확인

### 2. 커밋 전 확인사항

- [ ] 민감 정보 (API 키, 비밀번호) 제외 확인
- [ ] `.env` 파일 커밋 안 되었는지 확인
- [ ] 불필요한 파일 제외

### 3. 커밋 메시지 작성 (Conventional Commits)

```bash
# 형식
<type>(<scope>): <subject>

<body>

<footer>

# 예시
feat(calendar): Add calendar view with monthly todo display

- Implement CalendarPage component
- Add calendar data API endpoint
- Update documentation
- Add tests

Resolves #13
```

**Type 종류**:

- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 업데이트
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

### 4. 커밋 & 푸시는 직접 수행하겠음

## 🎯 체크리스트 실행 순서

### Phase 완료 시

1. ✅ **문서 업데이트** (Implementation Plan, Swagger)
2. 🗂️ **파일 정리** (불필요한 코드 제거)
3. 🧪 **테스트 확인** (모든 테스트 통과)
4. 📝 **README 업데이트**
5. 📦 **Git 반영**

### 확장 기능 추가 시

1. 📖 **기능 명세서 작성** (extentions/)
2. ✅ **Implementation Plan 업데이트**
3. 🔌 **API 문서 작성** (API/)
4. 🗂️ **파일 정리**
5. 📦 **Git 반영**

---

## 📊 문서화 품질 기준

### 필수 항목 (MUST)

- [x] Implementation Plan 업데이트
- [x] Swagger API 문서 업데이트
- [x] README.md 기능 목록 최신화
- [x] 불필요한 파일 제거
- [x] 모든 테스트 통과

### 권장 항목 (SHOULD)

- [ ] 기능별 상세 명세서 작성
- [ ] 디버깅 기록 작성
- [ ] 코드 주석 정리
- [ ] UI 스크린샷 추가

### 선택 항목 (COULD)

- [ ] API 사용 예제 추가
- [ ] 성능 테스트 결과 기록
- [ ] 아키텍처 다이어그램 업데이트

---

## 🔍 자동 체크 스크립트 (향후)

```bash
# docs/scripts/check-documentation.sh
#!/bin/bash

echo "🔍 문서화 체크 시작..."

# 1. Swagger 파일 유효성 검사
echo "📄 Swagger 파일 검증..."
# npx swagger-cli validate swagger/swagger.json

# 2. 깨진 링크 확인
echo "🔗 문서 링크 검증..."
# npx markdown-link-check docs/**/*.md

# 3. 불필요한 파일 찾기
echo "🗑️  불필요한 파일 검색..."
find . -name "debug-*.js" -type f
find . -name "*template*.md" -type f

echo "✅ 체크 완료!"
```

---

## 📌 참고 자료

- [Conventional Commits](https://www.conventionalcommits.org/)
- [OpenAPI (Swagger) Specification](https://swagger.io/specification/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)

---

**마지막 업데이트**: 2025-11-27
**작성자**: JKN Team
