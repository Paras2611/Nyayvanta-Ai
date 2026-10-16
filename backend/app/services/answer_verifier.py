"""
Evidence Grounding and Legal Answer Verification Service for Nyayavanta AI.

Constructs bounded prompt envelopes, queries local inference engines,
verifies citations against retrieved passages, evaluates tri-state claim validity,
and detects phantom citations or hallucinated provisions.
"""

import logging
from pathlib import Path
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from backend.app.services.retrieval import retrieval_engine
from backend.app.services.ollama_client import ollama_service

logger = logging.getLogger("nyayavanta.answer_verifier")

SYSTEM_PROMPT = """You are Nyayavanta AI, an objective Indian legal information and research assistant.
Your answers assist citizens and legal researchers. You are NOT a substitute for a qualified advocate.

CRITICAL INSTRUCTIONS:
1. Ground your answer EXCLUSIVELY in the provided LEGAL EVIDENCE PASSAGES below.
2. NEVER invent legal provisions, section numbers, court orders, case names, URLs, or facts.
3. If the provided evidence passages do not contain enough facts to answer the question, state: "NOT_ENOUGH_EVIDENCE" and explain what specific information is missing.
4. Distinguish between mandatory requirements (e.g. statutory timelines, mandatory affidavits) and recommended/useful evidence.
5. Do not treat a sample document or specific case fact as a universal legal mandate.
6. Preserve English and Marathi terms accurately without distortion.
7. Maintain an objective, professional, and accessible legal tone.
"""


def extract_cited_sections(text: str) -> List[str]:
    """Extract section references like 'Section 15', 'Sec. 24' from answer text."""
    pattern = re.compile(r"(?:Section|Sec\.|कलम|धारा)\s*(\d+[A-Za-z]?(?:\(\d+\))*(?:\([a-z]\))*)", re.IGNORECASE)
    matches = pattern.findall(text)
    return list(dict.fromkeys([m.strip(" .") for m in matches if m.strip(" .")]))


