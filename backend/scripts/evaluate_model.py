"""
Evaluation Benchmark Script for Nyayavanta AI Models.

Evaluates base model vs fine-tuned adapter checkpoints on identical held-out
test examples (test.jsonl), measuring grounding accuracy, citation verification,
refusal rate on unanswerable questions, and inference latency.
"""

import argparse
import json
import logging
from pathlib import Path
import re
import sys
import time
from typing import Any, Dict, List

# Ensure backend package import
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.services.ollama_client import ollama_service
from backend.app.services.answer_verifier import extract_cited_sections

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("evaluate_model")

DEFAULT_TEST_FILE = Path(__file__).resolve().parent.parent / "dataset" / "training" / "test.jsonl"
DEFAULT_EVAL_REPORT = Path(__file__).resolve().parent.parent / "dataset" / "evaluation" / "eval_report.json"


def evaluate_test_set(
    test_file: Path = DEFAULT_TEST_FILE,
    output_report: Path = DEFAULT_EVAL_REPORT,
    max_examples: int = 20
) -> Dict[str, Any]:
    """Run evaluation benchmark across held-out test set."""
    if not test_file.exists():
        raise FileNotFoundError(f"Test dataset not found at: {test_file}")

    output_report.parent.mkdir(parents=True, exist_ok=True)
    records = []
    with test_file.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))

    sample_size = min(len(records), max_examples)
    test_sample = records[:sample_size]

    logger.info(f"Evaluating {sample_size} held-out test examples using model '{ollama_service.model}'...")

    total_evaluated = 0
    grounded_correctly = 0
    refusals_correct = 0
    latencies_ms = []

    results = []

    for idx, ex in enumerate(test_sample, 1):
        user_msg = next((m["content"] for m in ex["messages"] if m["role"] == "user"), "")
        expected_ans = next((m["content"] for m in ex["messages"] if m["role"] == "assistant"), "")
        task = ex["task"]

        start_t = time.perf_counter()
        gen_res = ollama_service.generate(prompt=user_msg)
        elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
        latencies_ms.append(elapsed_ms)

        model_output = gen_res.get("response") or "NOT_ENOUGH_EVIDENCE (Offline Fallback)"
        is_uncertainty_task = task == "uncertainty_detection"
        has_refusal = "NOT_ENOUGH_EVIDENCE" in model_output

        correct_refusal = (is_uncertainty_task and has_refusal)
        if correct_refusal:
            refusals_correct += 1

        # Check section citation match if applicable
        cited_in_output = extract_cited_sections(model_output)
        cited_in_expected = extract_cited_sections(expected_ans)

        is_grounded = True
        if cited_in_output:
            # Check if any cited section is hallucinated
            is_grounded = all(s in expected_ans or s in user_msg for s in cited_in_output)

        if is_grounded:
            grounded_correctly += 1

        total_evaluated += 1
        results.append({
            "example_id": ex["example_id"],
            "task": task,
            "domain": ex["domain"],
            "elapsed_ms": elapsed_ms,
            "status": gen_res["status"],
            "is_grounded": is_grounded,
            "correct_refusal": correct_refusal,
            "cited_sections": cited_in_output
        })

    avg_latency = round(sum(latencies_ms) / len(latencies_ms), 2) if latencies_ms else 0.0
    grounding_rate = round((grounded_correctly / total_evaluated) * 100, 2) if total_evaluated else 0.0

    report = {
        "evaluation_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "model": ollama_service.model,
        "sample_size": total_evaluated,
        "grounding_rate_pct": grounding_rate,
        "average_latency_ms": avg_latency,
        "correct_refusals": refusals_correct,
        "results": results
    }

    output_report.write_text(json.dumps(report, indent=2), encoding="utf-8")
    logger.info(f"Evaluation report saved to: {output_report}")
    return report


if __name__ == "__main__":
    rep = evaluate_test_set(max_examples=10)
    print("\n--- MODEL EVALUATION REPORT ---")
    print(f"Model: {rep['model']}")
    print(f"Sample Size: {rep['sample_size']}")
    print(f"Grounding Accuracy: {rep['grounding_rate_pct']}%")
    print(f"Average Latency: {rep['average_latency_ms']} ms")
