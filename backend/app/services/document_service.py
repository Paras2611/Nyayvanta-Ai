import re
import uuid
from typing import Dict, Any, List
from backend.app.schemas.document import DocumentAnalysisResponse, ClauseAnalysisItem

class DocumentIntelligenceService:
    """Extracts legal clauses, verifies enforceability, and calculates legal risk."""

    CLAUSE_PATTERNS = [
        {
            "title": "Arbitration & Dispute Resolution",
            "regex": r"(arbitrat\w+|dispute resolution|sole arbitrator|seat of arbitration|venue)",
            "implication": "Mandates private arbitration before approaching courts. Under Section 8 of the Arbitration and Conciliation Act, courts may refer disputes to arbitration, but consumer forums retain supplementary jurisdiction under Section 100 of CPA 2019.",
            "statute": "Arbitration & Conciliation Act, 1996 / CPA 2019 Sec 100",
            "risk": "MEDIUM"
        },
        {
            "title": "Post-Employment Non-Compete & Restraint",
            "regex": r"(non[- ]compete|restraint of trade|shall not engage|shall not work for competitor|prohibited from joining)",
            "implication": "Restricts right to pursue lawful profession after contract expiry. Under Section 27 of the Indian Contract Act, 1872 and Niranjan Shankar Golikari precedent, this clause is completely void.",
            "statute": "Indian Contract Act, 1872 - Section 27",
            "risk": "CRITICAL"
        },
        {
            "title": "Liquidated Damages & Forfeiture Penalty",
            "regex": r"(liquidated damages|forfeiture|penalty|forfeit the entire|full amount shall be forfeited)",
            "implication": "Imposes pre-fixed damages or total deposit forfeiture. Under Section 74 of the Indian Contract Act and Kailash Nath ruling, forfeiture without proof of actual damage is legally unsustainable.",
            "statute": "Indian Contract Act, 1872 - Section 74",
            "risk": "HIGH"
        },
        {
            "title": "Exclusive Jurisdiction & Forum Selection",
            "regex": r"(exclusive jurisdiction|courts at|courts in [a-zA-Z]+ shall have exclusive)",
            "implication": "Limits dispute filing to a designated territorial court. In consumer disputes, Section 34 of CPA 2019 permits consumers to file where they reside regardless of exclusive jurisdiction clauses.",
            "statute": "Consumer Protection Act, 2019 - Section 34",
            "risk": "MEDIUM"
        },
        {
            "title": "Unilateral Termination & Short Notice",
            "regex": r"(terminate without notice|terminate immediately|unilateral termination|sole discretion to terminate)",
            "implication": "Grants one party arbitrary termination power without reciprocal cure period, potentially violating principles of natural justice and fair trade practice.",
            "statute": "Indian Contract Act, 1872 / Specific Relief Act",
            "risk": "HIGH"
        },
        {
            "title": "Security Deposit Retention & Deductions",
            "regex": r"(security deposit|deduct\w+|withhold the deposit|repair charges)",
            "implication": "Outlines landlord or vendor rights to withhold deposits. Under Section 108 Transfer of Property Act, deductions require itemized receipts and mutual handover inspection.",
            "statute": "Transfer of Property Act, 1882 - Section 108(B)(q)",
            "risk": "MEDIUM"
        }
    ]

    def analyze_document_text(self, filename: str, text: str) -> DocumentAnalysisResponse:
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"
        doc_type = "Commercial Contract / Legal Agreement"
        lower = text.lower()

        if any(w in lower for w in ["lease", "rent", "tenant", "landlord", "premises"]):
            doc_type = "Tenancy / Lease Agreement"
        elif any(w in lower for w in ["employment", "employee", "salary", "designation", "probation"]):
            doc_type = "Employment Agreement / Offer Letter"
        elif any(w in lower for w in ["invoice", "consumer", "purchase order", "warranty"]):
            doc_type = "Consumer Purchase Invoice / Service Contract"

        detected_clauses: List[ClauseAnalysisItem] = []
        highest_risk = "LOW"
        risk_rank = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}

        paragraphs = text.split("\n")
        for cp in self.CLAUSE_PATTERNS:
            for p in paragraphs:
                p_clean = p.strip()
                if len(p_clean) > 20 and re.search(cp["regex"], p_clean, re.IGNORECASE):
                    clause_item = ClauseAnalysisItem(
                        clauseTitle=cp["title"],
                        extractedSnippet=p_clean[:280] + ("..." if len(p_clean) > 280 else ""),
                        legalImplication=cp["implication"],
                        riskRating=cp["risk"],
                        relevantStatuteSnippet=cp["statute"],
                        sectionReference=cp["statute"]
                    )
                    detected_clauses.append(clause_item)

                    if risk_rank[cp["risk"]] > risk_rank[highest_risk]:
                        highest_risk = cp["risk"]
                    break

        # Fallback if no specific clause matched
        if not detected_clauses:
            detected_clauses.append(ClauseAnalysisItem(
                clauseTitle="Standard Operational Terms",
                extractedSnippet=text[:200] if text else "General contractual agreement stipulations.",
                legalImplication="Standard contractual framework subject to Indian Contract Act, 1872 rules on offer, acceptance, and consideration.",
                riskRating="LOW",
                relevantStatuteSnippet="Indian Contract Act, 1872 - Section 10"
            ))

        # Detect parties
        parties = []
        party_match = re.findall(r"(?:between|party of the first part|lessor|lessee|employer|employee|buyer|seller)\s*[:\-]?\s*([A-Z][a-zA-Z\s]{3,30})", text, re.IGNORECASE)
        if party_match:
            parties = list(set([p.strip() for p in party_match[:2]]))
        else:
            parties = ["Party of First Part", "Party of Second Part"]

        # Detect dates
        date_match = re.findall(r"\b(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b", text)
        dates = list(set(date_match)) if date_match else ["Document Date Referenced"]

        potential_issues = []
        if highest_risk in ["HIGH", "CRITICAL"]:
            potential_issues.append("Document contains potentially void or disproportionately onerous penalty provisions under Indian jurisprudence.")
        if any(c.clauseTitle.startswith("Arbitration") for c in detected_clauses):
            potential_issues.append("Private arbitration clause may require formal invocation notice under Section 21 of ACA 1996 before tribunal filing.")

        recommendations = [
            "Retain stamped, signed counterpart copies and postal/email delivery proof.",
            "Issue a formal 15-day pre-litigation notice before initiating contentious legal proceedings.",
            "Ensure statutory limitation period (2-3 years) is strictly monitored."
        ]

        return DocumentAnalysisResponse(
            documentId=doc_id,
            filename=filename,
            status="Complete",
            documentType=doc_type,
            parties=parties,
            dates=dates,
            riskLevel=highest_risk,
            importantClauses=detected_clauses,
            relevantLaws=[c.relevantStatuteSnippet for c in detected_clauses if c.relevantStatuteSnippet],
            potentialIssues=potential_issues,
            aiFindings=f"Analyzed {len(detected_clauses)} critical clauses with overall {highest_risk} risk profile under applicable Indian statutory laws.",
            recommendations=recommendations,
            textExcerpt=text[:500] if text else None
        )

document_service = DocumentIntelligenceService()
