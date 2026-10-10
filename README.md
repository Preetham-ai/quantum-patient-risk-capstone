# QuantumRisk: Hybrid QML Patient Risk Prediction

[![Course](https://img.shields.io/badge/Course-Capstone%2023CSE463-cyan.svg)](https://github.com)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-%2328-blue.svg)](https://github.com)
[![Frameworks](https://img.shields.io/badge/Quantum-Qiskit%20%7C%20PennyLane-purple.svg)](https://qiskit.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-emerald.svg)](https://fastapi.tiangolo.com)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20(Three.js)-white.svg)](https://nextjs.org)

An end-to-end, production-grade hybrid Quantum Machine Learning (QML) prototype for clinical patient risk prediction and stratification. Built for **Capstone 23CSE463: Problem Statement #28**.

---

## 🌟 Key Capabilities

1. **Three Distinct Quantum Architectures**:
   - **Model A: Variational Quantum Classifier (VQC)**: `ZZFeatureMap` (linear entanglement) + `RealAmplitudes` parameterized ansatz (8 parameters).
   - **Model B: Quantum Support Vector Machine (QSVM)**: Fidelity Quantum Kernel $K(x, x') = |\langle\Phi(x)|\Phi(x')\rangle|^2$ evaluated in Hilbert space.
   - **Model C: Hybrid QNN**: PyTorch classical projection ($13 \rightarrow 4$) coupled with PennyLane `TorchLayer` quantum node.

2. **Five Classical Industry Baselines**:
   - Logistic Regression (L2 ridge)
   - Support Vector Machine (RBF kernel)
   - Random Forest (100 trees)
   - XGBoost / Gradient Boosting
   - Multilayer Perceptron (MLP)

3. **Interactive 3D Quantum State Lab (Three.js / React Three Fiber)**:
   - **Bloch Spheres**: Statevector rotations with arrow length scaling dynamically to state purity $\text{Tr}(\rho^2)$.
   - **Entanglement Beams**: Glowing 3D quadratic curves connecting qubits with thickness mapped to quantum mutual information $I(A:B)$.
   - **Circuit Timeline**: 3D quantum wires and gate blocks with traveling quantum light pulses.
   - **Probability Landscape**: 16 glowing 3D basis-state probability bars ($2^4 = 16$).
   - **Quantum Risk Core**: Pulsing energy orb color-coded to risk level (Low: Emerald, Medium: Amber, High: Crimson).
   - **Guided Tour & Free Orbit**: 5-stage camera rig (Intake $\rightarrow$ Encode $\rightarrow$ Entangle $\rightarrow$ Measure $\rightarrow$ Result) or interactive mouse orbit.

4. **NISQ Hardware Noise Lab**:
   - Thermal relaxation, depolarizing noise channels, and measurement shot sampling ($64$ to $8192$ shots) via Qiskit Aer.

5. **Real-Time Training Theatre**:
   - Live WebSocket stream (`ws://localhost:8000/ws/train`) streaming epoch loss, gradient norms, and validation AUROC.

6. **Clinical Ethics & Governance**:
   - Strictly open, de-identified datasets (UCI Cleveland Heart Disease & Pima Indians Diabetes). Zero Protected Health Information (PHI) storage.

---

## 🚀 Quickstart Guide

### Option 1: Running Locally

#### 1. Backend Setup
```bash
# Clone the repository and enter directory
cd /Users/preetham/Documents/quantum_capstone

# Install Python requirements
pip install -r backend/requirements.txt

# Start the FastAPI server
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
Backend runs at `http://localhost:8000`. Swagger API docs available at `http://localhost:8000/docs`.

#### 2. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
# OR run the production build
npm run build && npm start
```
Frontend runs at `http://localhost:3000`.

---

### Option 2: Docker Compose
```bash
docker-compose up --build
```
- Web Application: `http://localhost:3000`
- REST & WebSocket API: `http://localhost:8000`

---

### Option 3: Deploying on Vercel & GitHub

#### 1. Push Codebase to GitHub
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main
git push -u origin main
```

#### 2. Vercel 1-Click Deployment
1. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository.
3. In **Root Directory**, set to `frontend` (or leave default with the root `vercel.json`).
4. Set Framework Preset: **Next.js**.
5. Click **Deploy**.
6. The frontend automatically runs with resilient client-side statevector simulation fallbacks, ensuring complete functionality (3D Bloch observatory, Hilbert bars, entanglement topologies, model evaluations) even before configuring a live backend URL!
7. *(Optional)* Add Environment Variable `NEXT_PUBLIC_API_URL` pointing to your deployed backend (e.g. on Railway, Render, or GCP Cloud Run).

---

## 🧪 Automated Testing

Run the pytest suite to verify all backend API endpoints and quantum state simulations:
```bash
pytest backend/tests/test_api.py -v
```
All 6/6 tests verify health checks, dataset schemas, VQC predictions, QSVM kernel calculations, 5-fold CV metrics, and noise simulations.

---

## 📊 Stratified 5-Fold Cross-Validation Leaderboard

| Model Architecture | Paradigm | Parameters | AUROC | F1 Score | Accuracy |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Random Forest** | Classical Ensemble | ~12,000 | **0.884** | **0.841** | **0.852** |
| **XGBoost / GradBoost** | Classical Trees | ~8,500 | 0.879 | 0.838 | 0.847 |
| **SVM (RBF)** | Classical Kernel | ~300 | 0.856 | 0.812 | 0.820 |
| **PennyLane Hybrid** | Quantum Hybrid | 60 | 0.841 | 0.824 | 0.836 |
| **Logistic Regression** | Classical Linear | 14 | 0.842 | 0.801 | 0.811 |
| **QSVM (Fidelity)** | Quantum Kernel | Kernel ($O(N^2)$) | 0.835 | 0.818 | 0.825 |
| **VQC (Qiskit)** | Variational Quantum | **8** | 0.812 | 0.795 | 0.803 |
| **MLP (2-layer)** | Classical NN | 1,024 | 0.848 | 0.806 | 0.815 |

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers (predict, compare, noise, train_ws)
│   │   ├── core/            # Config & Pydantic validation schemas
│   │   ├── services/        # Quantum statevector simulation, VQC, QSVM, baselines
│   │   └── main.py          # FastAPI application entrypoint
│   ├── ml/
│   │   ├── artifacts/       # Pretrained models, scalers, and metrics.json
│   │   ├── data/            # UCI heart.csv and pima.csv datasets
│   │   └── train.py         # 5-fold cross-validation offline training script
│   ├── tests/               # Pytest automated test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Modern landing page
│   │   ├── intake/page.tsx  # Clinical vitals intake form with presets
│   │   ├── lab/page.tsx     # 3D Quantum State Lab showpiece
│   │   ├── compare/page.tsx # Head-to-head 8-model performance benchmark
│   │   ├── noise/page.tsx   # NISQ hardware noise simulation lab
│   │   ├── training/page.tsx# Real-time WebSocket training stream theatre
│   │   └── ethics/page.tsx  # Clinical ethics & responsible AI governance
│   ├── components/three/    # Three.js / React Three Fiber 3D scene modules
│   ├── lib/                 # Zustand store, API client, TypeScript schemas
│   └── Dockerfile
├── docs/
│   ├── architecture.md      # Mathematical formulations & technical specs
│   └── demo-script.md       # 5-minute examiner presentation guide & Q&A defense
├── docker-compose.yml
└── README.md
```

---

## ⚖️ Clinical Disclaimer & Ethics

This project is an **academic research and educational prototype** created for Capstone 23CSE463. It is **not** an FDA-cleared diagnostic medical device and should not be used as the sole basis for clinical treatment decisions.
