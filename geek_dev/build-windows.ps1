# Stop on error
$ErrorActionPreference = "Stop"

# Build opencode CLI
Write-Host "Building opencode CLI..."
Set-Location "../packages/opencode"
bun run script/build.ts --single

# Determine architecture and paths
# Assuming x64 for Windows usually, but can check $env:PROCESSOR_ARCHITECTURE
$RUST_TARGET = "x86_64-pc-windows-msvc"
$CLI_SOURCE = "dist/opencode-windows-x64/bin/opencode.exe"

if (!(Test-Path $CLI_SOURCE)) {
    Write-Error "Error: CLI binary not found at $CLI_SOURCE"
    exit 1
}

Set-Location "../../geek_dev"

# Prepare binaries directory
New-Item -ItemType Directory -Force -Path "src-tauri/binaries" | Out-Null
$TARGET_BIN = "src-tauri/binaries/opencode-cli-${RUST_TARGET}.exe"

Write-Host "Copying CLI binary to $TARGET_BIN..."
Copy-Item "../packages/opencode/$CLI_SOURCE" "$TARGET_BIN" -Force

# Build Tauri app
Write-Host "Building Tauri app..."
bun run tauri build
