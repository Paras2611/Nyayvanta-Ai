"""
Ollama Client Service for Nyayavanta Local AI.

Manages connection health, model discovery, bounded local inference,
and actionable error states when Ollama or the required model tag is offline.
"""

import json
import logging
import os
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional
import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from backend.app.core.config import settings

logger = logging.getLogger("nyayavanta.ollama_client")


class OllamaClient:
    """Handles communication with the local Ollama inference server."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        num_ctx: Optional[int] = None,
        num_predict: Optional[int] = None,
        temperature: Optional[float] = None,
        keep_alive: Optional[str] = None
    ):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.model = model or settings.OLLAMA_MODEL
        self.num_ctx = num_ctx or settings.OLLAMA_NUM_CTX
        self.num_predict = num_predict or settings.OLLAMA_NUM_PREDICT
        self.temperature = temperature if temperature is not None else settings.OLLAMA_TEMPERATURE
        self.keep_alive = keep_alive or settings.OLLAMA_KEEP_ALIVE

    def check_health(self) -> Dict[str, Any]:
        """
        Check whether Ollama is running and inspect available models.
        Returns detailed diagnostic dictionary.
        """
        try:
            with httpx.Client(timeout=3.0) as client:
                res = client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    models = [m.get("name") for m in data.get("models", [])]
                    model_installed = any(
                        self.model == m or self.model in m or m.startswith(self.model.split(":")[0])
                        for m in models
                    )

                    return {
                        "is_running": True,
                        "base_url": self.base_url,
                        "configured_model": self.model,
                        "is_model_installed": model_installed,
                        "available_models": models,
                        "message": "Ollama is active." if model_installed else (
                            f"Ollama is running, but model '{self.model}' is not installed. "
                            f"Run 'ollama pull {self.model}' in PowerShell."
                        )
                    }
                else:
                    return {
                        "is_running": False,
                        "base_url": self.base_url,
                        "configured_model": self.model,
                        "is_model_installed": False,
                        "available_models": [],
                        "message": f"Ollama returned HTTP status {res.status_code}"
                    }
        except httpx.ConnectError:
            return {
                "is_running": False,
                "base_url": self.base_url,
                "configured_model": self.model,
                "is_model_installed": False,
                "available_models": [],
                "message": (
                    f"Ollama is not running at {self.base_url}. "
                    "Start it via 'ollama serve' or open the Ollama application."
                )
            }
        except Exception as ex:
            return {
                "is_running": False,
                "base_url": self.base_url,
                "configured_model": self.model,
                "is_model_installed": False,
                "available_models": [],
                "message": f"Error connecting to Ollama: {str(ex)}"
            }

    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: float = 60.0
    ) -> Dict[str, Any]:
        """
        Send a generation request to Ollama with strict resource bounds.
        """
        target_model = model or self.model
        health = self.check_health()

        if not health["is_running"]:
            return {
                "status": "ollama_unavailable",
                "error": health["message"],
                "model": target_model,
                "response": None
            }

        if not health["is_model_installed"]:
            return {
                "status": "model_missing",
                "error": health["message"],
                "model": target_model,
                "response": None
            }

        payload = {
            "model": target_model,
            "prompt": prompt,
            "stream": False,
            "keep_alive": self.keep_alive,
            "options": {
                "num_ctx": self.num_ctx,
                "num_predict": self.num_predict,
                "temperature": self.temperature
            }
        }
        if system_prompt:
            payload["system"] = system_prompt

        try:
            with httpx.Client(timeout=httpx.Timeout(timeout_seconds, connect=3.0)) as client:
                res = client.post(f"{self.base_url}/api/generate", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "status": "success",
                        "response": data.get("response", "").strip(),
                        "model": target_model,
                        "eval_count": data.get("eval_count"),
                        "eval_duration_ms": round(data.get("eval_duration", 0) / 1e6, 2),
                        "total_duration_ms": round(data.get("total_duration", 0) / 1e6, 2)
                    }
                else:
                    return {
                        "status": "generation_error",
                        "error": f"Ollama HTTP {res.status_code}: {res.text}",
                        "model": target_model,
                        "response": None
                    }
        except httpx.ReadTimeout:
            return {
                "status": "timeout",
                "error": f"Inference timed out after {timeout_seconds} seconds on local CPU.",
                "model": target_model,
                "response": None
            }
        except Exception as ex:
            return {
                "status": "error",
                "error": f"Inference request failed: {str(ex)}",
                "model": target_model,
                "response": None
            }


# Singleton instance
ollama_service = OllamaClient()
