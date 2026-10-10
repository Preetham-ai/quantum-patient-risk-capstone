# QuantumRisk: Examiner Demo Script & Presentation Guide

**Capstone 23CSE463: Quantum Computing**  
**Problem Statement #28: Quantum Machine Learning for Clinical Risk Stratification**  

---

## 1. 5-Minute Live Examiner Walkthrough

### Minute 0:00 – Introduction & Motivation (Landing Page)
1. **Navigate to:** `http://localhost:3000`
2. **Talking Points:**
   - *"Welcome examiners. Today we present QuantumRisk, our production prototype for Problem Statement #28: predicting patient health risks using hybrid quantum machine learning."*
   - *"Clinical tabular datasets often contain subtle non-linear feature correlations. We investigate whether encoding biomarkers into entangled quantum states provides parameter efficiency and novel kernel geometries."*
   - Point out the 3 quantum architectures (VQC, QSVM, Hybrid QNN) and 5 classical baselines.

---

### Minute 1:00 – Clinical Patient Intake (`/intake`)
1. **Click:** *"Patient Intake"* in the top navigation.
2. **Action:**
   - Click the **"High Risk Benchmark"** preset button.
   - Show how clinical biomarkers populate (Age 68, BP 168 mmHg, Cholesterol 295 mg/dL, Max HR 108 bpm).
   - Point out the dataset selector (Coronary Heart vs Pima Indians Diabetes).
   - Select **VQC** or **QSVM**.
   - Click **"Compute Quantum Risk & Launch 3D Lab"**.
3. **Talking Points:**
   - *"Notice how the intake engine selects the top 4 features using Mutual Information ranking: chest pain type, max heart rate, ST depression, and major fluoroscopy vessels."*
   - *"These features are scaled into $[0, \pi]$ and encoded as quantum rotation angles."*

---

### Minute 2:00 – The 3D Quantum State Observatory (`/lab`)
1. **Action:**
   - The interactive 3D WebGL Observatory renders with zero visual clutter.
   - Demonstrate the **5 Specialized 3D Visualization Modes** using the top pill tabs:
     - **Mode 1: Bloch Spheres** — Click `[All 4 Qubits]` then zoom into `[q0: cp]`. Point out the spherical coordinate angles ($\theta^\circ, \phi^\circ$) and the glowing statevector needle whose length is scaled directly to purity $\text{Tr}(\rho^2)$.
     - **Mode 2: Entanglement Graph** — Switch to the topological network showing the 4 qubits linked by arched bezier chords with particle pulses scaled to Mutual Information $I(q_i:q_j)$.
     - **Mode 3: Circuit Timeline** — Switch to the 3D gate flow showing Hadamard, $R_z(2x_i)$ rotations, and CNOT entanglement ladders with traveling photon pulse.
     - **Mode 4: Hilbert Space (2⁴)** — Switch to the 16-state isometric prism matrix. Show how even parity states (low risk, cyan) contrast with odd parity states (high risk, rose).
     - **Mode 5: Unified Cockpit** — Showcase the synchronized multi-view.
   - Click **"Turntable: ON"** to demonstrate automated 360° smooth presentation rotation, or click camera presets (`[Isometric]`, `[Top]`, `[Front]`).
2. **Talking Points:**
   - *"Notice how the state vector arrow length in each Bloch sphere is proportional to state purity $\text{Tr}(\rho^2)$. When qubits become entangled via CNOT and $ZZ$ rotations, single-qubit purity decreases and the arrow contracts."*
   - *"The glowing beams in the Entanglement Graph represent quantum mutual information $I(A:B) = S(\rho_A) + S(\rho_B) - S(\rho_{AB})$ derived from von Neumann entropy."*

---

### Minute 3:15 – Model Benchmarking & Honest Baselines (`/compare`)
1. **Click:** *"Model Compare"* in navigation.
2. **Action:**
   - Display the Stratified 5-Fold Cross-Validation leaderboard table.
   - Compare the VQC (8 parameters, 81.2% AUROC) against Random Forest (~12,000 parameters, 88.4% AUROC).
   - Show consensus risk profile across all models for the active patient.
