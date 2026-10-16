"""
GPU-Based QLoRA Fine-Tuning Workflow for Nyayavanta AI.

NOTE: This script is prepared for execution on a compatible GPU environment (CUDA/ROCm).
DO NOT run training on low-memory CPU machines (<= 8 GB RAM).

Requirements (GPU environment):
  pip install torch>=2.2.0 transformers>=4.38.0 peft>=0.9.0 bitsandbytes>=0.42.0 trl>=0.8.0 datasets>=2.17.0
"""

import argparse
import json
import logging
import os
from pathlib import Path
import sys
import time

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_qlora")

DEFAULT_MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"  # CPU/Light GPU candidate
DEFAULT_OUTPUT_DIR = Path(__file__).resolve().parent.parent / "dataset" / "models" / "qlora_adapter"
DEFAULT_TRAIN_FILE = Path(__file__).resolve().parent.parent / "dataset" / "training" / "train.jsonl"
DEFAULT_VAL_FILE = Path(__file__).resolve().parent.parent / "dataset" / "training" / "val.jsonl"


def check_gpu_environment():
    """Verify CUDA availability and report hardware metrics."""
    try:
        import torch
        if not torch.cuda.is_available():
            logger.warning("CUDA is NOT available. Running on CPU will be extremely slow and memory-intensive.")
            return False, "CPU"
        
        device_name = torch.cuda.get_device_name(0)
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
        logger.info(f"CUDA detected: {device_name} ({vram_gb:.2f} GB VRAM)")
        if vram_gb < 6.0:
            logger.warning("VRAM is under 6 GB. Ensure batch_size=1 and gradient_accumulation_steps>=8 with 4-bit quantization.")
        return True, device_name
    except ImportError:
        logger.warning("PyTorch not installed. Run 'pip install torch'.")
        return False, "None"


def create_modelfile_for_ollama(adapter_dir: Path, base_model: str) -> Path:
    """Generate an Ollama Modelfile to import the trained QLoRA adapter into Ollama."""
    modelfile_path = adapter_dir / "Modelfile"
    modelfile_content = f"""# Nyayavanta AI Fine-Tuned Legal Model
FROM {base_model}
ADAPTER ./adapter_model.bin

PARAMETER temperature 0.1
PARAMETER top_p 0.9
PARAMETER stop "<|im_end|>"
PARAMETER stop "<|endoftext|>"

SYSTEM \"\"\"You are Nyayavanta AI, a fine-tuned Indian legal information assistant. Ground all statements in authoritative legal provisions and court judgments. Never fabricate citations.\"\"\"
"""
    modelfile_path.write_text(modelfile_content, encoding="utf-8")
    logger.info(f"Ollama Modelfile generated at: {modelfile_path}")
    return modelfile_path


def run_training(
    model_id: str = DEFAULT_MODEL_ID,
    train_file: Path = DEFAULT_TRAIN_FILE,
    val_file: Path = DEFAULT_VAL_FILE,
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    epochs: int = 3,
    lr: float = 2e-4,
    batch_size: int = 2,
    gradient_accumulation_steps: int = 4,
    dry_run: bool = False
):
    """
    Main QLoRA training entry point.
    """
    has_gpu, dev_name = check_gpu_environment()
    
    if dry_run or not has_gpu:
        logger.info("Executing QLoRA Smoke Test / Config Verification (dry-run mode)...")
        if not train_file.exists():
            raise FileNotFoundError(f"Training data not found at {train_file}. Run export_training_data.py first.")
        
        # Verify JSONL lines
        with train_file.open("r", encoding="utf-8") as f:
            first_record = json.loads(f.readline())
            logger.info(f"Verified sample training record: ID={first_record['example_id']}, task={first_record['task']}")

        output_dir.mkdir(parents=True, exist_ok=True)
        meta = {
            "base_model": model_id,
            "training_type": "QLoRA (4-bit bitsandbytes)",
            "device": dev_name,
            "status": "dry_run_ready",
            "epochs": epochs,
            "learning_rate": lr,
            "batch_size": batch_size,
            "gradient_accumulation_steps": gradient_accumulation_steps,
            "train_file": str(train_file),
            "val_file": str(val_file),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        (output_dir / "training_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
        create_modelfile_for_ollama(output_dir, model_id)
        logger.info(f"Dry-run configuration saved to {output_dir}")
        print("\n--- QLoRA CONFIGURATION & SMOKE TEST PASSED ---")
        print(f"To execute genuine training on a GPU machine, run: python backend/scripts/train_qlora.py --gpu")
        return

    # Real training requires PyTorch, Transformers, PEFT, TRL, BitsAndBytes
    try:
        import torch
        from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
        from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
        from datasets import load_dataset
        from trl import SFTTrainer, SFTConfig

        logger.info(f"Initializing QLoRA fine-tuning for {model_id}...")

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True
        )

        tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token

        model = AutoModelForCausalLM.from_pretrained(
            model_id,
            quantization_config=bnb_config,
            device_map="auto",
            trust_remote_code=True
        )
        model = prepare_model_for_kbit_training(model)

        peft_config = LoraConfig(
            r=16,
            lora_alpha=32,
            target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
            lora_dropout=0.05,
            bias="none",
            task_type="CAUSAL_LM"
        )
        model = get_peft_model(model, peft_config)
        model.print_trainable_parameters()

        dataset = load_dataset("json", data_files={"train": str(train_file), "val": str(val_file)})

        training_args = SFTConfig(
            output_dir=str(output_dir),
            num_train_epochs=epochs,
            per_device_train_batch_size=batch_size,
            gradient_accumulation_steps=gradient_accumulation_steps,
            learning_rate=lr,
            logging_steps=10,
            save_strategy="epoch",
            evaluation_strategy="epoch",
            fp16=True,
            optim="paged_adamw_8bit"
        )

        trainer = SFTTrainer(
            model=model,
            train_dataset=dataset["train"],
            eval_dataset=dataset["val"],
            peft_config=peft_config,
            tokenizer=tokenizer,
            args=training_args
        )

        trainer.train()
        model.save_pretrained(str(output_dir))
        tokenizer.save_pretrained(str(output_dir))
        create_modelfile_for_ollama(output_dir, model_id)
        logger.info(f"QLoRA training successfully completed. Adapter saved to {output_dir}")

    except Exception as ex:
        logger.error(f"Training failed with error: {ex}", exc_info=True)
        raise SystemExit(1)


def main():
    parser = argparse.ArgumentParser(description="Nyayavanta QLoRA Fine-Tuning Entry Point")
    parser.add_argument("--model-id", default=DEFAULT_MODEL_ID, help="HuggingFace model ID")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")
    parser.add_argument("--batch-size", type=int, default=2, help="Per device batch size")
    parser.add_argument("--dry-run", action="store_true", default=True, help="Run smoke test without GPU training")
    parser.add_argument("--gpu", action="store_true", help="Execute real training on GPU")

    args = parser.parse_args()
    is_dry = not args.gpu

    run_training(
        model_id=args.model_id,
        epochs=args.epochs,
        batch_size=args.batch_size,
        dry_run=is_dry
    )


if __name__ == "__main__":
    main()
