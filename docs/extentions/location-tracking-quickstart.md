# 위치 확인 기능 구현 가이드

담당 개발자를 위한 빠른 구현 가이드

## 필요한 패키지 설치

### Backend

```bash
cd server
npm install socket.io uuid
```

### Frontend

```bash
cd client
npm install socket.io-client qrcode.react
```

## Kakao Map API Key 발급

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 등록
3. JavaScript 키 발급
4. 플랫폼 설정에서 Web 플랫폼 등록 (localhost 및 배포 도메인)
5. `.env` 파일에 추가:
   ```
   VITE_KAKAO_MAP_API_KEY=your_key_here
   ```

## 구현 체크리스트

### Backend (server/)

- [ ] Socket.io 서버 설정 (`server/index.js`)
- [ ] 세션 관리 서비스 생성 (`server/src/services/locationSessionService.js`)
- [ ] Socket 이벤트 핸들러 구현 (`server/src/sockets/locationSocket.js`)

### Frontend - PC View (client/)

- [ ] LocationPage 컴포넌트 생성 (`client/src/pages/LocationPage.jsx`)
- [ ] QR 코드 생성 (qrcode.react 사용)
- [ ] Kakao Map 컴포넌트 (`client/src/components/KakaoMap.jsx`)
- [ ] Socket.io 클라이언트 연결
- [ ] 라우트 추가 (`/location`)
- [ ] 네비게이션 메뉴에 "내 위치 확인" 추가

### Frontend - Mobile View (client/)

- [ ] MobileLocationPage 컴포넌트 생성 (`client/src/pages/MobileLocationPage.jsx`)
- [ ] Geolocation API 통합
- [ ] Socket.io 클라이언트 연결
- [ ] 라우트 추가 (`/mobile/location/:sessionId`)

## 참고 문서

- [Socket.io 공식 문서](https://socket.io/docs/)
- [Kakao Map Web API](https://apis.map.kakao.com/web/)
- [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
