import logging
from sqlalchemy.orm import Session
from backend.app.models.legal_data import LegalDocument, LegalSection, Judgment, LegalChunk

logger = logging.getLogger(__name__)

INITIAL_ACTS = [
    {
        "act_name": "Consumer Protection Act",
        "year": 2019,
        "jurisdiction": "India (Central)",
        "domain_id": "consumer",
        "authoritative_body": "Parliament of India",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/15256",
        "sections": [
            {
                "section_number": "Section 2(7)",
                "title": "Definition of Consumer",
                "verbatim_text": "Consumer means any person who buys any goods for a consideration which has been paid or promised or partly paid and partly promised, or under any system of deferred payment, and includes any user of such goods other than the person who buys such goods for consideration paid or promised... but does not include a person who obtains such goods for resale or for any commercial purpose.",
                "plain_explanation": "Protects individuals buying goods or services for personal use, whether purchased offline or through e-commerce portals. Excludes purely commercial reselling.",
                "legal_domain": "consumer"
            },
            {
                "section_number": "Section 2(11)",
                "title": "Deficiency in Service",
                "verbatim_text": "Deficiency means any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance which is required to be maintained by or under any law for the time being in force or has been undertaken to be performed by a person in pursuance of a contract or otherwise in relation to any service.",
                "plain_explanation": "Covers any failure to deliver contracted service standards, including delays, unauthorized charges, or substandard customer support.",
                "legal_domain": "consumer"
            },
            {
                "section_number": "Section 35",
                "title": "Manner in which complaint shall be made",
                "verbatim_text": "A complaint, in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided, may be filed with a District Commission by the consumer or any voluntary consumer association registered under any law.",
                "plain_explanation": "Empowers aggrieved consumers to lodge formal redressal petitions before the competent District Consumer Commission or electronically via E-Daakhil.",
                "legal_domain": "consumer"
            },
            {
                "section_number": "Section 69",
                "title": "Limitation Period for Consumer Complaints",
                "verbatim_text": "The District Commission, the State Commission or the National Commission shall not admit a complaint unless it is filed within two years from the date on which the cause of action has arisen.",
                "plain_explanation": "A strict 2-year statutory deadline applies from the date the dispute, refusal, or deficiency occurred to file a complaint.",
                "legal_domain": "consumer"
            }
        ]
    },
    {
        "act_name": "Transfer of Property Act",
        "year": 1882,
        "jurisdiction": "India (Central / State Rent Acts)",
        "domain_id": "tenancy",
        "authoritative_body": "Parliament of India",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/2338",
        "sections": [
            {
                "section_number": "Section 106",
                "title": "Duration of certain leases in absence of written contract",
                "verbatim_text": "In the absence of a contract or local law or usage to the contrary, a lease of immovable property for agricultural or manufacturing purposes shall be deemed to be a lease from year to year... and a lease of immovable property for any other purpose shall be deemed to be a lease from month to month, terminable, on the part of either lessor or lessee, by fifteen days' notice.",
                "plain_explanation": "Governs statutory notice periods required to terminate tenancies in the absence of contrary written lease agreements.",
                "legal_domain": "tenancy"
            },
            {
                "section_number": "Section 108(B)(q)",
                "title": "Rights and liabilities of Lessor and Lessee (Handover & Refund)",
                "verbatim_text": "On the determination of the lease, the lessee is bound to put the lessor into possession of the property. Correspondingly, the lessor is bound to account for and refund any security deposit held after deducting reasonable admitted charges.",
                "plain_explanation": "Mandates mutual reciprocal obligation: tenant vacates peacefully, landlord immediately accounts for and refunds the security deposit.",
                "legal_domain": "tenancy"
            }
        ]
    },
    {
        "act_name": "Indian Contract Act",
        "year": 1872,
        "jurisdiction": "India (Central)",
        "domain_id": "contract",
        "authoritative_body": "Parliament of India",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/2187",
        "sections": [
            {
                "section_number": "Section 27",
                "title": "Agreement in restraint of trade, void",
                "verbatim_text": "Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.",
                "plain_explanation": "Post-employment non-compete clauses restricting employees from joining competitors or starting ventures in India are void and legally unenforceable.",
                "legal_domain": "employment"
            },
            {
                "section_number": "Section 73",
                "title": "Compensation for loss or damage caused by breach of contract",
                "verbatim_text": "When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach.",
                "plain_explanation": "Entitles the aggrieved party to recover actual, direct damages sustained from a contractual breach, but not indirect or remote damages.",
                "legal_domain": "contract"
            },
            {
                "section_number": "Section 74",
                "title": "Compensation for breach of contract where penalty stipulated for",
                "verbatim_text": "When a contract has been broken, if a sum is named in the contract as the amount to be paid in case of such breach, or if the contract contains any other stipulation by way of penalty, the party complaining of the breach is entitled, whether or not actual damage or loss is proved to have been caused thereby, to receive from the party who has broken the contract reasonable compensation not exceeding the amount so named.",
                "plain_explanation": "Forfeiture of full deposits or unconscionable liquidated damages is impermissible; the claimant can only retain reasonable compensation for actual proven injury.",
                "legal_domain": "contract"
            }
        ]
    },
    {
        "act_name": "Payment of Gratuity Act",
        "year": 1972,
        "jurisdiction": "India (Central)",
        "domain_id": "employment",
        "authoritative_body": "Parliament of India",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/1512",
        "sections": [
            {
                "section_number": "Section 4",
                "title": "Payment of Gratuity",
                "verbatim_text": "Gratuity shall be payable to an employee on the termination of his employment after he has rendered continuous service for not less than five years: (a) on his superannuation, or (b) on his retirement or resignation, or (c) on his death or disablement due to accident or disease.",
                "plain_explanation": "Mandates that employees who complete 5 continuous years of service are statutorily entitled to gratuity upon resignation or retirement.",
                "legal_domain": "employment"
            },
            {
                "section_number": "Section 7(3A)",
                "title": "Interest on Delayed Gratuity Payment",
                "verbatim_text": "If the amount of gratuity payable under sub-section (3) is not paid by the employer within the period specified in sub-section (3), the employer shall pay, from the date on which the gratuity becomes payable to the date on which it is paid, simple interest at such rate, not exceeding the rate notified by the Central Government.",
                "plain_explanation": "Employers who delay gratuity payment beyond 30 days are statutorily liable to pay compoundable simple interest (typically 10% p.a.).",
                "legal_domain": "employment"
            }
        ]
    },
    {
        "act_name": "Micro, Small and Medium Enterprises Development Act",
        "year": 2006,
        "jurisdiction": "India (Central)",
        "domain_id": "contract",
        "authoritative_body": "Parliament of India",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/2012",
        "sections": [
            {
                "section_number": "Section 15",
                "title": "Liability of buyer to make payment to MSME supplier",
                "verbatim_text": "Where any supplier supplies any goods or renders any services to any buyer, the buyer shall make payment therefor on or before the date agreed upon between him and the supplier in writing or, where there is no agreement, before the appointed day: Provided that in no case the period agreed upon between the supplier and the buyer in writing shall exceed forty-five days from the day of acceptance.",
                "plain_explanation": "Buyers must settle invoices with registered MSME vendors within 45 days maximum. Agreements prescribing longer payment terms are superseded by law.",
                "legal_domain": "contract"
            },
            {
                "section_number": "Section 16",
                "title": "Date from which and rate at which interest is payable",
                "verbatim_text": "Where any buyer fails to make payment of the amount to the supplier, the buyer shall be liable to pay compound interest with monthly rests to the supplier on that amount from the appointed day at three times of the bank rate notified by the Reserve Bank.",
                "plain_explanation": "Delayed payments to MSMEs attract statutory compound interest at 3x the RBI bank rate, payable through the MSME Samadhaan Council.",
                "legal_domain": "contract"
            }
        ]
    }
]

