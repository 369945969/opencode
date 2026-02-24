#!/bin/bash
PROXY_PORT=4097
PROXY_PID=$(lsof -t -i:$PROXY_PORT)

if [ -n "$PROXY_PID" ]; then
  echo "Port $PROXY_PORT is occupied by PID $PROXY_PID. Killing it..."
  kill -9 $PROXY_PID
fi

bun run proxy
