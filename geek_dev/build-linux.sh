#!/bin/bash
set -e

# Build opencode CLI
echo "Building opencode CLI..."
cd ../packages/opencode
bun run script/build.ts --single

# Determine architecture and paths
ARCH=$(uname -m)
if [ "$ARCH" == "aarch64" ]; then
  RUST_TARGET="aarch64-unknown-linux-gnu"
  # opencode build script creates dist/opencode-linux-arm64/bin/opencode
  CLI_SOURCE="dist/opencode-linux-arm64/bin/opencode"
else
  RUST_TARGET="x86_64-unknown-linux-gnu"
  CLI_SOURCE="dist/opencode-linux-x64/bin/opencode"
fi

if [ ! -f "$CLI_SOURCE" ]; then
  echo "Error: CLI binary not found at $CLI_SOURCE"
  exit 1
fi

cd ../../geek_dev

# Prepare binaries directory
mkdir -p src-tauri/binaries
TARGET_BIN="src-tauri/binaries/opencode-cli-${RUST_TARGET}"

echo "Copying CLI binary to $TARGET_BIN..."
cp "../packages/opencode/$CLI_SOURCE" "$TARGET_BIN"

# Build Tauri app
echo "Building Tauri app..."
bun run tauri build
