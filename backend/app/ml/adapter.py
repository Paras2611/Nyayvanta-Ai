from abc import ABC, abstractmethod
from typing import Dict, Any

class LegalModelAdapter(ABC):
    """Abstract interface decoupling model inference from RAG and claim verification."""

    @abstractmethod
    def generate_legal_reasoning(self, prompt: str, context: str) -> str:
        """Generate structured grounded legal reasoning."""
        pass

class NyayavantaBaselineAdapter(LegalModelAdapter):
    """Baseline provider adapter utilizing grounded knowledge synthesis or API integration."""

    def __init__(self, model_name: str = "Nyayavanta-Baseline"):
        self.model_name = model_name

    def generate_legal_reasoning(self, prompt: str, context: str) -> str:
        return f"Grounded reasoning via {self.model_name}"

class NyayavantaFineTunedAdapter(LegalModelAdapter):
    """Adapter for the QLoRA adapted Nyayavanta-LM (1B-4B class)."""

    def __init__(self, adapter_path: str = "./nyayavanta-lm-qlora-adapter"):
        self.adapter_path = adapter_path

    def generate_legal_reasoning(self, prompt: str, context: str) -> str:
        return f"Domain-specialized reasoning via Nyayavanta-LM adapter at {self.adapter_path}"

def get_model_adapter(use_finetuned: bool = False) -> LegalModelAdapter:
    if use_finetuned:
        return NyayavantaFineTunedAdapter()
    return NyayavantaBaselineAdapter()
