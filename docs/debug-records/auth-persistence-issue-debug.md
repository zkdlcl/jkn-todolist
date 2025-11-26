# 인증 상태 유지 문제 디버깅 기록

## 문제 개요

- **문제 발생 상황**: 로그인 후 F5 새로고침 시 로그인 상태가 풀리는 현상 발생
- **예상 동작**: 로그인 상태는 새로고침 후에도 유지되어야 함
- **실제 동작**: 새로고침 시 로그아웃되고 로그인 페이지로 리다이렉션됨
- **발생 환경**: JKN-TODOLIST 프로젝트의 프론트엔드 (React + Zustand + JWT)

## 문제 원인 분석

초기 진단 결과, 문제는 다음과 같은 원인들로 인해 발생할 수 있음:

1. **토큰 저장 방식 문제**: JWT 토큰이 새로고침 후에도 유지되지 않음
2. **상태 복원 로직 문제**: 애플리케이션 시작 시 저장된 토큰으로 인증 상태를 복원하지 못함
3. **토큰 만료 처리 문제**: 액세스 토큰이 만료되었을 때 리프레시 토큰으로 갱신하지 못함
4. **API 엔드포인트 문제**: 백엔드에 존재하지 않는 엔드포인트 호출로 인한 오류

## 문제 해결 과정

### 1. 초기 상태 확인

- `zustand`의 `persist` 미들웨어를 사용하여 인증 상태를 로컬 스토리지에 저장하고 있었음
- `useAuthStore.js`의 `restoreAuth` 함수를 통해 애플리케이션 시작 시 토큰 복원 로직이 구현되어 있었음
- `App.jsx`에서 `useEffect`를 통해 앱 시작 시 `restoreAuth` 함수 호출하고 있었음

### 2. 디버깅 로그 추가

- `apiClient.js`에 요청/응답 인터셉터에 콘솔 로그 추가
- `useAuthStore.js`에 `restoreAuth` 함수에 콘솔 로그 추가
- 콘솔 로그를 통해 문제 발생 지점을 파악

### 3. 콘솔 로그 분석

로그를 분석한 결과, 다음과 같은 문제를 확인:

```
restoreAuth 호출됨
useAuthStore.js:133 로컬 스토리지에서 가져온 토큰: 
{accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}

authAPI.js:34 GET http://localhost:3000/api/auth/me 404 (Not Found)

apiClient.js:39 API 응답 에러 발생: 404 Request failed with status code 404

useAuthStore.js:153 restoreAuth - 토큰 유효성 검증 실패: AxiosError

useAuthStore.js:164 restoreAuth - 토큰 삭제 및 상태 초기화
```

### 4. 문제 원인 확인

- `restoreAuth` 함수에서 `authAPI.getMe(accessToken)` 호출 시 `/api/auth/me` 엔드포인트가 404 오류 발생
- 이로 인해 catch 블록이 실행되어 토큰이 삭제되고 인증 상태가 초기화됨
- 따라서 로그인 상태가 풀리는 문제가 발생

## 문제 해결 방안

### 1. 토큰 유효성 검사 방식 수정

- 더 이상 `/api/auth/me` 엔드포인트를 사용하지 않고, JWT 토큰의 페이로드를 디코딩하여 만료 여부를 확인
- JWT 토큰은 3개의 부분(Header.Payload.Signature)으로 구성되며, 두 번째 부분(Payload)에 만료 시간 정보가 포함되어 있음
- Payload를 Base64 디코딩하여 `exp` 필드를 확인하면 토큰 만료 여부를 판단할 수 있음

### 2. 코드 수정

#### useAuthStore.js 수정

```javascript
/**
 * 저장된 토큰으로 인증 상태 복원
 */
restoreAuth: async () => {
  console.log("restoreAuth 호출됨");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("로컬 스토리지에서 가져온 토큰:", {
    accessToken,
    refreshToken,
  });

  if (accessToken && refreshToken) {
    try {
      // JWT 토큰의 유효성만 확인 (디코딩으로 만료 시간 확인)
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const isTokenExpired = tokenPayload.exp * 1000 < Date.now();

      if (isTokenExpired) {
        console.log("액세스 토큰이 만료됨, 리프레시 토큰으로 갱신 시도");
        // 토큰이 만료된 경우 서버에 갱신 요청
        const response = await apiClient.post("/auth/refresh", { refreshToken });
        const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // 새로운 토큰으로 상태 업데이트
        set({
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          isAuthenticated: true,
        });
        
        // 로컬 스토리지에 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        
        console.log("토큰 갱신 후 상태 업데이트 완료");
      } else {
        // 토큰이 유효하므로 바로 사용자 정보와 함께 상태 업데이트
        const user = {
          id: tokenPayload.userId,
          email: tokenPayload.email,
          role: tokenPayload.role
        };

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        console.log("저장된 토큰이 유효하여 상태 업데이트 완료");
      }
    } catch (error) {
      console.error("restoreAuth - 토큰 유효성 검증 또는 갱신 실패:", error);
      // 토큰이 유효하지 않거나 갱신에 실패하면 로컬 스토리지에서 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      console.log("restoreAuth - 토큰 삭제 및 상태 초기화");
    }
  } else {
    console.log("restoreAuth - 저장된 토큰 없음");
  }
},
```

#### authAPI.js에서 getMe 함수 주석 처리

```javascript
/**
 * 사용자 정보 가져오기 (토큰 검증용)
 * @param {string} accessToken
 * @returns {Promise}
 * 
 * NOTE: 현재 백엔드에 /auth/me 엔드포인트가 없어 404 오류 발생
 * 토큰 유효성 검사는 restoreAuth 함수에서 JWT 디코딩 방식으로 검증
 */
// getMe: async (accessToken) => {
//   // 직접 토큰을 헤더에 포함시켜 요청
//   const response = await apiClient.get("/auth/me", {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   return response;
// },
```

## 최종 결과

문제를 해결한 후, 다음과 같은 테스트 결과를 확인:

- 로그인 후 F5 새로고침을 해도 로그인 상태가 유지됨
- JWT 토큰이 만료되지 않았을 경우, 바로 상태를 복원함
- JWT 토큰이 만료되었을 경우, 리프레시 토큰으로 새로운 액세스 토큰을 발급받아 상태를 복원함
- 디버깅 로그를 통해 문제 해결 과정이 정상적으로 실행됨을 확인

## 학습 포인트

1. **JWT 토큰 구조 이해**: JWT 토큰은 Header.Payload.Signature 3개의 부분으로 구성되며, Payload 부분을 디코딩하면 토큰 관련 정보를 확인할 수 있음

2. **토큰 만료 처리**: 액세스 토큰이 만료되었을 때 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받는 방식을 구현하는 것이 중요함

3. **디버깅 로그의 중요성**: 문제 원인을 파악하기 위해 콘솔 로그를 적절히 활용하여 문제 발생 지점을 정확히 파악할 수 있었음

4. **API 엔드포인트 존재 여부 확인**: 프론트엔드에서 백엔드 API를 호출할 때, 해당 엔드포인트가 실제로 존재하는지 확인하는 것이 중요함