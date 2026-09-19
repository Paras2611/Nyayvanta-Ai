# Nyayavanta: Final Presentation & Live Demo Script

> **Demonstration Goal**: Showcase the 11-step evidence-first Indian legal research workflow, interactive clarification prompt, claim verification matrix, and document clause analysis in under 7 minutes.

---

## Act 1: Introduction & Product Positioning (1 Minute)
1. **Open Platform**: Navigate to `http://localhost:3000` (Dashboard).
2. **Key Talking Points**:
   - *"Welcome to Nyayavanta: AI-Powered Indian Legal Information & Research Assistant."*
   - *"Our founding principle is: 'Don't make AI look magical. Make its evidence visible.'"*
   - Point out the persistent legal disclaimer banner: *"Nyayavanta provides research assistance, not legal advice, and never guarantees legal outcomes."*
   - Highlight the 4 initial V1 domains: Consumer Complaints, Tenancy Disputes, Employment Disputes, Contract Disputes.

---

## Act 2: Legal Research & Interactive Clarification (2.5 Minutes)
1. **Navigate to Ask Nyayavanta (`/chat`)**:
   - Select domain: **Consumer Complaints** or **Tenancy Disputes**.
2. **Scenario 1 - Missing Details (Demonstrate Clarification Pipeline)**:
   - Type query: *"Seller sent me a damaged refrigerator and refuses replacement."*
   - Click **Research Law**.
   - Observe processing state stepper (*"Searching Indian legal sources..."*, *"Finding relevant provisions..."*, *"Retrieving judgments..."*).
   - **Highlight Clarification Card**:
     - Explain to evaluators: *"Notice that Nyayavanta does NOT hallucinate or guess assumptions. Because the consideration amount was missing, it prompts for purchase price and tax invoice availability."*
3. **Scenario 2 - Full Evidence Grounding & 9 Canonical Sections**:
   - Submit clarifications: Select *"Tax Invoice Available"* and enter price.
   - Observe full response rendering:
     - **Section 1 (Answer)**: Explains rights under Section 2(7) and Section 2(11) of Consumer Protection Act 2019.
     - **Section 2 (Why This May Apply)**: Nexus between payment of consideration and deficiency of service.
     - **Section 3 (Relevant Law)**: Verbatim text of Bare Act provisions.
     - **Section 4 (Relevant Cases)**: Binding Apex Court rulings.
     - **Section 5 (Possible Next Steps)**: Step 1: 15-day Pre-Litigation Legal Notice; Step 2: E-Daakhil filing.
     - **Section 6 (Limitations)**: 2-year statutory limitation under Section 69 CPA.
     - **Right Evidence Panel**: Inspect the **Confidence Card** (88% grounding score) and **Claim Verification Cards** with green `VERIFIED` badges and exact statutory citations.

---

## Act 3: Document Intelligence & Clause Risk Analysis (2 Minutes)
1. **Navigate to Documents (`/documents`)**:
   - Click preset sample: *"Residential Lease with Deposit Forfeiture"*.
   - Click **Run AI Analysis**.
   - Observe pipeline steps: *Uploading -> Extracting Text -> Analyzing -> Finding Law -> Verifying*.
2. **Highlight Findings**:
   - Show overall risk badge: **Risk: High / Critical**.
   - Point out **Clause 8 (Deposit Forfeiture)**: Flagged under Section 74 of the Indian Contract Act and the Supreme Court *Kailash Nath* doctrine (forfeiture without proof of actual damage is void).
   - Point out **Clause 14 (Arbitration)**: Explains that consumer forum remedies remain supplementary under Section 100 CPA 2019.

---

## Act 4: Statutory Search, Landmark Cases & Internationalization (1.5 Minutes)
1. **Legal Search (`/legal-search`)**:
   - Search: *"Section 27"*.
   - Filter by domain: *Employment Law*.
   - Show instant hybrid retrieval of Section 27 (Restraint of Trade Void) and Niranjan Shankar Golikari precedent.
2. **Case Detail (`/case-search` -> Case Detail)**:
   - Open *Niranjan Shankar Golikari v. Century Spinning*.
   - Show the interactive procedural timeline: `Filing -> Hearing -> Interim Order -> Judgment -> Final Outcome`.
3. **Multilingual Toggle (i18n)**:
   - Switch language in top bar from **EN** to **HI (हिंदी)** or **MR (मराठी)**.
   - Point out that all navigation, headers, and disclaimer notices dynamically localize without hardcoding.

---

## Conclusion
- *"Nyayavanta is fully modular, verified with 10 automated backend tests and zero TypeScript errors, and ready to bridge the gap between Indian statutory law and accessible justice."*
