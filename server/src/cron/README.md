# 공휴일 자동 동기화 스케줄러 (Cron Jobs)

## 개요

JKN-TODOLIST는 한국천문연구원(KASI) API를 통해 공휴일, 기념일, 24절기, 잡절 정보를 자동으로 동기화합니다.

## 스케줄러 구성

### 1. 연간 동기화 (Annual Sync)

**스케줄**: 매년 7월 1일 오전 3시 (KST)  
**Cron 표현식**: `0 3 1 7 *`

**동작**:

- 차차년도(+2년) 데이터를 자동으로 동기화합니다.
- 예: 2025년 7월 1일에는 2027년 데이터를 가져옵니다.

**대상 데이터**:

- 공휴일 (HOLIDAY)
- 기념일 (NOTICE)
- 24절기 (SOLAR_TERM)
- 잡절 (SEASONAL_DAY)

**실행 이유**:

- KASI API는 매년 6~8월경 차차년도(+2년) 데이터를 우선 업데이트합니다.
- 이 시기에 맞춰 자동으로 최신 데이터를 확보합니다.

### 2. 주간 체크 (Weekly Check)

**스케줄**: 매주 월요일 오전 2시 (KST)  
**Cron 표현식**: `0 2 * * 1`

**동작**:

- 현재 연도의 공휴일 데이터를 재동기화합니다.

**대상 데이터**:

- 공휴일 (HOLIDAY) 만 재검증

**실행 이유**:

- 임시공휴일 대응: 정부 발표로 갑자기 추가되는 임시공휴일 감지
- 대체공휴일 대응: 대통령령 시행 후 업데이트되는 대체공휴일 감지
- KASI API는 임시공휴일 발생 시 최대 1일 이내 업데이트를 보장합니다.

## 수동 동기화

자동 스케줄러 외에도 수동으로 동기화를 실행할 수 있습니다.

### 전체 동기화

```bash
cd server
node scripts/syncHolidays.js 2025  # 2025년 모든 데이터 동기화
node scripts/syncHolidays.js       # 현재 연도 동기화
```

### 동기화 결과

스크립트 실행 시 다음과 같은 결과가 표시됩니다:

```
=== Starting Holiday Sync for Year 2025 ===

[PublicEventSyncService] Starting full sync for year 2025...
[PublicEventSyncService] Sync completed for 2025: { added: 15, updated: 0, errors: [] }
[PublicEventSyncService] Anniversary sync completed for 2025: { added: 32, updated: 0, errors: [] }
[PublicEventSyncService] 24 Divisions sync completed for 2025: { added: 24, updated: 0, errors: [] }
[PublicEventSyncService] Sundry Day sync completed for 2025: { added: 8, updated: 0, errors: [] }

=== Sync Results ===
Year: 2025
Total Added: 79
Total Errors: 0

=== Sync Completed Successfully ===
```

## 스케줄러 관리

### 스케줄러 상태 확인

서버 시작 시 다음과 같은 로그가 표시됩니다:

```
Server is running on port 3000

[PublicEventScheduler] Starting all scheduled jobs...
[PublicEventScheduler] Annual sync job registered
[PublicEventScheduler] Weekly check job registered
[PublicEventScheduler] 2 jobs are now running:
  - annual-sync: 매년 7월 1일 오전 3시 - 차차년도 공휴일 데이터 동기화
    Schedule: 0 3 1 7 *
  - weekly-check: 매주 월요일 오전 2시 - 현재 연도 공휴일 재동기화 (임시공휴일 대응)
    Schedule: 0 2 * * 1
```

### 스케줄러 비활성화

환경 변수나 설정을 통해 스케줄러를 비활성화하려면 다음 방법을 사용할 수 있습니다:

1. **index.js 수정**: `initializeSchedulers()` 호출 주석 처리
2. **cron 파일 수정**: `publicEventScheduler.js`에서 특정 job만 비활성화

## 타임존 설정

모든 스케줄러는 `Asia/Seoul` 타임존을 사용합니다.

## Cron 표현식 가이드

```
* * * * *
│ │ │ │ │
│ │ │ │ └─ 요일 (0-6, 0=일요일)
│ │ │ └─── 월 (1-12)
│ │ └───── 일 (1-31)
│ └─────── 시 (0-23)
└───────── 분 (0-59)
```

**예시**:

- `0 3 1 7 *`: 매년 7월 1일 오전 3시
- `0 2 * * 1`: 매주 월요일 오전 2시
- `0 0 * * *`: 매일 자정
- `*/30 * * * *`: 30분마다

## 동기화 데이터 유형

| 유형   | type 값      | 설명                       | API 엔드포인트     |
| ------ | ------------ | -------------------------- | ------------------ |
| 공휴일 | HOLIDAY      | 법정공휴일 (설날, 추석 등) | getRestDeInfo      |
| 기념일 | NOTICE       | 국가 기념일                | getAnniversaryInfo |
| 24절기 | SOLAR_TERM   | 입춘, 하지 등              | get24DivisionsInfo |
| 잡절   | SEASONAL_DAY | 단오, 한식 등              | getSundryDayInfo   |

## 데이터베이스 스키마

동기화된 데이터는 `public_events` 테이블에 저장됩니다:

```sql
CREATE TABLE public_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(20) DEFAULT 'HOLIDAY',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, title)  -- 중복 방지
);
```

## 문제 해결

### 스케줄러가 실행되지 않는 경우

1. 로그 확인: 서버 시작 시 스케줄러 등록 로그 확인
2. 타임존 확인: `Asia/Seoul` 설정 확인
3. node-cron 설치 확인: `npm list node-cron`

### API 호출 실패

1. API 키 확인: `.env` 파일의 `KASI_API_KEY` 확인
2. 네트워크 확인: KASI API 접근 가능 여부 확인
3. 수동 테스트:
   ```bash
   curl "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=YOUR_KEY&solYear=2025&solMonth=01&_type=json"
   ```

## 참고 자료

- **KASI API 문서**: [공공데이터포털](https://www.data.go.kr/data/15012690/openapi.do)
- **node-cron 문서**: [npm node-cron](https://www.npmjs.com/package/node-cron)
- **프로젝트 문서**: `docs/extentions/calendar-feature-consolidated.md`
