"""
Training Dataset Exporter for Nyayavanta AI.

Transforms verified legal chunks into human-reviewable instruction-tuning examples
(UTF-8 JSONL) with strict document-level split isolation (train/val/test) to prevent leakage.
"""

import json
import logging
from pathlib import Path
import random
import re
import sys
from typing import Any, Dict, List

# Ensure backend package import
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("export_training_data")

DEFAULT_CHUNKS_PATH = Path(__file__).resolve().parent.parent / "dataset" / "chunks" / "legal_chunks.jsonl"
DEFAULT_MANIFEST_PATH = Path(__file__).resolve().parent.parent / "dataset" / "processed" / "dataset_manifest.json"
DEFAULT_OUTPUT_DIR = Path(__file__).resolve().parent.parent / "dataset" / "training"


def generate_classification_example(chunk: Dict[str, Any], example_id: str, split: str) -> Dict[str, Any]:
    """Task: Document Domain & Forum Classification."""
    prompt = (
        "Identify the primary legal domain and appropriate legal forum for the following Indian legal passage:\n\n"
        f"Passage:\n\"\"\"{chunk['chunk_text'][:600]}\"\"\""
    )
    domain_label = "Rental / Tenancy Dispute" if chunk["domain"] == "rental" else "Consumer Complaint"
    forum = "Rent Control Court / Competent Authority" if chunk["domain"] == "rental" else "District Consumer Disputes Redressal Commission"

    assistant_reply = (
        f"Domain: {domain_label}\n"
        f"Jurisdiction / Forum: {forum} (Maharashtra / India)\n"
        f"Language: {chunk['language'].upper()}\n"
        "Grounding: Verified from statutory and judicial corpus."
    )

    return {
        "example_id": example_id,
        "domain": chunk["domain"],
        "task": "document_classification",
        "language": chunk["language"],
        "messages": [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": assistant_reply}
        ],
        "source_document_ids": [chunk["document_id"]],
        "source_chunk_ids": [chunk["chunk_id"]],
        "review_status": "pending",
        "split": split
    }


def generate_provision_example(chunk: Dict[str, Any], example_id: str, split: str) -> Optional[Dict[str, Any]]:
    """Task: Provision Identification from Supplied Source Text."""
    sec = chunk.get("section_number")
    if not sec:
        return None

    prompt = (
        "Examine the supplied legal text excerpt and identify the exact statutory section referenced, "
        "along with its primary legal rule:\n\n"
        f"Excerpt:\n\"\"\"{chunk['chunk_text'][:700]}\"\"\""
    )
    assistant_reply = (
        f"Statutory Provision: Section {sec}\n"
        f"Legal Context: Governs rights, procedures, or grounds under {chunk['domain'].capitalize()} Law.\n"
        "Grounding: This section is explicitly cited within the supplied authoritative excerpt."
    )

    return {
        "example_id": example_id,
        "domain": chunk["domain"],
        "task": "provision_identification",
        "language": chunk["language"],
        "messages": [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": assistant_reply}
        ],
        "source_document_ids": [chunk["document_id"]],
        "source_chunk_ids": [chunk["chunk_id"]],
        "review_status": "pending",
        "split": split
    }


def generate_uncertainty_example(chunk: Dict[str, Any], example_id: str, split: str) -> Dict[str, Any]:
    """Task: Uncertainty Detection and Zero-Hallucination Guardrail."""
    prompt = (
        "Based STRICTLY on the excerpt below, answer: What is the exact monetary penalty for violating "
        "Section 999 of this Act?\n\n"
        f"Excerpt:\n\"\"\"{chunk['chunk_text'][:500]}\"\"\""
    )
    assistant_reply = (
        "NOT_ENOUGH_EVIDENCE: The provided excerpt does not mention Section 999 or any corresponding monetary penalty. "
        "As an objective legal assistant, I do not extrapolate or invent legal penalties outside the verified record."
    )

    return {
        "example_id": example_id,
        "domain": chunk["domain"],
        "task": "uncertainty_detection",
        "language": chunk["language"],
        "messages": [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": assistant_reply}
        ],
        "source_document_ids": [chunk["document_id"]],
        "source_chunk_ids": [chunk["chunk_id"]],
        "review_status": "pending",
        "split": split
    }


