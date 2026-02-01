#!/bin/bash

# macOS build script for OpenCode
# Builds both desktop (Tauri) and CLI binaries for macOS (arm64 and x64)

set -e

# Colors for output - using printf for better compatibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

printf "${BLUE}========================================${NC}\n"
printf "${BLUE}║       OpenCode macOS Builder         ║${NC}\n"
printf "${BLUE}========================================${NC}\n"
printf "\n"

# Get project root
SCRIPT_PATH="${BASH_SOURCE[0]:-$0}"
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Verify root package.json exists
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
  printf "${RED}Error: Root package.json not found at $PROJECT_ROOT/package.json${NC}\n"
  exit 1
fi

# Create a bun shim if not exists to ensure sub-commands (like npm scripts) can find it
if ! command -v bun &> /dev/null; then
  printf "${YELLOW}Bun not found in PATH. Creating a shim in .bin...${NC}\n"
  mkdir -p "$PROJECT_ROOT/.bin"
  cat > "$PROJECT_ROOT/.bin/bun" <<EOF
#!/bin/bash
npx -y bun@latest "\$@"
EOF
  chmod +x "$PROJECT_ROOT/.bin/bun"
fi

# Always add .bin to PATH to ensure our shim or local binaries are found
export PATH="$PROJECT_ROOT/.bin:$PATH"

# Ensure Rust and Cargo are in PATH
if [ -d "$HOME/.cargo/bin" ]; then
  export PATH="$HOME/.cargo/bin:$PATH"
fi

# Function to run bun
run_bun() {
  if command -v bun &> /dev/null; then
    bun "$@"
  else
    npx -y bun@latest "$@"
  fi
}

cd "$PROJECT_ROOT"

# Ensure dependencies are installed
if [[ ! "$*" == *"--skip-install"* ]]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  run_bun install
fi


# 1. Build CLI
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}1. Building CLI binaries for macOS...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_ROOT/packages/opencode"
echo -e "${YELLOW}Building all CLI targets...${NC}"
run_bun run build --os=darwin "$@"


echo -e "${GREEN}✓ CLI build complete${NC}"
echo ""

# 2. Build Desktop
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}2. Building Desktop application...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_ROOT/packages/desktop"

# Determine host architecture
HOST_ARCH=$(uname -m)
TAURI_NATIVE_TARGET=""
case $HOST_ARCH in
  arm64) TAURI_NATIVE_TARGET="aarch64-apple-darwin" ;;
  x86_64) TAURI_NATIVE_TARGET="x86_64-apple-darwin" ;;
esac

# Targets to build for macOS
if [[ "$*" == *"--all"* ]]; then
  TARGETS="aarch64-apple-darwin x86_64-apple-darwin"
  echo -e "${YELLOW}Building all macOS architectures: ${TARGETS}${NC}"
else
  TARGETS="$TAURI_NATIVE_TARGET"
  echo -e "${YELLOW}Defaulting to native architecture: ${TARGETS} (use --all to build both)${NC}"
fi

for target in $TARGETS; do
  echo -e "${YELLOW}Building for target: ${target}${NC}"
  
  # Ensure target is installed
  if command -v rustup &> /dev/null; then
    if ! rustup target list --installed | grep -q "^${target}$"; then
      echo -e "${YELLOW}Installing Rust target: ${target}${NC}"
      rustup target add "$target"
    fi
  fi
  
  # Prepare Sidecar
  echo -e "${YELLOW}Preparing CLI sidecar for ${target}...${NC}"
  SIDECARS_DIR="$PROJECT_ROOT/packages/desktop/src-tauri/sidecars"
  mkdir -p "$SIDECARS_DIR"
  
  CLI_SOURCE=""
  case $target in
    aarch64-apple-darwin) CLI_SOURCE="$PROJECT_ROOT/packages/opencode/dist/opencode-darwin-arm64/bin/opencode" ;;
    x86_64-apple-darwin)  CLI_SOURCE="$PROJECT_ROOT/packages/opencode/dist/opencode-darwin-x64/bin/opencode" ;;
  esac
  
  if [ -f "$CLI_SOURCE" ]; then
    cp "$CLI_SOURCE" "$SIDECARS_DIR/opencode-cli-$target"
    chmod +x "$SIDECARS_DIR/opencode-cli-$target"
    echo -e "${GREEN}✓ Sidecar prepared: opencode-cli-$target${NC}"
  else
    echo -e "${RED}Error: CLI binary not found at $CLI_SOURCE${NC}"
    exit 1
  fi
  
  # Build Desktop App
  echo -e "${BLUE}Running: npm run tauri build --target ${target}${NC}"
  npm run tauri build -- --target "$target"
  
  echo -e "${GREEN}✓ Build complete for ${target}${NC}"
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}║      macOS Build Complete! 🎉         ║${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Output: packages/desktop/src-tauri/target/release/bundle/dmg/${NC}"
