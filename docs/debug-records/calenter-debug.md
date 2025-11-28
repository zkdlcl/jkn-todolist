# 달력 기능 디버깅 기록

## 문제 개요

- **문제 발생 상황**: 달력 기능 구현 후 서버 오류 및 UI 문제 발생
- **예상 동작**: 달력에 월별/주별/일별 보기, 현재 월 기준 할일과 공휴일 표시
- **실제 동작**: 서버 내부 오류(500) 발생, 달력 UI 요소들 동작하지 않음
- **발생 환경**: JKN-TODOLIST 프로젝트의 프론트엔드 및 백엔드 (React + Node.js/Express + PostgreSQL)

## 문제 원인 분석

초기 진단 결과, 문제는 다음과 같은 원인들로 인해 발생:

1. **데이터베이스 컬럼 이름 불일치**: SQL 쿼리에 실제 테이블에 존재하지 않는 컬럼 이름 사용
2. **서버 오류 전파**: 데이터베이스 오류가 서버 전체에 영향을 미침
3. **UI 상호작용 문제**: 달력 툴바 버튼들이 동작하지 않음

## 문제 해결 과정

### 1. 초기 상태 확인

- `publicEventRepository.js`에서 `event_name`, `event_date`, `is_holiday` 컬럼을 사용
- 실제 데이터베이스 스키마에는 `title`, `date`, `type` 컬럼만 존재
- 이 불일치로 인해 데이터베이스 쿼리 실행 시 오류 발생

### 2. 디버깅 로그 분석

서버 로그를 분석한 결과, 다음과 같은 문제를 확인:

```
[CalendarController] getCalendarData error: error: "event_name" 이름의 칼럼은 없습니다
at C:\test\jkn-todolist\server\node_modules\pg-pool\index.js:45:11
at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
at async PublicEventRepository.findByDateRange (C:\test\jkn-todolist\server\src\repositories\publicEventRepository.js:19:22)
at async CalendarService.getCalendarData (C:\test\jkn-todolist\server\src\services\calendarService.js:26:26)
at async CalendarController.getCalendarData (C:\test\jkn-todolist\server\src\controllers\calendarController.js:24:28) {
length: 122,
severity: '오류',
code: '42703',
detail: undefined,
hint: undefined,
position: '19',
internalPosition: undefined,
internalQuery: undefined,
where: undefined,
schema: undefined,
table: undefined,
column: undefined,
dataType: undefined,
constraint: undefined,
file: 'parse_relation.c',
line: '3675',
routine: 'errorMissingColumn'
}
```

### 3. 해결 시도

- `publicEventRepository.js`에서 실제 테이블 컬럼 이름에 맞게 SQL 쿼리 수정
- `event_name` → `title AS event_name` (별칭 사용)
- `event_date` → `date AS event_date` (별칭 사용)
- `is_holiday` → `CASE WHEN type = 'HOLIDAY' THEN true ELSE false END AS is_holiday` (값 변환 및 별칭 사용)

## 현재까지 구현된 개선 사항

1. **오류 처리 개선**: `useTodoStore.js`에서 서버 오류 상황에 대해 더 명확한 메시지 표시
2. **UI 오류 표시**: `CalendarPage.jsx`에 서버 오류 발생 시 사용자에게 알림 표시
3. **달력 높이 조정**: `CalendarPage.jsx`에서 달력 뷰의 높이 및 스크롤 이슈 해결 시도

## 여전히 존재하는 문제들

1. **툴바 버튼 동작 안함**: 오늘, 다음달, 이전달 버튼 / 일별 주별 월별 버튼이 동작하지 않음
2. **공휴일 데이터 확인 필요**: 현재 10월만 표시되고 있어 10월의 공휴일 데이터를 확인할 수 없음
3. **서버 다운 문제**: 여전히 서버 오류로 인해 전체 기능에 영향이 있음

## 문제 해결을 위한 다음 단계

1. 서버가 정상적으로 실행되도록 데이터베이스 연결 및 쿼리 오류 수정 필요 (완료)
2. 실제 `public_events` 테이블이 데이터베이스에 존재하는지 확인 필요 (완료 - 테스트 스크립트로 확인)
3. 달력 툴바 버튼들이 정상적으로 동작하는지 확인 및 수정 필요 (완료 - CalendarPage.jsx 수정)

## 4. 해결 완료 (2025-11-27)

- **DB 연결 및 쿼리**: `publicEventRepository.js`의 쿼리 별칭 수정이 유효함을 확인했습니다. `scripts/test-db.js`를 통해 `public_events` 테이블이 존재하고 데이터 조회가 가능함을 검증했습니다.
- **UI 네비게이션**: `CalendarPage.jsx`에서 `onNavigate` 핸들러를 추가하고 `date` prop을 연결하여, 툴바 버튼(이전/다음/오늘) 클릭 시 `currentDate` 상태가 업데이트되고 데이터가 새로 로드되도록 수정했습니다.
- **서버 상태**: DB 연결 테스트 성공으로 보아 서버의 DB 의존성 문제는 해결된 것으로 보입니다.

## 5. 추가 발견된 문제점 (2025-11-27 15:25)

### 5.1 월별/주별/일별 뷰 동작 이상

- **증상**: 월별 뷰는 동작하나 주별/일별 뷰 전환 시 화면이 깨지거나 데이터가 정상적으로 표시되지 않음.
- **원인 추정**: `react-big-calendar`의 뷰 설정 미흡 또는 CSS 스타일 충돌 가능성.

### 5.2 툴팁 UI 및 데이터 표시 문제

- **증상**: 툴팁 디자인이 미려하지 않고, 할일(Todos)의 상세 내용(내용, 마감일 등)이 표시되지 않음.
- **원인 추정**: `CustomEvent` 컴포넌트의 스타일링 부족 및 데이터 매핑(`content` 등) 확인 필요.

### 5.3 할일 추가 모달 UI 깨짐

- **증상**: 할일 추가 모달의 폰트와 레이아웃이 흐트러짐. 마감기한 디폴트 값이 `:--`와 같이 비정상적으로 표시됨.
- **원인 추정**: Tailwind CSS 클래스 충돌 또는 최근 변경 사항의 사이드 이펙트. 마감기한 초기값 처리 로직 오류.

### 5.4 할일 추가 처리

- **증상**: 할일 추가 모달의 폰트와 레이아웃이 흐트러짐. 마감기한 디폴트 값이 `:--`와 같이 비정상적으로 표시됨.
- **원인 추정**: Tailwind CSS 클래스 충돌 또는 최근 변경 사항의 사이드 이펙트. 마감기한 초기값 처리 로직 오류.

### 캘린더 달력 시작시간만 입력할 시 달력 UI에 무제한 그리는 것 관련 NULL일경우 시작일자 표시로 수정

-----위에는 처리 됨----
