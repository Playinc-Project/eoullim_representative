# 부하 테스트 및 메트릭 수집 스크립트

간단한 사용법 요약:

- 스테이징에서 실행 권장. `scripts` 폴더의 스크립트들은 로컬 및 CI에서 실행 가능합니다.
- `run_load_test.sh` : `hey` 또는 `wrk`로 부하를 발생시키고 결과 파일을 생성합니다.
- `parse_hey_p95.sh` : `hey` 출력에서 p95 추출.
- `get_cloudwatch_metrics.sh` : AWS CLI로 RDS 메트릭(JSON) 수집.

예시 실행 (bash):

```bash
# 1) 부하(예비) 수집
cd backend-nestjs/scripts
./run_load_test.sh "http://staging.example.com/api/posts/123/comments" before hey 1000 50

# 2) p95 확인
./parse_hey_p95.sh before_hey.txt

# 3) CloudWatch 메트릭 수집
./get_cloudwatch_metrics.sh my-db-instance CPUUtilization 2025-12-29T09:50:00Z 2025-12-29T10:00:00Z cw_cpu_before.json
```

참고: Windows 환경에서는 WSL 또는 Git Bash 권장.
