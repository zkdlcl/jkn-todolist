# GitHub Issues 생성 가이드

이 디렉토리에는 JKN-TODOLIST 프로젝트의 GitHub 이슈를 생성하기 위한 파일들이 포함되어 있습니다.

## 파일 구조

```
github-issues/
├── README.md                    # 이 파일
├── create-issues.ps1            # PowerShell 스크립트 (자동 생성)
├── issue-be-01.md               # BE-01 이슈 내용
├── issue-be-02.md               # BE-02 이슈 내용
├── issue-be-03.md               # BE-03 이슈 내용
├── issue-be-04.md               # BE-04 이슈 내용
├── issue-be-05.md               # BE-05 이슈 내용
├── issue-fe-01.md               # FE-01 이슈 내용
├── issue-fe-02.md               # FE-02 이슈 내용
├── issue-fe-03.md               # FE-03 이슈 내용
├── issue-fe-04.md               # FE-04 이슈 내용
├── issue-fe-05.md               # FE-05 이슈 내용
├── issue-fe-06.md               # FE-06 이슈 내용
└── issue-fe-07.md               # FE-07 이슈 내용
```

## 이슈 생성 방법

### 방법 1: PowerShell 스크립트 사용 (권장)

1. PowerShell을 관리자 권한으로 실행
2. 프로젝트 루트 디렉토리로 이동
3. 다음 명령어 실행:

```powershell
cd C:\test\jkn-todolist\github-issues
.\create-issues.ps1
```

### 방법 2: 수동 생성

각 마크다운 파일을 참조하여 GitHub 웹 인터페이스에서 수동으로 생성할 수 있습니다.

1. GitHub 저장소의 Issues 탭 접속
2. "New issue" 버튼 클릭
3. 해당 마크다운 파일의 내용을 복사하여 붙여넣기
4. Labels 설정 (파일 상단에 명시됨)

## 생성될 이슈 목록

### Phase 1: 인프라 및 기본 세팅 (2개)
1. **BE-01**: Node.js/Express 프로젝트 초기화 - `setup, backend, complexity:low`
2. **FE-01**: React/Vite 프로젝트 초기화 - `setup, frontend, complexity:low`

### Phase 2: 사용자 인증 (4개)
3. **BE-02**: 사용자 모델 및 리포지토리 구현 - `feature, backend, complexity:medium`
4. **BE-03**: 인증 서비스 및 컨트롤러 구현 - `feature, backend, complexity:high`
5. **FE-02**: Axios 인터셉터 및 인증 스토어 구현 - `feature, frontend, complexity:medium`
6. **FE-03**: 로그인/회원가입 UI 구현 - `feature, frontend, complexity:medium`

### Phase 3: 할일 관리 핵심 (4개)
7. **BE-04**: 할일 CRUD API 구현 - `feature, backend, complexity:high`
8. **FE-04**: 할일 스토어 구현 - `feature, frontend, complexity:medium`
9. **FE-05**: 할일 목록 및 아이템 컴포넌트 구현 - `feature, frontend, complexity:medium`
10. **FE-06**: 할일 추가/수정 모달 구현 - `feature, frontend, complexity:medium`

### Phase 4: 휴지통 및 마무리 (2개)
11. **BE-05**: 휴지통 조회 및 복구 API 구현 - `feature, backend, complexity:low`
12. **FE-07**: 휴지통 페이지 UI 구현 - `feature, frontend, complexity:low`

## 사용된 Label 체계

### 종류
- `setup`: 초기 설정 작업
- `feature`: 기능 구현
- `enhancement`: 개선 작업

### 영역
- `backend`: 백엔드 작업
- `frontend`: 프론트엔드 작업
- `database`: 데이터베이스 작업
- `infra`: 인프라 작업

### 복잡도
- `complexity:low`: 낮은 복잡도 (1-2시간)
- `complexity:medium`: 중간 복잡도 (3-5시간)
- `complexity:high`: 높은 복잡도 (6시간 이상)

## 이슈 생성 확인

이슈 생성 후 다음 명령어로 확인:

```bash
gh issue list
```

## 주의사항

- GitHub CLI (`gh`)가 설치되어 있어야 합니다
- GitHub 저장소에 대한 write 권한이 필요합니다
- 이슈 생성 전 GitHub에 로그인되어 있어야 합니다 (`gh auth login`)

## 문의

이슈 생성에 문제가 있을 경우 프로젝트 관리자에게 문의하세요.