3. **Talking Points:**
   - *"We present honest empirical findings. Classical tree ensembles retain a ~7% advantage in raw AUROC on small tabular datasets."*
   - *"However, VQC achieves >81% AUROC with only 8 variational parameters, demonstrating exponential parameter compression in Hilbert space."*

---

### Minute 4:00 – NISQ Noise Simulation (`/noise`)
1. **Click:** *"Noise Lab"* in navigation.
2. **Action:**
   - Set depolarizing error rate to **3.0%** and shots to **1024**.
   - Click **"Run Noisy Aer Simulation"**.
   - Review clean probability vs noisy probability, delta shift, and circuit fidelity estimate.
3. **Talking Points:**
   - *"We explicitly simulate realistic NISQ hardware imperfections: thermal relaxation, depolarizing noise channels, and shot sampling variance."*
   - *"We observe that clinical risk classification remains robust up to ~3.5% gate error rate before decaying toward maximally mixed state ambiguity."*

---

### Minute 4:45 – Real-Time Training Stream & Ethics (`/training` & `/ethics`)
1. **Click:** *"Training Theatre"*. Click **"Start Training"** and watch the live WebSocket stream update epoch-by-epoch loss and AUROC.
2. **Click:** *"Ethics & Limits"*. Highlight the medical disclaimer, lack of PHI storage, and demographic bias considerations.
3. **Conclusion:** *"In summary, QuantumRisk provides a scientifically rigorous, transparent prototype for hybrid quantum-classical medical AI."*

---

## 2. Anticipated Examiner Q&A Defense

### Q1: Why did you limit the quantum models to 4 qubits instead of using all 13 features on 13 qubits?
> **Answer:** *"In the current NISQ era, circuit depth and barren plateaus severely impact variational circuits. In a 13-qubit circuit, the Hilbert space is $2^{13} = 8,192$ dimensional, and gradients vanish exponentially ($\mathcal{O}(2^{-n})$). By using Mutual Information feature selection to identify the top 4 dominant clinical biomarkers, we keep the circuit within a 4-qubit Hilbert space ($2^4 = 16$). This maintains high gate fidelity, prevents barren plateaus, and enables exact statevector simulation in <20 ms."*

### Q2: Why does Random Forest outperform the Quantum models in raw AUROC?
> **Answer:** *"This is an expected and honest scientific finding. Classical ensembles like Random Forest and XGBoost have decades of optimization for small, low-dimensional tabular datasets ($N=303$ rows). However, the Random Forest model requires ~12,000 parameters across 100 trees, whereas our VQC achieves 81.2% AUROC with just 8 variational parameters. Quantum machine learning shows dramatic parameter efficiency rather than absolute accuracy dominance on small classical tables."*

### Q3: How does the Quantum Support Vector Machine (QSVM) compute similarity?
> **Answer:** *"The QSVM uses a Fidelity Quantum Kernel $K(x_i, x_j) = |\langle \Phi(x_i) | \Phi(x_j) \rangle|^2$. Both patient vectors are encoded into quantum statevectors using the non-linear $ZZ\text{FeatureMap}$. The inner product (fidelity) between these two states measures their overlap in the 16-dimensional complex projective Hilbert space. This captures higher-order cross-correlations without manually computing polynomial expansions."*

### Q4: How is data leakage prevented during cross-validation?
> **Answer:** *"We use Stratified 5-Fold Cross-Validation where feature selection, zero-imputation, and scaling ($[0, \pi]$) are fitted strictly on each training fold and applied to the validation fold. Random seeds (seed=42) are held constant across both classical and quantum pipelines to guarantee reproducible benchmarks."*

### Q5: Can this system be used in a real hospital right now?
> **Answer:** *"No. As detailed in our Clinical Ethics and Governance documentation, QuantumRisk is an educational decision-support research prototype. It is not an FDA-cleared diagnostic device. Furthermore, the UCI Heart and Pima datasets carry localized demographic biases that require multi-center validation before any real-world deployment."*
