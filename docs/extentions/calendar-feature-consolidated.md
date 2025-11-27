# 9. 달력 기능 명세서 (Consolidated) - @CalendarFeature

## @CalendarFeature-Overview

### 기능 목표

달력 뷰를 통해 할일을 시각적으로 관리하고, 국경일 정보를 함께 표시하여 사용자의 일정 관리 효율성을 극대화한다.

### 핵심 기능

1. **월간 달력 뷰**: 현재 월의 달력에 할일과 국경일 표시
2. **날짜별 할일 표시**: 각 날짜에 해당하는 할일 개수 및 미리보기
3. **인터랙션**: 달력에서 직접 할일 생성, 수정, 완료, 삭제
4. **국경일 표시**: DB에 저장된 국경일 정보 표시

---

## @CalendarFeature-API-Integration

### 국경일 API 연동

**API 제공**: 한국천문연구원 (KASI) 특일 정보 제공 서비스

**API 키**: `18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e`

**Base URL**: `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`

**엔드포인트**:

- `getRestDeInfo`: 월별 공휴일 정보 조회
- `getAnniversaryInfo`: 연간 기념일 정보 조회
- `getHoliDeInfo`: 월별 국경일 정보 조회 (추후 확장)

**DateKind 분류**:

- `01`: 국경일 (어린이날, 광복절, 개천절)
- `02`: 기념일 (의병의 날, 정보보호의 날 등)
- `03`: 24절기 (청명, 경칩, 하지 등)
- `04`: 잡절 (단오, 한식 등)

**특이사항**:

- 제헌절은 `getHoliDeInfo`에 포함되나 `isHoliday=N`으로 표시
- 제헌절은 `getRestDeInfo`에서는 제외됨

**데이터 갱신 주기**:

- **특일 정보**: 연 1회, 6~8월경 차차년도(+2년) 데이터 우선 업데이트
- **기념일, 24절기, 잡절**: 11월경 업데이트
- **임시공휴일**: 발생 시 최대 1일 이내 업데이트
- **대체공휴일**: 대통령령 시행 후 업데이트

**담당자 정보**:

- **담당자**: 유솔
- **부서**: 천문전산융합센터
- **연락처**: 042-865-2188
- **이메일**: sol0993@kasi.re.kr

**추가 엔드포인트**:

- `get24DivisionsInfo`: 24절기 정보 조회
- `getSundryDayInfo`: 잡절 정보 조회

---

## @CalendarFeature-UserScenarios

### 시나리오 1: 월간 일정 확인

**배경**: 사용자가 이번 달 전체 일정을 한눈에 파악하고 싶다.

**단계**:

1. 사용자가 "달력" 메뉴 클릭
2. 현재 월의 달력이 표시됨
3. 각 날짜에 할일 개수와 국경일이 표시됨
4. 마감일이 임박한 날짜는 강조 표시

**결과**: 한 달 전체 일정을 시각적으로 파악하여 업무 계획 수립

### 시나리오 2: 특정 날짜 할일 관리

**배경**: 사용자가 특정 날짜의 할일을 확인하고 새로운 할일을 추가하고 싶다.

**단계**:

1. 달력에서 특정 날짜 클릭
2. 해당 날짜의 할일 목록이 사이드 패널에 표시됨
3. "할일 추가" 버튼 클릭
4. 모달에서 제목, 내용 등 입력 (날짜는 선택한 날짜로 자동 설정)
5. 저장 시 달력에 즉시 반영

**결과**: 날짜별로 할일을 쉽게 추가하고 관리

### 시나리오 3: 국경일 확인

**배경**: 사용자가 이번 달 공휴일을 확인하고 싶다.

**단계**:

1. 달력에서 국경일이 있는 날짜 확인 (예: 빨간색으로 표시)
2. 국경일 날짜 위에 마우스 호버
3. 툴팁으로 국경일 이름 표시 (예: "설날")

**결과**: 공휴일을 고려한 일정 계획 수립

---

## @CalendarFeature-Requirements

### 달력 UI

#### 월간 달력 뷰

**필수 요소**:

- 현재 월/년도 표시
- 이전/다음 달 네비게이션
- 요일 헤더 (일요일~토요일)
- 날짜 셀 (6주 표시)

**각 날짜 셀 표시 정보**:

- 날짜 숫자
- 할일 개수 (예: "3개")
- 할일 상태 표시 (점 또는 배지)
- 국경일 이름 (있는 경우)

