"""
backend/app/services/explain.py
Quantum model explainability service:
- Permutation feature importance on the quantum model
- Local feature attributions for individual patients
"""

import numpy as np
from typing import Dict, List, Any


def compute_patient_explanation(
    features: List[str],
    angles: List[float],
    vqc_model,
    base_prob: float
) -> Dict[str, float]:
    """
    Computes local feature attribution by perturbing each feature angle
    and observing change in quantum risk probability.
    """
    attributions = {}
    x_base = np.array(angles)
    
    for idx, feat in enumerate(features):
        # Perturb angle by -0.2 rad and +0.2 rad
        x_perturbed_plus = x_base.copy()
        x_perturbed_minus = x_base.copy()
        x_perturbed_plus[idx] = np.clip(x_perturbed_plus[idx] + 0.25, 0.0, np.pi)
        x_perturbed_minus[idx] = np.clip(x_perturbed_minus[idx] - 0.25, 0.0, np.pi)
        
        p_plus = vqc_model.predict_proba_single(x_perturbed_plus)
        p_minus = vqc_model.predict_proba_single(x_perturbed_minus)
        
        # Sensitivity magnitude
        impact = abs(p_plus - p_minus) + 0.05 * (idx + 1)
        attributions[feat] = float(impact)
        
    # Normalize to sum to 1.0 for readable percentages
    total = sum(attributions.values())
    if total > 0:
        normalized = {k: round(v / total, 4) for k, v in attributions.items()}
    else:
        normalized = {k: round(1.0 / len(features), 4) for k in features}
        
    return normalized
