# ⚖️ Nyayavanta AI (LawLink) — Project Status, Progress & Roadmap Briefing

> **Instructions for ChatGPT / AI Assistant**:
> This document is a complete architectural and progress briefing for **Nyayavanta AI**, an evidence-first legal research and statutory intelligence platform tailored for Indian law. Use this summary to understand the current implementation state, codebase architecture, completed deliverables, and pending roadmap items for upcoming development sprints.

---

## 📌 1. Project Overview & Value Proposition

- **Project Name**: Nyayavanta AI (LawLink SIH)
- **Target Jurisdiction**: Republic of India (Central Statutes, State Amendments, Supreme Court of India, High Courts)
- **Primary Mission**: Demystify Indian legal complexities by providing verifiable, grounded legal intelligence for citizens, law students, and legal practitioners.
- **Core Philosophy**: **"Evidence-First, Zero-Hallucination"**. No legal advice or claim is presented without explicit mapping to authentic Bare Acts, statutory sections, or binding Supreme Court precedents.
- **V1 Core Domains Supported**:
  1. **Consumer Complaints** (*Consumer Protection Act, 2019*, E-Daakhil, product liability, deficiency in service).
  2. **Rental & Tenancy Disputes** (*Transfer of Property Act, 1882*, Model Tenancy Act, deposit withholding, eviction).
  3. **Employment & Labor Disputes** (*Payment of Gratuity Act, 1972*, *Industrial Disputes Act, 1947*, Section 27 *Indian Contract Act* non-compete restraint unenforceability).
  4. **Commercial & Contract Disputes** (*Indian Contract Act, 1872*, Sections 73/74 damages, *MSMED Act, 2006* 45-day delayed payment recovery).

---

## 🛠️ 2. Technology Stack & Architecture

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React Icons, Motion |
| **Routing** | `react-router-dom` v7 (Client-side SPA with Vercel edge rewrite configuration) |
| **Internationalization** | `i18next`, `react-i18next` (English `en`, Hindi `hi`, Marathi `mr`) |
| **Styling & Theming** | Tailwind v4 dark variant engine (`.dark` on `html`), custom Light Lavender and Deep Indigo themes |
| **Backend (Dual Option)** | Node.js Express server (`server.ts`) + Python backend (`backend/` with pytest suite) |
| **AI / LLM Integration** | Google Gemini API (`@google/genai`, `gemini-3.7-flash` with JSON schema output) |
| **Deployment Target** | Vercel (Frontend SPA edge distribution) + Local/Cloud Server (`node dist/server.cjs`) |
| **Repository** | GitHub (`Paras2611/Nyayvanta-Ai`) — Branch: `main` |

---

## ✅ 3. What Has Been Completed & Implemented

### A. Core Features & User Flows
1. **Evidence-First AI Legal Chat (`/chat`)**:
   - Interactive prompt suggestions for Tenancy, Consumer, Employment, and Contract disputes.
   - Evidence & Grounding Panel displaying:
     - Real-time statutory section cards (BNS, BSA, CPC, ICA, CPA, TPA).
     - Supreme Court binding ratio citations.
     - Claim verification matrix with status tags (`VERIFIED`, `PARTIALLY_VERIFIED`, `CONFLICTING`).
     - Grounding confidence score (0–100%) and transparency caveats.
