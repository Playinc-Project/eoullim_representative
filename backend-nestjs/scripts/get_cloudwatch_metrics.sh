#!/usr/bin/env bash
set -euo pipefail

# Usage:
# ./get_cloudwatch_metrics.sh <DB_INSTANCE_IDENTIFIER> <MetricName> <StartTime(ISO)> <EndTime(ISO)> <out.json>
# Example:
# ./get_cloudwatch_metrics.sh my-db-instance CPUUtilization 2025-12-29T09:50:00Z 2025-12-29T10:00:00Z cpu.json

DB_INSTANCE_IDENTIFIER="$1"
METRIC_NAME="$2"
START_TIME="$3"
END_TIME="$4"
OUTFILE="$5"

aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name "$METRIC_NAME" \
  --dimensions Name=DBInstanceIdentifier,Value="$DB_INSTANCE_IDENTIFIER" \
  --start-time "$START_TIME" \
  --end-time "$END_TIME" \
  --period 60 --statistics Average | jq '.' > "$OUTFILE"

echo "Saved CloudWatch metric to $OUTFILE"
