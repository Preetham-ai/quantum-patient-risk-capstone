"""
backend/tests/test_api.py
Unit and integration tests for QuantumRisk backend services and API.
"""

import os
import sys
import numpy as np
import pytest
from fastapi.testclient import TestClient

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)

from backend.app.main import app
from backend.app.services.preprocess import ClinicalDataPreprocessor, get_clinical_schema
from backend.app.services.quantum_vqc import VariationalQuantumClassifier
from backend.app.services.state_viz import compute_quantum_state_data

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Qiskit" in data["quantum_frameworks"][0]


def test_schema():
    res = client.get("/schema/heart")
    assert res.status_code == 200
    data = res.json()
    assert data["condition"] == "heart"
    assert len(data["features"]) == 13
    assert "low_risk" in data["sample_patients"]


def test_state_viz_properties():
    vqc = VariationalQuantumClassifier(n_qubits=4, seed=42)
    angles = np.array([0.5, 1.2, 2.1, 0.8])
    qc = vqc.build_full_circuit(angles)
    
    state_data = compute_quantum_state_data(qc)
    assert state_data["n_qubits"] == 4
    
    # 1. Bloch vectors length at most 1
    for q_state in state_data["qubit_states"]:
        bx, by, bz = q_state["bloch"]
        norm = np.sqrt(bx**2 + by**2 + bz**2)
        assert norm <= 1.0001, f"Bloch vector norm {norm} exceeds 1.0!"
        # Purity in [0, 1]
        assert 0.0 <= q_state["purity"] <= 1.0001
        
    # 2. Probability landscape sums to 1
    total_prob = sum(state_data["state_probabilities"].values())
    assert abs(total_prob - 1.0) < 0.05, f"Sum of state probabilities {total_prob} != 1.0"
    
    # 3. Entanglement matrix is symmetric
    ent = state_data["entanglement"]
    for i in range(4):
        for j in range(4):
            assert abs(ent[i][j] - ent[j][i]) < 1e-4


def test_predict_endpoint():
    schema = get_clinical_schema("heart")
    sample = schema["sample_patients"]["high_risk"]
    
    res = client.post("/predict", json={
        "condition": "heart",
        "vitals": sample,
        "model": "vqc",
        "n_qubits": 4
    })
    assert res.status_code == 200
    data = res.json()
    assert 0.0 <= data["risk_probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Medium", "High"]
    assert len(data["qubit_states"]) == 4
    assert len(data["encoded_angles"]) == 4
    assert len(data["features_used"]) == 4
    assert "circuit" in data
    assert "state_probabilities" in data


def test_compare_endpoint():
    schema = get_clinical_schema("heart")
    sample = schema["sample_patients"]["medium_risk"]
    
    res = client.post("/compare", json={
        "condition": "heart",
        "vitals": sample
    })
    assert res.status_code == 200
    data = res.json()
    assert "vqc" in data["quantum_models"]
    assert "qsvm" in data["quantum_models"]
    assert "hybrid_qnn" in data["quantum_models"]
    assert "logreg" in data["classical_baselines"]


def test_noise_endpoint():
    schema = get_clinical_schema("heart")
    sample = schema["sample_patients"]["low_risk"]
    
    res = client.post("/noise", json={
        "condition": "heart",
        "vitals": sample,
        "error_rate": 0.03,
        "shots": 1024
    })
    assert res.status_code == 200
    data = res.json()
    assert 0.0 <= data["noisy_probability"] <= 1.0
    assert data["fidelity_estimate"] <= 1.0
