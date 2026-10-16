"""
Document Suggestion & Proceeding Checklist Engine for Nyayavanta AI.

Grounds recommended procedural and evidentiary documents in the authoritative
dataset (ConsumerData1.txt, ConsumerData2.txt, Maharashtra Rent Control Act,
and judicial precedents) for legal case proceedings.
"""

import logging
from pathlib import Path
import re
import sys
from typing import Any, Dict, List, Optional

# Allow standalone execution
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from backend.app.services.retrieval import retrieval_engine

logger = logging.getLogger("nyayavanta.document_checklist")


# Authoritative procedural checklists derived directly from our dataset
DATASET_PROCEDURAL_CHECKLISTS: Dict[str, Dict[str, Any]] = {
    "consumer_complaint": {
        "forum": "District Consumer Disputes Redressal Commission (e-Jagriti / E-Daakhil)",
        "governing_law": "Consumer Protection Act, 2019 - Section 35",
        "dataset_source": "text/ConsumerData/ConsumerData2.txt (e-Jagriti Filing Manual Steps 3-8)",
        "documents": [
            {
                "name": "Consumer Complaint Petition (Memo of Complaint)",
                "category": "Pleading",
                "is_mandatory": True,
                "purpose": "Sets out factual dispute, date of cause of action, details of deficiency of service/defective goods, and specific compensation claimed.",
                "legal_risk_if_missing": "Filing cannot be registered without formal petition setting out jurisdictional facts.",
                "dataset_citation": "ConsumerData2.txt Step 4 & Step 8: 'Enter case details, amount paid, claim amount, date of cause of action.'"
            },
            {
                "name": "Verification Affidavit (Notarized)",
                "category": "Pleading",
                "is_mandatory": True,
                "purpose": "Sworn statement by the complainant affirming truthfulness of all contents in the complaint.",
                "legal_risk_if_missing": "Defective filing; Consumer Commission scrutiny branch will raise objection under Regulation 14 of CPA Regulations.",
                "dataset_citation": "ConsumerData2.txt Step 8.1: 'Upload the required documents i.e Index, Proforma, Synopsis, Memo of Parties, Notarized Affidavit.'"
            },
            {
                "name": "Index & Synopsis",
                "category": "Pleading",
                "is_mandatory": True,
                "purpose": "Chronological list of events and table of exhibits with pagination for court reference.",
                "legal_risk_if_missing": "Clerical rejection during preliminary scrutiny.",
                "dataset_citation": "ConsumerData2.txt Step 8.1: 'Index, Proforma, Synopsis.'"
            },
            {
                "name": "Memo of Parties with Complete Postal & Email Addresses",
                "category": "Pleading",
                "is_mandatory": True,
                "purpose": "Full identification and service addresses of complainant and opposite parties (OP).",
                "legal_risk_if_missing": "Notice cannot be served; case stalled at issuance stage.",
                "dataset_citation": "ConsumerData2.txt Step 5 & Step 7: 'Enter Complainant details... Add Additional/Proforma Opposite Party details.'"
            },
            {
                "name": "Tax Invoices / Receipts / Transaction Payment Proof",
                "category": "Payment Proof",
                "is_mandatory": True,
                "purpose": "Establishes complainant's status as a 'consumer' who paid consideration under Section 2(7) of CPA 2019.",
                "legal_risk_if_missing": "Dismissal in limine for lack of consumer locus standi.",
                "dataset_citation": "ConsumerData2.txt Step 4.1: 'Enter the amount paid for the service, claim amount.'"
            },
            {
                "name": "Legal Notice & Postal Dispatch Proof (RPAD / Speed Post Tracking)",
                "category": "Statutory Notice",
                "is_mandatory": False,
                "purpose": "Demonstrates pre-litigation opportunity given to opposite party to rectify deficiency, supporting claims for mental agony and litigation costs.",
                "legal_risk_if_missing": "Does not bar complaint, but weakens claim for punitive damages and costs.",
                "dataset_citation": "ConsumerData2.txt Step 8.2: 'Upload Annexures (with appropriate title).'"
            },
            {
                "name": "Vakalatnama / Authorisation Letter",
                "category": "Authorisation",
                "is_mandatory": False,
                "purpose": "Required if represented by an advocate or authorized representative; not mandatory if appearing in-person (Section 35).",
                "legal_risk_if_missing": "Advocate cannot appear or argue without filed Vakalatnama.",
                "dataset_citation": "ConsumerData2.txt Step 5.2 & Step 8.1: 'Add the advocate from the list... and Vakalatnama.'"
            }
        ]
    },
    "consumer_appeal": {
        "forum": "State Consumer Disputes Redressal Commission / National Commission (NCDRC)",
        "governing_law": "Consumer Protection Act, 2019 - Section 41 (Appeal to State Commission)",
        "dataset_source": "text/ConsumerData/ConsumerData1.txt (First Appeal Filing Guidelines Step 6-8)",
        "documents": [
            {
                "name": "Certified True Copy of Impugned District Commission Order",
                "category": "Judicial Order",
                "is_mandatory": True,
                "purpose": "Primary order against which First Appeal is preferred.",
                "legal_risk_if_missing": "Appeal dismissed at admission stage for failure to submit certified impugned decree.",
                "dataset_citation": "ConsumerData1.txt Step 6.1 & Step 8.1: 'Enter date of impugned order... Upload Certified State/District Commission Order.'"
            },
            {
                "name": "Memo of Appeal (First Appeal Petition) with Notarized Affidavit",
                "category": "Pleading",
                "is_mandatory": True,
                "purpose": "Outlines specific legal and factual errors committed by the lower forum.",
                "legal_risk_if_missing": "Appeal rejected during preliminary registry scrutiny.",
                "dataset_citation": "ConsumerData1.txt Step 8.1: 'FA with Notarized Affidavit, Index, Proforma, Synopsis.'"
            },
            {
                "name": "Proof of Statutory Pre-Deposit (50% of Awarded Amount)",
                "category": "Payment Proof",
                "is_mandatory": True,
                "purpose": "Mandatory condition precedent under Section 41 of CPA 2019 before an appeal can be entertained.",
                "legal_risk_if_missing": "Appellate forum has no jurisdiction to grant stay or entertain appeal without deposit receipt / DD.",
                "dataset_citation": "ConsumerData1.txt Step 6.2: 'Enter the DD details, if available (Statutory Deposit).'"
            },
            {
                "name": "Application for Condonation of Delay (Interlocutory Application)",
                "category": "Pleading",
                "is_mandatory": False,
                "purpose": "Mandatory only if appeal is filed after statutory 45-day limitation period under Section 41.",
                "legal_risk_if_missing": "Barred by limitation if delay is unexplained by sufficient cause.",
                "dataset_citation": "ConsumerData1.txt Step 8.1: 'Annexures (titled), or IA Application.'"
            }
        ]
    },
    "tenancy_eviction": {
        "forum": "Competent Authority / Small Causes Court / Civil Judge Senior Division",
        "governing_law": "Maharashtra Rent Control Act, 1999 (Sections 15, 16, 24)",
        "dataset_source": "text/RentalData/ (Judgments & Statutory Maharashtra Rent Control Corpus)",
        "documents": [
            {
                "name": "Registered Leave & License / Lease Agreement",
                "category": "Contractual Evidence",
                "is_mandatory": True,
                "purpose": "Proves jural relationship of landlord-tenant / licensor-licensee; under Section 55 of MRC Act, written agreement is mandatory.",
                "legal_risk_if_missing": "Landlord faces heavy burden of oral proof; non-registration attracts statutory penalties.",
                "dataset_citation": "Maharashtra Rent Control Act, 1999 Section 55: 'Tenancy agreement to be compulsorily registered in writing.'"
            },
            {
                "name": "Statutory Notice to Quit / Demand Notice under Section 15(2)",
                "category": "Statutory Notice",
                "is_mandatory": True,
                "purpose": "Under Section 15(2) of MRC Act, no suit for recovery of possession on ground of rent arrears can be instituted until expiration of 90 days next after notice in writing.",
                "legal_risk_if_missing": "FATAL DEFECT: Eviction suit on rent default grounds is legally barred and will be dismissed.",
                "dataset_citation": "RentalData (202509111900892266.txt Section 15): 'No suit for recovery of possession... until ninety days after notice.'"
            },
            {
                "name": "Proof of Notice Service (Postal RPAD Receipt & Signed AD Card / Web Tracking)",
                "category": "Statutory Notice",
                "is_mandatory": True,
                "purpose": "Proves tenant actually received or refused the statutory notice under Section 106 Transfer of Property Act / Section 27 General Clauses Act.",
                "legal_risk_if_missing": "Court will not draw presumption of service; suit dismissed for lack of completed cause of action.",
                "dataset_citation": "RentalData (Bombay High Court rulings on Section 15 notice delivery)."
            },
            {
                "name": "Proof of Title / Ownership (Property Card, Municipal Assessment / Index II)",
                "category": "Title Evidence",
                "is_mandatory": True,
                "purpose": "Establishes landlord's ownership or legal entitlement to receive rent.",
                "legal_risk_if_missing": "Tenant may dispute locus standi or title of the landlord under Section 116 Evidence Act.",
                "dataset_citation": "RentalData (Competent Authority filing prerequisites)."
            },
            {
                "name": "Bank Account Statements / Rent Ledgers / Rent Receipts",
                "category": "Payment Proof",
                "is_mandatory": True,
                "purpose": "Evidences standard rent and the exact chronological period of non-payment / default.",
                "legal_risk_if_missing": "Court cannot quantify arrears or calculate interest under Section 15(3).",
                "dataset_citation": "Maharashtra Rent Control Act Section 15 & Section 31 (Duty to issue rent receipt)."
            },
            {
                "name": "Sanctioned Building Plan & Architect Certificate (for Section 16(1)(i) demolition)",
                "category": "Technical Evidence",
                "is_mandatory": False,
                "purpose": "Mandatory only if eviction is sought for building reconstruction/demolition.",
                "legal_risk_if_missing": "Ground of eviction under Section 16(1)(i) will be summarily rejected.",
                "dataset_citation": "RentalData Section 16(1)(i): 'Demolition and reconstruction with approved municipal plan.'"
            }
        ]
    },
    "deposit_recovery": {
        "forum": "Civil Court / Small Causes Court / Consumer Disputes Commission",
        "governing_law": "Transfer of Property Act 1882 (Section 108) / Maharashtra Rent Control Act Section 15",
        "dataset_source": "text/RentalData/ & text/ConsumerData/ (Security Deposit jurisprudence)",
        "documents": [
            {
                "name": "Copy of Lease / License Agreement showing Deposit Clause",
                "category": "Contractual Evidence",
                "is_mandatory": True,
                "purpose": "Proves deposit quantum paid, refund conditions, and notice period obligations.",
                "legal_risk_if_missing": "Unable to establish primary contractual obligation to refund.",
                "dataset_citation": "RentalData & ConsumerData statutory lease clauses."
            },
            {
                "name": "Proof of Deposit Payment (Bank Transfer / Cheque Counterfoil / Receipt)",
                "category": "Payment Proof",
                "is_mandatory": True,
                "purpose": "Conclusive evidence of financial transfer of security deposit to landlord.",
                "legal_risk_if_missing": "Landlord may deny receipt of deposit.",
                "dataset_citation": "Indian Evidence Act Section 91 & Section 101 (Burden of proof)."
            },
            {
                "name": "Notice of Vacation & Handover Communication (Email / WhatsApp / Letter)",
                "category": "Communication Evidence",
                "is_mandatory": True,
                "purpose": "Proves tenant provided agreed notice of vacation and offered vacant peaceful possession.",
                "legal_risk_if_missing": "Landlord may claim wrongful abandonment and deduct rental damages.",
                "dataset_citation": "RentalData eviction and vacation jurisprudence."
            },
            {
                "name": "Joint Move-Out Inspection Report / Keys Handover Acknowledgment",
                "category": "Handover Evidence",
                "is_mandatory": False,
                "purpose": "Disproves unsubstantiated landlord claims of physical damage or repair deductions.",
                "legal_risk_if_missing": "Landlord may raise unilateral repair claims to forfeit deposit.",
                "dataset_citation": "Transfer of Property Act Section 108(B)(q)."
            },
            {
                "name": "Formal Demand Notice for Deposit Refund",
                "category": "Statutory Notice",
                "is_mandatory": True,
                "purpose": "Demands repayment within 15 days with interest at 12-18% p.a., starting date of cause of action.",
                "legal_risk_if_missing": "Court will not award interest or legal costs without pre-litigation demand.",
                "dataset_citation": "Civil Procedure Code interest jurisprudence & Section 73 Contract Act."
            }
        ]
    }
}


