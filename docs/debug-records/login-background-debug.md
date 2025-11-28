# 로그인 화면 배경 이미지 디버깅 기록

## 문제 상황

- 로그인 페이지에서 배경 이미지를 표시하려고 했으나 검은 화면만 보임
- 여러 이미지 서비스 시도 (Unsplash Source, Lorem Picsum)
- z-index, Tailwind 클래스 조정 등 여러 시도에도 불구하고 문제 지속

## 원인 분석

**Tailwind CSS의 `utilities` 레이어 충돌**

- Tailwind CSS의 `utilities` 레이어가 `background-color: var(--color-black)`를 자동으로 적용
- 이 스타일이 배경 이미지(`backgroundImage`)보다 우선순위가 높아서 이미지를 완전히 가림
- Chrome DevTools에서 `utilities` 레이어 체크 해제 시 배경 이미지가 정상적으로 보임을 확인

## 해결 방법

**인라인 스타일(`style={}`) 사용으로 Tailwind 우회**

1. Tailwind 클래스 대신 모든 배경 및 레이아웃 스타일을 인라인 `style` 속성으로 직접 적용
2. 주요 변경 사항:
   - `className="absolute inset-0 -z-10"` → `style={{ position: "absolute", ... }}`
   - 모든 z-index, position, background 속성을 JavaScript 객체로 직접 지정
3. 배경 이미지 URL을 Unsplash로 변경하여 안정적인 이미지 제공

## 최종 코드 구조

```javascript
<div
  style={{
    minHeight: "100vh",
    backgroundImage: `url(...)`,
    backgroundSize: "cover",
    position: "relative",
    // ... 기타 스타일
  }}
>
  {/* Overlay */}
  <div
    style={{
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    }}
  />

  {/* Content */}
  <div style={{ position: "relative", zIndex: 10 }}>{/* 로그인 폼 */}</div>
</div>
```

## 교훈

- Tailwind CSS 사용 시 utility 클래스와 커스텀 스타일 간의 우선순위 충돌 가능성 주의
- 중요한 스타일(배경, 레이아웃)은 인라인 스타일 또는 `!important` 사용 고려
- DevTools의 CSS 레이어 검사 기능이 디버깅에 매우 유용함
