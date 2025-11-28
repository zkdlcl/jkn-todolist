# 위치 확인 기능 (Location Tracking Feature)

## 개요

사용자가 PC에서 QR 코드를 생성하고, 모바일에서 QR 코드를 스캔하여 위치 권한을 허용하면 실시간으로 위치를 받아 지도에 표시하는 기능입니다.

## 기능 명세

### 1. PC 화면 (Desktop View)

- **페이지**: `/location` 라우트 추가
- **주요 기능**:
  - QR 코드 표시
  - 연결된 모바일 기기의 위치를 지도에 표시
  - 실시간 위치 업데이트

### 2. 모바일 화면 (Mobile View)

- **페이지**: `/mobile/location/:sessionId` 라우트
- **주요 기능**:
  - 위치 권한 요청
  - 위치 정보 전송
  - 연결 상태 표시

## 기술 스택

### Frontend

- **QR 코드 생성**: `qrcode.react` 라이브러리
- **지도**: Kakao Map API (가장 간편하고 한국 지도에 최적화)
- **실시간 통신**: WebSocket 또는 Socket.io

### Backend

- **실시간 통신**: Socket.io
- **세션 관리**: In-memory (간단한 Map 객체)

## 데이터 흐름

1. **PC에서 접속**:

   - 고유 세션 ID 생성
   - QR 코드 생성 (세션 ID 포함된 URL)
   - WebSocket 연결 대기

2. **모바일에서 QR 스캔**:

   - QR 코드의 URL로 접속 (`/mobile/location/:sessionId`)
   - 위치 권한 요청
   - 위치 정보를 WebSocket으로 전송

3. **PC에서 위치 수신**:
   - WebSocket으로 위치 정보 수신
   - Kakao Map에 마커 표시
   - 실시간 업데이트

## API 설계

### WebSocket Events

#### Client → Server

- `join-session`: 세션 참여 (세션 ID 포함)
- `send-location`: 위치 정보 전송
  ```json
  {
    "latitude": 37.5665,
    "longitude": 126.978,
    "accuracy": 10,
    "timestamp": 1234567890
  }
  ```

#### Server → Client

- `session-created`: 세션 생성 완료
- `mobile-connected`: 모바일 기기 연결됨
- `location-update`: 위치 정보 업데이트
- `mobile-disconnected`: 모바일 기기 연결 해제

## 환경 변수

```env
# Kakao Map API Key
VITE_KAKAO_MAP_API_KEY=your_kakao_api_key_here
```

## 보안 고려사항

1. **세션 만료**: 세션은 1시간 후 자동 만료
2. **인증**: 로그인한 사용자만 위치 확인 페이지 접근 가능
3. **HTTPS**: 위치 권한은 HTTPS에서만 작동
4. **개인정보 보호**: 위치 정보는 저장하지 않고 실시간 전송만 수행

## MVP 범위

### Phase 1: 기본 기능

- [x] QR 코드 생성
- [x] 모바일에서 위치 권한 요청
- [x] 위치 정보 WebSocket 전송
- [x] PC에서 지도에 위치 표시

### Phase 2: 개선 (선택)

- [ ] 여러 모바일 기기 동시 연결
- [ ] 위치 이동 경로 표시
- [ ] 위치 히스토리 저장 (선택적)

## 참고 자료

- [Kakao Map Web API 문서](https://apis.map.kakao.com/web/)
- [Socket.io 문서](https://socket.io/docs/)
- [qrcode.react 문서](https://github.com/zpao/qrcode.react)
