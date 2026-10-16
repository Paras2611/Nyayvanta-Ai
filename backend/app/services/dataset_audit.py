"""
Dataset Audit & Safe Ingestion Service for Nyayavanta Local AI.

Handles safe ZIP ingestion, path-traversal prevention, metadata extraction,
and machine-readable manifest generation (JSON & CSV).
"""

import csv
import hashlib
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
import zipfile

logger = logging.getLogger("nyayavanta.dataset_audit")

# Supported file extensions for safe extraction
SUPPORTED_EXTENSIONS = {".txt"}

# Pre-defined domain keyword heuristics
DOMAIN_KEYWORDS = {
    "rental": ["rent", "tenancy", "landlord", "tenant", "eviction", "lease", "ownership flats"],
    "consumer": ["consumer", "तक्रार", "ग्राहक", "redressal", "deficiency in service", "forum"],
    "employment": ["employment", "gratuity", "workman", "termination", "retrenchment", "provident fund"],
    "contract": ["breach of contract", "liquidated damages", "specific performance", "agreement", "section 73", "section 74"]
}


def compute_sha256(content_bytes: bytes) -> str:
    """Compute deterministic SHA-256 hash of bytes."""
    return hashlib.sha256(content_bytes).hexdigest()


def detect_language(text: str) -> str:
    """
    Detect if text is Devanagari (Marathi/Hindi), English, or mixed.
    Devanagari Unicode block: U+0900 to U+097F.
    """
    has_devanagari = any("\u0900" <= ch <= "\u097F" for ch in text)
    has_latin = any("A" <= ch <= "Z" or "a" <= ch <= "z" for ch in text)

    if has_devanagari and has_latin:
        return "mr/en"
    elif has_devanagari:
        return "mr"
    return "en"


def detect_domain(rel_path: str, text: str) -> str:
    """
    Classify domain from file path and content.
    Returns: 'rental', 'consumer', 'employment', 'contract', or 'unknown'.
    """
    lower_path = rel_path.lower()
    if "rental" in lower_path:
        return "rental"
    if "consumer" in lower_path:
        return "consumer"
    if "employment" in lower_path:
        return "employment"
    if "contract" in lower_path:
        return "contract"

    lower_text = text[:4000].lower()
    for domain, keywords in DOMAIN_KEYWORDS.items():
        if any(kw in lower_text for kw in keywords):
            return domain

    return "unknown"


def is_safe_zip_entry(entry_name: str, target_dir: Path) -> bool:
    """
    Validate that an archive entry does not attempt directory traversal attacks.
    Guards against '..', absolute paths, leading slashes, and Windows drive escapes.
    """
    # Normalize path separators
    normalized = entry_name.replace("\\", "/").strip()
    
    # Check for obvious traversal sequences
    if ".." in normalized.split("/"):
        return False
    if normalized.startswith("/") or normalized.startswith("\\"):
        return False
    if ":" in normalized:  # Windows drive letter injection e.g. C:
        return False

    # Resolved destination check
    try:
        dest_path = (target_dir / normalized).resolve()
        target_dir_resolved = target_dir.resolve()
        if not str(dest_path).startswith(str(target_dir_resolved)):
            return False
    except Exception:
        return False

    return True


