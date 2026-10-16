"""
Training Data Validator for Nyayavanta AI.

Validates schema compliance, checks UTF-8 integrity, enforces strict document-level
split isolation, detects duplicates, and audits domain balance.
"""

import hashlib
import json
import logging
from pathlib import Path
import sys
from typing import Any, Dict, List, Set

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("validate_training_data")

DEFAULT_TRAINING_DIR = Path(__file__).resolve().parent.parent / "dataset" / "training"
REQUIRED_FIELDS = {"example_id", "domain", "task", "language", "messages", "source_document_ids", "review_status", "split"}


def validate_training_file(file_path: Path) -> Dict[str, Any]:
    """Inspect and validate a single JSONL training file."""
    if not file_path.exists():
        raise FileNotFoundError(f"Training file not found: {file_path}")

    line_count = 0
    errors: List[str] = []
    seen_ids: Set[str] = set()
    seen_prompt_hashes: Set[str] = set()
    exact_duplicates = 0
    
    domain_counts: Dict[str, int] = {}
    task_counts: Dict[str, int] = {}
    language_counts: Dict[str, int] = {}
    documents_seen: Set[str] = set()

    with file_path.open("r", encoding="utf-8", errors="strict") as f:
        for idx, line in enumerate(f, 1):
            line_count += 1
            line_clean = line.strip()
            if not line_clean:
                errors.append(f"Line {idx}: Empty line detected.")
                continue

            try:
                record = json.loads(line_clean)
            except json.JSONDecodeError as ex:
                errors.append(f"Line {idx}: JSON parse error: {ex}")
                continue

            # 1. Field validation
            missing_fields = REQUIRED_FIELDS - set(record.keys())
            if missing_fields:
                errors.append(f"Line {idx}: Missing mandatory fields: {missing_fields}")
                continue

            # 2. Example ID uniqueness
            ex_id = record["example_id"]
            if ex_id in seen_ids:
                errors.append(f"Line {idx}: Duplicate example_id: '{ex_id}'")
            seen_ids.add(ex_id)

            # 3. Message structure
            msgs = record.get("messages", [])
            if not isinstance(msgs, list) or len(msgs) < 2:
                errors.append(f"Line {idx}: 'messages' must contain at least 2 turns (user + assistant).")
            else:
                user_msg = next((m for m in msgs if m.get("role") == "user"), None)
                asst_msg = next((m for m in msgs if m.get("role") == "assistant"), None)
                if not user_msg or not asst_msg:
                    errors.append(f"Line {idx}: Missing user or assistant role in messages.")
                else:
                    # Check exact duplicate prompt
                    p_hash = hashlib.sha256(user_msg.get("content", "").encode("utf-8")).hexdigest()
                    if p_hash in seen_prompt_hashes:
                        exact_duplicates += 1
                    seen_prompt_hashes.add(p_hash)

            # 4. Track metadata
            domain_counts[record["domain"]] = domain_counts.get(record["domain"], 0) + 1
            task_counts[record["task"]] = task_counts.get(record["task"], 0) + 1
            language_counts[record["language"]] = language_counts.get(record["language"], 0) + 1
            
            for doc_id in record.get("source_document_ids", []):
                documents_seen.add(doc_id)

    return {
        "file_path": str(file_path.resolve()),
        "total_records": line_count,
        "is_valid": len(errors) == 0,
        "error_count": len(errors),
        "errors": errors[:10],  # first 10 errors
        "exact_duplicates": exact_duplicates,
        "domain_distribution": domain_counts,
        "task_distribution": task_counts,
        "language_distribution": language_counts,
        "unique_documents": len(documents_seen),
        "document_ids": list(documents_seen)
    }


def audit_splits_isolation(training_dir: Path = DEFAULT_TRAINING_DIR) -> Dict[str, Any]:
    """Verify that train, val, and test splits have ZERO document ID overlap."""
    train_file = training_dir / "train.jsonl"
    val_file = training_dir / "val.jsonl"
    test_file = training_dir / "test.jsonl"

    train_res = validate_training_file(train_file)
    val_res = validate_training_file(val_file)
    test_res = validate_training_file(test_file)

    train_docs = set(train_res["document_ids"])
    val_docs = set(val_res["document_ids"])
    test_docs = set(test_res["document_ids"])

    train_val_overlap = train_docs & val_docs
    train_test_overlap = train_docs & test_docs
    val_test_overlap = val_docs & test_docs

    has_leakage = bool(train_val_overlap or train_test_overlap or val_test_overlap)

    return {
        "is_isolation_valid": not has_leakage,
        "train_records": train_res["total_records"],
        "val_records": val_res["total_records"],
        "test_records": test_res["total_records"],
        "overlaps": {
            "train_val_overlap": list(train_val_overlap),
            "train_test_overlap": list(train_test_overlap),
            "val_test_overlap": list(val_test_overlap)
        },
        "train_audit": train_res,
        "val_audit": val_res,
        "test_audit": test_res
    }


if __name__ == "__main__":
    report = audit_splits_isolation()
    print("--- SPLIT ISOLATION & VALIDATION REPORT ---")
    print(f"Data Isolation Valid: {report['is_isolation_valid']}")
    print(f"Train Records: {report['train_records']}, Val Records: {report['val_records']}, Test Records: {report['test_records']}")
    if not report['is_isolation_valid']:
        print("CRITICAL: Data leakage detected between splits!", report["overlaps"])
    else:
        print("Success: Zero document leakage between Train, Validation, and Test sets.")
