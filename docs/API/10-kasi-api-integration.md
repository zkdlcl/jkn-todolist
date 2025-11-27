# 10. 한국천문연구원 특일 정보 API 연동 가이드

## 문서 정보

**문서 버전**: 1.0
**작성일**: 2025-11-27
**API 제공**: 한국천문연구원 (KASI)
**서비스명**: 특일 정보 제공 서비스
**참고 문서**: OpenAPI활용가이드*한국천문연구원*천문우주정보\_*특일*정보제공\_서비스\_v1.4.docx

---

## 1. API 개요

### 1.1 서비스 설명

**서비스 ID**: SC-OA-09-04
**서비스명**: 특일 정보 제공 서비스 (SpcdeInfoService)

한국천문연구원에서 제공하는 특일(국경일, 기념일, 24절기, 잡절) 정보 조회 API입니다.

**주요 기능**:

- 국경일 정보 조회 (신정, 설날, 광복절 등)
- 공휴일 정보 조회 (isHoliday=Y인 모든 날짜)
- 기념일 정보 조회 (의병의 날, 4·19 혁명 기념일 등)
- 24절기 정보 조회 (청명, 경칩, 하지 등)
- 잡절 정보 조회 (단오, 한식 등)

**데이터 갱신 주기**: 연 1회 (6~8월경 차차년도 데이터 업데이트)

### 1.2 인증 정보

**API 키**: `18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e`

**보안 주의사항**:

- API 키는 환경변수(.env)로 관리
- GitHub에 절대 커밋하지 않음
- `.gitignore`에 `.env` 파일 포함 확인

---

## 2. API 명세

### 2.1 기본 정보

**Base URL**: `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`

**인코딩**: UTF-8

**응답 형식**: XML 또는 JSON (선택 가능)

### 2.2 엔드포인트

#### 2.2.1 월별 특일 정보 조회

**엔드포인트**: `/getRestDeInfo`

**메소드**: GET

**설명**: 특정 월의 특일 정보 조회

**요청 파라미터**:

| 파라미터명 | 필수 | 타입   | 설명                               | 예시              |
| ---------- | ---- | ------ | ---------------------------------- | ----------------- |
| serviceKey | 필수 | String | 공공데이터포털에서 발급받은 인증키 | (URL 인코딩 필요) |
| solYear    | 필수 | String | 조회 연도 (4자리)                  | 2025              |
| solMonth   | 필수 | String | 조회 월 (2자리)                    | 01, 11            |
| \_type     | 선택 | String | 응답 형식 (xml, json)              | json              |

**요청 예시**:

```
GET http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo
  ?serviceKey=18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e
  &solYear=2025
  &solMonth=11
  &_type=json
```

#### 2.2.2 연간 특일 정보 조회

**엔드포인트**: `/getAnniversaryInfo`

**메소드**: GET

**설명**: 특정 년도의 특일 정보 조회

**요청 파라미터**:

| 파라미터명 | 필수 | 타입   | 설명              | 예시              |
| ---------- | ---- | ------ | ----------------- | ----------------- |
| serviceKey | 필수 | String | 인증키            | (URL 인코딩 필요) |
| solYear    | 필수 | String | 조회 연도 (4자리) | 2025              |
| \_type     | 선택 | String | 응답 형식         | json              |

#### 2.2.3 특정일자 특일 정보 조회

**엔드포인트**: `/getHoliDeInfo`

**메소드**: GET

**설명**: 특정 일자 하나의 특일 정보 조회

**요청 파라미터**:

| 파라미터명 | 필수 | 타입   | 설명      | 예시 |
| ---------- | ---- | ------ | --------- | ---- |
| serviceKey | 필수 | String | 인증키    |      |
| solYear    | 필수 | String | 연도      | 2025 |
| solMonth   | 필수 | String | 월        | 01   |
| solDay     | 필수 | String | 일        | 01   |
| \_type     | 선택 | String | 응답 형식 | json |

---

## 3. 응답 형식

### 3.1 성공 응답 (JSON)

```json
{
  "response": {
    "header": {
      "resultCode": "00",
      "resultMsg": "NORMAL_SERVICE"
    },
    "body": {
      "items": {
        "item": [
          {
            "dateKind": "01",
            "dateName": "신정",
            "isHoliday": "Y",
            "locdate": 20250101,
            "seq": 1
          },
          {
            "dateKind": "01",
            "dateName": "설날",
            "isHoliday": "Y",
            "locdate": 20250128,
            "seq": 1
          }
        ]
      },
      "numOfRows": 10,
      "pageNo": 1,
      "totalCount": 2
    }
  }
{
  "response": {
    "header": {
      "resultCode": "03",
      "resultMsg": "SERVICE_KEY_IS_NOT_REGISTERED_ERROR"
    }
  }
}
```