class LegalAnswerPipeline:
    """End-to-end evidence-grounded legal question answering pipeline."""

    def __init__(self, retrieval=None, client=None):
        self.retrieval = retrieval or retrieval_engine
        self.client = client or ollama_service

    def build_prompt_context(self, question: str, chunks: List[Dict[str, Any]]) -> Tuple[str, str]:
        """Format retrieved evidence passages into a bounded context string."""
        passages_text = []
        for idx, chk in enumerate(chunks, 1):
            source_title = chk.get("title") or chk.get("source_file", "Legal Source")
            sec = f" (Section {chk['section_number']})" if chk.get("section_number") else ""
            passages_text.append(
                f"[Passage {idx} - Source: {source_title}{sec}]\n{chk['chunk_text']}\n"
            )

        context_body = "\n".join(passages_text)
        
        user_prompt = (
            f"LEGAL EVIDENCE PASSAGES:\n{context_body}\n\n"
            f"USER QUESTION: {question}\n\n"
            "Based strictly on the legal evidence passages above, provide a clear, structured summary:\n"
            "1. Legal Position / Findings from Evidence\n"
            "2. Relevant Statutory Provisions or Case Rules (only if cited above)\n"
            "3. Actionable Next Steps or Limitations\n"
            "If the passages do not provide sufficient evidence, explicitly state 'NOT_ENOUGH_EVIDENCE'."
        )
        return SYSTEM_PROMPT, user_prompt

    def verify_answer_citations(
        self,
        answer_text: str,
        retrieved_chunks: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Verify that all sections/cases mentioned in the answer exist in the retrieved passages.
        Flags phantom citations as UNVERIFIED.
        """
        cited_in_answer = extract_cited_sections(answer_text)

        # Aggregate all text from retrieved chunks
        corpus_chunk_text = " ".join([c["chunk_text"] for c in retrieved_chunks])
        verified_sections = []
        unverified_sections = []

        for sec in cited_in_answer:
            # Check if section number appears in retrieved chunks
            if re.search(r"\b" + re.escape(sec) + r"\b", corpus_chunk_text):
                verified_sections.append(sec)
            else:
                unverified_sections.append(sec)

        is_grounded = len(unverified_sections) == 0
        has_insufficient_evidence_marker = "NOT_ENOUGH_EVIDENCE" in answer_text

        status = "VERIFIED"
        if not is_grounded:
            status = "CONTAINS_UNVERIFIED_CITATIONS"
        elif has_insufficient_evidence_marker:
            status = "NOT_ENOUGH_EVIDENCE"

        return {
            "status": status,
            "is_fully_grounded": is_grounded,
            "cited_sections": cited_in_answer,
            "verified_sections": verified_sections,
            "unverified_sections": unverified_sections,
            "has_insufficient_evidence_flag": has_insufficient_evidence_marker
        }

    def fallback_extractive_answer(
        self,
        question: str,
        chunks: List[Dict[str, Any]],
        reason: str
    ) -> str:
        """
        Deterministic, grounded fallback answer when local Ollama inference is offline.
        Synthesizes top extracted passages directly without hallucinating.
        """
        if not chunks:
            return (
                "NOT_ENOUGH_EVIDENCE: No matching legal records were found in the local corpus for your question. "
                "Nyayavanta avoids generating unverified legal advice."
            )

        lines = [
            f"**Local Evidence Summary** (Offline Fallback Mode: {reason})",
            "",
            f"Based on {len(chunks)} authoritative passages retrieved from the local legal corpus:",
            ""
        ]

        for i, c in enumerate(chunks, 1):
            src = c.get("title") or c.get("source_file")
            sec_note = f" (Ref: Section {c['section_number']})" if c.get("section_number") else ""
            lines.append(f"**Evidence Passage {i}** — *{src}*{sec_note}:")
            snippet = c["chunk_text"].strip()
            # Truncate if long for readability
            if len(snippet) > 400:
                snippet = snippet[:400] + "..."
            lines.append(f"> \"{snippet}\"\n")

        lines.append(
            "\n*Note: To enable generative natural-language synthesis, start Ollama via `ollama serve` with `qwen3.5:0.8b`.*"
        )
        return "\n".join(lines)

    def answer_question(
        self,
        question: str,
        domain: Optional[str] = None,
        language: Optional[str] = "en",
        top_k: int = 4
    ) -> Dict[str, Any]:
        """
        Execute full QA pipeline: Retrieve -> Rank -> Prompt -> Infer -> Verify.
        """
        clean_q = question.strip()
        if not clean_q:
            return {
                "answer": "Please provide a valid legal query or case dispute question.",
                "status": "invalid_input",
                "domain": domain,
                "sources": [],
                "verification": {"status": "INVALID_QUERY"},
                "model": self.client.model
            }

        # Step 1: Retrieval
        retrieval_res = self.retrieval.search(
            query=clean_q,
            domain=domain,
            language=language,
            top_k=top_k
        )

        if retrieval_res["status"] == "coverage_gap":
            return {
                "answer": retrieval_res["message"],
                "status": "coverage_gap",
                "domain": domain,
                "sources": [],
                "verification": {
                    "status": "COVERAGE_GAP",
                    "note": f"Domain '{domain}' has 0 verified files in the local archive."
                },
                "inference_meta": {
                    "status": "skipped_coverage_gap",
                    "model": self.client.model
                },
                "model": self.client.model
            }

        if retrieval_res["status"] == "no_evidence" or not retrieval_res.get("results"):
            return {
                "answer": (
                    "NOT_ENOUGH_EVIDENCE: The local corpus contains no relevant statutory provisions or court records "
                    f"addressing: '{question}'."
                ),
                "status": "insufficient_evidence",
                "domain": domain,
                "sources": [],
                "verification": {
                    "status": "NOT_ENOUGH_EVIDENCE",
                    "note": "Retrieval score below relevance threshold."
                },
                "inference_meta": {
                    "status": "skipped_insufficient_evidence",
                    "model": self.client.model
                },
                "model": self.client.model
            }

        chunks = retrieval_res["results"]

        # Step 2: Build Bounded Prompt
        sys_prompt, user_prompt = self.build_prompt_context(clean_q, chunks)

        # Step 3: Local LLM Inference
        gen_res = self.client.generate(
            prompt=user_prompt,
            system_prompt=sys_prompt
        )

        answer_text = ""
        inference_status = gen_res["status"]

        if gen_res["status"] == "success" and gen_res.get("response"):
            answer_text = gen_res["response"]
        else:
            # Fallback to transparent extractive grounded summary
            fallback_reason = gen_res.get("error", "Local Ollama engine offline")
            answer_text = self.fallback_extractive_answer(clean_q, chunks, fallback_reason)

        # Step 4: Verification
        verification = self.verify_answer_citations(answer_text, chunks)

        # Step 5: Format clean source metadata (never invent page numbers or URLs)
        sources = []
        for c in chunks:
            sources.append({
                "document_id": c["document_id"],
                "chunk_id": c["chunk_id"],
                "title": c["title"],
                "source_file": c["source_file"],
                "domain": c["domain"],
                "section_number": c["section_number"],
                "page_number": c["page_number"],
                "source_url": c["source_url"],
                "relevance_score": c["relevance_score"]
            })

        return {
            "answer": answer_text,
            "status": "evidence_available" if verification["status"] != "NOT_ENOUGH_EVIDENCE" else "insufficient_evidence",
            "domain": domain or (chunks[0]["domain"] if chunks else "general"),
            "sources": sources,
            "verification": verification,
            "inference_meta": {
                "status": inference_status,
                "model": self.client.model,
                "eval_duration_ms": gen_res.get("eval_duration_ms")
            },
            "disclaimer": "Nyayavanta provides legal research assistance, not formal legal representation or advocate advice."
        }


# Singleton pipeline instance
legal_qa_pipeline = LegalAnswerPipeline()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    pipeline = LegalAnswerPipeline()
    res = pipeline.answer_question(
        question="What documents or procedures govern a landlord's claim for possession under Maharashtra Rent Control Act?",
        domain="rental"
    )
    print("--- ANSWER PIPELINE RESULT ---")
    print("Status:", res["status"])
    print("Sources count:", len(res["sources"]))
    print("Verification:", res["verification"])
    print("Answer snippet:\n", res["answer"][:300])
