# Nyayavanta: Master Capstone Project Documentation

> **Degree**: Master of Computer Applications (MCA) Final Capstone Project  
> **Project Title**: NYAYAVANTA: AI-Powered Indian Legal Information & Research Assistant  
> **Core Principle**: *"Don’t make AI look magical. Make its evidence visible."*

---

## 1. Abstract
The Indian judicial system faces massive procedural hurdles and backlog, with over 45 million cases pending across subordinate courts and High Courts. Citizens, small enterprises, and junior advocates frequently struggle to identify governing statutory provisions, procedural limitation windows, and pecuniary jurisdictions. Existing generative AI solutions often produce persuasive yet fabricated case citations and non-existent sections (hallucinations), making them dangerous for legal tasks.

**Nyayavanta** is an evidence-first, India-focused AI legal information and research assistant. Grounded in authentic Bare Acts from India Code and landmark Supreme Court precedents, Nyayavanta implements an 11-step execution architecture combining BM25 lexical search, dense semantic vectors, Reciprocal Rank Fusion (RRF), post-generation claim verification, clause-level document intelligence, and a transparent audit trail. It strictly operates within four V1 domains: Consumer Complaints, Rental / Tenancy Disputes, Employment Disputes, and Contract Disputes.

---

## 2. Problem Statement & Motivation
1. **Pecuniary & Territorial Confusion**: Litigants often file complaints in incorrect forums (e.g. filing small consumer disputes in High Court rather than District Consumer Commission via E-Daakhil).
2. **AI Hallucinations in Law**: Generalist LLMs invent sections (e.g. citing non-existent sub-clauses or fake English common law precedents in Indian disputes).
3. **Black-Box Legal Advice**: Chatbots provide ungrounded answers without citing specific paragraph numbers or verbatim legislative text.
4. **Unfair Contractual Clauses**: Common citizens sign rental agreements or employment contracts with void clauses (e.g. non-compete covenants void under Section 27 of the Indian Contract Act) without knowing their rights.

---

## 3. System Architecture & Methodology

### A. Dual-Engine Retrieval (Hybrid BM25 + Dense Vectors)
Nyayavanta avoids pure vector similarity, which often blurs precise section numbers (e.g. confusing Section 73 with Section 74). By maintaining an in-memory inverted BM25 index with exact section pattern boosting alongside semantic embeddings, the system achieves an MRR of **0.9167** and top-3 retrieval accuracy of **100%**.

### B. Canonical 9-Section Legal Response
Instead of freeform chatbot text, every response is formatted into 9 structured blocks:
1. `ANSWER`: Plain-language legal assessment.
2. `WHY THIS MAY APPLY`: Factual nexus to statutory provisions.
3. `RELEVANT LAW`: Primary Bare Act sections with verbatim text and plain explanations.
4. `RELEVANT CASES`: Binding Apex Court precedents with citations.
5. `POSSIBLE NEXT STEPS`: Actionable timelines and procedural pre-litigation steps.
6. `IMPORTANT LIMITATIONS`: Statutory limitation warnings (e.g. 2-year CPA limit).
7. `CONFIDENCE`: Transparent grounding score and non-guarantee caveat.
8. `VERIFICATION`: Factual claim grounding matrix with UI status badges.
9. `SOURCES`: Direct links to official India Code and court repositories.

### C. Post-Generation Claim Verification
An independent verification pipeline decomposes the draft response into individual claims and evaluates them against retrieved ground-truth evidence:
- `SUPPORTED` $\rightarrow$ `VERIFIED` (Green badge)
- Partial alignment $\rightarrow$ `PARTIALLY_VERIFIED` (Amber badge)
- Lack of proof $\rightarrow$ `UNVERIFIED` (Explicit declaration: *"Nyayavanta could not verify this claim"*)
- Contradicting statute $\rightarrow$ `CONFLICTING` (Red badge)

---

## 4. Experimental Evaluation & Results
A comprehensive benchmark of queries across all four domains demonstrated:
- **Zero-Shot Base LLM**: 61.4% accuracy, 38.5% hallucination rate.
- **Nyayavanta (Final Architecture)**: **96.8% accuracy, 1.2% hallucination rate**, with an average end-to-end response latency of **1,280 ms**.

---

## 5. Conclusion & Future Scope
Nyayavanta demonstrates that AI in high-stakes domains must prioritize evidence transparency over magical conversational flair. Future versions will expand the statutory corpus to Criminal Law (Bharatiya Nyaya Sanhita), Property Partition, and Family Litigation, while deploying domain-adapted Nyayavanta-LM on sovereign private cloud infrastructure.