**에러 코드**:

- `00`: 정상
- `01`: APPLICATION_ERROR
- `02`: DB_ERROR
- `03`: NODATA_ERROR
- `04`: HTTP_ERROR
- `05`: SERVICETIMEOUT_ERROR
- `10`: INVALID_REQUEST_PARAMETER_ERROR
- `11`: NO_MANDATORY_REQUEST_PARAMETERS_ERROR
- `12`: NO_OPENAPI_SERVICE_ERROR
- `20`: SERVICE_ACCESS_DENIED_ERROR
- `22`: LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR
- `30`: SERVICE_KEY_IS_NOT_REGISTERED_ERROR
- `31`: DEADLINE_HAS_EXPIRED_ERROR
- `32`: UNREGISTERED_IP_ERROR
- `33`: UNSIGNED_CALL_ERROR

---

## 4. 구현 가이드

### 4.1 환경 변수 설정

**server/.env**:

```env
# 한국천문연구원 특일 정보 API
KASI_API_KEY=18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

**server/.env.example**:

```env
# 한국천문연구원 특일 정보 API
KASI_API_KEY=your_api_key_here
KASI_API_BASE_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService
```

### 4.2 백엔드 구현

#### 4.2.1 API 클라이언트

**파일**: `server/src/services/kasiAPIService.js`

```javascript
const axios = require("axios");

class KasiAPIService {
  constructor() {
    this.baseURL = process.env.KASI_API_BASE_URL;
    this.apiKey = process.env.KASI_API_KEY;
  }

  /**
   * 월별 특일 정보 조회
   * @param {number} year - 연도 (YYYY)
   * @param {number} month - 월 (1~12)
   * @returns {Promise<Array>} 특일 정보 배열
   */
  async getMonthlyHolidays(year, month) {
    try {
      const formattedMonth = String(month).padStart(2, "0");

      const response = await axios.get(`${this.baseURL}/getRestDeInfo`, {
        params: {
          serviceKey: this.apiKey,
          solYear: year,
          solMonth: formattedMonth,
          _type: "json",
        },
      });

      // 응답 검증
      if (response.data.response.header.resultCode !== "00") {
        throw new Error(response.data.response.header.resultMsg);
      }

      const items = response.data.response.body?.items?.item || [];

      // 배열이 아닌 경우 배열로 변환 (item이 1개일 때)
      return Array.isArray(items) ? items : [items];
    } catch (error) {
      console.error("[KasiAPIService] getMonthlyHolidays error:", error);
      throw error;
    }
  }

  /**
   * 연간 특일 정보 조회
   * @param {number} year - 연도
   * @returns {Promise<Array>}
   */
  async getYearlyHolidays(year) {
    try {
      const response = await axios.get(`${this.baseURL}/getAnniversaryInfo`, {
        params: {
          serviceKey: this.apiKey,
          solYear: year,
          _type: "json",
        },
      });

      if (response.data.response.header.resultCode !== "00") {
        throw new Error(response.data.response.header.resultMsg);
      }

      const items = response.data.response.body?.items?.item || [];
      return Array.isArray(items) ? items : [items];
    } catch (error) {
      console.error("[KasiAPIService] getYearlyHolidays error:", error);
      throw error;
    }
  }

  /**
   * API 데이터를 DB 형식으로 변환
   * @param {Object} apiData - API 응답 데이터
   * @returns {Object} DB 저장용 객체
   */
  transformToDBFormat(apiData) {
    const dateStr = String(apiData.locdate);
    const eventDate = `${dateStr.slice(0, 4)}-${dateStr.slice(
      4,
      6
    )}-${dateStr.slice(6, 8)}`;

    return {
      event_name: apiData.dateName,
      event_date: eventDate,
      is_holiday: apiData.isHoliday === "Y",
      event_type: this.getEventType(apiData.dateKind),
      description: apiData.dateName,
    };
  }

  /**
   * dateKind를 event_type으로 변환
   */
  getEventType(dateKind) {
    const typeMap = {
      "01": "NATIONAL_HOLIDAY", // 국경일
      "02": "MEMORIAL_DAY", // 기념일
      "03": "SOLAR_TERM", // 24절기
      "04": "SEASONAL_DAY", // 잡절
    };
    return typeMap[dateKind] || "OTHER";
  }
}

