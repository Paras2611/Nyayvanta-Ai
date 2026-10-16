# Nyayavanta Local AI Pipeline: Complete Windows Setup & Operations Guide

> **System Target**: Windows 11 / CPU-only execution / <= 8 GB RAM (Tested on ~1.4 GB free physical memory)  
> **Core Principle**: *"Don't make AI look magical. Make its evidence visible."*  
> **Retrieval Stack**: SQLite FTS5 / BM25 Inverted Index (< 3 MB disk, ~0 MB RAM footprint)  
> **Local LLM Engine**: Ollama running `qwen3.5:0.8b` (Quantized 4-bit, ctx: 2048, max predict: 256)

---

## 1. Prerequisites

1. **Operating System**: Windows 10 or 11 (PowerShell 5.1 or PowerShell 7)
2. **Python**: Python 3.10+ (Verified on Python 3.14.5)
3. **Node.js**: Node.js v18+ and npm
4. **Local LLM (Optional for synthesis, fallback available)**:
   - Download Ollama for Windows from [ollama.com](https://ollama.com)
   - If Ollama is not installed or running, Nyayavanta operates in **deterministic extractive grounding mode**, guaranteeing zero crashes and zero hallucination.

---

## 2. Installation Steps

### Step 1: Install Python Dependencies
```powershell
pip install -r backend/requirements.txt
```

### Step 2: Install Frontend Dependencies
```powershell
npm install
```

### Step 3: Setup Environment Configuration
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

Default local AI parameters in `.env`:
```env
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen3.5:0.8b"
OLLAMA_NUM_CTX=2048
OLLAMA_NUM_PREDICT=256
OLLAMA_TEMPERATURE=0.1
OLLAMA_KEEP_ALIVE="5m"
```

---

## 3. Dataset Ingestion & Index Creation

The extracted dataset archive `text.zip` contains **17 authoritative legal documents** (1.45M characters, 177,704 words).

### Automated Pipeline Execution
Run the automated PowerShell setup script:
```powershell
.\scripts\setup_local_ai.ps1
```

Or execute step-by-step:

1. **Extract & Audit the Dataset**:
   ```powershell
   python backend/scripts/audit_dataset.py
   ```
   *Safely validates archive entries, checks for path traversal attempts, and generates `backend/dataset/processed/dataset_manifest.json`.*

2. **Chunk Text & Build SQLite FTS5 Index**:
   ```powershell
   python backend/scripts/build_index.py
   ```
   *Generates 526 semantic chunks in `backend/dataset/chunks/legal_chunks.jsonl` and builds the SQLite FTS5 inverted index in `backend/dataset/processed/nyayavanta_fts.db` (2.78 MB).*

3. **Portable Keyword Search Utility**:
   Search the corpus directly with context windowing and JSON/CSV output:
   ```powershell
   python search_text_dataset/search_text_dataset.py --keywords "Maharashtra Rent Control Act" "Section 35" --format text
   ```

---

## 4. Local Ollama Model Setup (Optional for Generative Answers)

If you have installed Ollama:

1. **Start Ollama Service**:
   ```powershell
   ollama serve
   ```
2. **Pull the CPU-Friendly Model Candidate**:
   ```powershell
   ollama pull qwen3.5:0.8b
   ```
3. **Verify Installation**:
   ```powershell
   curl.exe http://localhost:11434/api/tags
   ```

*If you skip this step, Nyayavanta will seamlessly display the retrieved authoritative legal text excerpts with citations without attempting generative completion.*

---

## 5. Launching Nyayavanta

### Option A: One-Click Launch Script
```powershell
.\scripts\run_local_ai.ps1
```
*Starts the FastAPI backend on port 8000 and the Vite frontend on port 3000.*

### Option B: Manual Multi-Terminal Startup

**Terminal 1 — FastAPI Backend**:
```powershell
python backend/run.py
```
*API Swagger Documentation available at `http://localhost:8000/docs`.*

**Terminal 2 — React / Vite Frontend**:
```powershell
npm run dev
```
*Access web interface at `http://localhost:3000`.*

---

## 6. Local AI API Verification Commands

You can test the Local AI endpoints using PowerShell:

### 1. Health & Diagnostic Check
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/local-ai/health" | ConvertTo-Json -Depth 4
```

### 2. Inspect Model Configuration & Resource Bounds
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/local-ai/model" | ConvertTo-Json
```

### 3. Query the Evidence-Grounded Pipeline (Rental Domain)
```powershell
$body = @{
    question = "What procedures govern a landlord seeking possession for bonafide requirement?"
    domain = "rental"
    language = "en"
    top_k = 3
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/local-ai/query" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 4
```

### 4. Query with Coverage-Gap Detection (Employment Domain)
```powershell
$body = @{
    question = "What is the statutory notice period for termination under industrial disputes law?"
    domain = "employment"
    language = "en"
    top_k = 2
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/local-ai/query" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 4
```
*Expected: Returns status `coverage_gap` informing the user that 0 documents exist in the current corpus for employment disputes.*

### 5. Inspect Dataset Corpus Statistics
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/local-ai/dataset/stats" | ConvertTo-Json -Depth 4
```

---

## 7. Running the Automated Test Suite

Nyayavanta includes a complete automated test suite (28 tests covering security, chunking, retrieval, API, and verification):

```powershell
# Run the local AI pipeline test suite
python -m pytest backend/tests/test_local_ai.py -v

# Run all backend tests
python -m pytest backend/tests/ -v

# Validate frontend TypeScript compilation
npm run test:frontend
```

---

## 8. Updating the Corpus

When adding new legal judgments or Bare Acts:

1. Place new `.txt` files in `backend/dataset/text/<domain>/` or update `search_text_dataset/text.zip`.
2. Run audit:
   ```powershell
   python backend/scripts/audit_dataset.py
   ```
3. Rebuild index:
   ```powershell
   python backend/scripts/build_index.py
   ```
   Or invoke the rebuild API:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8000/api/local-ai/index/rebuild" -Method Post
   ```

---

## 9. Future GPU-Based Fine-Tuning Workflow

To adapt the model weights on a GPU-equipped machine (>= 8 GB VRAM):

1. **Export Reviewed Training Data**:
   ```powershell
   python backend/scripts/export_training_data.py
   ```
   *Generates 1,128 multi-task instruction examples partitioned into `train.jsonl` (733), `val.jsonl` (60), and `test.jsonl` (335) with zero document-level leakage.*

2. **Validate Split Isolation**:
   ```powershell
   python backend/scripts/validate_training_data.py
   ```

3. **Execute QLoRA Fine-Tuning**:
   ```powershell
   python backend/scripts/train_qlora.py --gpu --model-id "Qwen/Qwen2.5-0.5B-Instruct" --epochs 3
   ```

4. **Evaluate Model Grounding on Held-Out Test Set**:
   ```powershell
   python backend/scripts/evaluate_model.py
   ```

For detailed hyperparameter configurations and VRAM requirements, refer to [`docs/fine-tuning-guide.md`](docs/fine-tuning-guide.md).

---

## 10. Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **`Ollama is not running`** | Ollama background daemon is inactive | Run `ollama serve` in a separate PowerShell window or use the application icon. The app gracefully falls back to extractive mode. |
| **`Model 'qwen3.5:0.8b' not found`** | Model weights have not been downloaded | Run `ollama pull qwen3.5:0.8b`. |
| **`FTS index not found`** | The search index database has not been built | Run `python backend/scripts/build_index.py`. |
| **High Memory / Thrashing** | Large context or unquantized model | Ensure `OLLAMA_NUM_CTX=2048` and `OLLAMA_NUM_PREDICT=256` are set in `.env`. |
| **`UnicodeEncodeError` in Windows console** | Windows PowerShell default `cp1252` encoding | Set `$env:PYTHONIOENCODING="utf-8"` or use the updated `search_text_dataset.py` which auto-reconfigures `sys.stdout`. |
| **Coverage Gap Alert** | Querying `employment` or `contract` domain | Normal behavior; the current corpus contains 0 files for these domains. System reports this rather than hallucinating. |
