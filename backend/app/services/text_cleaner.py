"""
Text Cleaning and Normalization Service for Nyayavanta AI.

Normalizes legal text preserving Marathi Devanagari Unicode, section numbers,
clause identifiers, amounts, and dates without silently rewriting legal content.
"""

import hashlib
import logging
import re
import unicodedata
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger("nyayavanta.text_cleaner")

# Regex pattern for legal section numbers (e.g. Section 15(1), Sec. 24, Clause 4.2)
LEGAL_SECTION_PATTERN = re.compile(
    r"(?:Section|Sec\.|धारा|कलम)\s*(\d+[A-Za-z]?(?:\(\d+\))*(?:\([a-z]\))*)",
    re.IGNORECASE
)

# Common repeated header patterns in Bombay High Court / Consumer Commission transcripts
COMMON_HEADER_PATTERNS = [
    re.compile(r"^\s*IN THE HIGH COURT OF JUDICATURE AT BOMBAY\s*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^\s*BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL.*$", re.IGNORECASE | re.MULTILINE),
]


class TextCleaner:
    """Legal text sanitizer and anomaly detector."""

    @staticmethod
    def normalize_unicode(text: str) -> str:
        """
        Normalize text using Unicode Normalization Form C (NFC).
        Preserves Marathi Devanagari composite characters (e.g. क् + ष = क्ष).
        """
        if not text:
            return ""
        return unicodedata.normalize("NFC", text)

    @staticmethod
    def detect_anomalies(text: str) -> Dict[str, Any]:
        """
        Scan text for quality issues: empty files, unicode replacement chars, OCR noise.
        """
        char_count = len(text)
        word_count = len(text.split())
        replacement_char_count = text.count("\ufffd")

        # Control characters other than standard whitespace (tab, newline, carriage return)
        control_chars = [ch for ch in text if unicodedata.category(ch).startswith("C") and ch not in "\t\n\r"]
        
        is_empty = char_count == 0
        is_near_empty = 0 < char_count < 50
        has_ocr_noise = replacement_char_count > 5 or len(control_chars) > 20

        flags = []
        if is_empty:
            flags.append("EMPTY_FILE")
        elif is_near_empty:
            flags.append("NEAR_EMPTY")
        if replacement_char_count > 0:
            flags.append(f"UNICODE_REPLACEMENT_CHARS_{replacement_char_count}")
        if len(control_chars) > 0:
            flags.append(f"CONTROL_CHARS_{len(control_chars)}")

        return {
            "char_count": char_count,
            "word_count": word_count,
            "replacement_chars": replacement_char_count,
            "control_chars_count": len(control_chars),
            "is_valid": not is_empty and not is_near_empty,
            "flags": flags
        }

    @classmethod
    def clean_legal_text(
        cls,
        text: str,
        strip_headers: bool = False
    ) -> Tuple[str, Dict[str, Any]]:
        """
        Cleans text without corrupting legal numbering or Marathi text.
        Returns: (cleaned_text, quality_metadata)
        """
        if not text:
            return "", cls.detect_anomalies("")

        # 1. Unicode NFC Normalization
        normalized = cls.normalize_unicode(text)

        # 2. Extract quality metrics
        quality = cls.detect_anomalies(normalized)

        # 3. Clean control characters safely (keep standard newlines and spaces)
        cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", " ", normalized)

        # 4. Optional header pattern removal if explicitly requested and safe
        if strip_headers:
            for pat in COMMON_HEADER_PATTERNS:
                cleaned = pat.sub("", cleaned)

        # 5. Normalize whitespace while preserving paragraph structure
        # Replace carriage returns with standard newlines
        cleaned = cleaned.replace("\r\n", "\n").replace("\r", "\n")
        # Collapse 3 or more newlines into double newlines (paragraphs)
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
        # Collapse multiple inline spaces/tabs into a single space
        cleaned = re.sub(r"[ \t]+", " ", cleaned)

        # Strip leading/trailing margins
        cleaned = cleaned.strip()

        return cleaned, quality

    @staticmethod
    def extract_sections(text: str) -> List[str]:
        """Extract legal section references mentioned in the text."""
        matches = LEGAL_SECTION_PATTERN.findall(text)
        # Deduplicate while preserving order
        seen = set()
        sections = []
        for m in matches:
            clean = m.strip(" .")
            if clean and clean not in seen:
                seen.add(clean)
                sections.append(clean)
        return sections
