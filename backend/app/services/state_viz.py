"""
backend/app/services/state_viz.py
Quantum state analysis and visualization services:
- Full statevector simulation
- Per-qubit reduced density matrices via partial trace
- Bloch vectors (x, y, z) and Purities Tr(rho^2)
- Pairwise mutual information (von Neumann entropy)
- Basis-state probability landscape (2^n states)
- Gate timeline decomposition for 3D UI
"""

import warnings
import numpy as np
from typing import Dict, List, Any, Tuple
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, partial_trace, Pauli

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    try:
        from qiskit.circuit.library import zz_feature_map, real_amplitudes
    except ImportError:
        from qiskit.circuit.library import ZZFeatureMap as zz_feature_map
        from qiskit.circuit.library import RealAmplitudes as real_amplitudes


def von_neumann_entropy(rho) -> float:
    """Computes von Neumann entropy S(rho) = -Tr(rho log2 rho)."""
    vals = np.linalg.eigvalsh(rho.data)
    vals = vals[vals > 1e-12]
    if len(vals) == 0:
        return 0.0
    return float(-np.sum(vals * np.log2(vals)))


def compute_quantum_state_data(circuit: QuantumCircuit) -> Dict[str, Any]:
    """
    Simulates the circuit statevector and computes:
    - per-qubit Bloch vector [x, y, z]
    - per-qubit purity Tr(rho_i^2)
    - pairwise mutual information matrix
    - 2^n basis state probabilities
    - circuit timeline gate list
    """
    n_qubits = circuit.num_qubits
    sv = Statevector.from_instruction(circuit)
    
    # 1. Per-qubit Bloch vectors and Purities
    qubit_states = []
    pauli_x = Pauli("X").to_matrix()
    pauli_y = Pauli("Y").to_matrix()
    pauli_z = Pauli("Z").to_matrix()
    
    for q in range(n_qubits):
        trace_qubits = [i for i in range(n_qubits) if i != q]
        rho_q = partial_trace(sv, trace_qubits)
        mat = rho_q.data
        
        bx = float(np.real(np.trace(mat @ pauli_x)))
        by = float(np.real(np.trace(mat @ pauli_y)))
        bz = float(np.real(np.trace(mat @ pauli_z)))
        purity = float(np.real(np.trace(mat @ mat)))
        
        qubit_states.append({
            "qubit": q,
            "bloch": [round(bx, 4), round(by, 4), round(bz, 4)],
            "purity": round(min(1.0, max(0.0, purity)), 4),
        })
        
    # 2. Pairwise Mutual Information Matrix (Entanglement map)
    # I(A:B) = S(A) + S(B) - S(AB)
    entanglement = [[0.0 for _ in range(n_qubits)] for _ in range(n_qubits)]
    for i in range(n_qubits):
        for j in range(i + 1, n_qubits):
            rho_i = partial_trace(sv, [k for k in range(n_qubits) if k != i])
            rho_j = partial_trace(sv, [k for k in range(n_qubits) if k != j])
            rho_ij = partial_trace(sv, [k for k in range(n_qubits) if k not in [i, j]])
            
            s_i = von_neumann_entropy(rho_i)
            s_j = von_neumann_entropy(rho_j)
            s_ij = von_neumann_entropy(rho_ij)
            
            mi = round(max(0.0, float(s_i + s_j - s_ij)), 4)
            entanglement[i][j] = mi
            entanglement[j][i] = mi
            
    # 3. Basis-state probability landscape (2^n states)
    probs_dict = sv.probabilities_dict()
    # Format all binary strings
    state_probs = {}
    for idx in range(2 ** n_qubits):
        bstr = format(idx, f"0{n_qubits}b")
        p_val = float(probs_dict.get(bstr, 0.0))
        state_probs[bstr] = round(p_val, 4)
        
    # 4. Circuit timeline decomposition
    circuit_gates = []
    layer_idx = 0
    decomposed = circuit.decompose()
    for instruction in decomposed.data:
        gate_name = instruction.operation.name.upper()
        q_indices = [decomposed.find_bit(q).index for q in instruction.qubits]
        params = instruction.operation.params
        param_val = float(params[0]) if len(params) > 0 and isinstance(params[0], (int, float)) else None
        
        circuit_gates.append({
            "layer": layer_idx,
            "gate": gate_name,
            "qubits": q_indices,
            "param": round(param_val, 4) if param_val is not None else None,
        })
        layer_idx += 1
        
    return {
        "n_qubits": n_qubits,
        "qubit_states": qubit_states,
        "entanglement": entanglement,
        "state_probabilities": state_probs,
        "circuit": circuit_gates[:30],  # Top 30 gates for smooth 3D display
    }