def export_training_dataset(
    chunks_path: Path = DEFAULT_CHUNKS_PATH,
    manifest_path: Path = DEFAULT_MANIFEST_PATH,
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    seed: int = 42
) -> Dict[str, Any]:
    """Export instruction dataset with split isolation by document ID."""
    if not chunks_path.exists():
        raise FileNotFoundError(f"Chunks file not found: {chunks_path}")
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")

    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
    documents = manifest_data.get("documents", [])
    doc_ids = [d["file_id"] for d in documents]

    # Deterministic split by document ID to avoid data leakage
    rng = random.Random(seed)
    shuffled_doc_ids = list(doc_ids)
    rng.shuffle(shuffled_doc_ids)

    n_docs = len(shuffled_doc_ids)
    n_train = max(1, int(n_docs * 0.70))
    n_val = max(1, int(n_docs * 0.15))

    train_doc_set = set(shuffled_doc_ids[:n_train])
    val_doc_set = set(shuffled_doc_ids[n_train:n_train + n_val])
    test_doc_set = set(shuffled_doc_ids[n_train + n_val:])

    # Ensure at least one doc in test set if small corpus
    if not test_doc_set and len(val_doc_set) > 1:
        moved = val_doc_set.pop()
        test_doc_set.add(moved)

    logger.info(f"Split distribution by documents: Train={len(train_doc_set)}, Val={len(val_doc_set)}, Test={len(test_doc_set)}")

    examples: List[Dict[str, Any]] = []
    task_counts: Dict[str, int] = {}
    split_counts: Dict[str, int] = {"train": 0, "val": 0, "test": 0}
    ex_idx = 1

    with chunks_path.open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            chunk = json.loads(line)
            doc_id = chunk["document_id"]

            if doc_id in train_doc_set:
                split = "train"
            elif doc_id in val_doc_set:
                split = "val"
            else:
                split = "test"

            # 1. Classification example
            ex1 = generate_classification_example(chunk, f"EX_{ex_idx:05d}", split)
            examples.append(ex1)
            task_counts[ex1["task"]] = task_counts.get(ex1["task"], 0) + 1
            split_counts[split] += 1
            ex_idx += 1

            # 2. Provision example (if section detected)
            ex2 = generate_provision_example(chunk, f"EX_{ex_idx:05d}", split)
            if ex2:
                examples.append(ex2)
                task_counts[ex2["task"]] = task_counts.get(ex2["task"], 0) + 1
                split_counts[split] += 1
                ex_idx += 1

            # 3. Uncertainty / Guardrail example (sample 1 out of 3 chunks)
            if ex_idx % 3 == 0:
                ex3 = generate_uncertainty_example(chunk, f"EX_{ex_idx:05d}", split)
                examples.append(ex3)
                task_counts[ex3["task"]] = task_counts.get(ex3["task"], 0) + 1
                split_counts[split] += 1
                ex_idx += 1

    # Write master JSONL and individual splits
    all_jsonl = output_dir / "instruction_tuning_all.jsonl"
    train_jsonl = output_dir / "train.jsonl"
    val_jsonl = output_dir / "val.jsonl"
    test_jsonl = output_dir / "test.jsonl"

    with all_jsonl.open("w", encoding="utf-8") as f_all, \
         train_jsonl.open("w", encoding="utf-8") as f_train, \
         val_jsonl.open("w", encoding="utf-8") as f_val, \
         test_jsonl.open("w", encoding="utf-8") as f_test:

        for ex in examples:
            line_str = json.dumps(ex, ensure_ascii=False) + "\n"
            f_all.write(line_str)
            if ex["split"] == "train":
                f_train.write(line_str)
            elif ex["split"] == "val":
                f_val.write(line_str)
            else:
                f_test.write(line_str)

    summary = {
        "total_examples": len(examples),
        "split_counts": split_counts,
        "task_counts": task_counts,
        "document_splits": {
            "train": list(train_doc_set),
            "val": list(val_doc_set),
            "test": list(test_doc_set)
        },
        "output_files": {
            "all": str(all_jsonl.resolve()),
            "train": str(train_jsonl.resolve()),
            "val": str(val_jsonl.resolve()),
            "test": str(test_jsonl.resolve())
        }
    }
    logger.info(f"Dataset export completed. Total examples: {len(examples)}")
    return summary


if __name__ == "__main__":
    summary = export_training_dataset()
    print(json.dumps(summary, indent=2))
