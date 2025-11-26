# GitHub Issues 빠른 생성 가이드

## 사전 준비

### 1. GitHub CLI 설치 확인

```powershell
gh --version
```

설치되지 않은 경우:
```powershell
winget install --id GitHub.cli
```

### 2. GitHub 인증

```powershell
gh auth login
```

### 3. 저장소 확인

현재 디렉토리가 올바른 저장소인지 확인:
```powershell
git remote -v
```

## 이슈 생성 실행

### PowerShell 스크립트 실행

```powershell
# 1. github-issues 디렉토리로 이동
cd C:\test\jkn-todolist\github-issues

# 2. 실행 권한 설정 (최초 1회)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. 스크립트 실행
.\create-issues.ps1
```

## 예상 출력

```
GitHub 이슈 생성을 시작합니다...

[Phase 1] 인프라 및 기본 세팅 이슈 생성 중...
✓ BE-01 이슈 생성 완료
✓ FE-01 이슈 생성 완료

[Phase 2] 사용자 인증 이슈 생성 중...
✓ BE-02 이슈 생성 완료
✓ BE-03 이슈 생성 완료
✓ FE-02 이슈 생성 완료
✓ FE-03 이슈 생성 완료

[Phase 3] 할일 관리 핵심 이슈 생성 중...
✓ BE-04 이슈 생성 완료
✓ FE-04 이슈 생성 완료
✓ FE-05 이슈 생성 완료
✓ FE-06 이슈 생성 완료

[Phase 4] 휴지통 및 마무리 이슈 생성 중...
✓ BE-05 이슈 생성 완료
✓ FE-07 이슈 생성 완료

================================================
모든 GitHub 이슈 생성이 완료되었습니다!
총 11개의 이슈가 생성되었습니다.
================================================
```

## 생성 결과 확인

```powershell
# 이슈 목록 확인
gh issue list

# 특정 Phase의 이슈만 확인
gh issue list --label "backend"
gh issue list --label "frontend"
gh issue list --label "complexity:high"
```

## 문제 해결

### 권한 오류

```
Error: HTTP 403: Resource not accessible by integration
```

**해결**: GitHub 인증 재실행
```powershell
gh auth logout
gh auth login
```

### 실행 정책 오류

```
cannot be loaded because running scripts is disabled
```

**해결**: 실행 정책 변경
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 저장소 인식 오류

```
Error: GraphQL: Could not resolve to a Repository
```

**해결**: 올바른 디렉토리인지 확인
```powershell
cd C:\test\jkn-todolist
git remote -v
```

## 수동 생성 (대안)

스크립트가 작동하지 않을 경우, 각 이슈를 수동으로 생성:

```powershell
# 예시: BE-01 이슈 생성
gh issue create `
  --title "[Phase 1] BE-01: Node.js/Express 프로젝트 초기화" `
  --label "setup,backend,complexity:low" `
  --body-file "issue-be-01.md"
```

모든 이슈에 대해 반복하거나, GitHub 웹 인터페이스를 사용하세요.

## 다음 단계

이슈 생성 후:
1. GitHub 저장소의 Issues 탭에서 확인
2. Project 보드에 이슈 추가 (선택사항)
3. Phase 1부터 순차적으로 작업 시작
4. 각 이슈를 완료하면 체크리스트 업데이트

## 참고 링크

- [GitHub CLI 문서](https://cli.github.com/manual/)
- [gh issue create 사용법](https://cli.github.com/manual/gh_issue_create)
- [프로젝트 실행 계획](../docs/7-implementation_plan.md)
