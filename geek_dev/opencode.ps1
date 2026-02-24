$Port = 2345
$Connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($Connections) {
    $PIDs = $Connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($ProcessId in $PIDs) {
        if ($ProcessId -ne 0) {
            Write-Host "Port $Port is occupied by PID $ProcessId. Killing it..."
            Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
        }
    }
}

if (-not $env:OPENCODE_SERVER_USERNAME) { $env:OPENCODE_SERVER_USERNAME = "opencode" }
if (-not $env:OPENCODE_SERVER_PASSWORD) { $env:OPENCODE_SERVER_PASSWORD = "123" }
if (-not $env:OPENCODE_CONFIG) { $env:OPENCODE_CONFIG = Join-Path $PSScriptRoot "opencode.json" }

opencode serve --hostname=127.0.0.1 --port=$Port
