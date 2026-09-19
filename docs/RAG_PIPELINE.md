# Nyayavanta: RAG Retrieval & Ingestion Pipeline

> **Core Objective**: Ground AI responses in authentic, verifiable Indian primary legal materials with chunk-level provenance.

---

## 1. Pipeline Architecture

```mermaid
flowchart TD
    UserQuery["User Dispute Query / Case Facts"] --> Preprocess["Pre-processing & Tokenization\n(Preserve 'Section 2(7)', '108(B)(q)', etc.)"]
    
    subgraph Ingestion ["Corpus Ingestion & Indexing"]
        BareActs["India Code Bare Acts\n(CPA 2019, TPA 1882, ICA 1872, PGA 1972, MSMED 2006)"] --> Chunking["Atomic Legal Section Chunking"]
        ApexJudgments["Supreme Court Landmark Precedents\n(Golikari, Kailash Nath, Vodafone)"] --> Chunking
        Chunking --> LexicalIndex["BM25 Lexical Inverted Index\n(Term Frequency & Inverse Doc Freq)"]
        Chunking --> DenseIndex["Dense Semantic Sub-word Vector Index\n(Cosine Similarity Representations)"]
    end

    Preprocess --> BM25Search["BM25 Lexical Matcher\n(High boost for exact Section patterns)"]
    Preprocess --> DenseSearch["Dense Semantic Matcher\n(Captures conceptual dispute intent)"]

    LexicalIndex --> BM25Search
    DenseIndex --> DenseSearch

    BM25Search --> RRF["Reciprocal Rank Fusion (RRF) Reranker\nRRF(d) = Σ 1 / (60 + Rank_m(d))"]
    DenseSearch --> RRF

    RRF --> DomainFilter["Metadata & Domain Filter\n(Consumer, Tenancy, Employment, Contract)"]
    DomainFilter --> TopK["Top-K Relevant Legal Passages\n(Chunk IDs, Section Nos, Act Names, URLs)"]

    TopK --> ContextEnvelope["Context Preparation Envelope\n(Structured Envelope + Case Facts)"]
    ContextEnvelope --> ModelAdapter["Nyayavanta-LM Model Adapter"]
```

---

## 2. Ingestion & Indexing Specifications

### Chunking Strategy
- **Bare Acts**: Each chunk represents a discrete statutory section (`LegalSection`), preserving:
  - Act name and publication year
  - Section number (e.g. `Section 2(7)`, `Section 74`)
  - Section title
  - Verbatim legislative text
  - Plain English explanation
  - Canonical official URL (India Code repository)
- **Judicial Precedents**: Each landmark case is indexed with:
  - Case title and citation string
  - Bench composition and court level
  - Summary of facts
  - Court reasoning (Ratio Decidendi)
  - Operative outcome and disposition

### Hybrid Fusion Formula
Reciprocal Rank Fusion (RRF) combines lexical BM25 rankings and dense semantic rankings without requiring sensitive hyperparameter tuning:
$$\text{RRF Score}(d) = \sum_{m \in \{\text{BM25}, \text{Dense}\}} \frac{1}{60 + \text{Rank}_m(d)}$$
Exact section keyword matches receive an additional $2.5\times$ boost in the lexical index, ensuring direct hits when a user mentions specific section numbers.
