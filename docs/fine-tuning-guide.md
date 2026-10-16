# Nyayavanta AI: GPU QLoRA Fine-Tuning Guide

> **Target Architecture**: Parameter-Efficient Fine-Tuning (PEFT / QLoRA 4-bit)  
> **Target Hardware**: CUDA-enabled GPU (NVIDIA RTX 3060/4060 or cloud GPU e.g. T4 / A10G / Colab Pro)  
> **Base Model Candidate**: `Qwen/Qwen2.5-0.5B-Instruct` or `Qwen/Qwen2.5-1.5B-Instruct` (Quantized in Ollama as `qwen3.5:0.8b`)  
> **License**: Apache 2.0 / Qwen Community License (permissive for research and commercial assistance)

---

## 1. Important Distinction: Fine-Tuning vs. System Prompts

| Mechanism | Description | Memory / Compute Requirement | Implemented in Nyayavanta |
| :--- | :--- | :--- | :--- |
| **System Prompt / Modelfile** | Prompt-engineering instruction envelope guiding base weights without modifying them. | Low (runs on CPU/Ollama in 1 GB RAM) | **Yes (Active in Phase 4 & 5)** |
| **RAG In-Context Evidence** | Injecting authoritative SQLite FTS5 / BM25 chunks into the context window. | Very Low (< 50 MB RAM) | **Yes (Active in Phase 3)** |
| **QLoRA Fine-Tuning** | Parameter-efficient weight adaptation (training low-rank adapter matrices $W = W_0 + B \cdot A$). | Requires GPU VRAM (>= 6-8 GB) | **Prepared & Documented (Phase 8)** |
| **Full Parameter Training** | Updating all billions of neural network weights. | High-End GPU Cluster (>= 80 GB VRAM) | **Out of Scope (Not Recommended)** |

> [!CAUTION]
> **Do not attempt parameter training on Windows CPU with <= 8 GB RAM.**  
> Loading the backward gradient graph and AdamW optimizer states will trigger Windows memory swapping and thrash the machine. Use the local RAG pipeline for local execution, and reserve the fine-tuning workflow below for a GPU environment.

---

## 2. Hardware & Library Requirements

### GPU VRAM Estimations

| Base Model Size | Quantization | Minimum GPU VRAM | Recommended Hardware |
| :--- | :--- | :--- | :--- |
| **0.5B – 0.8B Parameters** | 4-bit QLoRA (NF4) | **6 GB VRAM** | NVIDIA RTX 3050 / 3060 / T4 |
| **1.5B Parameters** | 4-bit QLoRA (NF4) | **8 GB VRAM** | NVIDIA RTX 3060 / 4060 (8GB) |
| **3B – 4B Parameters** | 4-bit QLoRA (NF4) | **12 GB VRAM** | NVIDIA RTX 3060 12GB / RTX 4070 |
| **7B – 8B Parameters** | 4-bit QLoRA (NF4) | **16 GB VRAM** | NVIDIA RTX 4080 / A10G / A100 |

### Required Python Libraries (Pinned)

```bash
pip install \
  torch>=2.2.0 \
  transformers>=4.38.0 \
  peft>=0.9.0 \
  bitsandbytes>=0.42.0 \
  trl>=0.8.0 \
  datasets>=2.17.0 \
  accelerate>=0.28.0
```

---

## 3. Training Dataset Architecture

The training dataset has been exported from the verified legal corpus using `backend/scripts/export_training_data.py`:
- **`backend/dataset/training/train.jsonl`** (733 examples): Primary training partition.
- **`backend/dataset/training/val.jsonl`** (60 examples): Validation partition for early stopping.
- **`backend/dataset/training/test.jsonl`** (335 examples): Held-out test set for final uncompromised benchmark evaluation.

### Document-Level Leakage Prevention
Chunks originating from the same court document or statute are strictly isolated into the **same partition**. No document ID is shared between `train`, `val`, and `test`.

---

## 4. Execution Commands (On GPU Machine)

### Step 1: Validate Training Data & Split Isolation
```bash
python backend/scripts/validate_training_data.py
```
Expected output: `Data Isolation Valid: True`

### Step 2: Run QLoRA Fine-Tuning
```bash
python backend/scripts/train_qlora.py --gpu --model-id "Qwen/Qwen2.5-0.5B-Instruct" --epochs 3 --batch-size 2
```

Hyperparameter defaults:
- `lora_r`: 16
- `lora_alpha`: 32
- `lora_dropout`: 0.05
- `target_modules`: `["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]`
- `quantization`: NormalFloat4 (NF4) with Double Quantization
- `optimizer`: Paged AdamW 8-bit

### Step 3: Evaluate Base Model vs. Fine-Tuned Adapter
```bash
python backend/scripts/evaluate_model.py
```
Inspect `backend/dataset/evaluation/eval_report.json` to verify grounding rate, refusal accuracy on unanswerable questions, and average latency.

---

## 5. Deploying the Fine-Tuned Adapter to Local Ollama

Once training is complete, import the adapter into Ollama:

1. Ensure the generated `Modelfile` is in `backend/dataset/models/qlora_adapter/`:
   ```dockerfile
   FROM qwen3.5:0.8b
   ADAPTER ./adapter_model.bin
   PARAMETER temperature 0.1
   ```
2. Build the Ollama model:
   ```powershell
   ollama create nyayavanta-finetuned -f backend/dataset/models/qlora_adapter/Modelfile
   ```
3. Update `.env` to point to the new model:
   ```env
   OLLAMA_MODEL="nyayavanta-finetuned"
   ```
4. Restart the Nyayavanta API to run with the fine-tuned adapter!
