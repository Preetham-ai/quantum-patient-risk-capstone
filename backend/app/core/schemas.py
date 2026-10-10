"""
backend/app/core/schemas.py
Pydantic v2 schemas matching the QuantumRisk API contract.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class QubitState(BaseModel):
    qubit: int
    bloch: List[float] = Field(..., description="[x, y, z] Bloch coordinates on reduced density matrix")
    purity: float = Field(..., description="Tr(rho^2) purity measure [0, 1]")


class CircuitGate(BaseModel):
    layer: int
    gate: str
    qubits: List[int]
    param: Optional[float] = None


class PredictRequest(BaseModel):
    condition: str = Field("heart", description="'heart' or 'diabetes'")
    vitals: Dict[str, float] = Field(..., description="Raw clinical features dictionary")
    model: str = Field("vqc", description="'vqc', 'qsvm', or 'hybrid'")
    n_qubits: int = Field(4, description="Active qubit count (4, 6, 8)")


class PredictResponse(BaseModel):
    condition: str
    risk_probability: float
    risk_level: str
    model: str
    n_qubits: int
    features_used: List[str]
    encoded_angles: List[float]
    circuit: List[CircuitGate]
    qubit_states: List[QubitState]
    entanglement: List[List[float]]
    state_probabilities: Dict[str, float]
    explanation: Dict[str, float]
    baselines: Dict[str, float]
    disclaimer: str = "Research prototype. Not a medical device."


class CompareRequest(BaseModel):
    condition: str = "heart"
    vitals: Dict[str, float]


class CompareResponse(BaseModel):
    condition: str
    quantum_models: Dict[str, Dict[str, Any]]
    classical_baselines: Dict[str, Dict[str, Any]]
    consensus_risk: str
    mean_quantum_risk: float
    mean_classical_risk: float


class ExplainRequest(BaseModel):
    condition: str = "heart"
    vitals: Dict[str, float]


class ExplainResponse(BaseModel):
    condition: str
    feature_attributions: Dict[str, float]
    per_qubit_purity: List[Dict[str, Any]]
    dominant_entangled_pairs: List[Dict[str, Any]]


class NoiseRequest(BaseModel):
    condition: str = "heart"
    vitals: Dict[str, float]
    error_rate: float = Field(0.02, ge=0.0, le=0.10)
    shots: int = Field(1024, ge=64, le=8192)


class NoiseResponse(BaseModel):
    condition: str
    error_rate: float
    shots: int
    clean_probability: float
    noisy_probability: float
    delta: float
    fidelity_estimate: float
    risk_level: str
