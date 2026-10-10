"""
backend/app/services/noise.py
Qiskit Aer Noise simulation service:
- Depolarizing quantum errors
- Readout bit-flip errors
- Shot noise sweeps (256, 1024, 4096)
"""

import numpy as np
from typing import Dict, Any, List
from qiskit_aer.noise import NoiseModel, depolarizing_error, ReadoutError


def build_custom_noise_model(error_rate: float) -> NoiseModel:
    """
    Constructs an Aer NoiseModel with 1-qubit/2-qubit depolarizing error
    and symmetric readout errors.
    """
    noise_model = NoiseModel()
    if error_rate <= 0.0:
        return noise_model
        
    # 1-qubit gate error (H, RZ)
    err_1q = depolarizing_error(error_rate, 1)
    noise_model.add_all_qubit_quantum_error(err_1q, ["h", "rz", "ry"])
    
    # 2-qubit gate error (CX)
    err_2q = depolarizing_error(min(1.0, error_rate * 2.0), 2)
    noise_model.add_all_qubit_quantum_error(err_2q, ["cx"])
    
    # Readout error
    p_ro = error_rate * 0.8
    ro_err = ReadoutError([[1.0 - p_ro, p_ro], [p_ro, 1.0 - p_ro]])
    noise_model.add_all_qubit_readout_error(ro_err)
    
    return noise_model


def simulate_noisy_prediction(
    base_probability: float,
    error_rate: float = 0.02,
    shots: int = 1024
) -> Dict[str, Any]:
    """
    Simulates stochastic noise and finite-sampling shot variance on patient risk prediction.
    """
    # Mathematical effect of depolarizing noise: pushes state towards maximally mixed state (p=0.5)
    depolarized_prob = (1.0 - error_rate * 1.5) * base_probability + (error_rate * 1.5) * 0.5
    depolarized_prob = float(np.clip(depolarized_prob, 0.0, 1.0))
    
    # Finite shot sampling from binomial distribution
    shots_count = max(64, shots)
    positive_counts = np.random.binomial(shots_count, depolarized_prob)
    noisy_prob = round(float(positive_counts / shots_count), 4)
    
    # State fidelity estimation under noise
    # F approx (1 - e)^depth
    depth_estimate = 12
    fidelity_est = round(float(max(0.2, (1.0 - error_rate) ** depth_estimate)), 4)
    
    return {
        "error_rate": error_rate,
        "shots": shots,
        "clean_probability": base_probability,
        "noisy_probability": noisy_prob,
        "delta": round(noisy_prob - base_probability, 4),
        "fidelity_estimate": fidelity_est,
        "risk_level": "High" if noisy_prob > 0.65 else ("Medium" if noisy_prob >= 0.35 else "Low")
    }
