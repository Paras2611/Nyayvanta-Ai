# Nyayavanta Local AI Test Plan

> **Scope**: Validation suite for dataset ingestion, portable keyword search, text cleaning, chunking, SQLite FTS retrieval, Ollama integration, evidence verification, and FastAPI local AI endpoints.  
> **Environment**: Windows 11, Python 3.14.5, pytest >= 8.0.0.

---

## 1. Test Matrix Overview

| Test Module | Coverage Scope | Execution Mechanism | Expected Pass Condition |
| :--- | :--- | :--- | :--- |
| **`test_zip_safety.py`** | Rejection of path traversal (`../`), invalid extensions, duplicate file handling, idempotent reruns. | Unit test (mock zip + real zip) | 100% rejection of malicious paths; clean extraction of 17 legal files. |
| **`test_text_cleaner.py`** | Marathi Devanagari preservation, whitespace normalization, legal section preservation (`Section 2(7)`), empty file detection. | Unit test | 0% corruption of Devanagari unicode characters; legal numbers intact. |
| **`test_chunker.py`** | Token length boundaries (400-600 tokens), overlap continuity, metadata assignment, content hash determinism. | Unit test | Chunk lengths within bounds; chunk hash reproducible across runs. |
| **`test_search_text_dataset.py`** | Portability of keyword search script, CLI args, case-insensitive matches, JSON output format, unreadable file handling. | Unit / CLI test | Valid CLI execution returning accurate match counts and JSON export. |
| **`test_retrieval.py`** | SQLite FTS index build, top-k query matching, domain filtering, Marathi queries, low-relevance thresholding (`no_evidence`). | Integration test | Accurate chunk retrieval for known terms; domain filter isolation. |
| **`test_ollama_client.py`** | Health check, mock generation, connection timeout, missing model error reporting, configuration via environment. | Unit & Mock test | Graceful error states when Ollama service is stopped; valid payloads when active. |
| **`test_answer_verifier.py`** | Grounding verification, tri-state claim evaluation (`SUPPORTED`, `NOT_ENOUGH_EVIDENCE`), citation cross-checking. | Unit test | Phantom citations flagged as unverified; unsupported claims marked appropriately. |
| **`test_local_ai_api.py`** | FastAPI endpoints: `/health`, `/model`, `/query`, `/index/rebuild`, `/dataset/stats`. | Integration test | HTTP 200 responses with well-typed Pydantic schemas. |

---

## 2. Dataset Ingestion & Keyword Search Acceptance Criteria

1. **Security**: An entry named `../../etc/passwd` or `..\windows\system32\cmd.exe` in a ZIP must raise a security exception and never be written to disk.
2. **Marathi Script Safety**: Text containing `ग्राहक तक्रार` or `महाराष्ट्र भाडे नियंत्रण कायदा` must retain all Devanagari vowel signs (`matras`) and conjuncts through ingestion, cleaning, chunking, and FTS tokenization.
3. **Keyword Search Portability**: `search_text_dataset.py` must run without any hardcoded paths, supporting `--text-dir`, `--keywords`, `--format json`, and relative directory resolution.

---

## 3. Retrieval & Grounding Evaluation Queries

The retrieval engine will be evaluated using standard benchmark queries derived directly from the corpus:

| Query ID | Test Query | Expected Domain | Target Statutory / Judicial Concept | Expected Status |
| :--- | :--- | :--- | :--- | :--- |
| **Q1** | "Tenant security deposit refund and interest under Maharashtra Rent Control Act" | `rental` | Section 15, landlord obligations, interest on deposit | `evidence_available` |
| **Q2** | "Recovery of possession for bonafide requirement by landlord" | `rental` | Section 16(1)(g), bonafide need, hardship test | `evidence_available` |
| **Q3** | "District Consumer Forum jurisdiction and Section 35 complaint procedure" | `consumer` | Section 35, Consumer Protection Act, filing fee | `evidence_available` |
| **Q4** | "ग्राहक तक्रार निवारण आयोग तक्रार दाखल करण्याची मुदत" | `consumer` | Limitation period, Marathi consumer filing | `evidence_available` |
| **Q5** | "Wrongful termination of software engineer notice pay in IT sector" | `employment` | Industrial Disputes / Shops & Est. | `coverage_gap` (0 files in archive) |
| **Q6** | "Liquidated damages clause breach under Indian Contract Act section 74" | `contract` | Indian Contract Act Sec 74 | `coverage_gap` (0 files in archive) |

---

## 4. Performance & Memory Thresholds

- **Index Build Duration**: < 10 seconds for all 17 files on Windows CPU.
- **Index Disk Space**: < 5 MB SQLite database file.
- **Retrieval Latency**: < 50 milliseconds per search query.
- **Peak RAM Delta**: < 50 MB during indexing; < 100 MB during retrieval.
