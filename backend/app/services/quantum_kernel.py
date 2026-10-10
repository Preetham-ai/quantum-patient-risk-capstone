"""
backend/app/services/quantum_kernel.py
Quantum Support Vector Machine (QSVM) with FidelityQuantumKernel:
- ZZFeatureMap (reps=2, linear)
- Fidelity transition probability kernel K(x, x') = |<phi(x)|phi(x')>|^2
- Precomputed SVC with calibrated decision margin
"""

import os
import joblib
import warnings
import numpy as np
from typing import Dict, Any, Tuple
from sklearn.svm import SVC

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    try:
        from qiskit.circuit.library import zz_feature_map
    except ImportError:
        from qiskit.circuit.library import ZZFeatureMap as zz_feature_map

from qiskit_machine_learning.kernels import FidelityQuantumKernel


class QuantumKernelSVM:
    """
    Quantum Kernel SVM Classifier:
    Precomputes the quantum fidelity matrix and fits a classical support vector classifier.
    """

    def __init__(self, n_qubits: int = 4, reps: int = 2, c_param: float = 1.0):
        self.n_qubits = n_qubits
        self.reps = reps
        self.c_param = c_param
        
        self.feature_map = zz_feature_map(
            feature_dimension=n_qubits,
            reps=reps,
            entanglement="linear"
        )
        self.quantum_kernel = FidelityQuantumKernel(feature_map=self.feature_map)
        self.model = SVC(kernel="precomputed", C=c_param)
        self.X_train: np.ndarray = np.empty((0, n_qubits))

    def fit(self, X_train: np.ndarray, y_train: np.ndarray) -> np.ndarray:
        self.X_train = X_train
        # Compute training kernel Gram matrix
        K_train = self.quantum_kernel.evaluate(x_vec=X_train)
        self.model.fit(K_train, y_train)
        return K_train

    def predict_single(self, x_patient: np.ndarray) -> Tuple[int, float, float]:
        """
        Evaluates kernel between this patient and all training states.
        Returns: (predicted_class, decision_margin, risk_probability).
        """
        K_test = self.quantum_kernel.evaluate(x_vec=x_patient.reshape(1, -1), y_vec=self.X_train)
        pred_class = int(self.model.predict(K_test)[0])
        decision_val = float(self.model.decision_function(K_test)[0])
        prob = float(1.0 / (1.0 + np.exp(-decision_val)))
        return pred_class, round(decision_val, 4), round(prob, 4)

    def evaluate_test(self, X_test: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        K_test = self.quantum_kernel.evaluate(x_vec=X_test, y_vec=self.X_train)
        preds = self.model.predict(K_test)
        decision_vals = self.model.decision_function(K_test)
        probs = 1.0 / (1.0 + np.exp(-decision_vals))
        return preds, probs

    def save_model(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            "model": self.model,
            "X_train": self.X_train,
            "n_qubits": self.n_qubits,
            "reps": self.reps,
            "c_param": self.c_param
        }, filepath)

    def load_model(self, filepath: str):
        data = joblib.load(filepath)
        self.model = data["model"]
        self.X_train = data["X_train"]
        self.n_qubits = data["n_qubits"]
        self.reps = data["reps"]
        self.c_param = data["c_param"]
        self.feature_map = zz_feature_map(
            feature_dimension=self.n_qubits,
            reps=self.reps,
            entanglement="linear"
        )
        self.quantum_kernel = FidelityQuantumKernel(feature_map=self.feature_map)
