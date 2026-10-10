"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuantumStore } from "@/lib/store";
import { runPredict } from "@/lib/api";
import { QuantumObservatory, ViewMode, CameraPreset } from "@/components/three/QuantumObservatory";
import {
  Cpu,
  Layers,
  RotateCw,
  Compass,
  Activity,
  Eye,
  Info,
  Network,
  Binary,
  Sliders,
  HeartPulse,
  BookOpen,
} from "lucide-react";

export default function QuantumLabPage() {
  const {
    condition,
    vitals,
    activeModel,
    predictResult,
    setPredictResult,
  } = useQuantumStore();

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("bloch");
  const [focusQubit, setFocusQubit] = useState<number | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("front");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [use2DFallback, setUse2DFallback] = useState(false);
  const [activeTab, setActiveTab] = useState<"qubits" | "entanglement" | "hilbert" | "math">("qubits");

  // Load prediction on mount if empty
  useEffect(() => {
    if (!predictResult) {
      setLoading(true);
      runPredict(condition, vitals, activeModel, 4)
        .then((res) => {
          setPredictResult(res);
        })
        .catch((err) => {
          console.error("Initial prediction error:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [condition, vitals, activeModel, predictResult, setPredictResult]);

  const isHighRisk = predictResult?.risk_level === "High";
  const isMedRisk = predictResult?.risk_level === "Medium";

  // Exact Qubit Clinical Biomarker Dictionary
  const qubitDetails = [
    {
      index: 0,
      code: "q0",
      featureName: predictResult?.features_used[0] || (condition === "heart" ? "cp" : "Glucose"),
      title: condition === "heart" ? "Chest Pain Type (cp)" : "Plasma Glucose",
      clinicalMeaning: condition === "heart"
        ? "Cardiac ischemic pain indicator. Class 0: Asymptomatic, Class 1-3: Angina discomfort."
        : "Fasting glucose concentration. Drives metabolic diabetic microvascular deterioration.",
      pole0: "Optimal / Asymptomatic (|0⟩)",
      pole1: "Pathological Angina / Hyperglycemic (|1⟩)",
    },
    {
      index: 1,
      code: "q1",
      featureName: predictResult?.features_used[1] || (condition === "heart" ? "thalach" : "BMI"),
      title: condition === "heart" ? "Max Heart Rate (thalach)" : "Body Mass Index (BMI)",
      clinicalMeaning: condition === "heart"
        ? "Peak treadmill chronotropic response. Inability to reach target heart rate indicates coronary insufficiency."
        : "Central adiposity and body mass index driving peripheral insulin resistance.",
      pole0: "Robust Chronotropic Range (|0⟩)",
      pole1: "Chronotropic Incompetence / Obese (|1⟩)",
    },
    {
      index: 2,
      code: "q2",
      featureName: predictResult?.features_used[2] || (condition === "heart" ? "oldpeak" : "Age"),
      title: condition === "heart" ? "ST Depression (oldpeak)" : "Patient Age",
      clinicalMeaning: condition === "heart"
        ? "Exercise-induced electrocardiographic ST segment depression. Directly reflects subendocardial myocardial ischemia."
        : "Progressive biological age reflecting cumulative pancreatic beta-cell depletion.",
      pole0: "Isoelectric Normal ECG (|0⟩)",
      pole1: "Severe Ischemic Depression (|1⟩)",
    },
    {
      index: 3,
      code: "q3",
      featureName: predictResult?.features_used[3] || (condition === "heart" ? "ca" : "Insulin"),
      title: condition === "heart" ? "Major Vessels (ca)" : "Serum Insulin",
      clinicalMeaning: condition === "heart"
        ? "Number of major coronary arteries colored by fluoroscopy dye (0-3). Confirms anatomical stenosis."
        : "Post-prandial serum insulin level reflecting pancreatic secretion strain.",
      pole0: "Patent Vessels (0 Stenosed) (|0⟩)",
      pole1: "Multivessel Coronary Stenosis (|1⟩)",
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-5 flex flex-col min-h-[calc(100vh-4.5rem)]">
      {/* 1. Header Navigation & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-800/80 flex items-center justify-center text-teal-400">
            <HeartPulse className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {condition === "heart"
                  ? "Coronary Risk Quantum State Observatory"
                  : "Diabetes Risk Quantum State Observatory"}
              </h1>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                isHighRisk
                  ? "bg-rose-950/80 text-rose-300 border-rose-800/80"
                  : isMedRisk
                  ? "bg-amber-950/80 text-amber-300 border-amber-800/80"
                  : "bg-teal-950/80 text-teal-300 border-teal-800/80"
              }`}>
                {predictResult?.risk_level || "Evaluating"} Risk Profile
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Problem Statement #28 • 4 Superconducting Qubits • 16-Dimensional Hilbert Space
            </p>
          </div>
        </div>

        {/* 5 View Mode Pills */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => {
              setViewMode("bloch");
              setFocusQubit(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              viewMode === "bloch"
                ? "bg-teal-500 text-black font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1. Bloch Spheres</span>
          </button>

          <button
            onClick={() => setViewMode("entanglement")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              viewMode === "entanglement"
                ? "bg-teal-500 text-black font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>2. Entanglement Graph</span>
          </button>

          <button
            onClick={() => setViewMode("circuit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              viewMode === "circuit"
                ? "bg-teal-500 text-black font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Circuit Timeline</span>
          </button>

          <button
            onClick={() => setViewMode("hilbert")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              viewMode === "hilbert"
                ? "bg-teal-500 text-black font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>4. Hilbert Space (2⁴)</span>
          </button>

          <button
            onClick={() => setViewMode("cockpit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              viewMode === "cockpit"
                ? "bg-teal-500 text-black font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. Unified Cockpit</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 ${
              autoRotate
                ? "bg-teal-950/80 text-teal-300 border-teal-700/80"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-teal-400" : ""}`} />
            <span>{autoRotate ? "Turntable: ON" : "Auto-Rotate"}</span>
          </button>

          <button
            onClick={() => setUse2DFallback(!use2DFallback)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span>{use2DFallback ? "3D Observatory" : "2D Grid"}</span>
          </button>

          <Link
            href="/intake"
            className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs tracking-wide transition flex items-center space-x-1.5 shadow-md shadow-teal-500/20"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Modify Patient</span>
          </Link>
        </div>
      </div>

      {/* 2. Explanatory Context Bar */}
      <div className="my-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs backdrop-blur-md">
        <div className="flex items-center space-x-2 text-slate-300">
          <Info className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-bold text-white">
            {viewMode === "bloch" && "Bloch Spheres (Feature Mapping):"}
            {viewMode === "entanglement" && "Entanglement Network (Biomarker Synergies):"}
            {viewMode === "circuit" && "Quantum Circuit Flow (Gate Evolution):"}
            {viewMode === "hilbert" && "Hilbert Space (Basis Probability Distribution):"}
            {viewMode === "cockpit" && "Unified Cockpit (Multi-View Diagnostics):"}
          </span>
          <span className="text-slate-400">
            {viewMode === "bloch" && "Each sphere maps one clinical feature to a quantum spin vector. Arrow length shows purity Tr(ρ²); it shrinks inside the unit sphere when entangled."}
            {viewMode === "entanglement" && "Glowing chords represent Quantum Mutual Information I(A:B). Thicker rose chords show strong non-linear medical risk correlations."}
            {viewMode === "circuit" && "Shows Hadamard superposition, Rz phase encoding, and CNOT entanglement gates with an animated traveling photon."}
            {viewMode === "hilbert" && "Displays 16 basis state probabilities. Cyan prisms = Even parity (Low Risk); Rose prisms = Odd parity (High Risk)."}
            {viewMode === "cockpit" && "Simultaneous view of single-qubit states alongside the inter-qubit correlation topology."}
          </span>
        </div>

        {/* Focus Qubit selector for Bloch */}
        {viewMode === "bloch" && (
          <div className="flex items-center space-x-1 text-[11px] font-mono">
            <span className="text-slate-400 mr-1 font-sans">Zoom:</span>
            <button
              onClick={() => setFocusQubit(null)}
              className={`px-2 py-0.5 rounded transition ${
                focusQubit === null ? "bg-teal-500 text-black font-bold" : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              All 4
            </button>
            {predictResult?.features_used.map((feat, idx) => (
              <button
                key={feat}
                onClick={() => setFocusQubit(idx)}
                className={`px-2 py-0.5 rounded transition ${
                  focusQubit === idx ? "bg-teal-500 text-black font-bold" : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                q{idx}:{feat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Main Workspace: 3D Viewport (Left) + Detailed Clinical Explainer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-hidden mt-1">
        {/* Left 3D Viewport */}
        <div className="lg:col-span-8 flex flex-col h-[520px] lg:h-full rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl relative bg-[#040814]">
          {/* Mouse Controls Hint */}
          <div className="absolute bottom-3 left-3 z-20 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono pointer-events-none">
            🖱️ Left Drag: Rotate 360° • Scroll: Zoom • Right Drag: Pan
          </div>

          <div className="w-full h-full relative">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-[#040814]">
                <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-300 font-mono">Simulating 4-Qubit Statevector...</p>
              </div>
            ) : predictResult ? (
              use2DFallback ? (
                /* 2D Fallback */
                <div className="w-full h-full bg-[#080d1a] p-6 overflow-y-auto space-y-4">
                  <h3 className="text-sm font-bold text-white font-mono">
                    2D State Density Matrix & Coordinates
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {predictResult.qubit_states.map((q, idx) => (
                      <div key={q.qubit} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-xs font-bold text-white mb-1">
                          q{q.qubit}: {predictResult.features_used[idx]}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 space-y-1">
                          <div>x: {q.bloch[0].toFixed(3)}</div>
                          <div>y: {q.bloch[1].toFixed(3)}</div>
                          <div>z: {q.bloch[2].toFixed(3)}</div>
                          <div className="text-teal-400 font-bold">
                            Purity: {(q.purity * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <QuantumObservatory
                  data={predictResult}
                  viewMode={viewMode}
                  focusQubit={focusQubit}
                  cameraPreset={cameraPreset}
                  autoRotate={autoRotate}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs bg-[#040814]">
                Loading quantum state...
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Risk Score Telemetry + Explicit Interpretation Engine */}
        <div className="lg:col-span-4 flex flex-col h-full space-y-3 overflow-y-auto pr-1">
          {/* Card 1: Computed Clinical Risk Score */}
          {predictResult && (
            <div className={`p-5 rounded-2xl border shadow-lg backdrop-blur-md transition-all ${
              isHighRisk
                ? "bg-rose-950/40 border-rose-800/80"
                : isMedRisk
                ? "bg-amber-950/40 border-amber-800/80"
                : "bg-teal-950/40 border-teal-800/80"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Calculated Risk Score
                </span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                  isHighRisk
                    ? "bg-rose-900/80 text-rose-200 border-rose-600 animate-cardiac-pulse"
                    : isMedRisk
                    ? "bg-amber-900/80 text-amber-200 border-amber-600"
                    : "bg-emerald-900/80 text-emerald-200 border-emerald-600"
                }`}>
                  {predictResult.risk_level.toUpperCase()} RISK
                </span>
              </div>

              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-4xl font-extrabold font-mono text-white">
                  {(predictResult.risk_probability * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400 font-medium">Event Probability</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-900/80 overflow-hidden my-2 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isHighRisk
                      ? "bg-gradient-to-r from-amber-500 via-rose-500 to-red-600"
                      : isMedRisk
                      ? "bg-gradient-to-r from-teal-400 via-yellow-400 to-amber-500"
                      : "bg-gradient-to-r from-teal-400 to-emerald-400"
                  }`}
                  style={{ width: `${Math.max(5, predictResult.risk_probability * 100)}%` }}
                />
              </div>

              {/* Clinical Implication Summary */}
              <div className="text-xs text-slate-300 leading-snug mt-2 pt-2 border-t border-slate-800/70">
                <strong>Clinical Implication: </strong>
                {isHighRisk && "Severe ischemic risk profile. Elevated chest pain combined with positive ST depression indicates >50% probability of coronary stenosis."}
                {isMedRisk && "Borderline cardiovascular stress. Elevated blood pressure and age warrant lifestyle intervention and regular monitoring."}
                {!isHighRisk && !isMedRisk && "Normal baseline hemodynamics with optimal resting heart rate. No acute ischemic risk detected."}
              </div>
            </div>
          )}

          {/* Card 2: Plain-English & Mathematical Rigorous Interpretation Engine */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wide">
                  Clinical & Quantum Interpretation Guide
                </h3>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 my-3 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-medium">
              <button
                onClick={() => setActiveTab("qubits")}
                className={`py-1.5 px-1 rounded-lg text-center transition ${
                  activeTab === "qubits" ? "bg-teal-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                1. Qubits
              </button>
              <button
                onClick={() => setActiveTab("entanglement")}
                className={`py-1.5 px-1 rounded-lg text-center transition ${
                  activeTab === "entanglement" ? "bg-teal-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                2. Entangle
              </button>
              <button
                onClick={() => setActiveTab("hilbert")}
                className={`py-1.5 px-1 rounded-lg text-center transition ${
                  activeTab === "hilbert" ? "bg-teal-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                3. 16 States
              </button>
              <button
                onClick={() => setActiveTab("math")}
                className={`py-1.5 px-1 rounded-lg text-center transition ${
                  activeTab === "math" ? "bg-teal-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                4. Math Form
              </button>
            </div>

            {/* Tab 1: Exact Qubit Names & Representations */}
            {activeTab === "qubits" && (
              <div className="text-xs text-slate-300 space-y-2.5 overflow-y-auto pr-1">
                <div className="text-[11px] text-slate-400 font-medium mb-1">
                  Each qubit encodes one clinical biomarker scaled to rotation angle θ:
                </div>
                {qubitDetails.map((q) => {
                  const angle = predictResult?.encoded_angles[q.index] ?? 0;
                  const purity = predictResult?.qubit_states[q.index]?.purity ?? 1.0;
                  return (
                    <div key={q.code} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex justify-between items-center font-bold text-white mb-1">
                        <span className="text-teal-400 font-mono">{q.code}: {q.title}</span>
                        <span className="font-mono text-cyan-300 text-[11px]">θ = {angle.toFixed(2)} rad</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mb-1.5 leading-snug">
                        {q.clinicalMeaning}
                      </p>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                        <span>Purity Tr(ρ²): {(purity * 100).toFixed(0)}%</span>
                        <span>{purity < 0.9 ? "Entangled with other vitals" : "Near Pure"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: What Entanglement Represents */}
            {activeTab === "entanglement" && (
              <div className="text-xs text-slate-300 space-y-2.5 overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">What does Entanglement mean here?</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    In medicine, clinical biomarkers rarely act in isolation. A patient with chest pain <em>and</em> ST depression has a risk far greater than the sum of the two individual symptoms.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">Pairwise Clinical Synergies:</div>
                  <ul className="text-[11px] space-y-1.5 text-slate-300">
                    <li>
                      <strong className="text-white">q0 ↔ q2 (Chest Pain + ST Depression):</strong> Acute Ischemic Synergy. Represents active coronary artery disease causing exercise-induced angina.
                    </li>
                    <li>
                      <strong className="text-white">q1 ↔ q3 (Heart Rate + Major Vessels):</strong> Vascular Hemodynamic Strain. Shows chronotropic incompetence linked to anatomical vessel blockage.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: What Hilbert 16 States Represent */}
            {activeTab === "hilbert" && (
              <div className="text-xs text-slate-300 space-y-2.5 overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">What are the 16 basis states (2⁴ = 16)?</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    With 4 qubits, the quantum wavefunction exists across 16 simultaneous states from |0000⟩ to |1111⟩:
                  </p>
                  <ul className="text-[11px] space-y-1.5 text-slate-300 mt-2 font-mono">
                    <li><strong className="text-teal-400">|0000⟩:</strong> All 4 biomarkers healthy (Low Risk).</li>
                    <li><strong className="text-rose-400">|1111⟩:</strong> All 4 biomarkers pathological (Critical Risk).</li>
                    <li><strong className="text-slate-400">|0101⟩, |1010⟩:</strong> Mixed intermediate clinical profiles.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">The Parity Rule:</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    • <strong className="text-cyan-400">Even Parity (Cyan):</strong> Sum of 1-bits is even → Projects toward Low Risk.<br />
                    • <strong className="text-rose-400">Odd Parity (Rose):</strong> Sum of 1-bits is odd → Projects toward High Risk.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: Realistic Mathematical Formulas */}
            {activeTab === "math" && (
              <div className="text-xs text-slate-300 space-y-2.5 overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">1. Unitary Feature Encoding:</div>
                  <div className="font-mono text-[11px] text-cyan-300 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    {"U_Φ(x) = exp( i ∑_{j=1}^4 ϕ_j(x_j) Z_j + i ∑_{j<k} ϕ_{jk}(x_j, x_k) Z_j Z_k )"}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    where ϕ<sub>j</sub>(x<sub>j</sub>) = 2x<sub>j</sub> and ϕ<sub>jk</sub>(x<sub>j</sub>, x<sub>k</sub>) = 2(π - x<sub>j</sub>)(π - x<sub>k</sub>).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">2. Variational Quantum Ansatz:</div>
                  <div className="font-mono text-[11px] text-cyan-300 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    {"|ψ(x, θ)⟩ = U_W(θ) · U_Φ(x) |0000⟩"}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    U<sub>W</sub>(θ) parameterized by 8 variational R<sub>y</sub> rotation weights over 2 entangling layers.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">3. Parity Observable Measurement:</div>
                  <div className="font-mono text-[11px] text-cyan-300 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    {"⟨M⟩ = ⟨ψ| Z₀ ⊗ Z₁ ⊗ Z₂ ⊗ Z₃ |ψ⟩ = ∑_{even} |c_k|² - ∑_{odd} |c_k|² ∈ [-1, +1]"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">4. Calibrated Clinical Risk:</div>
                  <div className="font-mono text-[11px] text-emerald-400 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    {"P(Risk = 1 | x) = σ( β · ⟨M⟩ ) = 1 / ( 1 + exp(-β · ⟨M⟩) )"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
