"""
backend/app/api/noise.py
POST /noise endpoint: Simulates prediction degradation under quantum noise.
"""

import numpy as np
from fastapi import APIRouter, HTTPException
from backend.app.core.schemas import NoiseRequest, NoiseResponse
from backend.app.api.predict import get_cached_services
from backend.app.services.noise import simulate_noisy_prediction

router = APIRouter()


@router.post("/noise", response_model=NoiseResponse)
async def evaluate_noisy_prediction(req: NoiseRequest):
    try:
        services = get_cached_services(condition=req.condition, n_qubits=4)
        prep = services["preprocessor"]
        vqc = services["vqc"]
        
        _, angles_list = prep.transform_patient(req.vitals)
        x_vec = np.array(angles_list)
        clean_prob = vqc.predict_proba_single(x_vec)
        
        noisy_res = simulate_noisy_prediction(
            base_probability=clean_prob,
            error_rate=req.error_rate,
            shots=req.shots
        )
        
        return NoiseResponse(
            condition=req.condition,
            error_rate=req.error_rate,
            shots=req.shots,
            clean_probability=clean_prob,
            noisy_probability=noisy_res["noisy_probability"],
            delta=noisy_res["delta"],
            fidelity_estimate=noisy_res["fidelity_estimate"],
            risk_level=noisy_res["risk_level"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
