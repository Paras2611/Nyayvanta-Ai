"""
Script entry point to chunk legal text and build the SQLite FTS5 / BM25 inverted index.
"""

import json
import logging
from pathlib import Path
import sys

# Ensure backend package import
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.services.chunker import LegalChunker
from backend.app.services.retrieval import LocalFTSIndex

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


def main():
    base_dir = Path(__file__).resolve().parent.parent
    manifest_path = base_dir / "dataset" / "processed" / "dataset_manifest.json"
    text_dir = base_dir / "dataset" / "text"
    output_chunks = base_dir / "dataset" / "chunks" / "legal_chunks.jsonl"

    print("Step 1: Chunking legal text documents...")
    chunker = LegalChunker()
    total_chunks = chunker.process_corpus_incrementally(manifest_path, text_dir, output_chunks)
    print(f"Generated {total_chunks} deduplicated chunks.")

    print("\nStep 2: Building SQLite FTS5 / BM25 Inverted Index...")
    index = LocalFTSIndex()
    count = index.build_index(chunks_file=output_chunks, force_rebuild=True)
    stats = index.get_index_stats()
    print(f"\n--- INDEX BUILD COMPLETE ---")
    print(f"Indexed chunks: {count}")
    print(f"Database size: {stats['db_size_mb']} MB ({stats['db_size_bytes']} bytes)")
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    main()
