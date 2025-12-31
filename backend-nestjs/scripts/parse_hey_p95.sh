#!/usr/bin/env bash
set -euo pipefail

# Usage: parse_hey_p95.sh <hey_output_file>
FILE="${1:-}" 
if [ -z "$FILE" ]; then
  echo "Usage: $0 <hey_output_file>" >&2
  exit 2
fi

# hey 출력에서 95% 지연시간 추출 (여러 형태 대응)
if grep -q -E "95%|95\%|95 percentile|95th" "$FILE"; then
  # 가능한 라인 출력
  grep -E "95%|95\%|95 percentile|95th" "$FILE" || true
else
  echo "No 95% percentile line found in $FILE" >&2
  exit 1
fi
