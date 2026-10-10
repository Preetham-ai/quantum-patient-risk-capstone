"""
backend/app/services/hybrid_qnn.py
Model C: Hybrid Classical-Quantum Neural Network
Architecture:
Input (raw clinical features) -> Dense(16, ReLU) -> Dense(n_qubits) -> tanh * pi
  -> Quantum Layer (n_qubits, AngleEmbedding + StronglyEntanglingLayers)
  -> Dense(1) -> Sigmoid
Built with PennyLane + PyTorch (qml.qnn.TorchLayer).
"""

import os
import torch
import torch.nn as nn
import pennylane as qml
import numpy as np
from typing import Dict, Any, Tuple


class HybridClassicalQuantumNet(nn.Module):
    """
    Hybrid PyTorch + PennyLane Architecture.
    """
    def __init__(self, in_features: int = 13, n_qubits: int = 4, n_qlayers: int = 2):
        super().__init__()
        self.in_features = in_features
        self.n_qubits = n_qubits
        self.n_qlayers = n_qlayers
        
        # Classical feature compression
        self.encoder = nn.Sequential(
            nn.Linear(in_features, 16),
            nn.ReLU(),
            nn.Linear(16, n_qubits),
            nn.Tanh()
        )
        
        # PennyLane QNode device
        dev = qml.device("default.qubit", wires=n_qubits)
        
        @qml.qnode(dev, interface="torch")
        def qnode(inputs, weights):
            # Scale tanh [-1, 1] into [-pi, pi]
            qml.AngleEmbedding(inputs * np.pi, wires=range(n_qubits))
            qml.StronglyEntanglingLayers(weights, wires=range(n_qubits))
            return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]
            
        weight_shapes = {"weights": (n_qlayers, n_qubits, 3)}
        self.q_layer = qml.qnn.TorchLayer(qnode, weight_shapes)
        
        # Classical classification head
        self.classifier = nn.Sequential(
            nn.Linear(n_qubits, 1),
            nn.Sigmoid()
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        compressed = self.encoder(x)
        q_out = self.q_layer(compressed)
        prob = self.classifier(q_out)
        return prob


class HybridQNNService:
    def __init__(self, in_features: int = 13, n_qubits: int = 4):
        self.in_features = in_features
        self.n_qubits = n_qubits
        self.model = HybridClassicalQuantumNet(in_features=in_features, n_qubits=n_qubits)

    def fit(self, X_train: np.ndarray, y_train: np.ndarray, epochs: int = 15, lr: float = 0.02):
        self.model.train()
        criterion = nn.BCELoss()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=lr)
        
        x_tensor = torch.tensor(X_train, dtype=torch.float32)
        y_tensor = torch.tensor(y_train, dtype=torch.float32).unsqueeze(1)
        
        # Limit to 50 samples for snappy training
        if len(x_tensor) > 50:
            x_tensor = x_tensor[:50]
            y_tensor = y_tensor[:50]
            
        for ep in range(epochs):
            optimizer.zero_grad()
            preds = self.model(x_tensor)
            loss = criterion(preds, y_tensor)
            loss.backward()
            optimizer.step()

    def predict_single(self, x_patient: np.ndarray) -> float:
        self.model.eval()
        with torch.no_grad():
            x_t = torch.tensor(x_patient, dtype=torch.float32)
            if x_t.ndim == 1:
                x_t = x_t.unsqueeze(0)
            prob = float(self.model(x_t).item())
        return round(prob, 4)

    def save_weights(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        torch.save(self.model.state_dict(), filepath)

    def load_weights(self, filepath: str):
        self.model.load_state_dict(torch.load(filepath, weights_only=True))
        self.model.eval()