#### 날짜 셀 스타일

**상태별 스타일**:

- 오늘: 파란색 테두리
- 국경일: 빨간색 텍스트
- 할일 있음: 배지 표시
- 마감일 임박(3일 이내): 주황색 강조
- 과거 날짜: 회색 (비활성)

#### 날짜 클릭 시

**동작**:

1. 해당 날짜의 할일 목록을 사이드 패널에 표시
2. "할일 추가" 버튼 활성화 (해당 날짜로 자동 설정)
3. 기존 할일 클릭 시 수정 모달 열기

---

## @CalendarFeature-BackendAPI

### 달력 데이터 조회 API

**엔드포인트**: `GET /api/calendar/{year}/{month}`

**요청 파라미터**:

- `year`: 연도 (YYYY)
- `month`: 월 (1~12)

**응답 데이터**:

```json
{
  "success": true,
  "data": {
    "year": 2025,
    "month": 11,
    "todos": [
      {
        "id": 1,
        "title": "프로젝트 기획",
        "due_date": "2025-11-27",
        "is_completed": false,
        "priority": "HIGH"
      }
    ],
    "publicEvents": [
      {
        "id": 1,
        "event_name": "크리스마스",
        "event_date": "2025-12-25",
        "is_holiday": true
      }
    ]
  }
}
```

### 기존 API 활용

- 할일 생성: `POST /api/todos`
- 할일 수정: `PATCH /api/todos/:id`
- 할일 삭제: `DELETE /api/todos/:id`
- 할일 완료 토글: `PATCH /api/todos/:id` (is_completed 업데이트)

---

## @CalendarFeature-Frontend

### 달력 라이브러리

**추천 라이브러리**: `react-calendar`

**선정 이유**:

- 간단하고 가볍다
- 커스터마이징 용이
- TypeScript 지원
- 한국어 로케일 지원

**설치**:

```bash
npm install react-calendar
npm install date-fns  # 날짜 유틸리티 (이미 설치됨)
```

### 컴포넌트 구조

```
CalendarPage/
├── CalendarView       # 달력 메인 뷰
├── DayCell            # 각 날짜 셀
├── TodoSidebar        # 선택한 날짜의 할일 목록
└── CalendarHeader     # 월/년도 헤더 및 네비게이션
```

### State 관리

**Zustand Store 확장**:

```javascript
// useCalendarStore.js
{
  currentDate: Date,        // 현재 선택된 날짜
  viewMonth: { year, month }, // 보고 있는 월
  calendarTodos: [],        // 해당 월의 모든 할일
  publicEvents: [],         // 해당 월의 국경일
  selectedDate: Date,       // 사이드바에 표시할 날짜
}
```

---

## @CalendarFeature-Backend-Implementation

### 새 Repository 메서드

```javascript
// calendarRepository.js
getTodosByMonth(userId, year, month)
getPublicEventsByMonth(year, month)
```

### 새 Service 메서드

```javascript
// calendarService.js
getCalendarData(userId, year, month)
```

### 새 Controller & Routes

```javascript
// calendarController.js
getCalendarData(req, res)

// calendarRoutes.js
GET /api/calendar/:year/:month
```

---

## @CalendarFeature-KASI-API-Integration

### 환경 설정

- `server/.env`에 `KASI_API_KEY` 추가
- `server/.env.example` 업데이트
- `.gitignore`에 `.env` 포함 확인 (이미 완료 ✓)

### DB 테이블 준비

- `public_events` 테이블에 UNIQUE 제약조건 확인
  ```sql
  UNIQUE(event_date, event_name)
  ```

### 동기화 전략

- 초기 동기화: `node server/scripts/syncHolidays.js 2025`
- 향후 동기화: 연 1회 수동 실행 or 스케줄러 (cron)

### API 클라이언트 구현

```javascript
// kasiAPIService.js
class KasiAPIService {
  constructor() {
    this.baseURL = process.env.KASI_API_BASE_URL;
    this.apiKey = process.env.KASI_API_KEY;
  }

  async getMonthlyHolidays(year, month) {
    // 월별 공휴일 조회 (getRestDeInfo)
  }

  async getAnnualEvents(year) {
    // 연간 이벤트 조회 (getAnniversaryInfo)
  }

  async getHoliDeInfo(year, month) {
    // 월별 국경일 조회 (getHoliDeInfo)
  }

  async get24DivisionsInfo(year) {
    // 24절기 정보 조회
  }

  async getSundryDayInfo(year) {
    // 잡절 정보 조회
  }
}
```