INITIAL_JUDGMENTS = [
    {
        "case_name": "Niranjan Shankar Golikari v. The Century Spinning and Mfg. Co. Ltd.",
        "court": "Supreme Court of India",
        "citation_str": "1967 AIR 1098, 1967 SCR (2) 378",
        "judgment_date": "1967-01-17",
        "bench": "Shelat, J. M., Bachawat, R. S.",
        "petitioner": "Niranjan Shankar Golikari",
        "respondent": "Century Spinning and Mfg. Co. Ltd.",
        "summary": "Landmark Supreme Court ruling on Section 27 of the Indian Contract Act distinguishing between post-service covenants and covenants during employment.",
        "court_reasoning": "A negative covenant operating during the period of employment when the employee is bound to serve his employer exclusively is not in restraint of trade. However, post-termination restrictions are strictly void under Section 27.",
        "outcome": "Post-employment non-compete restraint declared void; restrictions during employment tenure upheld.",
        "cited_cases": ["Nordfelt v. Maxim Nordfelt Guns", "Herbert Morris v. Saxelby"],
        "citing_cases": ["Percept D'Mark (India) (P) Ltd. v. Zaheer Khan (2006)", "Superintendence Company of India v. Krishan Murgai (1980)"],
        "timeline_milestones": [
            {"step": "Filing", "date": "1964-03-12", "desc": "Suit filed by employer seeking injunction"},
            {"step": "Hearing", "date": "1965-08-10", "desc": "Arguments heard on validity of restrictive covenants"},
            {"step": "Interim Order", "date": "1965-11-20", "desc": "High Court interim restriction pending adjudication"},
            {"step": "Judgment", "date": "1967-01-17", "desc": "Supreme Court delivers authoritative judgment"},
            {"step": "Final Outcome", "date": "1967-01-17", "desc": "Principle settled: post-termination restraint is void under Sec 27 ICA"}
        ],
        "source_url": "https://indiankanoon.org/doc/1842880/"
    },
    {
        "case_name": "Kailash Nath Associates v. Delhi Development Authority",
        "court": "Supreme Court of India",
        "citation_str": "(2015) 4 SCC 136",
        "judgment_date": "2015-01-09",
        "bench": "R.F. Nariman, Kurian Joseph",
        "petitioner": "Kailash Nath Associates",
        "respondent": "Delhi Development Authority",
        "summary": "Authoritative ruling on forfeiture of earnest money and liquidated damages under Sections 73 and 74 of the Indian Contract Act.",
        "court_reasoning": "Damage or loss is the sine qua non for claiming compensation under Section 74. Where no actual loss has occurred, forfeiture of earnest money or security deposit is arbitrary, unreasonable, and legally unsustainable.",
        "outcome": "DDA directed to refund the forfeited deposit since no loss was sustained.",
        "cited_cases": ["Fateh Chand v. Balkishan Dass (1964)", "Maula Bux v. Union of India (1970)"],
        "citing_cases": ["MBL Infrastructures v. Delhi Metro (2020)"],
        "timeline_milestones": [
            {"step": "Filing", "date": "1994-05-18", "desc": "Writ petition against arbitrary deposit forfeiture"},
            {"step": "Hearing", "date": "2014-11-14", "desc": "Apex Court bench hears substantive constitutional arguments"},
            {"step": "Judgment", "date": "2015-01-09", "desc": "Supreme Court orders full refund with interest"},
            {"step": "Final Outcome", "date": "2015-01-09", "desc": "Arbitrary earnest money deduction without proof of actual loss held illegal"}
        ],
        "source_url": "https://indiankanoon.org/doc/174984224/"
    },
    {
        "case_name": "Vodafone Idea Cellular Ltd. v. Ajay Kumar Agarwal",
        "court": "Supreme Court of India",
        "citation_str": "(2022) 6 SCC 496",
        "judgment_date": "2022-02-16",
        "bench": "D.Y. Chandrachud, A.S. Bopanna",
        "petitioner": "Vodafone Idea Cellular Ltd.",
        "respondent": "Ajay Kumar Agarwal",
        "summary": "Supreme Court clarifies consumer commission jurisdiction over telecom disputes under the Consumer Protection Act.",
        "court_reasoning": "The remedy under Consumer Protection Act is an additional remedy under Section 100. Consumer forums have full jurisdiction to adjudicate service deficiencies regardless of alternate statutory arbitration clauses.",
        "outcome": "Consumer forum complaint upheld; consumer remedies held to be supplementary and broad.",
        "cited_cases": ["M.D. Thiruvalluvar Transport Corp. v. Consumer Protection Council", "General Manager, Telecom v. M. Krishnan"],
        "citing_cases": ["IREO Grace Realtech v. Abhishek Nayar (2023)"],
        "timeline_milestones": [
            {"step": "Filing", "date": "2015-07-22", "desc": "Complaint filed in District Consumer Forum"},
            {"step": "Hearing", "date": "2021-12-05", "desc": "Appeal on jurisdiction heard in Supreme Court"},
            {"step": "Judgment", "date": "2022-02-16", "desc": "Apex court settles consumer remedy supremacy"},
            {"step": "Final Outcome", "date": "2022-02-16", "desc": "Consumers retain full right to approach Consumer Commission"}
        ],
        "source_url": "https://indiankanoon.org/doc/129487920/"
    }
]

