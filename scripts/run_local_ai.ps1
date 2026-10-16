# ==============================================================================
# Nyayavanta AI - Windows Local Run Script
# Launches both FastAPI Backend (port 8000) and Vite Frontend (port 3000)
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Launching Nyayavanta AI Legal Intelligence Platform    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Set project root and PYTHONPATH
$projectRoot = (Get-Item -Path ".").FullName
$env:PYTHONPATH = "$projectRoot;$env:PYTHONPATH"

# Ensure SQLite FTS index exists
if (-not (Test-Path "backend\dataset\processed\nyayavanta_fts.db")) {
    Write-Host "Building search index before launch..." -ForegroundColor Yellow
    python backend/scripts/build_index.py
}

Write-Host "`nStarting FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "python" -ArgumentList "backend/run.py" -WorkingDirectory $projectRoot -PassThru -NoNewWindow

Write-Host "Starting Vite Client on http://localhost:3000..." -ForegroundColor Green
Write-Host "`nPress Ctrl+C to shut down.`n" -ForegroundColor Yellow

try {
    npm run dev
} finally {
    Write-Host "`nStopping backend process (PID: $($backendProcess.Id))..." -ForegroundColor DarkYellow
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Shutdown complete." -ForegroundColor Green
}
