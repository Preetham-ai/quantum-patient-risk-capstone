/**
 * frontend/lib/types.ts
 * Type definitions matching the QuantumRisk API contract.
 */

export interface QubitState {
  qubit: number;
  bloch: [number, number, number]; // [x, y, z]
  purity: number; // [0, 1]
}

export interface CircuitGate {
  layer: number;
  gate: string;
  qubits: number[];
  param?: number | null;
}

export interface PredictResponse {
  condition: string;
  risk_probability: number;
  risk_level: "Low" | "Medium" | "High";
  model: "vqc" | "qsvm" | "hybrid";
  n_qubits: number;
  features_used: string[];
  encoded_angles: number[];
  circuit: CircuitGate[];
  qubit_states: QubitState[];
  entanglement: number[][]; // Mutual information matrix
  state_probabilities: Record<string, number>; // 16 basis states
  explanation: Record<string, number>;
  baselines: {
    logreg: number;
    rf: number;
    xgb: number;
  };
  disclaimer: string;
}

export interface FeatureMeta {
  name: string;
  label: string;
  type: "int" | "float" | "select";
  min?: number;
  max?: number;
  step?: number;
  default: number;
  unit?: string;
  options?: { label: string; value: number }[];
}

export interface ClinicalSchema {
  condition: string;
  name: string;
  features: FeatureMeta[];
  sample_patients: {
    low_risk: Record<string, number>;
    medium_risk: Record<string, number>;
    high_risk: Record<string, number>;
  };
}

export interface ModelDetail {
  name: string;
  risk_probability: number;
  risk_level: string;
  parameters?: number | string;
  type?: string;
}

export interface CompareResponse {
  condition: string;
  quantum_models: Record<string, ModelDetail>;
  classical_baselines: Record<string, ModelDetail>;
  consensus_risk: string;
  mean_quantum_risk: number;
  mean_classical_risk: number;
}

export interface NoiseResponse {
  condition: string;
  error_rate: number;
  shots: number;
  clean_probability: number;
  noisy_probability: number;
  delta: number;
  fidelity_estimate: number;
  risk_level: string;
}
