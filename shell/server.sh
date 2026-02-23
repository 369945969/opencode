#!/bin/bash
# OpenCode Server Start Script (Root-aware)

# Find the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "PYF_DEBUG: Project root detected at $ROOT_DIR"
cd "$ROOT_DIR"

echo "PYF_DEBUG: Performing pre-start cleanup..."
PORT=2345
PID=$(lsof -t -i:$PORT)
if [ -n "$PID" ]; then
  echo "PYF_DEBUG: Killing process on port $PORT (PID $PID)..."
  kill -9 $PID
fi
sleep 1

echo "PYF_DEBUG: Starting OpenCode server on port 2345 (Logs: server.log)..."
# Run in foreground and pipe to tee for logging
OPENCODE_DEFAULT_AGENT_SKILL=product_manager bun run --cwd packages/opencode --conditions=browser src/index.ts serve --port=$PORT 2>&1 | tee server.log