class DatasetAuditor:
    """Ingests and audits legal datasets for Nyayavanta."""

    def __init__(
        self,
        zip_path: Optional[Path] = None,
        extract_dir: Optional[Path] = None,
        manifest_dir: Optional[Path] = None
    ):
        base_dir = Path(__file__).resolve().parent.parent.parent
        self.zip_path = zip_path or (base_dir.parent / "search_text_dataset" / "text.zip")
        self.extract_dir = extract_dir or (base_dir / "dataset" / "text")
        self.manifest_dir = manifest_dir or (base_dir / "dataset" / "processed")
        
        self.extract_dir.mkdir(parents=True, exist_ok=True)
        self.manifest_dir.mkdir(parents=True, exist_ok=True)

    def safe_extract_zip(self, force_overwrite: bool = False) -> List[Path]:
        """
        Safely extracts supported files from the ZIP archive.
        Rejects path traversal, skips duplicates unless force_overwrite is True.
        """
        if not self.zip_path.exists():
            raise FileNotFoundError(f"Dataset ZIP archive not found at: {self.zip_path}")

        extracted_files: List[Path] = []
        skipped_files: List[str] = []
        errors: List[str] = []

        logger.info(f"Inspecting archive: {self.zip_path}")
        with zipfile.ZipFile(self.zip_path, "r") as zf:
            infolist = zf.infolist()
            for info in infolist:
                if info.is_dir():
                    continue

                entry_name = info.filename
                ext = Path(entry_name).suffix.lower()

                if ext not in SUPPORTED_EXTENSIONS:
                    logger.debug(f"Skipping unsupported file type: {entry_name}")
                    skipped_files.append(entry_name)
                    continue

                if not is_safe_zip_entry(entry_name, self.extract_dir):
                    msg = f"Security Alert: Blocked unsafe ZIP entry with traversal attempt: {entry_name}"
                    logger.error(msg)
                    errors.append(msg)
                    continue

                target_file = self.extract_dir / entry_name
                target_file.parent.mkdir(parents=True, exist_ok=True)

                if target_file.exists() and not force_overwrite:
                    # Check if hash matches existing file
                    existing_bytes = target_file.read_bytes()
                    zip_bytes = zf.read(entry_name)
                    if compute_sha256(existing_bytes) == compute_sha256(zip_bytes):
                        extracted_files.append(target_file)
                        continue

                try:
                    data = zf.read(entry_name)
                    target_file.write_bytes(data)
                    extracted_files.append(target_file)
                except Exception as ex:
                    msg = f"Failed to extract {entry_name}: {ex}"
                    logger.error(msg)
                    errors.append(msg)

        logger.info(f"Extracted {len(extracted_files)} files safely. Skipped: {len(skipped_files)}. Errors: {len(errors)}")
        return extracted_files

    def audit_corpus(self, text_dir: Optional[Path] = None) -> Dict[str, Any]:
        """
        Audits extracted TXT files and creates a machine-readable manifest.
        Calculates file counts, sizes, character counts, word counts, detected languages,
        and domain distribution.
        """
        search_dir = text_dir or self.extract_dir
        if not search_dir.exists():
            raise FileNotFoundError(f"Text directory does not exist: {search_dir}")

        txt_files = sorted([p for p in search_dir.rglob("*.txt") if p.is_file()])
        manifest_records: List[Dict[str, Any]] = []
        seen_hashes: Dict[str, str] = {}  # sha256 -> first file path

        domain_counts: Dict[str, int] = {"rental": 0, "consumer": 0, "employment": 0, "contract": 0, "unknown": 0}
        domain_char_counts: Dict[str, int] = {"rental": 0, "consumer": 0, "employment": 0, "contract": 0, "unknown": 0}
        domain_word_counts: Dict[str, int] = {"rental": 0, "consumer": 0, "employment": 0, "contract": 0, "unknown": 0}
        language_counts: Dict[str, int] = {}

        total_bytes = 0
        total_chars = 0
        total_words = 0
        now_iso = datetime.now(timezone.utc).isoformat()

        for idx, file_path in enumerate(txt_files, 1):
            raw_bytes = file_path.read_bytes()
            file_size = len(raw_bytes)
            file_hash = compute_sha256(raw_bytes)
            total_bytes += file_size

            # Decode safely
            text = raw_bytes.decode("utf-8", errors="replace")
            char_count = len(text)
            word_count = len(text.split())
            line_count = len(text.splitlines())
            total_chars += char_count
            total_words += word_count

            rel_path = str(file_path.relative_to(search_dir)).replace("\\", "/")
            domain = detect_domain(rel_path, text)
            lang = detect_language(text)

            domain_counts[domain] = domain_counts.get(domain, 0) + 1
            domain_char_counts[domain] = domain_char_counts.get(domain, 0) + char_count
            domain_word_counts[domain] = domain_word_counts.get(domain, 0) + word_count
            language_counts[lang] = language_counts.get(lang, 0) + 1

            # Duplicate detection
            is_duplicate = False
            duplicate_of = None
            if file_hash in seen_hashes:
                is_duplicate = True
                duplicate_of = seen_hashes[file_hash]
            else:
                seen_hashes[file_hash] = rel_path

            # Quality analysis
            quality_status = "verified"
            quality_notes: List[str] = []
            if char_count < 50:
                quality_status = "warning_near_empty"
                quality_notes.append("File has fewer than 50 characters")
            if "\ufffd" in text:
                quality_notes.append("Contains Unicode replacement characters (possible OCR artifact)")

            # Unknown metadata explicitly recorded as None
            record = {
                "file_id": f"DOC_{idx:03d}_{file_hash[:8]}",
                "relative_path": rel_path,
                "file_hash_sha256": file_hash,
                "domain": domain,
                "language": lang,
                "source_title": None,
                "source_url": None,
                "jurisdiction": "Maharashtra / India" if domain in ["rental", "consumer"] else None,
                "document_type": "judgment_or_statute",
                "extraction_method": "pdf_text_extraction",
                "file_size_bytes": file_size,
                "character_count": char_count,
                "word_count": word_count,
                "line_count": line_count,
                "is_duplicate": is_duplicate,
                "duplicate_of": duplicate_of,
                "quality_status": quality_status,
                "quality_notes": "; ".join(quality_notes) if quality_notes else "clean",
                "date_last_audited": now_iso
            }
            manifest_records.append(record)

        # Domain dominance warning
        dominant_domain = None
        max_share = 0.0
        if total_chars > 0:
            for d, c in domain_char_counts.items():
                share = (c / total_chars) * 100.0
                if share > max_share:
                    max_share = share
                    dominant_domain = d

        warnings: List[str] = []
        if dominant_domain and max_share > 70.0:
            warnings.append(
                f"Domain Imbalance: '{dominant_domain}' represents {max_share:.1f}% of total corpus characters. "
                "Retrieval queries outside this domain must be handled with explicit coverage checks."
            )
        if domain_counts.get("employment", 0) == 0:
            warnings.append("Coverage Gap: 0 documents found for domain 'employment'.")
        if domain_counts.get("contract", 0) == 0:
            warnings.append("Coverage Gap: 0 documents found for domain 'contract'.")

        summary = {
            "total_files": len(txt_files),
            "total_size_bytes": total_bytes,
            "total_characters": total_chars,
            "total_words": total_words,
            "domain_distribution": domain_counts,
            "domain_character_shares": {
                d: round((c / total_chars * 100), 2) if total_chars else 0.0
                for d, c in domain_char_counts.items()
            },
            "language_distribution": language_counts,
            "warnings": warnings,
            "audit_timestamp": now_iso
        }

        # Write machine-readable manifests
        self._write_manifests(manifest_records, summary)

        return {
            "summary": summary,
            "records": manifest_records
        }

    def _write_manifests(self, records: List[Dict[str, Any]], summary: Dict[str, Any]) -> None:
        """Write JSON and CSV manifests."""
        json_path = self.manifest_dir / "dataset_manifest.json"
        csv_path = self.manifest_dir / "dataset_manifest.csv"

        payload = {
            "summary": summary,
            "documents": records
        }
        json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        logger.info(f"Manifest written to JSON: {json_path}")

        if records:
            fieldnames = list(records[0].keys())
            with csv_path.open("w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                for rec in records:
                    writer.writerow(rec)
            logger.info(f"Manifest written to CSV: {csv_path}")


def run_pipeline() -> Dict[str, Any]:
    """Helper entry point for CLI or automated startup."""
    auditor = DatasetAuditor()
    auditor.safe_extract_zip()
    return auditor.audit_corpus()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    results = run_pipeline()
    print("\n--- DATASET AUDIT COMPLETE ---")
    print(json.dumps(results["summary"], indent=2))
