$Port = 4097
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

bun run proxy
