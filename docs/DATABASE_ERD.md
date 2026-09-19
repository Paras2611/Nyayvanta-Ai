# Nyayavanta: Database Entity-Relationship Diagram (ERD)

> **ORM**: SQLAlchemy 2.0  
> **Supported Engines**: PostgreSQL (Production) / SQLite (Local Zero-Config Dev & Automated CI)  
> **Total Core Models**: 13

---

## 1. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Conversation : has
    User ||--o{ Case : creates
    User ||--o{ UploadedDocument : uploads
    User ||--o{ AuditEvent : generates
    Conversation ||--o{ Message : contains
    Conversation ||--o| Case : associates
    Message ||--o{ Citation : references
    Message ||--o{ Claim : asserts
    Claim ||--o| Verification : validated_by
    LegalDocument ||--o{ LegalSection : divides_into
    LegalDocument ||--o{ LegalChunk : chunks_into
    LegalSection ||--o{ LegalChunk : indexes_into
    Judgment ||--o{ LegalChunk : extracts_into
    UploadedDocument ||--o{ LegalChunk : parses_into

    User {
        string id PK
        string email UK
        string hashed_password
        string full_name
        string role
        boolean is_active
        string preferred_language
        string theme_preference
        boolean notifications_enabled
        datetime created_at
        datetime updated_at
    }

    Conversation {
        string id PK
        string user_id FK
        string domain_id
        string title
        string status
        datetime created_at
        datetime updated_at
    }

    Message {
        string id PK
        string conversation_id FK
        string sender
        text content
        json structured_response
        json clarification_payload
        datetime created_at
    }

    Case {
        string id PK
        string user_id FK
        string conversation_id FK
        string domain_id
        string title
        text dispute_description
        string complainant_role
        string opposite_party_name
        string opposite_party_type
        float disputed_amount_inr
        string incident_date
        string state_jurisdiction
        json jurisdiction_details
        json analysis_cache
        string status
        datetime created_at
        datetime updated_at
    }

    LegalDocument {
        string id PK
        string act_name
        int year
        string jurisdiction
        string domain_id
        string authoritative_body
        string source_url
    }

    LegalSection {
        string id PK
        string document_id FK
        string section_number
        string title
        text verbatim_text
        text plain_explanation
        string legal_domain
    }

    Judgment {
        string id PK
        string case_name
        string court
        string citation_str
        string judgment_date
        string bench
        string petitioner
        string respondent
        text summary
        text court_reasoning
        string outcome
        json cited_cases
        json citing_cases
        json timeline_milestones
        string source_url
    }

    LegalChunk {
        string id PK
        string document_id FK
        string section_id FK
        string judgment_id FK
        int chunk_index
        text content
        json metadata_json
        json embedding_vector
    }

    Claim {
        string id PK
        string message_id FK
        text claim_text
        string category
        int importance_score
    }

    Verification {
        string id PK
        string claim_id FK
        string status
        string ui_badge
        text matched_passage
        string source_citation
        float confidence_score
        text status_justification
        datetime created_at
    }

    Citation {
        string id PK
        string message_id FK
        string source_type
        string act_name
        string section_number
        string court_or_authority
        text excerpt
        string source_url
        float relevance_score
    }

    UploadedDocument {
        string id PK
        string user_id FK
        string case_id FK
        string filename
        string file_path
        string mime_type
        string file_size_bytes
        string status
        text extracted_text
        string risk_level
        json analysis_findings
        datetime created_at
    }

    AuditEvent {
        string id PK
        string user_id FK
        string session_id
        string action_type
        text query_text
        string domain_id
        int retrieved_sources_count
        string model_used
        json verification_summary
        int execution_time_ms
        datetime timestamp
    }
```

---

## 2. Model Dictionary & Relationships

1. **User**: Authentication, role permissions (advocate, researcher, citizen), and user preferences.
2. **Conversation**: Multi-turn legal inquiry sessions grouped chronologically.
3. **Message**: Individual exchanges containing user query or 9-section evidence-backed AI response.
4. **Case**: Structured legal matter record with pecuniary jurisdiction and parties.
5. **LegalDocument**: Indian Bare Acts (e.g. CPA 2019, TPA 1882, ICA 1872).
6. **LegalSection**: Specific statutory sections with verbatim text and plain English explanations.
7. **Judgment**: Binding precedent records from Supreme Court of India and High Courts.
8. **LegalChunk**: Atomic normalized passages indexed by BM25 and vector retriever.
9. **Claim**: Discrete factual or statutory assertions extracted from AI answers.
10. **Verification**: Tri-state grounding verdict (`SUPPORTED`, `CONTRADICTED`, `NOT_ENOUGH_EVIDENCE`) and UI status badge.
11. **Citation**: Explicit links connecting AI statements to source passages and URLs.
12. **UploadedDocument**: User-uploaded agreements, lease deeds, or invoices with parsed clauses and risk rating.
13. **AuditEvent**: Transparent log of user queries, retrieved sources, execution latency, and verification passes.
