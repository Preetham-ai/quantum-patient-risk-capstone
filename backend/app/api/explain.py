"""
backend/app/api/explain.py
POST /explain endpoint: Feature attributions, per-qubit purity, and dominant entangled pairs.
"""

import numpy as np
from fastapi import APIRouter, HTTPException
from backend.app.core.schemas import ExplainRequest, ExplainResponse
from backend.app.api.predict import get_cached_services
from backend.app.services.state_viz import compute_quantum_state_data
from backend.app.services.explain import compute_patient_explanation

router = APIRouter()


@router.post("/explain", response_model=ExplainResponse)
async def explain_patient_prediction(req: ExplainRequest):
    try:
        services = get_cached_services(condition=req.condition, n_qubits=4)
        prep = services["preprocessor"]
        vqc = services["vqc"]
        
        _, angles_list = prep.transform_patient(req.vitals)
        x_vec = np.array(angles_list)
        base_prob = vqc.predict_proba_single(x_vec)
        
        # 1. Feature attributions
        attributions = compute_patient_explanation(
            features=prep.selected_features,
            angles=angles_list,
            vqc_model=vqc,
            base_prob=base_prob
        )
        
        # 2. Quantum state data
        circuit = vqc.build_full_circuit(x_vec)
        state_data = compute_quantum_state_data(circuit)
        
        # 3. Dominant entangled pairs
        mi_matrix = state_data["entanglement"]
        pairs = []
        n_q = len(mi_matrix)
        for i in range(n_q):
            for j in range(i + 1, n_q):
                if mi_matrix[i][j] > 0.05:
                    pairs.append({
                        "qubits": [i, j],
                        "feature_1": prep.selected_features[i],
                        "feature_2": prep.selected_features[j],
                        "mutual_information": mi_matrix[i][j],
                    })
        pairs.sort(key=lambda x: x["mutual_information"], reverse=True)
        
        return ExplainResponse(
            condition=req.condition,
            feature_attributions=attributions,
            per_qubit_purity=state_data["qubit_states"],
            dominant_entangled_pairs=pairs,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
