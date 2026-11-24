# GirlfriendGPT - PowerShell Start Script
# Runs both frontend and backend with browser output

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   GirlfriendGPT - Starting System    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Create logs directory if it doesn't exist
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Check for and stop any existing Node.js processes on port 3000
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
$portProcess = Get-NetTCPConnection -Port 3000 -ErrorAction SilentlyContinue
if ($portProcess) {
    Write-Host "Stopping existing process on port 3000..." -ForegroundColor Yellow
    Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Starting GirlfriendGPT..." -ForegroundColor Green
Write-Host ""

# Set environment variables
$env:NODE_ENV = "development"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Start the Next.js dev server
Write-Host "[1/2] Starting Next.js development server..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev & echo. & echo Press any key to close... & pause >nul" -WindowStyle Normal -WorkingDirectory $PWD

# Wait for server to start
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Open browser automatically
Write-Host ""
Write-Host "[2/2] Opening browser..." -ForegroundColor Green
Write-Host ""

$browserOpened = $false
$url = "http://localhost:3000"

# Try Chrome
$chrome = Get-Command chrome -ErrorAction SilentlyContinue
if ($chrome -and (-not $browserOpened)) {
    Write-Host "Opening in Chrome..." -ForegroundColor Cyan
    Start-Process -FilePath "chrome.exe" -ArgumentList "--new-window", "--auto-open-devtools-for-tabs", $url
    $browserOpened = $true
}

# Try Microsoft Edge
$edge = Get-Command msedge -ErrorAction SilentlyContinue
if ($edge -and (-not $browserOpened)) {
    Write-Host "Opening in Microsoft Edge..." -ForegroundColor Cyan
    Start-Process -FilePath "msedge.exe" -ArgumentList "--new-window", "--auto-open-devtools-for-tabs", $url
    $browserOpened = $true
}

# Try Brave Browser
$brave = Get-Command brave -ErrorAction SilentlyContinue
if ($brave -and (-not $browserOpened)) {
    Write-Host "Opening in Brave Browser..." -ForegroundColor Cyan
    Start-Process -FilePath "brave.exe" -ArgumentList "--new-window", "--auto-open-devtools-for-tabs", $url
    $browserOpened = $true
}

# Use default browser
if (-not $browserOpened) {
    Write-Host "Opening in default browser..." -ForegroundColor Cyan
    Start-Process -FilePath $url
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     System Started Successfully!     " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Logs will be saved to: logs\" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server(s)" -ForegroundColor Yellow
Write-Host ""

# Keep script running and show server status
while ($true) {
    Start-Sleep -Seconds 10
    Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Server is running..." -ForegroundColor DarkGray
}