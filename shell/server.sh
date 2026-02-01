#!/bin/bash
# OpenCode Server Start Script (Root-aware)

# Find the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "PYF_DEBUG: Project root detected at $ROOT_DIR"
cd "$ROOT_DIR"

echo "PYF_DEBUG: Performing pre-start cleanup..."
pkill -f "opencode.*serve" || true
pkill -f "packages/opencode/src/index.ts" || true
sleep 1

echo "PYF_DEBUG: Starting OpenCode server on port 4096 (Logs: server.log)..."
# Run in foreground and pipe to tee for logging
bun run --cwd packages/opencode --conditions=browser src/index.ts serve 2>&1 | tee server.log
