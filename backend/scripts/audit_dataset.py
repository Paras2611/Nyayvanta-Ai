"""
Script entry point to safely extract archive and audit the Nyayavanta legal dataset.
"""

import json
import logging
from pathlib import Path
import sys

# Ensure backend package import
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.services.dataset_audit import DatasetAuditor

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


def main():
    auditor = DatasetAuditor()
    print("Step 1: Safely extracting text.zip...")
    extracted = auditor.safe_extract_zip()
    print(f"Extracted/verified {len(extracted)} files.")

    print("\nStep 2: Auditing legal corpus...")
    audit_res = auditor.audit_corpus()
    print("\n--- DATASET AUDIT SUMMARY ---")
    print(json.dumps(audit_res["summary"], indent=2))


if __name__ == "__main__":
    main()
