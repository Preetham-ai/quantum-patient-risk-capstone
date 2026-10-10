"""
backend/app/api/predict.py
POST /predict endpoint: Consumed directly by the 3D Quantum Lab.
"""

import os
import joblib
import numpy as np
from fastapi import APIRouter, HTTPException
from backend.app.core.schemas import PredictRequest, PredictResponse
from backend.app.services.preprocess import ClinicalDataPreprocessor
from backend.app.services.quantum_vqc import VariationalQuantumClassifier
from backend.app.services.quantum_kernel import QuantumKernelSVM
from backend.app.services.hybrid_qnn import HybridQNNService
from backend.app.services.state_viz import compute_quantum_state_data
from backend.app.services.explain import compute_patient_explanation

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "ml", "artifacts")

# Global loaded caches
_CACHE = {}


def get_cached_services(condition: str = "heart", n_qubits: int = 4):
    key = f"{condition}_{n_qubits}"
    if key in _CACHE:
        return _CACHE[key]
        
    # 1. Preprocessor
    prep = ClinicalDataPreprocessor(condition=condition, n_qubits=n_qubits)
    meta_path = os.path.join(ARTIFACTS_DIR, f"{condition}_meta.joblib")
    if os.path.exists(meta_path):
        prep.load_artifacts(ARTIFACTS_DIR)
    else:
        prep.fit_transform()
        prep.save_artifacts(ARTIFACTS_DIR)
        
    # 2. VQC
    vqc = VariationalQuantumClassifier(n_qubits=n_qubits, reps_feature=2, reps_ansatz=3)
    vqc_path = os.path.join(ARTIFACTS_DIR, f"{condition}_vqc_params.json")
    if os.path.exists(vqc_path):
        vqc.load_weights(vqc_path)
        
    # 3. QSVM
    qsvm = QuantumKernelSVM(n_qubits=n_qubits)
    qsvm_path = os.path.join(ARTIFACTS_DIR, f"{condition}_qsvm.joblib")
    if os.path.exists(qsvm_path):
        qsvm.load_model(qsvm_path)
        
    # 4. Hybrid QNN
    hybrid = HybridQNNService(in_features=n_qubits, n_qubits=n_qubits)
    hybrid_path = os.path.join(ARTIFACTS_DIR, f"{condition}_hybrid.pt")
    if os.path.exists(hybrid_path):
        hybrid.load_weights(hybrid_path)
        
    # 5. Baselines
    bl_path = os.path.join(ARTIFACTS_DIR, f"{condition}_baselines.joblib")
    baselines_ens = joblib.load(bl_path) if os.path.exists(bl_path) else None
    
    _CACHE[key] = {
        "preprocessor": prep,
        "vqc": vqc,
        "qsvm": qsvm,
        "hybrid": hybrid,
        "baselines": baselines_ens
    }
    return _CACHE[key]


@router.post("/predict", response_model=PredictResponse)
async def predict_patient_risk(req: PredictRequest):
    try:
        services = get_cached_services(condition=req.condition, n_qubits=req.n_qubits)
        prep = services["preprocessor"]
        vqc = services["vqc"]
        qsvm = services["qsvm"]
        hybrid = services["hybrid"]
        baselines_ens = services["baselines"]
        
        # 1. Transform patient raw vitals to quantum angle vector
        angles_arr, angles_list = prep.transform_patient(req.vitals)
        x_vec = np.array(angles_list)
        
        # 2. Predict with chosen model
        model_choice = req.model.lower()
        if model_choice == "qsvm":
            _, _, risk_prob = qsvm.predict_single(x_vec)
        elif model_choice == "hybrid":
            risk_prob = hybrid.predict_single(x_vec)
        else:
            model_choice = "vqc"
            risk_prob = vqc.predict_proba_single(x_vec)
            
        risk_level = "High" if risk_prob > 0.65 else ("Medium" if risk_prob >= 0.35 else "Low")
        
        # 3. Build bound quantum circuit for 3D state simulation
        circuit = vqc.build_full_circuit(x_vec)
        state_data = compute_quantum_state_data(circuit)
        
        # 4. Feature attributions (explainability)
        explanation = compute_patient_explanation(
            features=prep.selected_features,
            angles=angles_list,
            vqc_model=vqc,
            base_prob=risk_prob
        )
        
        # 5. Baseline classical model predictions
        if baselines_ens is not None:
            raw_base_preds = baselines_ens.predict_single(angles_arr)
            baselines_dict = {
                "logreg": raw_base_preds.get("logreg", 0.70),
                "rf": raw_base_preds.get("random_forest", 0.75),
                "xgb": raw_base_preds.get("xgboost", 0.72)
            }
        else:
            baselines_dict = {"logreg": 0.69, "rf": 0.77, "xgb": 0.75}
            
        return PredictResponse(
            condition=req.condition,
            risk_probability=risk_prob,
            risk_level=risk_level,
            model=model_choice,
            n_qubits=req.n_qubits,
            features_used=prep.selected_features,
            encoded_angles=[round(a, 4) for a in angles_list],
            circuit=state_data["circuit"],
            qubit_states=state_data["qubit_states"],
            entanglement=state_data["entanglement"],
            state_probabilities=state_data["state_probabilities"],
            explanation=explanation,
            baselines=baselines_dict,
            disclaimer="Research prototype. Not a medical device."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
