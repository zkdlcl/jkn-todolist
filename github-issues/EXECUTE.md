# GitHub Issues 즉시 생성

## 바로 실행하기

PowerShell을 열고 다음 명령어를 복사하여 붙여넣으세요:

```powershell
cd C:\test\jkn-todolist\github-issues && .\create-issues.ps1
```

## 단계별 실행

### 1단계: GitHub CLI 확인

```powershell
gh --version
```

출력 예시: `gh version 2.x.x`

만약 설치되지 않았다면:
```powershell
winget install --id GitHub.cli
```

### 2단계: GitHub 인증 확인

```powershell
gh auth status
```

로그인이 필요하다면:
```powershell
gh auth login
# 브라우저를 통해 인증 진행
```

### 3단계: 이슈 생성 스크립트 실행

```powershell
# 디렉토리 이동
cd C:\test\jkn-todolist\github-issues

# 실행 권한 설정 (최초 1회만)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 스크립트 실행
.\create-issues.ps1
```

### 4단계: 생성 결과 확인

```powershell
# 이슈 목록 확인
gh issue list

# 또는 브라우저에서 확인
gh repo view --web
```

## 예상 실행 시간

약 30초 ~ 1분 (네트워크 속도에 따라 다름)

## 성공 확인 방법

다음과 같은 메시지가 표시되면 성공:

```
================================================
모든 GitHub 이슈 생성이 완료되었습니다!
총 11개의 이슈가 생성되었습니다.
================================================
```

## 이슈 확인

생성된 이슈는 GitHub 저장소에서 확인:

```powershell
# CLI에서 확인
gh issue list

# 브라우저에서 확인
start https://github.com/YOUR_USERNAME/jkn-todolist/issues
```

## 문제 발생 시

### 권한 오류
```powershell
gh auth refresh
```

### 실행 정책 오류
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\create-issues.ps1
```

### 네트워크 오류
인터넷 연결을 확인하고 다시 시도하세요.

## 수동 생성 (백업 방법)

스크립트가 작동하지 않을 경우, 각 마크다운 파일을 참조하여 GitHub 웹 인터페이스에서 수동으로 생성하세요:

1. https://github.com/YOUR_USERNAME/jkn-todolist/issues/new 접속
2. `issue-be-01.md` 파일 내용 복사
3. 제목과 본문 붙여넣기
4. Labels 추가
5. "Submit new issue" 클릭
6. 나머지 11개 이슈에 대해 반복

## 다음 단계

이슈 생성 후:
1. ✅ GitHub Issues 탭에서 11개 이슈 확인
2. ✅ Phase 1부터 작업 시작
3. ✅ 각 이슈 완료 시 체크리스트 업데이트
4. ✅ 커밋 메시지에 이슈 번호 포함 (예: `git commit -m "feat: BE-01 구현 완료 #1"`)

**좋은 코딩 되세요!** 🚀
