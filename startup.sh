#!/bin/sh
# MA-OS-12 preview revive contract
set -e
cd /workspace
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  echo "preview already healthy on :8080"
  exit 0
fi
# free stale listeners if any
if command -v fuser >/dev/null 2>&1; then
  fuser -k 8080/tcp 2>/dev/null || true
fi
nohup npm run dev > /workspace/.grok/dev-server.log 2>&1 &
# wait for ready
i=0
while [ $i -lt 60 ]; do
  if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
    echo "dev server up on 0.0.0.0:8080"
    exit 0
  fi
  i=$((i+1))
  sleep 1
done
echo "dev server failed to become ready" >&2
tail -40 /workspace/.grok/dev-server.log >&2 || true
exit 1
