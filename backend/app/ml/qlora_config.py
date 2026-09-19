"""
Nyayavanta-LM: QLoRA / PEFT Adaptation Configuration
Target Base Models: Llama-3.2-1B / Llama-3.2-3B / Qwen2.5-3B-Instruct / Gemma-2-2B
Designed for practical MCA capstone GPU / resource constraints.
"""

QLORA_TRAINING_CONFIG = {
    "model_name_or_path": "meta-llama/Llama-3.2-3B-Instruct",
    "output_dir": "./nyayavanta-lm-qlora-adapter",
    "quantization": {
        "load_in_4bit": True,
        "bnb_4bit_quant_type": "nf4",
        "bnb_4bit_use_double_quant": True,
        "bnb_4bit_compute_dtype": "bfloat16"
    },
    "peft_lora": {
        "r": 16,
        "lora_alpha": 32,
        "lora_dropout": 0.05,
        "bias": "none",
        "task_type": "CAUSAL_LM",
        "target_modules": [
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj"
        ]
    },
    "training_args": {
        "per_device_train_batch_size": 2,
        "gradient_accumulation_steps": 8,
        "warmup_ratio": 0.05,
        "num_train_epochs": 3,
        "learning_rate": 2e-4,
        "fp16": False,
        "bf16": True,
        "logging_steps": 10,
        "optim": "paged_adamw_8bit",
        "weight_decay": 0.01,
        "lr_scheduler_type": "cosine",
        "seed": 42
    },
    "task_evaluation_metrics": [
        "answer_accuracy",
        "citation_accuracy",
        "hallucination_rate",
        "claim_support_rate",
        "precision_at_k",
        "recall_at_k",
        "mrr"
    ]
}