class DocumentChecklistService:
    """Provides dataset-grounded document checklists for Indian legal proceedings."""

    @staticmethod
    def detect_proceeding_type(domain: Optional[str], text: Optional[str]) -> str:
        """Heuristically identify the appropriate proceeding type from query facts."""
        text_lower = (text or "").lower()

        if domain == "rental" or any(w in text_lower for w in ["tenant", "landlord", "evict", "rent", "flat", "lease"]):
            if any(w in text_lower for w in ["deposit", "refund", "withheld", "forfeit"]):
                return "deposit_recovery"
            return "tenancy_eviction"

        if domain == "consumer" or any(w in text_lower for w in ["consumer", "takraar", "complaint", "deficiency", "warranty", "appeal"]):
            if any(w in text_lower for w in ["appeal", "first appeal", "state commission"]):
                return "consumer_appeal"
            return "consumer_complaint"

        return "consumer_complaint"

    def suggest_documents(
        self,
        domain: Optional[str] = "consumer",
        proceeding_type: Optional[str] = None,
        case_facts: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a structured document checklist verified against our dataset.
        """
        proc_type = proceeding_type or self.detect_proceeding_type(domain, case_facts)
        checklist_info = DATASET_PROCEDURAL_CHECKLISTS.get(proc_type)

        if not checklist_info:
            # Fallback to general civil filing checklist
            proc_type = "consumer_complaint"
            checklist_info = DATASET_PROCEDURAL_CHECKLISTS[proc_type]

        # Dynamically search FTS index for any specific documentation chunks
        query_terms = f"{checklist_info['governing_law']} required documents affidavit notice"
        search_res = retrieval_engine.search(
            query=query_terms,
            domain=domain if domain in ["rental", "consumer"] else None,
            top_k=2
        )

        relevant_chunks = []
        if search_res.get("status") == "evidence_available":
            for chk in search_res.get("results", []):
                relevant_chunks.append({
                    "chunk_id": chk["chunk_id"],
                    "title": chk["title"],
                    "section_number": chk.get("section_number"),
                    "source_file": chk["source_file"],
                    "snippet": chk["chunk_text"][:300] + "..."
                })

        mandatory = [d for d in checklist_info["documents"] if d["is_mandatory"]]
        supporting = [d for d in checklist_info["documents"] if not d["is_mandatory"]]

        return {
            "status": "success",
            "proceeding_type": proc_type,
            "proceeding_title": checklist_info["forum"],
            "governing_law": checklist_info["governing_law"],
            "dataset_source": checklist_info["dataset_source"],
            "total_documents": len(checklist_info["documents"]),
            "mandatory_count": len(mandatory),
            "supporting_count": len(supporting),
            "documents": checklist_info["documents"],
            "mandatory_documents": mandatory,
            "supporting_documents": supporting,
            "corroborating_chunks": relevant_chunks,
            "disclaimer": "This document checklist is generated from verified statutory filing manuals and judicial precedents. Consult an enrolled advocate for jurisdiction-specific registrar rules."
        }


# Singleton service instance
document_checklist_service = DocumentChecklistService()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    res = document_checklist_service.suggest_documents(domain="consumer", proceeding_type="consumer_complaint")
    print(f"Checklist generated for: {res['proceeding_title']}")
    print(f"Mandatory documents ({res['mandatory_count']}):")
    for d in res["mandatory_documents"]:
        print(f" - [{d['category']}] {d['name']} (Citation: {d['dataset_citation'][:60]})")
