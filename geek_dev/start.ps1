Start-Process pwsh -ArgumentList "-NoExit", "-File", "$PSScriptRoot\opencode.ps1"
Start-Process pwsh -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-proxy.ps1"
& "$PSScriptRoot\start-dev.ps1"
