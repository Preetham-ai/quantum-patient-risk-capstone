"""
backend/app/services/quantum_vqc.py
Variational Quantum Classifier (VQC) implementation:
- Feature map: ZZFeatureMap (reps=2, linear entanglement)
- Variational ansatz: RealAmplitudes (reps=3)
- Optimization with COBYLA/SPSA or Adam
- Calibrated probability output and parameter binding for state visualization
"""

import os
import json
import warnings
import numpy as np
from typing import Dict, Any, Tuple, Optional, List
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    try:
        from qiskit.circuit.library import zz_feature_map, real_amplitudes
    except ImportError:
        from qiskit.circuit.library import ZZFeatureMap as zz_feature_map
        from qiskit.circuit.library import RealAmplitudes as real_amplitudes


class VariationalQuantumClassifier:
    """
    Main VQC Model:
    Constructs parameterized circuit U(x, theta) = U_ansatz(theta) * U_feat(x).
    Readout maps Z_0 expectation value to calibrated probability via sigmoid.
    """

    def __init__(self, n_qubits: int = 4, reps_feature: int = 2, reps_ansatz: int = 3, seed: int = 42):
        self.n_qubits = n_qubits
        self.reps_feature = reps_feature
        self.reps_ansatz = reps_ansatz
        self.seed = seed
        
        self.feature_map = zz_feature_map(
            feature_dimension=n_qubits,
            reps=reps_feature,
            entanglement="linear"
        )
        self.ansatz = real_amplitudes(
            num_qubits=n_qubits,
            reps=reps_ansatz,
            entanglement="linear"
        )
        
        self.n_features = self.feature_map.num_parameters
        self.n_params = self.ansatz.num_parameters
        
        # Trainable parameters vector
        rng = np.random.default_rng(seed)
        self.theta = rng.uniform(-np.pi, np.pi, size=self.n_params)
        self.bias = 0.0
        self.scale = 1.0

    def build_full_circuit(self, x: np.ndarray, theta: Optional[np.ndarray] = None) -> QuantumCircuit:
        """
        Builds and parameter-binds the complete QuantumCircuit for feature vector x and weights theta.
        """
        if theta is None:
            theta = self.theta
            
        qc = QuantumCircuit(self.n_qubits)
        # Bind feature map
        bound_fmap = self.feature_map.assign_parameters(x)
        qc.compose(bound_fmap, inplace=True)
        # Bind ansatz
        bound_ansatz = self.ansatz.assign_parameters(theta)
        qc.compose(bound_ansatz, inplace=True)
        return qc

    def predict_expectation(self, x: np.ndarray, theta: Optional[np.ndarray] = None) -> float:
        """
        Simulates exact statevector and computes expectation value of Z on qubit 0.
        <Z_0> in [-1, 1].
        """
        qc = self.build_full_circuit(x, theta)
        sv = Statevector.from_instruction(qc)
        # Probabilities of bitstrings where qubit 0 is 0 vs 1
        probs = sv.probabilities()
        # In Qiskit convention, qubit 0 is least significant bit
        p_0 = sum(probs[i] for i in range(len(probs)) if (i & 1) == 0)
        p_1 = sum(probs[i] for i in range(len(probs)) if (i & 1) == 1)
        exp_z = float(p_0 - p_1)
        return exp_z

    def predict_proba_single(self, x: np.ndarray) -> float:
        """
        Computes calibrated probability P(Risk=1) in [0, 1].
        """
        exp_z = self.predict_expectation(x)
        # Sigmoid calibration: high risk maps to higher probability
        logits = self.scale * (-exp_z) + self.bias
        prob = float(1.0 / (1.0 + np.exp(-logits)))
        return round(float(np.clip(prob, 0.01, 0.99)), 4)

    def fit(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        maxiter: int = 40,
        lr: float = 0.15,
        callback=None
    ):
        """
        Optimizes theta on binary cross entropy using SPSA gradient estimation.
        """
        rng = np.random.default_rng(self.seed)
        n_samples = len(X_train)
        
        # Subsample for fast training during interactive sessions
        if n_samples > 60:
            idx = rng.choice(n_samples, 60, replace=False)
            X_sub = X_train[idx]
            y_sub = y_train[idx]
        else:
            X_sub = X_train
            y_sub = y_train
            
        theta = self.theta.copy()
        c = 0.1  # SPSA perturbation scale
        
        for it in range(maxiter):
            # SPSA gradient step
            delta = rng.choice([-1.0, 1.0], size=self.n_params)
            theta_plus = theta + c * delta
            theta_minus = theta - c * delta
            
            # Evaluate losses
            def compute_loss(th):
                losses = []
                for x_i, y_i in zip(X_sub, y_sub):
                    exp_z = self.predict_expectation(x_i, th)
                    p = 1.0 / (1.0 + np.exp(exp_z))
                    p = np.clip(p, 1e-4, 1.0 - 1e-4)
                    losses.append(- (y_i * np.log(p) + (1.0 - y_i) * np.log(1.0 - p)))
                return float(np.mean(losses))
                
            loss_plus = compute_loss(theta_plus)
            loss_minus = compute_loss(theta_minus)
            
            grad = (loss_plus - loss_minus) / (2.0 * c * delta)
            theta = theta - (lr / (it + 1) ** 0.5) * grad
            
            current_loss = 0.5 * (loss_plus + loss_minus)
            if callback:
                callback(it, current_loss, theta)
                
        self.theta = theta
        
        # Fit calibration scale & bias
        exp_vals = np.array([self.predict_expectation(x) for x in X_sub])
        y_sub_arr = np.array(y_sub)
        # Find best threshold / bias
        best_b = 0.0
        best_acc = 0.0
        for b in np.linspace(-1.5, 1.5, 30):
            preds = (1.0 / (1.0 + np.exp(-exp_vals + b))) >= 0.5
            acc = np.mean(preds == y_sub_arr)
            if acc > best_acc:
                best_acc = acc
                best_b = b
        self.bias = best_b

    def save_weights(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        data = {
            "n_qubits": self.n_qubits,
            "reps_feature": self.reps_feature,
            "reps_ansatz": self.reps_ansatz,
            "theta": self.theta.tolist(),
            "bias": float(self.bias),
            "scale": float(self.scale),
        }
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)

    def load_weights(self, filepath: str):
        with open(filepath, "r") as f:
            data = json.load(f)
        self.n_qubits = data["n_qubits"]
        self.reps_feature = data["reps_feature"]
        self.reps_ansatz = data["reps_ansatz"]
        self.theta = np.array(data["theta"])
        self.bias = data["bias"]
        self.scale = data["scale"]
