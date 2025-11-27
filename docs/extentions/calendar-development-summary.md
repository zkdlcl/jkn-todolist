# 달력 기능 개발 문서 총정리

## 📚 생성된 문서

### 1. **docs/9-calendar-feature.md** ✅

- **달력 기능 전체 명세서**
- 사용자 시나리오 3개
- 기능 요구사항 (UI, 백엔드 API, 국경일)
- 기술 스택 (`react-calendar` 사용)
- 컴포넌트 구조 및 State 관리
- 개발 4단계 (BE-06, FE-09, FE-10, BE-07)

### 2. **docs/10-kasi-api-integration.md** ✅

- **한국천문연구원 특일 정보 API 연동 가이드**
- API 키: `18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e`
- 3가지 엔드포인트 (월별, 연간, 특정일자 조회)
- 응답 형식 및 필드 설명
- 백엔드 구현 예제 코드
  - `kasiAPIService.js`: API 클라이언트
  - `publicEventSyncService.js`: DB 동기화 서비스
  - `syncHolidays.js`: 수동 동기화 스크립트
- 에러 처리 및 테스트 가이드

### 3. **docs/7-implementation_plan.md** (업데이트) ✅

- **Phase 5: 달력 기능** 추가
- BE-06: 달력 데이터 조회 API
- FE-09: 달력 UI 구현
- FE-10: 달력 인터랙션
- BE-07: KASI API 연동

### 4. **docs/8-wireframes.md** (업데이트) ✅

- **8.5 달력 페이지** 와이어프레임 추가
- 날짜 셀 디자인
- 상태별 스타일 가이드

---

## 🔑 API 키 정보

**한국천문연구원 특일 정보 API**

- **API 키**: `18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e`
- **Base URL**: `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`

**환경 변수 설정**:

```env
# server/.env
KASI_API_KEY=18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

**보안**:

- `.gitignore`에 `.env` 포함됨 ✅
- API 키는 절대 GitHub에 커밋하지 않음
- `.env.example` 파일 생성 권장

---

## 🛠️ 기술 스택

### 프론트엔드

- **달력 라이브러리**: `react-calendar`
- **날짜 유틸**: `date-fns` (이미 설치됨)
- **State 관리**: Zustand (`useCalendarStore`)

### 백엔드

- **HTTP 클라이언트**: `axios`
- **새 엔드포인트**: `GET /api/calendar/:year/:month`
- **DB**: PostgreSQL (`public_events` 테이블)

---

## 📋 개발 순서 (권장)

### Phase 1: 백엔드 API (BE-06)

1. CalendarRepository 생성
2. CalendarService 생성
3. CalendarController & Routes 생성
4. 통합 테스트 작성

### Phase 2: 달력 UI (FE-09)

1. react-calendar 설치
2. CalendarPage 컴포넌트 생성
3. 월별 데이터 조회 API 연동
4. 날짜 셀 커스터마이징

### Phase 3: 인터랙션 (FE-10)

1. 날짜 클릭 시 사이드바 표시
2. 사이드바에서 할일 CRUD
3. 달력 실시간 업데이트

### Phase 4: KASI API 연동 (BE-07)

1. kasiAPIService 구현
2. publicEventSyncService 구현
3. 동기화 스크립트 작성
4. 환경 변수 설정
5. 테스트 및 검증

---

## 📊 데이터베이스

### public_events 테이블 (기존)

```sql
CREATE TABLE public_events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  is_holiday BOOLEAN DEFAULT FALSE,
  event_type VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_date, event_name)
);
```

### event_type 값

- `NATIONAL_HOLIDAY`: 국경일
- `MEMORIAL_DAY`: 기념일
- `SOLAR_TERM`: 24절기
- `SEASONAL_DAY`: 잡절
- `OTHER`: 기타

---

## 🎯 주요 기능

### 1. 달력 뷰

- 월간 달력 표시
- 이전/다음 달 네비게이션
- 오늘 날짜 강조
- 국경일 빨간색 표시
- 할일 개수 배지

### 2. 날짜 클릭 인터랙션

- 선택한 날짜의 할일 목록 표시
- 사이드바에 할일 리스트
- 해당 날짜로 할일 추가
- 할일 수정/완료/삭제

### 3. 국경일 관리

- DB에서 국경일 조회
- KASI API로 자동 동기화
- 연간/월간 데이터 업데이트
- 수동 동기화 스크립트

---

## ✅ 인수 조건

### 백엔드

- [ ] 달력 데이터 조회 API 구현
- [ ] 월별 할일 및 국경일 반환
- [ ] KASI API 클라이언트 구현
- [ ] DB 동기화 서비스 구현
- [ ] 통합 테스트 통과

### 프론트엔드

- [ ] 월간 달력 뷰 표시
- [ ] 날짜별 할일 표시
- [ ] 날짜 클릭 시 사이드바
- [ ] 사이드바에서 할일 CRUD
- [ ] 국경일 표시 (빨간색)
- [ ] 이전/다음 달 네비게이션

---

## 🚀 시작하기

다음 단계로 **BE-06 (달력 데이터 조회 API 구현)**부터 시작할 수 있습니다!

참고 문서:

1. `docs/9-calendar-feature.md` - 달력 기능 전체 명세
2. `docs/10-kasi-api-integration.md` - KASI API 연동 가이드
3. `docs/7-implementation_plan.md` - Phase 5 실행 계획
4. `docs/8-wireframes.md` - 달력 UI 와이어프레임
