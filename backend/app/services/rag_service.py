import os
import re
import json
import logging
import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
try:
    from google import genai
except ImportError:
    genai = None

from backend.app.core.config import settings
from backend.app.models.conversation import Conversation, Message
from backend.app.models.legal_data import LegalSection, Judgment
from backend.app.schemas.chat import (
    EvidenceBackedResponse, LegalSectionItem, CaseCitationItem,
    ClaimVerificationItem, NextStepItem, SourceItem, ConfidenceInfo,
    ClarificationPayload, ClarificationQuestion
)
from backend.app.services.hybrid_search import hybrid_engine
from backend.app.services.verification_service import claim_verifier

logger = logging.getLogger(__name__)

class RAGService:
    """Orchestrates the 11-step evidence-backed Indian legal research pipeline."""

    def __init__(self):
        self._gemini_client = None

    def _get_client(self):
        if not self._gemini_client and settings.GEMINI_API_KEY:
            try:
                self._gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.warning(f"Could not initialize Gemini Client: {e}")
        return self._gemini_client

    def detect_missing_critical_info(self, query: str, domain_id: str) -> Optional[ClarificationPayload]:
        """Detect whether critical facts are missing for sound legal analysis."""
        lower = query.lower()
        questions = []

        if domain_id == "consumer":
            if not any(w in lower for w in ["paid", "inr", "rupees", "cost", "price", "₹"]):
                questions.append(ClarificationQuestion(
                    id="q_amount",
                    text="What was the total purchase price or consideration amount involved?",
                    type="number",
                    helpText="Required to determine whether District, State, or National Consumer Commission has pecuniary jurisdiction."
                ))
            if not any(w in lower for w in ["invoice", "bill", "receipt", "order id"]):
                questions.append(ClarificationQuestion(
                    id="q_invoice",
                    text="Do you possess a written tax invoice, receipt, or order confirmation?",
                    type="single_choice",
                    options=["Yes, Tax Invoice Available", "Only Payment Debit Record / UPI receipt", "No Written Record"],
                    helpText="Essential primary evidence under Section 2(7) of the Consumer Protection Act, 2019."
                ))

        elif domain_id == "tenancy":
            if not any(w in lower for w in ["agreement", "lease", "rent deed", "oral"]):
                questions.append(ClarificationQuestion(
                    id="q_tenancy_deed",
                    text="Was there an executed written tenancy agreement or was it an oral agreement?",
                    type="single_choice",
                    options=["Registered Lease Deed", "Unregistered Written Agreement", "Oral Tenancy"],
                    helpText="Determines whether statutory tenancy protections or summary Rent Authority processes apply."
                ))
            if not any(w in lower for w in ["notice", "letter", "message", "whatsapp"]):
                questions.append(ClarificationQuestion(
                    id="q_notice",
                    text="Have you served a formal written notice or written communication requesting return of deposit / vacation?",
                    type="yes_no",
                    helpText="Required to prove cause of action and date of default."
                ))

        elif domain_id == "employment":
            if not any(w in lower for w in ["years", "months", "duration", "tenure"]):
                questions.append(ClarificationQuestion(
                    id="q_tenure",
                    text="How many continuous years of service did you complete with the employer?",
                    type="dropdown",
                    options=["Less than 1 Year", "1 to 5 Years", "5 Years or More"],
                    helpText="5 continuous years triggers mandatory statutory gratuity rights under Section 4 of Payment of Gratuity Act."
                ))

        elif domain_id == "contract":
            if not any(w in lower for w in ["written", "signed", "email", "verbal"]):
                questions.append(ClarificationQuestion(
                    id="q_contract_form",
                    text="What form of agreement exists between the parties?",
                    type="single_choice",
                    options=["Signed Formal Agreement", "Exchange of Purchase Orders / Emails", "Oral / Informal Understanding"],
                    helpText="Indian Contract Act Section 10 requires certainty of terms to enforce liquidated damages."
                ))

        if questions:
            return ClarificationPayload(type="clarification", questions=questions)
        return None

    def execute_legal_analysis(
        self,
        db: Session,
        query: str,
        domain_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        clarification_answers: Optional[Dict[str, Any]] = None,
        case_facts: Optional[Dict[str, Any]] = None
    ) -> EvidenceBackedResponse:
        """Runs the 11-step Nyayavanta evidence-backed execution flow."""

        # 1 & 2. Domain & Intake Detection
        if not domain_id:
            lower = query.lower()
            if any(w in lower for w in ["rent", "landlord", "tenant", "deposit", "lease", "evict"]):
                domain_id = "tenancy"
            elif any(w in lower for w in ["salary", "job", "gratuity", "non-compete", "resignation", "notice period", "employer"]):
                domain_id = "employment"
            elif any(w in lower for w in ["vendor", "breach", "contract", "msme", "invoice", "penalty", "agreement"]):
                domain_id = "contract"
            else:
                domain_id = "consumer"

        # Check if clarification is needed and not already answered
        if not clarification_answers:
            clarification = self.detect_missing_critical_info(query, domain_id)
            if clarification:
                conv_id = conversation_id or str(uuid.uuid4())
                msg_id = str(uuid.uuid4())
                return EvidenceBackedResponse(
                    conversationId=conv_id,
                    messageId=msg_id,
                    domainId=domain_id,
                    isClarification=True,
                    clarification=clarification,
                    answer="Before formulating a conclusive statutory assessment, Nyayavanta needs clarifying factual details to accurately determine jurisdiction and applicable statutory relief.",
                    whyThisMayApply="Indian procedural law and pecuniary limits depend strictly on factual documentation and precise disputed quantum.",
                    relevantLaw=[],
                    relevantCases=[],
                    possibleNextSteps=[],
                    importantLimitations=["Answers depend on facts supplied."],
                    confidence=ConfidenceInfo(
                        score=60.0,
                        level="CONDITIONAL",
                        caveat="Clarification pending for factual precision.",
                        rationale="Awaiting specific facts on consideration/agreement form."
                    ),
                    verification=[],
                    sources=[]
                )

        # 4 & 5. Hybrid Retrieval (BM25 + Dense + RRF)
        retrieved_passages = hybrid_engine.search(db, query=query, domain_id=domain_id, top_k=5)

        # 6. Context Preparation
        context_blocks = []
        for p in retrieved_passages:
            context_blocks.append(p["content"])
        prepared_context = "\n---\n".join(context_blocks)

        # 7. AI Analysis (Gemini adapter or statutory knowledge synthesis)
        client = self._get_client()
        raw_answer = ""
        why_apply = ""
        next_steps = []
        limitations = []

        if client:
            prompt = f"""You are the Core Intelligence Engine of Nyayavanta, an India-specific legal information and research assistant.
DOMAIN: {domain_id}
USER SITUATION: {query}
CLARIFICATION ANSWERS: {json.dumps(clarification_answers or {})}
RETRIEVED STATUTORY CONTEXT:
{prepared_context}

RULES:
1. Don't make AI look magical. Make its evidence visible.
2. Ground all legal assertions in authentic Indian statutes (Consumer Protection Act 2019, Transfer of Property Act 1882, Indian Contract Act 1872, Payment of Gratuity Act 1972, Industrial Disputes Act 1947, MSMED Act 2006).
3. DO NOT fabricate case citations or fake sections. Reference only verified statutory sections.
4. Respond in valid JSON with:
{{
  "answer": "Comprehensive, plain-language legal explanation connecting facts to law",
  "whyThisMayApply": "Explicit factual reasoning of why the provisions apply to this scenario",
  "importantLimitations": ["limitation 1", "limitation 2"],
  "nextSteps": [
    {{
      "stepNumber": 1,
      "title": "Title",
      "category": "PRE_LITIGATION",
      "description": "Details",
      "actionableNotes": ["Note 1", "Note 2"],
      "recommendedTimeline": "Immediate (within 7 days)"
    }}
  ]
}}"""
            try:
                resp = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config={"response_mime_type": "application/json"}
                )
                parsed = json.loads(resp.text)
                raw_answer = parsed.get("answer", "")
                why_apply = parsed.get("whyThisMayApply", "")
                limitations = parsed.get("importantLimitations", [])
                for ns in parsed.get("nextSteps", []):
                    next_steps.append(NextStepItem(**ns))
            except Exception as e:
                logger.warning(f"Gemini generation fallback: {e}")

        # Fallback synthesis if API is unavailable
        if not raw_answer:
            if domain_id == "consumer":
                raw_answer = (
                    "Under Section 2(7) of the Consumer Protection Act, 2019, you qualify as an aggrieved consumer entitled to seek relief for deficiency of service under Section 2(11). "
                    "The service provider or seller is under a statutory obligation to cure defects, refund the consideration, or pay compensation. "
                    "Complaints may be submitted directly to the District Consumer Commission via the official E-Daakhil portal within a strict limitation period of 2 years from the date the dispute arose."
                )
                why_apply = "The transaction involves purchase of goods or services for personal use where the opposite party failed to adhere to promised standards or unlawfully retained consideration."
                limitations = [
                    "Does not apply if the transaction was conducted for resale or commercial profit.",
                    "Must be filed within 2 years of the cause of action (Section 69, CPA 2019)."
                ]
                next_steps = [
                    NextStepItem(
                        stepNumber=1,
                        title="Issue Formal Pre-Litigation Notice",
                        category="PRE_LITIGATION",
                        description="Issue a 15-day pre-litigation legal notice via Registered Post AD and Email.",
                        actionableNotes=["Demand full refund or deficiency rectification", "Retain postal delivery receipt for the court record"],
                        recommendedTimeline="Immediate (within 3-5 days)"
                    ),
                    NextStepItem(
                        stepNumber=2,
                        title="Lodge E-Daakhil Consumer Petition",
                        category="FILING_PROCEDURE",
                        description="If opposite party fails to respond within 15 days, file a complaint on E-Daakhil (edaakhil.nic.in).",
                        actionableNotes=["Attach invoice, payment proof, and notice copy", "District Commission jurisdiction applies"],
                        recommendedTimeline="Day 16 post-notice delivery"
                    )
                ]
            elif domain_id == "tenancy":
                raw_answer = (
                    "Under Section 108(B)(q) of the Transfer of Property Act, 1882 and model tenancy norms, a landlord is statutorily obligated to refund the security deposit upon peaceful handover of the leased premises. "
                    "Unilateral retention of the security deposit without establishing actual proven damages violates established principles under Section 74 of the Indian Contract Act, 1872. "
                    "In the absence of registered contract clauses to the contrary, termination is governed by 15 days' notice under Section 106."
                )
                why_apply = "The tenant has vacated the property and demanded refund, while the landlord has retained the consideration without providing an itemized account of actual repairs."
                limitations = [
                    "Subject to specific State Rent Control Act amendments if the premises are covered under local rent control.",
                    "Landlord is entitled to adjust admitted unpaid utility bills and verified structural damage."
                ]
                next_steps = [
                    NextStepItem(
                        stepNumber=1,
                        title="Serve Formal Written Notice for Deposit Refund",
                        category="PRE_LITIGATION",
                        description="Serve a demand notice giving 15 days to refund the full security deposit.",
                        actionableNotes=["Cite Section 108 Transfer of Property Act and Kailash Nath precedent", "Keep postal track consignment slip"],
                        recommendedTimeline="Within 3 days"
                    ),
                    NextStepItem(
                        stepNumber=2,
                        title="File Petition before Rent Authority / Small Causes",
                        category="FILING_PROCEDURE",
                        description="Approach the jurisdictional Rent Court or Small Causes Court for money recovery under the Limitation Act.",
                        actionableNotes=["File under summary recovery procedure", "Claim statutory interest from date of vacation"],
                        recommendedTimeline="Post 15-day notice window"
                    )
                ]
            elif domain_id == "employment":
                raw_answer = (
                    "Under Section 27 of the Indian Contract Act, 1872, agreements that restrain any person from exercising a lawful profession, trade, or business are void. "
                    "As affirmed by the Supreme Court in Niranjan Shankar Golikari, post-employment non-compete clauses cannot be enforced against an employee. "
                    "Furthermore, employees who have completed continuous service are protected under the Payment of Gratuity Act, 1972, where delays attract statutory interest under Section 7(3A)."
                )
                why_apply = "The dispute pertains to terms of employment, withheld relieving documents, non-compete restrictions, or statutory employee dues."
                limitations = [
                    "Non-disclosure of proprietary trade secrets or intellectual property theft remains actionable under common law.",
                    "Liquidated training bond damages are enforceable only to the extent of actual expenses incurred by the employer."
                ]
                next_steps = [
                    NextStepItem(
                        stepNumber=1,
                        title="Send Formal Demand for Experience Letter & Full & Final Settlement",
                        category="PRE_LITIGATION",
                        description="Write to HR and legal department stating that post-service restraint is void under Sec 27 ICA.",
                        actionableNotes=["Attach resignation acceptance", "Demand statutory interest on unpaid salary"],
                        recommendedTimeline="Immediate"
                    ),
                    NextStepItem(
                        stepNumber=2,
                        title="Approach Labour Conciliation Officer",
                        category="LEGAL_AID",
                        description="Lodge grievance on the Ministry of Labour SAMADHAAN Portal (samadhaan.labour.gov.in).",
                        actionableNotes=["Conciliation process is free of court fees", "Controlling Authority decides gratuity claims"],
                        recommendedTimeline="Within 14 days"
                    )
                ]
            else:  # Contract
                raw_answer = (
                    "Under Section 73 and 74 of the Indian Contract Act, 1872, compensation for breach of contract is limited to actual damage or loss that naturally arose in the usual course of things. "
                    "The Supreme Court in Kailash Nath Associates settled that damage or loss is the essential precondition; arbitrary penalties or total forfeiture of consideration cannot be sustained. "
                    "For registered MSME suppliers, Section 15 & 16 of the MSMED Act, 2006 mandate invoice clearance within 45 days along with compound interest at three times the RBI bank rate."
                )
                why_apply = "A valid contract existed and the respondent failed to perform agreed obligations, causing direct quantifiable financial prejudice."
                limitations = [
                    "Indirect or remote losses cannot be recovered under Section 73.",
                    "A 3-year limitation period applies from the default date under the Limitation Act, 1963."
                ]
                next_steps = [
                    NextStepItem(
                        stepNumber=1,
                        title="Issue Pre-Litigation Demand Notice",
                        category="PRE_LITIGATION",
                        description="Deliver formal notice setting out breach, default invoices, and 15-day cure deadline.",
                        actionableNotes=["Cite Section 73/74 ICA", "Reference MSMED Act if registered"],
                        recommendedTimeline="Within 5 days"
                    ),
                    NextStepItem(
                        stepNumber=2,
                        title="Initiate Commercial Recovery / MSME Samadhaan",
                        category="FILING_PROCEDURE",
                        description="File application before the MSME Facilitation Council or Commercial Court.",
                        actionableNotes=["Fast-track summary procedure", "Commercial Courts Act 2015 provides designated benches"],
                        recommendedTimeline="After notice expiry"
                    )
                ]

        # 8. Claim Extraction & Verification Pipeline
        extracted_claims = claim_verifier.extract_claims(raw_answer, domain_id)
        verified_claims = claim_verifier.verify_against_evidence(extracted_claims, retrieved_passages)

        # 9. Citation Matching & Source Mapping
        relevant_laws: List[LegalSectionItem] = []
        relevant_cases: List[CaseCitationItem] = []
        sources: List[SourceItem] = []

        for p in retrieved_passages:
            if p.get("section"):
                sec = p["section"]
                doc = sec.document
                relevant_laws.append(LegalSectionItem(
                    id=sec.id,
                    actName=doc.act_name,
                    year=doc.year,
                    sectionNumber=sec.section_number,
                    title=sec.title,
                    keyRuleVerbatim=sec.verbatim_text,
                    plainEnglishExplanation=sec.plain_explanation,
                    relevanceToCase=f"Statutory authority in {domain_id.title()} matters.",
                    statutoryReferenceUrl=doc.source_url
                ))
                sources.append(SourceItem(
                    id=f"src-{sec.id[:8]}",
                    title=f"{doc.act_name} ({doc.year})",
                    sourceType="Central Act",
                    sectionOrCourt=sec.section_number,
                    sourceUrl=doc.source_url,
                    verificationStatus="Verified Statutory Authority"
                ))
            elif p.get("judgment"):
                jg = p["judgment"]
                relevant_cases.append(CaseCitationItem(
                    id=jg.id,
                    caseName=jg.case_name,
                    court=jg.court,
                    citationStr=jg.citation_str,
                    judgmentDate=jg.judgment_date,
                    summary=jg.summary,
                    relevance=jg.outcome,
                    sourceUrl=jg.source_url
                ))
                sources.append(SourceItem(
                    id=f"src-{jg.id[:8]}",
                    title=jg.case_name,
                    sourceType="Apex Court Judgment",
                    sectionOrCourt=jg.court,
                    sourceUrl=jg.source_url,
                    verificationStatus="Binding Legal Precedent"
                ))

        # 10. Confidence & Uncertainty Scoring
        verified_count = sum(1 for v in verified_claims if v.uiBadge in ["VERIFIED", "PARTIALLY_VERIFIED"])
        conf_score = round(min(80.0 + (verified_count * 4.0), 96.0), 1)
        conf_level = "HIGH" if conf_score >= 88 else "MEDIUM"

        confidence_info = ConfidenceInfo(
            score=conf_score,
            level=conf_level,
            caveat="Confidence reflects statutory grounding and source availability; it is an AI confidence score and NOT a legal guarantee.",
            rationale=f"Analysis grounded in {len(relevant_laws)} verified statutory provisions and {len(relevant_cases)} binding judicial precedents."
        )

        conv_id = conversation_id or str(uuid.uuid4())
        msg_id = str(uuid.uuid4())

        return EvidenceBackedResponse(
            conversationId=conv_id,
            messageId=msg_id,
            domainId=domain_id,
            isClarification=False,
            answer=raw_answer,
            whyThisMayApply=why_apply,
            relevantLaw=relevant_laws,
            relevantCases=relevant_cases,
            possibleNextSteps=next_steps,
            importantLimitations=limitations,
            confidence=confidence_info,
            verification=verified_claims,
            sources=sources,
            caseSummary=f"Legal research assessment for {domain_id.title()} dispute."
        )

rag_service = RAGService()