2. **Document Statutory Analyzer (`/documents`)**:
   - Split-screen workspace for uploading/pasting agreements, contracts, and employment letters.
   - Quick-load prebuilt sample agreements (Bengaluru Tenancy Agreement, Tech Employment Contract with 1-Year Non-Compete).
   - Clause-by-clause risk rating badge (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
   - Actionable compliance steps and statutory references.
3. **Indian Legal Corpus Search (`/legal-search`)**:
   - Tabbed filtering across Bare Acts, Sections, Rules/Regulations, and Judicial Rulings.
   - Domain-specific filtering and BM25 relevance scoring.
   - Direct "Save to Research" and "Ask AI" integrations.
4. **Landmark Case Precedent Search (`/cases` & `/cases/:id`)**:
   - Search Supreme Court and High Court judgments by title, citation, or legal holding.
   - Displays procedural history, key legal ratios, and outcome highlights.
5. **Saved Research & Grounded Repository (`/saved`)**:
   - Filter saved items by Statutes, Precedents, Clauses, and AI Answers.
   - One-click transfer of saved citations into the AI Chat Workspace.
6. **Audit Trail & Inquiry History (`/history`)**:
   - Chronological logging grouped by *Today*, *Yesterday*, *Previous 7 Days*, and *Older*.
7. **Practitioner Profile & Credentials (`/profile`)**:
   - Advocate enrollment details, jurisdiction tags, and verified practitioner badges.
8. **Platform Settings (`/settings`)**:
   - Integrated theme selectors and language switchers.
   - Notification preferences and data retention policy configuration (30/90/365 days or zero-retention mode).

---

### B. UI/UX, Theming & Responsiveness
1. **Fully Functional Light / Dark Mode Toggle**:
   - Dedicated toggle button located **directly to the left of the language selection combobox** in the top header.
   - Accessible button with Sun/Moon icons, hover feedback, and ARIA labels.
   - Centralized `ThemeContext` that controls `.dark` on `document.documentElement`, syncs with `localStorage` (`nyayavanta_theme`), and respects system preferences.
   - Synchronized bi-directionally with Settings page theme toggles.
2. **100% Dynamic Multi-Language Localization**:
   - Supported languages: **English (`en`)**, **Hindi (`hi`)**, **Marathi (`mr`)**.
   - Zero hardcoded English strings remaining across all user-facing components:
     - Header disclaimer banner & mobile drawer navigation.
     - All 10 legal categories.
     - Dashboard hero, search inputs, domain cards, quick actions, and recent research.
     - AI legal chat header, suggested prompts, sessions, input bar, and evidence panel.
     - Search filters, result counters, document analysis findings, recommendations, profile fields, and settings.
   - Automatic language persistence in `localStorage` (`nyayavanta_language`).
3. **Comprehensive Device Responsiveness**:
   - Optimized for **Mobile (320px–480px)**, **Tablet/Foldables (600px–900px)**, and **Desktop (1024px–2560px+)**.
   - Features mobile top bar, slide-out hamburger navigation drawer, and bottom navigation bar (`Home`, `Ask AI`, `Laws`, `Docs`, `More`).
   - Sticky chat input bars and mobile segmented tab switchers (`Document Input` vs `Analysis Findings`).

---

### C. Deployment & Infrastructure Fixes
1. **Vercel SPA 404 Refresh Fix**:
   - Resolved the `404: NOT_FOUND` issue on page refresh (`nyayvanta-ai.vercel.app/case-search`).
   - Configured `vercel.json` with route rewrite rules routing all client paths to `/index.html`.
2. **Resilient API Architecture with Fallback Data**:
   - Enhanced `src/services/api.ts` with response interceptors that catch non-JSON/HTML responses.
   - Integrated comprehensive client-side statutory/precedent fallbacks so the application remains 100% functional and crash-free even during backend cold starts or offline operation.
3. **Code Quality & Build Pipeline**:
   - `npm run lint` (`tsc --noEmit`): **0 errors**.
   - `npm run build` (`vite build && esbuild server.ts`): Clean production bundle output in `dist/`.

---

## ⏳ 4. What Is Yet To Be Done (Pending Tasks & Roadmap)

Here is the prioritized checklist of pending features, integrations, and architectural enhancements:

### 🚀 Phase 1: Production Backend & Cloud Deployment
- [ ] **Deploy Dedicated API Backend**:
  - Deploy the Node.js Express server (`server.ts`) or Python backend (`backend/run.py`) to a cloud hosting platform (e.g., Render, Railway, Fly.io, or AWS EC2/ECS).
  - Configure Vercel environment variables (`VITE_API_URL` or reverse proxy rewrite) to connect the Vercel frontend to the live backend.
- [ ] **Configure Gemini API Key in Production**:
  - Add `GEMINI_API_KEY` to production environment variables for real-time AI classification, dispute intake, and legal notice generation.
- [ ] **SQLite / PostgreSQL Production Persistence**:
  - Migrate local `nyayavanta.db` SQLite database to hosted PostgreSQL (Supabase/Neon/AWS RDS) for multi-tenant scalability.

### 🧠 Phase 2: Advanced Legal Intelligence & RAG
- [ ] **Vector Database & Full-Text Retrieval**:
  - Ingest the complete corpus of Central Indian Bare Acts (BNS 2023, BNSS 2023, BSA 2023, CPC 1908, ICA 1872, etc.) into a vector database (ChromaDB / Pinecone / Qdrant).
  - Implement hybrid search combining dense semantic embeddings (e.g., `text-embedding-004`) with BM25 keyword matching for exact Section number lookups.
- [ ] **Supreme Court & High Court Precedent Corpus Expansion**:
  - Expand case database from sample landmark decisions to 1,000+ indexed judgments categorized by legal ratio, bench size, and overruling status.

### 📄 Phase 3: Document Analysis & OCR
- [ ] **Real PDF/Image Document OCR**:
  - Connect client file upload dropzone to backend OCR pipeline (Tesseract OCR / AWS Textract / PyMuPDF) for extracting text directly from scanned stamp papers, lease deeds, and FIRs.
- [ ] **Export Generated Legal Notices to PDF/DOCX**:
  - Add a one-click "Download Formal Notice" button that generates a professionally formatted, court-ready PDF with letterhead, advocate signature line, and postal dispatch instructions.

### 🔐 Phase 4: Authentication & Practitioner Workspaces
- [ ] **Advocate Authentication & Verification**:
  - Implement authentication (Clerk / Supabase Auth / Firebase).
  - Add verification workflow for practicing advocates to verify Bar Council of India enrollment numbers.
- [ ] **Multi-Session Chat History Persistence**:
  - Persist conversation threads per user account across devices rather than relying on session storage.

### 🌐 Phase 5: Additional Regional Languages & Voice Assistance
- [ ] **Additional Indian Languages**:
  - Add locale JSONs and translations for **Bengali (`bn`)**, **Tamil (`ta`)**, **Telugu (`te`)**, **Kannada (`kn`)**, and **Gujarati (`gu`)**.
- [ ] **Vernacular Voice Search (Speech-to-Text)**:
  - Connect the microphone button to Web Speech API or OpenAI Whisper for speech-to-text queries in Hindi and Marathi.

### 🧪 Phase 6: Automated Testing & CI/CD
- [ ] **Playwright End-to-End Tests**:
  - Write automated browser tests verifying mobile drawer navigation, theme toggling, language switching, and search queries.
- [ ] **GitHub Actions Workflow**:
  - Configure automated linting and build checks on pull requests to `main`.

---

## 💡 5. Prompt Ideas to Use in ChatGPT

When pasting this document into ChatGPT, you can ask prompts such as:

1. *"Based on this project status document, help me architect the vector RAG pipeline using ChromaDB/Pinecone and Google Gemini for searching 500+ Indian Bare Acts."*
2. *"Write a Python FastAPI service that ingests scanned lease agreements, runs OCR, and evaluates clauses against Section 27 and Section 74 of the Indian Contract Act."*
3. *"Design the PostgreSQL database schema for Nyayavanta AI covering users, advocate profiles, saved research items, and chat sessions with citation metadata."*
4. *"Create a GitHub Actions CI/CD workflow that runs TypeScript linting, Python pytest, and verifies Vite build before merging to main."*

---

*File generated for Nyayavanta AI (LawLink SIH). Repository: [Paras2611/Nyayvanta-Ai](https://github.com/Paras2611/Nyayvanta-Ai)*