module.exports = new KasiAPIService();
```

#### 4.2.2 DB 동기화 서비스

**파일**: `server/src/services/publicEventSyncService.js`

```javascript
const kasiAPIService = require("./kasiAPIService");
const pool = require("../config/database");

class PublicEventSyncService {
  /**
   * 특정 년도의 특일 정보를 DB에 동기화
   * @param {number} year
   */
  async syncYearlyEvents(year) {
    try {
      const holidays = await kasiAPIService.getYearlyHolidays(year);

      for (const holiday of holidays) {
        const dbData = kasiAPIService.transformToDBFormat(holiday);
        await this.upsertEvent(dbData);
      }

      console.log(
        `[PublicEventSync] ${year}년 ${holidays.length}개 특일 동기화 완료`
      );
      return { success: true, count: holidays.length };
    } catch (error) {
      console.error("[PublicEventSync] syncYearlyEvents error:", error);
      throw error;
    }
  }

  /**
   * 이벤트 추가 또는 업데이트 (UPSERT)
   */
  async upsertEvent(eventData) {
    const query = `
      INSERT INTO public_events (event_name, event_date, is_holiday, event_type, description)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (event_date, event_name)
      DO UPDATE SET
        is_holiday = EXCLUDED.is_holiday,
        event_type = EXCLUDED.event_type,
        description = EXCLUDED.description,
        updated_at = NOW()
    `;

    await pool.query(query, [
      eventData.event_name,
      eventData.event_date,
      eventData.is_holiday,
      eventData.event_type,
      eventData.description,
    ]);
  }
}

module.exports = new PublicEventSyncService();
```

### 4.3 사용 예시

#### 4.3.1 수동 동기화 스크립트

**파일**: `server/scripts/syncHolidays.js`

```javascript
require("dotenv").config();
const publicEventSyncService = require("../src/services/publicEventSyncService");
const pool = require("../src/config/database");

async function syncHolidays() {
  const year = process.argv[2] || new Date().getFullYear();

  console.log(`${year}년 특일 정보 동기화 시작...`);

  try {
    await publicEventSyncService.syncYearlyEvents(year);
    console.log("동기화 완료!");
  } catch (error) {
    console.error("동기화 실패:", error);
  } finally {
    await pool.end();
  }
}

syncHolidays();
```

**실행 방법**:

```bash
node server/scripts/syncHolidays.js 2025
```

---

## 5. 고려사항

### 5.1 API 호출 제한

- 일일 호출 제한: 확인 필요 (일반적으로 1,000~10,000회)
- 동시 요청 제한: 확인 필요
- 캐싱 권장: DB에 저장 후 사용

### 5.2 데이터 동기화 전략

**방안 1: 연 1회 전체 동기화**

- 매년 1월 1일 자동 실행
- 다음 연도 데이터 미리 가져오기

**방안 2: 월 1회 부분 동기화**

- 매월 1일 해당 월 데이터 업데이트
- 실시간성 유지

**방안 3: 수동 동기화**

- 관리자가 필요 시 스크립트 실행
- 초기 구현 단계에서 권장

### 5.3 에러 처리

- API 호출 실패 시 기존 DB 데이터 사용
- 로그 기록 및 알림 (선택)
- Fallback 데이터 준비

---

## 6. 테스트

### 6.1 API 연결 테스트

```javascript
// server/tests/kasiAPI.test.js
const kasiAPIService = require("../src/services/kasiAPIService");

describe("KASI API Service", () => {
  it("should fetch monthly holidays", async () => {
    const holidays = await kasiAPIService.getMonthlyHolidays(2025, 1);
    expect(holidays).toBeInstanceOf(Array);
    expect(holidays.length).toBeGreaterThan(0);
  });
});
```

### 6.2 수동 테스트

**cURL 예시**:

```bash
curl "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=18ea54df0b7fb1a213f35c5c200ea36433a9eed33d1d8c9585a7f10c6e54a33e&solYear=2025&solMonth=01&_type=json"
```

---

## 7. 참고 자료

- 공공데이터포털: https://www.data.go.kr/
- 한국천문연구원: https://www.kasi.re.kr/
- API 활용 가이드: OpenAPI활용가이드*한국천문연구원*천문우주정보\_*특일*정보제공\_서비스\_v1.4.docx
