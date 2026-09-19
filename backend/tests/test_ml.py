import os
from backend.app.core.database import SessionLocal
from backend.app.ml.evaluator import ml_evaluator
from backend.app.ml.dataset_generator import dataset_generator
from backend.app.ml.adapter import get_model_adapter

def test_dataset_generator():
    corpus = dataset_generator.generate_synthetic_corpus(count=20)
    assert len(corpus) == 20
    assert corpus[0]["task"] in dataset_generator.TASKS
    assert "Nyayavanta-LM" in corpus[0]["metadata"]["target_model"]

def test_ml_evaluator():
    db = SessionLocal()
    try:
        benchmark_results = ml_evaluator.run_benchmark(db)
        assert benchmark_results["totalBenchmarkQueries"] >= 5
        assert benchmark_results["meanReciprocalRank"] > 0.0
        assert len(benchmark_results["experimentMatrix"]) == 5
    finally:
        db.close()

def test_model_adapter_interface():
    baseline = get_model_adapter(use_finetuned=False)
    assert baseline is not None
    res = baseline.generate_legal_reasoning("test prompt", "test context")
    assert "Nyayavanta-Baseline" in res

    finetuned = get_model_adapter(use_finetuned=True)
    assert finetuned is not None
    res_ft = finetuned.generate_legal_reasoning("test prompt", "test context")
    assert "Nyayavanta-LM" in res_ft
