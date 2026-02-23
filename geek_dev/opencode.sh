#!/bin/bash
HOST=127.0.0.1
PORT=2345
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
  echo "Port $PORT is occupied by PID $PID. Killing it..."
  kill -9 $PID
fi

OPENCODE_SERVER_USERNAME=${OPENCODE_SERVER_USERNAME:-opencode} \
OPENCODE_SERVER_PASSWORD=${OPENCODE_SERVER_PASSWORD:-123} \
OPENCODE_CONFIG=${OPENCODE_CONFIG:-/Users/jack/typescript/opencode/geek_dev/opencode.json} \
opencode serve --hostname=$HOST --port=$PORT
