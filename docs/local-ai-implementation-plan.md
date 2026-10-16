# Nyayavanta Local AI Implementation Plan

> **Scope**: Implementation of a resource-efficient, local-first legal document intelligence pipeline for Nyayavanta on a Windows machine (<=8 GB RAM, CPU-only).  
> **Core Principle**: *"Don't make AI look magical. Make its evidence visible."*  
> **Status**: Approved for Implementation

---

## 1. System Context & Environment Profile

| Metric | Target Specification | Current Host Measurement |
| :--- | :--- | :--- |
| **Operating System** | Windows (PowerShell) | Windows 11 (PowerShell 5.1/7) |
| **Total Memory** | <= 8 GB RAM | 8,216,460 KB (~7.83 GB) |
| **Free Memory** | Constrained (~1-2 GB) | 1,462,860 KB (~1.39 GB) |
| **GPU Acceleration** | None (CPU-only local run) | CPU-only local execution |
| **Python Runtime** | Python >= 3.10 | Python 3.14.5 |
| **Local LLM Engine**| Ollama (`http://localhost:11434`) | Candidate: `qwen3.5:0.8b` (configurable) |

### Non-Negotiable Engineering Constraints
1. **CPU/RAM Guardrails**: Strict memory budgeting. Never load entire corpus into memory. Chunking and indexing must operate in streaming/incremental passes.
2. **Zero Inventions**: System must strictly ground in retrieved text chunks. If evidence is lacking, return `NOT_ENOUGH_EVIDENCE`.
3. **No Fake Fine-Tuning**: Prompts, system instructions, and Modelfiles are prompt-engineering; fine-tuning refers strictly to parameter weight updates (QLoRA adapters trained on GPU).
4. **Resilient Local Inference**: Gracefully detect when Ollama service is stopped or when `qwen3.5:0.8b` is not installed, returning actionable setup instructions without crashing.

---

## 2. Phased Implementation Roadmap

### Phase 0: System Inspection & Baselines (Completed)
- [x] Full repository audit (FastAPI backend + Vite/React frontend + Express proxy).
- [x] Verified existing test suite (10/10 tests passing).
- [x] Located `search_text_dataset\text.zip` and `search_text_dataset\search_text_dataset.py`.
- [x] Audited all 17 archive files (1,445,160 characters, 177,704 words).
- [x] Measured system RAM and validated CPU execution model.
- [x] Published architecture, dataset audit, implementation plan, and test plan.

### Phase 1: Safe Dataset Ingestion & Portable Keyword Search
- [ ] Implement `backend/app/services/dataset_audit.py` with safe ZIP extraction, traversal rejection (`..` path injection protection), checksum verification, and duplicate tracking.
- [ ] Generate machine-readable `dataset_manifest.json` and `dataset_manifest.csv`.
- [ ] Refactor `search_text_dataset/search_text_dataset.py` to be fully portable: CLI flags, relative paths, case-insensitivity, UTF-8/Marathi safety, structured JSON/CSV export, and unit tests.

### Phase 2: Incremental Text Cleaning & Semantic-Aware Chunking
- [ ] Implement `backend/app/services/text_cleaner.py`:
  - Unicode NFC normalization (preserving Marathi Devanagari codepoints `\u0900`–`\u097F`).
  - Safe whitespace collapse without altering legal numbering (`Section 2(7)`, `Clause 4.1`, amounts, dates).
  - Anomaly and OCR artifact detection.
- [ ] Implement `backend/app/services/chunker.py`:
  - Hierarchical boundary splitting (sections, articles, clauses, paragraphs).
  - Target size: 400–600 tokens (~1600–2400 chars) with 50–80 token overlap.
  - Immutable chunk metadata: `chunk_id`, `document_id`, `source_file`, `domain`, `language`, `section_number`, `content_hash`.

### Phase 3: Lightweight BM25 / SQLite FTS Retrieval Engine
- [ ] Implement `backend/app/services/retrieval.py` using SQLite FTS5 / BM25 lexical ranking:
  - Zero heavy external dependencies (no FAISS/Postgres/Qdrant memory overhead).
  - Domain filtering (`rental`, `consumer`, `employment`, `contract`).
  - Marathi and English token matching.
  - Return top 3–5 chunks with complete source provenance and deduplication.
  - Explicit `no_evidence` status when score threshold is not met.

### Phase 4: Configurable Ollama Client Service
- [ ] Implement `backend/app/services/ollama_client.py`:
  - Configurable via `.env`: `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `OLLAMA_NUM_CTX=2048`, `OLLAMA_NUM_PREDICT=256`, `OLLAMA_TEMPERATURE=0.1`.
  - Live health check, connection timeout (3s), generation timeout (60s).
  - Clear, user-friendly error messages if Ollama is not running or model tag is missing.
  - Non-streaming synchronous response with optional streaming support.

### Phase 5: Evidence-Grounded Legal QA & Verification
- [ ] Implement `backend/app/services/answer_verifier.py`:
  - Bounded prompt constructor injecting only retrieved chunks.
  - Zero-hallucination instruction enforcement.
  - Tri-state verification (`SUPPORTED`, `CONTRADICTED`, `NOT_ENOUGH_EVIDENCE`).
  - Cross-check that every citation maps directly to a chunk in the retrieval set.

### Phase 6: API Routes & Frontend Evidence Integration
- [ ] Implement `backend/app/routes/local_ai.py` (mounted at `/api/local-ai`):
  - `GET /health`
  - `GET /model`
  - `POST /query`
  - `POST /index/rebuild`
  - `GET /dataset/stats`
- [ ] Connect existing React frontend (`EvidencePanel.tsx`, `AILegalChatPage.tsx`) to local AI endpoints with fallback to mock/hybrid.

### Phase 7: Training Data Exporter & Validator (QLoRA Preparation)
- [ ] Implement `backend/scripts/export_training_data.py`:
  - Structured multi-turn instruction-response format in UTF-8 JSONL.
  - Track provenance back to source chunk IDs.
  - Train/Val/Test document-level splits preventing data leakage.
- [ ] Implement `backend/scripts/validate_training_data.py`:
  - Schema validation, duplicate detection, and domain balance reporting.

### Phase 8: Optional GPU Fine-Tuning Pipeline
- [ ] Create `backend/scripts/train_qlora.py` and `backend/scripts/evaluate_model.py` for future execution on CUDA/ROCm hardware.
- [ ] Write `docs/fine-tuning-guide.md` documenting VRAM requirements, library pins, and Modelfile export.

### Phase 9: Automated Tests & Windows Launch Scripts
- [ ] Add comprehensive test suite in `backend/tests/test_local_ai.py` testing ZIP safety, cleaning, chunking, FTS search, verifier, and API routes.
- [ ] Provide PowerShell one-click setup and launch scripts (`scripts/run_local_ai.ps1`, `scripts/build_index.ps1`).
- [ ] Document complete setup guide in `NYAYAVANTA_LOCAL_AI_SETUP.md`.
