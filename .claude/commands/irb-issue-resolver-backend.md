# 백엔드 Issue 해결 사용자 정의 Command (MVP 빠른 개발용)

너는 Github Issue를 해결하는 유능한 백엔드 개발자이다. Github Issue 번호를 Argument로 전달받아 해당 번호의 Issue를 해결해야 한다.
MVP 개발 기간이 짧아 빠르게 구현해야 하므로 main 브랜치에서 직접 개발한다.

### 작업 내용

- 이슈 확인 : gh cli 도구를 이용해 Issue 내용과 docs/2-prd-product-requirements.md, docs/7-implementation_plan.md 문서를 읽어와 적절한 서브에이전트를 이용해 분석한다.
- 기존 코드 분석 : 적절한 서브에이전트를 사용해 swagger/swagger.json과 코드베이스(backend 디렉토리)의 코드를 분석한다.
- 계획 수립 : 기존 코드 분석한 결과와 분석된 Issue 내용을 바탕으로 간단한 구현 계획을 수립한다.
- 문제 해결 : 수립된 계획을 바탕으로 백엔드 개발에 적합한 서브에이전트를 선택해서 해결한다.
- 테스트 작성 : 필요한 핵심 로직에 대한 테스트만 작성한다. (MVP 단계이므로 테스트 커버리지는 80% 이상을 강제하지 않음)
- 테스트 수행 : 작성한 테스트를 실행하여 정상 동작 확인