### DB 동기화 서비스

```javascript
// publicEventSyncService.js
class PublicEventSyncService {
  async syncHolidays(year) {
    // KASI API에서 데이터 가져와 DB에 저장
  }

  async syncAnniversary(year) {
    // 기념일 데이터 동기화
  }

  async syncDivisions(year) {
    // 24절기 데이터 동기화
  }
}
```

### 동기화 스크립트

```javascript
// server/scripts/syncHolidays.js
// 수동 실행 가능한 동기화 스크립트
```

---

## @CalendarFeature-UIUX

### 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│ [로고] JKN-TODOLIST        2025년 11월  [◀] [▶]    [로그아웃] │
├──────────┬──────────────────────────────────────────────────┤
│ 할일목록  │         일  월  화  수  목  금  토                │
│ 달력 ✓   │      27  28  29  30  31   1   2                 │
│ 휴지통   │       3   4   5   6   7   8   9                 │
│          │      10  11  12  13  14  15  16                 │
│          │      17  18  19  20  21  22  23                 │
│          │      24  25  26 [27]  28  29  30                │
│          │       1   2   3   4   5   6   7                 │
│          │                                                  │
│          │ 2025-11-27 (수)                                  │
│          │ ┌──────────────────────────────────────────────┐ │
│          │ │ ☐ 프로젝트 발표 준비  [높음]                  │ │
│          │ │ ☑ 회의록 작성 (완료)                          │ │
│          │ └──────────────────────────────────────────────┘ │
│          │ [+ 할일 추가]                                     │
└──────────┴──────────────────────────────────────────────────┘
```

### 색상 가이드

- 오늘: 파란색 테두리 (#3B82F6)
- 국경일: 빨간색 텍스트 (#EF4444)
- 할일 있음: 작은 파란색 점
- 마감 임박: 주황색 배경 (#F59E0B)
- 과거: 회색 (#9CA3AF)

---

## @CalendarFeature-Development-Phases

### Phase 1: 백엔드 API (BE-06)

1. CalendarRepository 생성
2. CalendarService 생성
3. CalendarController & Routes 생성
4. 통합 테스트 작성

### Phase 2: 달력 UI (FE-09)

1. react-calendar 설치 및 기본 설정
2. CalendarPage 컴포넌트 생성
3. 월별 데이터 조회 API 연동
4. 날짜 셀 커스터마이징 (할일 표시)

### Phase 3: 인터랙션 (FE-10)

1. 날짜 클릭 시 사이드바 표시
2. 사이드바에서 할일 추가/수정/삭제
3. 달력 실시간 업데이트

### Phase 4: KASI API 연동 (BE-07)

1. kasiAPIService 구현
2. publicEventSyncService 구현
3. 동기화 스크립트 작성
4. 환경 변수 설정
5. 테스트 및 검증

---

## @CalendarFeature-Database

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

## @CalendarFeature-Acceptance-Criteria

### 백엔드

- [ ] 달력 데이터 조회 API 구현
- [ ] 해당 월의 할일 및 국경일 반환
- [ ] KASI API 클라이언트 구현
- [ ] DB 동기화 서비스 구현
- [ ] 통합 테스트 통과

### 프론트엔드

- [ ] 월간 달력 뷰 표시
- [ ] 날짜별 할일 표시 (배지/점)
- [ ] 날짜 클릭 시 사이드바 표시
- [ ] 사이드바에서 할일 CRUD 가능
- [ ] 국경일 표시 (빨간색)
- [ ] 이전/다음 달 네비게이션

---

## @CalendarFeature-Extensibility

### 확장 가능한 아키텍처 설계

#### 백엔드 확장

**API 레이어**:
- `calendarService.js`는 확장 가능한 구조로 설계
- `kasiAPIService.js`는 다양한 API 엔드포인트를 추가할 수 있도록 확장 설계
- `publicEventSyncService.js`는 다양한 이벤트 타입을 처리할 수 있도록 설계

**DB 레이어**:
- `public_events` 테이블의 `event_type` 필드를 통해 다양한 이벤트 타입 확장
- `event_type` 필드 값: `NATIONAL_HOLIDAY`, `MEMORIAL_DAY`, `SOLAR_TERM`, `SEASONAL_DAY`, `OTHER`

#### 프론트엔드 확장

**UI/UX 확장**:
- `CalendarView` 컴포넌트는 다른 뷰(주간, 일간)로 확장 가능하도록 설계
- `DayCell` 컴포넌트는 다양한 이벤트 타입 표시 가능
- `TodoSidebar`는 다양한 날짜 기반 인터랙션 확장을 고려

### 향후 확장 기능

#### 1. API 연동 확장

- **공공 데이터 포털 API 추가 연동**
  - 다양한 공공기관의 일정 정보 통합
  - 자동 동기화 기능
  - 누락된 데이터 자동 업데이트

#### 2. UI/UX 확장

- **다양한 달력 뷰**
  - 주간 뷰 / 일간 뷰 추가
  - 연간 요약 뷰
- **인터랙션 확장**
  - 드래그 앤 드롭으로 할일 날짜 변경
  - 달력 내 할일 복사 기능
- **내보내기 기능**
  - 달력 내보내기 (iCal 형식)
  - 이미지 내보내기 기능

#### 3. 알림 및 리마인더

- 날짜 임박 할일 알림
- 공휴일 전날 알림
- 커스텀 알림 설정

#### 4. 사용자 맞춤 기능

- 개인 일정 추가
- 일정 그룹/카테고리 기능
- 공유 일정 기능 (관리자 기능)

### 모듈별 확장 가이드

#### 백엔드 모듈 확장

**새로운 API 엔드포인트 추가**:
1. `routes/`에 새 라우트 파일 생성
2. `controller/`에 새 컨트롤러 생성
3. `service/`에 비즈니스 로직 추가
4. `repository/`에 DB 쿼리 메서드 추가
5. `middleware/`에 필요한 미들웨어 추가

**새로운 이벤트 타입 추가**:
1. `public_events` 테이블에 새로운 `event_type` 값 추가
2. `kasiAPIService.js`에 새 엔드포인트 메서드 추가
3. `publicEventSyncService.js`에 동기화 로직 추가

#### 프론트엔드 모듈 확장

**새로운 UI 컴포넌트 추가**:
1. `client/src/components/`에 새 컴포넌트 폴더 생성
2. `client/src/store/`에 필요한 store 확장
3. `client/src/pages/`에 새 페이지 추가 (필요시)
4. `client/src/services/`에 API 호출 함수 추가

**새로운 기능 통합**:
1. `useCalendarStore`에 새로운 상태 추가
2. 컴포넌트에 새로운 기능 통합
3. 사용자 인터랙션 로직 구현

### 데이터 갱신 주기

- **특일 정보**: 연 1회, 6~8월경 차차년도(+2년) 데이터 우선 업데이트
- **기념일, 24절기, 잡절**: 11월경 업데이트
- **임시공휴일**: 발생 시 최대 1일 이내 업데이트
- **대체공휴일**: 대통령령 시행 후 업데이트

---

## @CalendarFeature-Implementation-Guidelines

### 시작하기

다음 단계로 **BE-06 (달력 데이터 조회 API 구현)**부터 시작할 수 있습니다!

1. CalendarRepository 생성
   ```javascript
   // repository/calendarRepository.js
   getTodosByMonth(userId, year, month)
   getPublicEventsByMonth(year, month)
   ```

2. CalendarService 생성
   ```javascript
   // service/calendarService.js
   getCalendarData(userId, year, month)
   ```

3. CalendarController & Routes 생성
   ```javascript
   // controller/calendarController.js
   getCalendarData(req, res)

   // routes/calendarRoutes.js
   GET /api/calendar/:year/:month
   ```

### 환경 변수 설정

**server/.env**:
```env
KASI_API_KEY=18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

**server/.env.example**:
```env
KASI_API_KEY=your_kasi_api_key_here
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

### 프론트엔드 설치

```bash
cd client
npm install react-calendar
```

### 테스트 API 호출

**테스트 1: 2025년 11월 공휴일 조회**

```bash
curl "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e&solYear=2025&solMonth=11&_type=json"
```

**테스트 2: 2025년 연간 데이터 조회**

```bash
curl "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getAnniversaryInfo?serviceKey=18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e&solYear=2025&_type=json"
```

### 구현 전 체크리스트

- [ ] `react-calendar` 설치 확인
- [ ] 환경 변수 설정 완료
- [ ] `public_events` 테이블 구조 확인
- [ ] 기존 테스트 모두 통과 확인
- [ ] Swagger 문서 업데이트 계획 수립