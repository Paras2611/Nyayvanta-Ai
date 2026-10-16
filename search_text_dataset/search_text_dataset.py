"""
Portable Legal Keyword Search Engine for Nyayavanta AI Corpus.

Supports configurable text directories, custom keywords, Marathi Devanagari Unicode,
case-insensitive searching, context windowing, and JSON/CSV/Text output formats.
"""

import argparse
import csv
import json
import logging
import os
from pathlib import Path
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

# Ensure UTF-8 output on Windows console (cp1252 fix)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("search_text_dataset")

# Authoritative default legal keywords
DEFAULT_KEYWORDS = [
    "Consumer Complaint",
    "Consumer Protection Act",
    "Section 35",
    "First Appeal",
    "Grievance Redressal",
    "unfair trade practices",
    "Maharashtra Rent Control Act",
    "Ownership Flats Act",
    "ग्राहक तक्रार",
    "तक्रार अर्ज",
    "अपील",
    "ग्राहक संरक्षण"
]


def resolve_default_text_dir() -> Path:
    """Resolve default text directory relative to this script or project root."""
    script_dir = Path(__file__).resolve().parent
    candidates = [
        script_dir / "text",
        script_dir / "text" / "text",
        script_dir.parent / "backend" / "dataset" / "text",
        script_dir.parent / "backend" / "dataset" / "text" / "text",
    ]
    for c in candidates:
        if c.exists() and any(c.rglob("*.txt")):
            return c
    return script_dir / "text"


def search_file_for_keywords(
    file_path: Path,
    keywords: List[str],
    context_before: int = 150,
    context_after: int = 300,
    find_all_occurrences: bool = False
) -> Tuple[List[Dict[str, Any]], Optional[str]]:
    """
    Search a single text file for specified keywords.
    Returns: (list_of_matches, error_message_if_any)
    """
    matches: List[Dict[str, Any]] = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except OSError as err:
        return [], f"Could not read {file_path}: {err}"

    for keyword in keywords:
        pattern = re.compile(re.escape(keyword), flags=re.IGNORECASE)
        iterator = pattern.finditer(content) if find_all_occurrences else ([pattern.search(content)] if pattern.search(content) else [])

        for match in iterator:
            if match is None:
                continue
            start = max(0, match.start() - context_before)
            end = min(len(content), match.end() + context_after)
            snippet = content[start:end]
            clean_snippet = re.sub(r"\s+", " ", snippet).strip()

            matches.append({
                "keyword": keyword,
                "matched_text": match.group(0),
                "position": match.start(),
                "snippet": clean_snippet
            })

    return matches, None


def search_corpus(
    text_dir: Path,
    keywords: Optional[List[str]] = None,
    find_all: bool = False,
    context_before: int = 150,
    context_after: int = 300
) -> Dict[str, Any]:
    """
    Recursively search TXT files in text_dir for legal keywords.
    """
    if not text_dir.exists():
        raise FileNotFoundError(f"Directory not found: {text_dir}")

    target_keywords = keywords if (keywords and len(keywords) > 0) else DEFAULT_KEYWORDS
    txt_files = sorted([p for p in text_dir.rglob("*.txt") if p.is_file()])

    results: List[Dict[str, Any]] = []
    unreadable_files: List[str] = []
    total_matches = 0

    for file_path in txt_files:
        matches, error = search_file_for_keywords(
            file_path,
            target_keywords,
            context_before=context_before,
            context_after=context_after,
            find_all_occurrences=find_all
        )
        if error:
            unreadable_files.append(error)
            continue

        if matches:
            total_matches += len(matches)
            try:
                rel_path = str(file_path.relative_to(text_dir)).replace("\\", "/")
            except ValueError:
                rel_path = file_path.name

            results.append({
                "file": rel_path,
                "absolute_path": str(file_path.resolve()),
                "match_count": len(matches),
                "matches": matches
            })

    return {
        "text_dir": str(text_dir.resolve()),
        "total_files_searched": len(txt_files),
        "files_with_matches": len(results),
        "total_matches": total_matches,
        "keywords_searched": target_keywords,
        "unreadable_files": unreadable_files,
        "results": results
    }


def output_results(
    data: Dict[str, Any],
    output_format: str = "text",
    output_file: Optional[Path] = None
) -> str:
    """Format results as text, JSON, or CSV, optionally writing to a file."""
    output_str = ""

    if output_format == "json":
        output_str = json.dumps(data, indent=2, ensure_ascii=False)
    elif output_format == "csv":
        rows = []
        for file_res in data["results"]:
            for match in file_res["matches"]:
                rows.append({
                    "file": file_res["file"],
                    "keyword": match["keyword"],
                    "matched_text": match["matched_text"],
                    "position": match["position"],
                    "snippet": match["snippet"]
                })
        if rows:
            import io
            sio = io.StringIO()
            writer = csv.DictWriter(sio, fieldnames=["file", "keyword", "matched_text", "position", "snippet"])
            writer.writeheader()
            writer.writerows(rows)
            output_str = sio.getvalue()
        else:
            output_str = "file,keyword,matched_text,position,snippet\n"
    else:
        # Standard human-readable console text format preserving original experience
        lines = [
            f"Searching text directory: {data['text_dir']}",
            f"TXT files found: {data['total_files_searched']}",
            "=" * 70
        ]
        for file_res in data["results"]:
            lines.append(f"\nFILE: {file_res['file']} ({file_res['match_count']} matches)")
            for match in file_res["matches"]:
                lines.append(f"  Keyword: {match['keyword']}")
                lines.append(f"  Context: {match['snippet']}")
                lines.append("-" * 50)
        lines.append(f"\nSearch completed.")
        lines.append(f"Total keyword matches: {data['total_matches']}")
        if data["unreadable_files"]:
            lines.append(f"Unreadable files: {len(data['unreadable_files'])}")
        output_str = "\n".join(lines)

    if output_file:
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(output_str, encoding="utf-8")
        logger.info(f"Results written to: {output_file}")

    return output_str


def main():
    parser = argparse.ArgumentParser(
        description="Search Nyayavanta legal text corpus for keywords with context windowing."
    )
    parser.add_argument(
        "--text-dir", "-d",
        type=str,
        default=None,
        help="Path to directory containing extracted TXT files (defaults to local text dir)"
    )
    parser.add_argument(
        "--keywords", "-k",
        nargs="+",
        default=None,
        help="Custom list of keywords to search for"
    )
    parser.add_argument(
        "--all-matches", "-a",
        action="store_true",
        help="Find all occurrences in each file, not just the first"
    )
    parser.add_argument(
        "--format", "-f",
        choices=["text", "json", "csv"],
        default="text",
        help="Output format (text, json, csv)"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="Optional path to save search results"
    )

    args = parser.parse_args()

    target_dir = Path(args.text_dir) if args.text_dir else resolve_default_text_dir()
    if not target_dir.exists():
        logger.error(f"Text directory does not exist: {target_dir}")
        sys.exit(1)

    data = search_corpus(
        text_dir=target_dir,
        keywords=args.keywords,
        find_all=args.all_matches
    )

    out_file = Path(args.output) if args.output else None
    formatted = output_results(data, output_format=args.format, output_file=out_file)

    if not out_file or args.format == "text":
        print(formatted)


if __name__ == "__main__":
    main()
