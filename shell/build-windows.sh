#!/bin/bash

# Windows build script for OpenCode
# Builds both desktop (Tauri) and CLI binaries for Windows (x64)

set -e

# Colors for output - using printf for better compatibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

printf "${BLUE}========================================${NC}\n"
printf "${BLUE}║      OpenCode Windows Builder        ║${NC}\n"
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
printf "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
printf "${GREEN}1. Building CLI binaries for Windows...${NC}\n"
printf "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

cd "$PROJECT_ROOT/packages/opencode"
printf "${YELLOW}Building all CLI targets...${NC}\n"
run_bun run build --os=win32 "$@"

printf "${GREEN}✓ CLI build complete${NC}\n"
printf "\n"

# 2. Build Desktop
printf "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
printf "${GREEN}2. Building Desktop application...${NC}\n"
printf "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

cd "$PROJECT_ROOT/packages/desktop"

# Targets to build for Windows
if [[ "$*" == *"--all"* ]]; then
  # Currently we only have x64 for windows in the list
  TARGETS="x86_64-pc-windows-msvc"
  printf "${YELLOW}Building all Windows architectures: ${TARGETS}${NC}\n"
else
  TARGETS="x86_64-pc-windows-msvc"
  printf "${YELLOW}Defaulting to native architecture: ${TARGETS}${NC}\n"
fi

for target in $TARGETS; do
  printf "${YELLOW}Building for target: ${target}${NC}\n"
  
  # Ensure target is installed
  if command -v rustup &> /dev/null; then
    if ! rustup target list --installed | grep -q "^${target}$"; then
      printf "${YELLOW}Installing Rust target: ${target}${NC}\n"
      rustup target add "$target"
    fi
  fi
  
  # Prepare Sidecar
  printf "${YELLOW}Preparing CLI sidecar for ${target}...${NC}\n"
  SIDECARS_DIR="$PROJECT_ROOT/packages/desktop/src-tauri/sidecars"
  mkdir -p "$SIDECARS_DIR"
  
  CLI_SOURCE=""
  case $target in
    x86_64-pc-windows-msvc) CLI_SOURCE="$PROJECT_ROOT/packages/opencode/dist/opencode-windows-x64/bin/opencode.exe" ;;
  esac
  
  if [ -f "$CLI_SOURCE" ]; then
    cp "$CLI_SOURCE" "$SIDECARS_DIR/opencode-cli-$target.exe"
    chmod +x "$SIDECARS_DIR/opencode-cli-$target.exe"
    printf "${GREEN}✓ Sidecar prepared: opencode-cli-$target.exe${NC}\n"
  else
    printf "${RED}Error: CLI binary not found at $CLI_SOURCE${NC}\n"
    printf "${RED}Make sure the CLI build (Step 1) completed successfully.${NC}\n"
    exit 1
  fi
  
  # Build Desktop App
  printf "${BLUE}Running: npm run tauri build --target ${target}${NC}\n"
  npm run tauri build -- --target "$target"
  
  printf "${GREEN}✓ Build complete for ${target}${NC}\n"
done

printf "\n"
printf "${BLUE}========================================${NC}\n"
printf "${BLUE}║      Windows Build Complete! 🎉       ║${NC}\n"
printf "${BLUE}========================================${NC}\n"
printf "${GREEN}Output: packages/desktop/src-tauri/target/release/bundle/msi/ or exe/${NC}\n"