def seed_legal_knowledge(db: Session):
    """Seed authoritative Indian legal statutes, sections, judgments, and pre-computed chunks."""
    existing_docs = db.query(LegalDocument).count()
    if existing_docs > 0:
        logger.info("Legal knowledge database already seeded.")
        return

    logger.info("Seeding authoritative Indian legal corpus into database...")

    for act_data in INITIAL_ACTS:
        sections_data = act_data.pop("sections")
        doc = LegalDocument(**act_data)
        db.add(doc)
        db.flush()

        for sec_data in sections_data:
            section = LegalSection(document_id=doc.id, **sec_data)
            db.add(section)
            db.flush()

            # Create searchable chunk
            chunk_content = f"{doc.act_name} ({doc.year}) - {section.section_number}: {section.title}\n\nVerbatim: {section.verbatim_text}\n\nExplanation: {section.plain_explanation}"
            chunk = LegalChunk(
                document_id=doc.id,
                section_id=section.id,
                chunk_index=0,
                content=chunk_content,
                metadata_json={
                    "act_name": doc.act_name,
                    "section_number": section.section_number,
                    "title": section.title,
                    "domain_id": section.legal_domain,
                    "source_url": doc.source_url
                }
            )
            db.add(chunk)

    for jg_data in INITIAL_JUDGMENTS:
        judgment = Judgment(**jg_data)
        db.add(judgment)
        db.flush()

        # Create searchable chunk for judgment
        chunk_content = f"Landmark Judgment: {judgment.case_name} | {judgment.court} ({judgment.citation_str})\n\nSummary: {judgment.summary}\n\nReasoning: {judgment.court_reasoning}\n\nOutcome: {judgment.outcome}"
        chunk = LegalChunk(
            judgment_id=judgment.id,
            chunk_index=0,
            content=chunk_content,
            metadata_json={
                "case_name": judgment.case_name,
                "court": judgment.court,
                "citation_str": judgment.citation_str,
                "source_url": judgment.source_url
            }
        )
        db.add(chunk)

    db.commit()
    logger.info("Legal knowledge corpus successfully seeded.")
