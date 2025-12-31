#!/usr/bin/env bash
set -euo pipefail

# Usage: run_load_test.sh <url> <outfile_prefix> <tool> <num_requests> <concurrency> [duration_seconds]
# tool: hey or wrk

URL="$1"
OUTPREFIX="$2"
TOOL="$3"
NUMREQ="$4"
CONC="$5"
DURATION="${6:-30}"

if [ "$TOOL" = "hey" ]; then
  OUTFILE="${OUTPREFIX}_hey.txt"
  echo "Running hey -> $OUTFILE"
  hey -n "$NUMREQ" -c "$CONC" "$URL" > "$OUTFILE" 2>&1
elif [ "$TOOL" = "wrk" ]; then
  OUTFILE="${OUTPREFIX}_wrk.txt"
  echo "Running wrk -> $OUTFILE"
  wrk -t4 -c"$CONC" -d"${DURATION}s" "$URL" > "$OUTFILE" 2>&1
else
  echo "Unknown tool: $TOOL" >&2
  exit 2
fi

echo "Saved: $OUTFILE"
