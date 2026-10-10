"""
backend/app/main.py
FastAPI entrypoint for QuantumRisk: Hybrid QML Patient Risk Prediction.
"""

import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.app.services.preprocess import get_clinical_schema
from backend.app.api.predict import router as predict_router
from backend.app.api.compare import router as compare_router
from backend.app.api.explain import router as explain_router
from backend.app.api.noise import router as noise_router
from backend.app.api.train_ws import router as ws_router

app = FastAPI(
    title="QuantumRisk: Hybrid QML Patient Risk Prediction API",
    description="Backend API for Capstone Problem Statement #28",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API route modules
app.include_router(predict_router)
app.include_router(compare_router)
app.include_router(explain_router)
app.include_router(noise_router)
app.include_router(ws_router)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "ml", "artifacts")


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "QuantumRisk API",
        "version": "1.0.0",
        "quantum_frameworks": ["Qiskit 2.4.2", "PennyLane 0.45.1", "PyTorch 2.14.1"],
        "models_available": ["VQC (Variational Quantum Classifier)", "QSVM (Quantum Kernel)", "Hybrid QNN"],
        "baselines_available": ["Logistic Regression", "SVM (RBF)", "Random Forest", "XGBoost", "MLP"]
    }


@app.get("/schema/{condition}")
def get_schema(condition: str = "heart"):
    cond = condition.lower()
    if cond not in ["heart", "diabetes", "pima"]:
        raise HTTPException(status_code=404, detail="Condition not supported. Choose 'heart' or 'diabetes'.")
    if cond == "pima":
        cond = "diabetes"
    return get_clinical_schema(cond)


@app.get("/metrics/{condition}")
def get_metrics(condition: str = "heart"):
    metrics_path = os.path.join(ARTIFACTS_DIR, "metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Metrics not yet computed. Run training script first.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
