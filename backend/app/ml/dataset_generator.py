import json
import uuid
from typing import List, Dict, Any

class LegalDatasetGenerator:
    """Generates standardized instruction fine-tuning dataset for Nyayavanta-LM.
    Target tasks: Legal QA, Section Explanation, Case Summarization, Provision Identification,
    Claim Extraction, Uncertainty Detection."""

    TASKS = [
        "LEGAL_QA",
        "SECTION_EXPLANATION",
        "CASE_SUMMARIZATION",
        "PROVISION_IDENTIFICATION",
        "CLAIM_EXTRACTION",
        "UNCERTAINTY_DETECTION"
    ]

    TEMPLATES = [
        {
            "task": "LEGAL_QA",
            "domain": "consumer",
            "instruction": "Explain the rights of a consumer when an e-commerce platform delivers defective goods and refuses refund.",
            "context": "Consumer Protection Act 2019, Section 2(7) defines consumer. Section 2(11) defines deficiency in service.",
            "response": "Under Section 2(7) of the Consumer Protection Act, 2019, an online buyer is recognized as a consumer. Refusal to refund or replace defective merchandise constitutes a deficiency in service under Section 2(11). The consumer can file a complaint before the District Commission via E-Daakhil within 2 years from the date of refusal."
        },
        {
            "task": "SECTION_EXPLANATION",
            "domain": "employment",
            "instruction": "What is the legal effect of a post-employment non-compete clause in India?",
            "context": "Indian Contract Act 1872, Section 27: Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.",
            "response": "Under Section 27 of the Indian Contract Act, 1872, any post-termination restriction restraining an employee from exercising a lawful profession is void ab initio. The Supreme Court in Niranjan Shankar Golikari upheld covenants only during the employment tenure; post-employment non-competes are unenforceable."
        },
        {
            "task": "PROVISION_IDENTIFICATION",
            "domain": "tenancy",
            "instruction": "Identify the statutory authority governing refund of security deposit when a tenant vacates a residential property.",
            "context": "Transfer of Property Act 1882, Section 108(B)(q) and Section 74 Indian Contract Act.",
            "response": "The relevant statutory authorities are Section 108(B)(q) of the Transfer of Property Act, 1882 (mandating reciprocal vacation and deposit reconciliation) and Section 74 of the Indian Contract Act, 1872 (prohibiting arbitrary deposit forfeiture without establishing actual loss)."
        },
        {
            "task": "CASE_SUMMARIZATION",
            "domain": "contract",
            "instruction": "Summarize the landmark holding in Kailash Nath Associates v. DDA regarding forfeiture of earnest money.",
            "context": "Kailash Nath Associates v. Delhi Development Authority (2015) 4 SCC 136.",
            "response": "The Supreme Court ruled that actual damage or loss is the sine qua non for claiming compensation or forfeiture under Section 74 of the Indian Contract Act, 1872. Where no actual financial injury has been suffered, arbitrary forfeiture of earnest money or security deposits is illegal and unenforceable."
        },
        {
            "task": "CLAIM_EXTRACTION",
            "domain": "consumer",
            "instruction": "Extract the verifiable legal claims from the provided advice statement.",
            "context": "Statement: You must lodge your consumer complaint within two years under Section 69 of CPA 2019.",
            "response": "Claim 1: The statutory limitation period for filing a consumer complaint is two years. Source: Section 69, Consumer Protection Act, 2019. Status: SUPPORTED."
        }
    ]

    def generate_synthetic_corpus(self, count: int = 100) -> List[Dict[str, Any]]:
        dataset = []
        for i in range(count):
            tpl = self.TEMPLATES[i % len(self.TEMPLATES)]
            example = {
                "id": f"ny-ds-{uuid.uuid4().hex[:8]}",
                "task": tpl["task"],
                "domain": tpl["domain"],
                "instruction": tpl["instruction"],
                "context": tpl["context"],
                "expected_response": tpl["response"],
                "metadata": {
                    "synthetic": True,
                    "target_model": "Nyayavanta-LM-3B",
                    "license": "Indian Legal Open Research Dataset"
                }
            }
            dataset.append(example)
        return dataset

    def export_jsonl(self, filepath: str, count: int = 250):
        data = self.generate_synthetic_corpus(count=count)
        with open(filepath, "w", encoding="utf-8") as f:
            for item in data:
                f.write(json.dumps(item, ensure_ascii=False) + "\n")
        return len(data)

dataset_generator = LegalDatasetGenerator()
