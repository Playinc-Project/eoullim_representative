## X,Y,A,B,P,Q 계산 지침

1) p95 (X -> Y)
- `run_load_test.sh`로 얻은 `*_hey.txt`에서 `./parse_hey_p95.sh <file>` 실행하여 p95 텍스트를 확인.
- 숫자(ms)를 복사하여 Before=X, After=Y에 입력.

2) 요청당 쿼리 수 (A -> B)
- TypeORM 로그(앱 레벨) 또는 DB slow/general log에서 한 요청에 해당하는 로그 블록을 추출.
- 요청 10~20회 반복 측정하여 각 요청에서 실행된 쿼리 수를 세고 평균 계산.

3) DB CPU (P -> Q)
- `get_cloudwatch_metrics.sh`로 부하 응답 기간의 `CPUUtilization`을 받아 평균값 계산.

결과 보고 템플릿:

- p95 응답시간: Before X ms -> After Y ms
- 요청당 쿼리 수: Before A -> After B
- DB CPUUtilization: Before P% -> After Q%
