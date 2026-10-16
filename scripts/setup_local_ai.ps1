# ==============================================================================
# Nyayavanta AI - Windows Local Pipeline Setup Script
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Nyayavanta AI: Local Document Intelligence Setup        " -ForegroundColor Cyan
Write-Host "  CPU-Friendly Mode (<= 8GB RAM Budget)                   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Set project root and PYTHONPATH
$projectRoot = (Get-Item -Path ".").FullName
$env:PYTHONPATH = "$projectRoot;$env:PYTHONPATH"

# 1. Check Python
Write-Host "`n[1/5] Checking Python Environment..." -ForegroundColor Yellow
try {
    $pyVersion = python --version
    Write-Host "  Found: $pyVersion" -ForegroundColor Green
} catch {
    Write-Error "Python is not found in PATH. Please install Python 3.10+."
    exit 1
}

# 2. Check Ollama
Write-Host "`n[2/5] Checking Ollama Installation..." -ForegroundColor Yellow
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "  Ollama is installed in PATH." -ForegroundColor Green
    # Check if running
    try {
        $tags = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction SilentlyContinue
        Write-Host "  Ollama service is active at http://localhost:11434." -ForegroundColor Green
        Write-Host "  Ensuring model 'qwen3.5:0.8b' is pulled..." -ForegroundColor Yellow
        ollama pull qwen3.5:0.8b
    } catch {
        Write-Host "  Ollama service is not running. Please launch 'ollama serve' in a separate terminal." -ForegroundColor DarkYellow
    }
} else {
    Write-Host "  Ollama executable not found in PATH." -ForegroundColor DarkYellow
    Write-Host "  To enable local LLM synthesis, download Ollama from https://ollama.com" -ForegroundColor DarkYellow
    Write-Host "  Nyayavanta will run in offline extractive grounding mode in the interim." -ForegroundColor Green
}

# 3. Ingest and Audit Legal Corpus
Write-Host "`n[3/5] Extracting and Auditing Legal Text Corpus..." -ForegroundColor Yellow
python backend/scripts/audit_dataset.py

# 4. Chunk Documents and Build SQLite FTS5 Inverted Index
Write-Host "`n[4/5] Building SQLite FTS5 / BM25 Inverted Index..." -ForegroundColor Yellow
python backend/scripts/build_index.py

# 5. Run Verification Test Suite
Write-Host "`n[5/5] Running Verification Tests..." -ForegroundColor Yellow
python -m pytest backend/tests/test_local_ai.py -v

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  Setup Complete! Launch Nyayavanta with:                 " -ForegroundColor Green
Write-Host "  .\scripts\run_local_ai.ps1                             " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
