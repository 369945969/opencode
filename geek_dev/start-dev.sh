#!/bin/bash
PORT=5173
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
  echo "Port $PORT is occupied by PID $PID. Killing it..."
  kill -9 $PID
fi

bun run dev
