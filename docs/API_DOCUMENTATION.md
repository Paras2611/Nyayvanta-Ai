# Nyayavanta: REST API Documentation

> **Base URL**: `http://localhost:8000/api` (proxied via Vite on `http://localhost:3000/api`)  
> **Protocol**: HTTP/1.1 JSON with JWT Bearer Authentication

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "email": "advocate.sharma@nyayavanta.in",
    "password": "SecurePassword123",
    "full_name": "Advocate R. Sharma",
    "role": "advocate"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "uuid",
      "email": "advocate.sharma@nyayavanta.in",
      "full_name": "Advocate R. Sharma",
      "role": "advocate",
      "is_active": true,
      "preferred_language": "en",
      "theme_preference": "light",
      "notifications_enabled": true,
      "created_at": "2026-09-19T09:50:00Z"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates existing user and returns JWT token.

### `GET /api/profile` & `PUT /api/profile`
Retrieve or update authenticated user profile, preferred language, and theme.

---

## 2. RAG Legal Chat Endpoints

### `POST /api/chat`
Executes the canonical 11-step legal research flow.
- **Request Body**:
  ```json
  {
    "conversationId": "optional-uuid",
    "query": "Landlord refuses to return security deposit of Rs 80,000 in Bengaluru",
    "domainId": "tenancy",
    "clarificationAnswers": {
      "q_tenancy_deed": "Unregistered Written Agreement",
      "q_notice": "yes"
    }
  }
  ```
- **Response (200 OK)**: Returns the 9-section Evidence-Backed Response:
  - `answer`: Plain-English legal assessment.
  - `whyThisMayApply`: Factual connection to statutory rules.
  - `relevantLaw`: List of sections with `actName`, `sectionNumber`, `verbatim`, and `explanation`.
  - `relevantCases`: Landmark rulings with `caseName`, `citationStr`, `court`, and `relevance`.
  - `possibleNextSteps`: Actionable procedural steps with timelines and notes.
  - `importantLimitations`: Scope boundaries and statutory limitation warnings.
  - `confidence`: Grounding score, level, and legal disclaimer caveat.
  - `verification`: List of claims with UI badge (`VERIFIED`, `PARTIALLY_VERIFIED`, `UNVERIFIED`) and justification.
  - `sources`: Authoritative Bare Act and Court links.

### `GET /api/conversations` & `GET /api/conversations/{id}`
Retrieve conversation history grouped by timeline.

---

## 3. Search & Authoritative Sources

### `POST /api/search`
Hybrid BM25 + Semantic search across Indian legal corpus.
- **Request Body**:
  ```json
  {
    "query": "Section 27 non-compete restraint of trade",
    "tab": "All",
    "domain": "employment",
    "page": 1,
    "pageSize": 10
  }
  ```

### `GET /api/laws` & `GET /api/laws/{id}`
Browse and inspect central statutes (CPA 2019, TPA 1882, ICA 1872, PGA 1972, MSMED 2006).

### `GET /api/cases` & `GET /api/cases/{id}`
Browse and inspect landmark rulings with full procedural timeline.

---

## 4. Document Intelligence

### `POST /api/documents/upload`
Multipart file upload (PDF, PNG, JPG, TXT) with secure isolation.

### `POST /api/documents/analyze`
Extracts clauses, highlights penalties/arbitration, and assigns risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

---

## 5. Saved Research & Audit

### `GET /api/saved`, `POST /api/saved`, `DELETE /api/saved/{id}`
Bookmark and manage legal research items.

### `GET /api/audit-events`
Audit trail of queries, retrieved chunks, and verification events.
