# Nyayavanta Dataset Audit Report

> **Audit Date**: 2026-10-16  
> **Target Archive**: `search_text_dataset/text.zip`  
> **Extraction Source**: Authoritative legal documents and court proceedings collected for Nyayavanta AI  
> **Auditor**: Local AI Pipeline Ingestion Engine  

---

## 1. Executive Summary & Inventory Counts

| Metric | Measured Value | Notes |
| :--- | :--- | :--- |
| **ZIP File Size (Compressed)** | 341,794 bytes (~333.8 KB) | Deflate compression |
| **Total Archive Entries** | 21 entries | 4 directory entries + 17 TXT files |
| **Valid Legal Text (.txt) Files** | **17 files** | All valid UTF-8/mixed encoding |
| **Uncompressed Text Volume** | **1,532,019 bytes** (~1.46 MB) | Raw byte size of extracted text |
| **Total Unicode Characters** | **1,445,160 characters** | Preserving Devanagari & Latin glyphs |
| **Total Whitespace-Separated Words** | **177,704 words** | Calculated via Unicode whitespace split |
| **Total Document Lines** | **19,776 lines** | Formatted statutory & judicial text |

---

## 2. Domain & Language Distribution

### Domain Breakdown

| Domain | Files | Characters | Words | Volume Share (%) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rental / Tenancy** | 9 | 1,379,348 | 172,899 | **95.4%** | Highly detailed Maharashtra Rent Control & Ownership Flats corpus |
| **Consumer Complaints**| 8 | 65,812 | 4,805 | **4.6%** | Consumer Protection Act & District Forum filings |
| **Employment Disputes**| 0 | 0 | 0 | **0.0%** | **COVERAGE GAP**: No files in current archive |
| **Contract Disputes**  | 0 | 0 | 0 | **0.0%** | **COVERAGE GAP**: No files in current archive |

> [!WARNING]
> **Corpus Imbalance Alert**: The dataset is heavily dominated by Rental / Tenancy jurisprudence (95.4% of total characters). Employment and Contract dispute materials are entirely absent from `text.zip`. The Nyayavanta retrieval pipeline must explicitly detect and report these coverage gaps rather than hallucinating answers for unsupported domains.

### Language Breakdown

| Language | Files | Description |
| :--- | :--- | :--- |
| **English (`en`)** | 11 | Complete judgments, acts, and procedural guidelines in English |
| **Marathi (`mr`)** | 5 | District consumer forum complaint templates and orders in Marathi Devanagari script |
| **Bilingual (`mr/en`)** | 1 | Rental judgment (`202605221804081212.txt`) containing mixed Marathi and English legal analysis |

---

## 3. Comprehensive File Manifest

Below is the verified inventory of all 17 text files contained in the authoritative archive:

