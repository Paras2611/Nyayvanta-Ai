# Nyayavanta Local AI Architecture Specification

> **Host Target**: Windows 11 / CPU-only / <= 8 GB RAM (1.4 GB free physical memory)  
> **Core Pipeline**: Local SQLite FTS5 / BM25 Inverted Index + Ollama Local LLM (`qwen3.5:0.8b`)  
> **Guiding Principle**: *"Don't make AI look magical. Make its evidence visible."*

---

## 1. System Topology & Component Diagram

```mermaid
flowchart TD
    subgraph DataIngestion ["Phase 1 & 2: Ingestion & Processing Pipeline"]
        Zip["Archive: text.zip (17 files, 1.45M chars)"] -->|Safe Traversal Ingestion| Ingest["Dataset Ingestion Engine\n(backend/app/services/dataset_audit.py)"]
        Ingest --> Manifest["Machine Manifest\n(dataset_manifest.json / .csv)"]
        Ingest --> Cleaner["Unicode & Legal Cleaner\n(backend/app/services/text_cleaner.py)"]
        Cleaner --> Chunker["Semantic-Aware Chunker\n(backend/app/services/chunker.py)"]
        Chunker --> Chunks["Structured Chunks (400-600 tokens)\n+ Immutable Content Hashes"]
    end

    subgraph IndexingLayer ["Phase 3: Zero-Memory Lightweight Retrieval"]
        Chunks --> FTSIndex["SQLite FTS5 / BM25 Inverted Index\n(backend/dataset/processed/nyayavanta_fts.db)"]
        Query["User Legal Question\n+ Target Domain"] --> Searcher["BM25 Lexical Retriever\n(backend/app/services/retrieval.py)"]
        FTSIndex --> Searcher
        Searcher --> TopChunks["Ranked Evidence Passages\n(Top 3-5 Chunks + Full Provenance)"]
    end

    subgraph LocalInferenceLayer ["Phase 4 & 5: Resource-Guarded Local LLM"]
        TopChunks --> PromptGen["Prompt Context Envelope Builder"]
        Query --> PromptGen
        PromptGen --> Ollama["Ollama Client Service (HTTP 11434)\n(backend/app/services/ollama_client.py)\nModel: qwen3.5:0.8b (ctx: 2048, out: 256)"]
        Ollama --> RawAnswer["Raw Local LLM Answer"]
        RawAnswer --> Verifier["Claim Verifier & Citation Checker\n(backend/app/services/answer_verifier.py)"]
        TopChunks --> Verifier
        Verifier --> FinalEnvelope["Grounded Legal Response Envelope\n- Answer\n- Evidence Citations\n- Tri-State Claims\n- Coverage Flags"]
    end

    subgraph PresentationLayer ["Phase 6: Web Interface & API"]
        FinalEnvelope --> LocalAIRouter["FastAPI Local AI Router (/api/local-ai)\n(backend/app/routes/local_ai.py)"]
        LocalAIRouter --> UI["React 19 Frontend Shell\n(EvidencePanel.tsx / AILegalChatPage.tsx)"]
    end

    subgraph TrainingPrep ["Phase 7 & 8: Decoupled Training Pipeline"]
        Chunks --> Exporter["Training Exporter (JSONL)\n(backend/scripts/export_training_data.py)"]
        Exporter --> TrainData["instruction_tuning.jsonl\n(Train / Val / Test Case Splits)"]
        TrainData -.->|Optional Cloud GPU| QLoRA["QLoRA Fine-Tuning Script\n(backend/scripts/train_qlora.py)"]
    end
```

---

## 2. Resource Budget & Memory Architecture

On a Windows PC with **8 GB total RAM** and approximately **1.4 GB free physical memory**, high-footprint deep learning frameworks (Torch/CUDA vector embeddings, in-memory FAISS indices, or multi-billion parameter models) will trigger severe swapping, page faults, or Out-Of-Memory (OOM) crashes.

| Component | Architecture Decision | Memory Impact | Rationale |
| :--- | :--- | :--- | :--- |
| **Document Storage** | SQLite FTS5 database on disk | < 25 MB RAM | Disk-backed inverted index; only relevant rows read into memory. |
| **Token Processing** | Streaming generator chunking | < 50 MB RAM | Files processed one by one; garbage-collected immediately. |
| **Vector Embeddings** | BM25 Lexical first; Dense Vector optional | 0 MB for BM25 | Pure algorithmic TF-IDF/BM25 requires no Torch model in memory. |
| **Local LLM Engine** | Ollama running `qwen3.5:0.8b` | ~700 MB – 1.0 GB RAM | 0.8B quantized parameters comfortably fit in 1.4 GB available RAM. |
| **Context Window** | Bounded to 2048 tokens; Output: 256 tokens | Minimal RAM | Prevents KV-cache explosion during CPU generation. |
| **Total Peak Budget** | **Strictly <= 1.2 GB RAM** | Safe headroom | Leaves operating system and browser fully functional. |

---

## 3. Strict Citations & Zero-Hallucination Policy

1. **No Phantom Authorities**: The model's prompt envelope explicitly orders:
   > *"You are an objective legal research assistant. Use ONLY the supplied legal passages. Never invent section numbers, court orders, case names, or statutory obligations. If the provided excerpts do not mention an answer, respond with 'NOT_ENOUGH_EVIDENCE'."*
2. **Deterministic Source Cross-Matching**:
   - `answer_verifier.py` parses all statutory or case citations in the answer.
   - Each citation is validated against the exact retrieved chunks in the context envelope.
   - If a citation does not exist in the retrieved passages, it is flagged as `UNVERIFIED_INVENTION` in the verification payload.
3. **Domain Coverage Gate**:
   - If a user queries `employment` or `contract` domains where the archive currently has 0 files, the pipeline skips inference and immediately returns `COVERAGE_GAP`, directing the user to official government portals.