| # | File Path | Size (Bytes) | SHA-256 Checksum | Chars | Words | Domain | Lang |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `text/ConsumerData/ConsumerData1.txt` | 5,719 | `431a05aba9b2547dbc0ad6680de1ddeab8b8ce04e7c5f2ab16fcb963193b5479` | 5,709 | 442 | Consumer | en |
| 2 | `text/ConsumerData/ConsumerData2.txt` | 6,601 | `c8baeaa849fa498aebae78fa5e68ce5888736ba9c4f49e71d731053895906ae0` | 6,587 | 586 | Consumer | en |
| 3 | `text/ConsumerData/gravience-redressal.txt` | 8,149 | `9e7abb1d4a2a62f3cea5b21f63c6597cd68693d1fbcc8311e7fb25e2889e438b` | 8,083 | 1,208 | Consumer | en |
| 4 | `text/ConsumerData/Marathi/20250616154728695.txt` | 14,412 | `1d59112fc99c1f7d64fc9ff8e326017100ea161d1e21a3c84c431b2c8a92cbd2` | 8,782 | 533 | Consumer | mr |
| 5 | `text/ConsumerData/Marathi/202506161668714250.txt` | 31,196 | `f17d9ea3b6b38e9e7fc47ef27c838126f9257d7e9680487fad8c69e0a3624f9b` | 13,946 | 827 | Consumer | mr |
| 6 | `text/ConsumerData/Marathi/20250616258524644.txt` | 8,434 | `7a16cdda9a15841d4e28457afd2f64481bf68d333fc9ddf1dc0a36fe6f58b986` | 4,540 | 354 | Consumer | mr |
| 7 | `text/ConsumerData/Marathi/20250616570182032.txt` | 15,927 | `ec17f94e68869e9bf8e34bdb2809b4798f42702361405a8d903c4b0692ae3b0f` | 6,141 | 260 | Consumer | mr |
| 8 | `text/ConsumerData/Marathi/20250616852295299.txt` | 19,140 | `358bb2e25b2b850b5be282552a72991e6afd9733976c21edc23f3993673f2078` | 12,024 | 595 | Consumer | mr |
| 9 | `text/RentalData/20250911109653766.txt` | 95,137 | `658b1333a2b4549d6257045d3ba3d51b3f0f6536f8fe55462ff3b6655ae15444` | 95,121 | 10,196 | Rental | en |
| 10 | `text/RentalData/20250911144768239.txt` | 79,119 | `735bb8e167c39b30ab550ea61b9f6368b2173fc8a2a28aed1542c277acab1707` | 77,572 | 9,878 | Rental | en |
| 11 | `text/RentalData/202509111900892266.txt` | 173,064 | `782050008286afeeeaaec68a1f87f486512059dc69583a1a2465d8197d51f6ed` | 172,646 | 21,251 | Rental | en |
| 12 | `text/RentalData/202509112044354047.txt` | 474,224 | `a85886883de342c012fd3b643cbef2fc48ea6c0a7b5608cbad8ad8db37225d83` | 474,131 | 51,469 | Rental | en |
| 13 | `text/RentalData/202509112093674248.txt` | 19,036 | `e43fe12f6d6bb477ccba23469611e84e42edae6de3711c6c4edb15921e8afc4d` | 19,006 | 3,186 | Rental | en |
| 14 | `text/RentalData/20250911271155943.txt` | 211,897 | `e38b5af263d59339006f64e4c769af4f54cc42dec07a64b36e5d8517442d8283` | 210,829 | 31,943 | Rental | en |
| 15 | `text/RentalData/202509122034412027.txt` | 161,744 | `ba691ca2e28b3040f9d8e8c6ca6e95019ebb8454e32882f2793aa89de6544043` | 161,535 | 20,905 | Rental | en |
| 16 | `text/RentalData/202509122132214915.txt` | 110,749 | `9367b8b17b81a57bf667741b720e90ab4297e671afc49d743b6c2836445ccc59` | 110,367 | 16,439 | Rental | en |
| 17 | `text/RentalData/202605221804081212.txt` | 97,471 | `2f61428c7926106b920a58809ee8efc0acfbdb973246ee33bee553125603d767` | 58,141 | 7,632 | Rental | mr/en |

---

## 4. Text Quality & Anomaly Analysis

1. **OCR and Replacement Artifacts**:
   - `text/RentalData/202605221804081212.txt` contains OCR character anomalies where Marathi glyphs alternate with OCR artifacts. Text cleaning must gracefully normalize or filter out invalid control characters while protecting genuine Devanagari unicode blocks.
2. **Marathi Unicode Integrity**:
   - Files in `ConsumerData/Marathi/` are encoded in UTF-8 Devanagari. Standard string operations in Python handle these well, but lowercase transformations (`.lower()`) must preserve script stability.
3. **Legal Citation & Section Syntax**:
   - Critical legal tokens (e.g., `Section 15(1)`, `Section 24`, `Regulation 3(b)`, `Clause 7`, `Rs. 50,000/-`) must be preserved during whitespace normalization.
4. **Header/Footer Repetitions**:
   - Court order header blocks (`IN THE HIGH COURT OF JUDICATURE AT BOMBAY`, `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION`) appear periodically and provide jurisdiction and forum context; they must not be stripped indiscriminately.

---

## 5. Domain Balancing & Expansion Plan

To address the coverage gap in Employment and Contract disputes:
1. **Employment Disputes Phase**:
   - Ingest Industrial Disputes Act, 1947, Payment of Gratuity Act, 1972, and standard employment contract termination precedents from High Courts.
2. **Contract Disputes Phase**:
   - Ingest Indian Contract Act, 1872 (Sections 10, 73, 74) and Commercial Courts Act precedents.
3. **Pipeline Action**:
   - Until verified sources are ingested, queries directed to Employment and Contract will cleanly return a `COVERAGE_GAP` notification with recommended official portals (e.g. Shram Suvidha, e-Courts).
