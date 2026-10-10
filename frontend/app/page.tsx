"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Activity,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Compass,
  Network,
  Binary,
  Radio,
  HeartPulse,
  Stethoscope,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"bloch" | "entanglement" | "baselines">("bloch");

  return (
    <div className="relative overflow-hidden text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono mb-8 shadow-sm">
            <HeartPulse className="w-4 h-4 text-teal-400" />
            <span className="font-semibold">Capstone 23CSE463 • Problem Statement #28</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Hybrid Quantum Machine Learning</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Quantum Machine Learning for{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Clinical Patient Risk Stratification
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Translating patient clinical biomarkers into entangled quantum states across a 16-dimensional (2⁴ = 16) Hilbert space.
            Comparing <strong className="text-teal-400 font-semibold">Variational Quantum Classifiers (VQC)</strong>,{" "}
            <strong className="text-cyan-400 font-semibold">Quantum SVM (Fidelity Kernel)</strong>, and{" "}
            <strong className="text-indigo-400 font-semibold">PennyLane Hybrid QNN</strong> against 5 classical baselines with an interactive 3D state observatory.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/lab"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition flex items-center justify-center space-x-2"
            >
              <Cpu className="w-4 h-4 text-slate-950" />
              <span>Launch 3D Quantum Lab</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/intake"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 text-slate-200 font-semibold text-sm transition flex items-center justify-center space-x-2 shadow-sm hover:border-teal-500/50"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Patient Intake Form</span>
            </Link>

            <Link
              href="/compare"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 text-slate-300 font-medium text-sm transition flex items-center justify-center space-x-2 shadow-sm hover:border-indigo-500/50"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>5-Fold Benchmarks</span>
            </Link>
          </div>
        </div>

        {/* Problem Statement Mathematical Foundations Card */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-2xl backdrop-blur-md">
          {/* Tab Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>The 3 Core Quantum Principles of PS #28</span>
            </span>

            <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("bloch")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "bloch"
                    ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                1. Feature Encoding
              </button>
              <button
                onClick={() => setActiveTab("entanglement")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "entanglement"
                    ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                2. Biomarker Synergy
              </button>
              <button
                onClick={() => setActiveTab("baselines")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "baselines"
                    ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                3. Parameter Efficiency
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === "bloch" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                    <Compass className="w-5 h-5 text-teal-400" />
                    <span>ZZFeatureMap Unitary Encoding</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Continuous clinical measurements (x ∈ ℝ⁴: Chest Pain, Max Heart Rate, ST Depression, Major Vessels) 
                    are min-max scaled into [0, π] radians. Non-linear feature interactions are generated via second-order Pauli couplings Z<sub>j</sub> ⊗ Z<sub>k</sub>.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Single-Qubit Purity</div>
                      <div className="text-teal-400 font-bold mt-0.5">Tr(ρ<sub>j</sub>²) = 1.0 (Pure)</div>
                      <div className="text-[10px] text-slate-500 mt-1">Surface of Bloch sphere</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Mixed Subsystem</div>
                      <div className="text-rose-400 font-bold mt-0.5">Tr(ρ<sub>j</sub>²) &lt; 1.0 (Entangled)</div>
                      <div className="text-[10px] text-slate-500 mt-1">Vector contracts inward</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                  <div className="text-slate-500 text-[11px]">// Second-Order Quantum Feature Map</div>
                  <div className="text-teal-300 font-semibold p-2.5 rounded-lg bg-teal-950/30 border border-teal-900/50 overflow-x-auto text-[11px]">
                    {"U_Φ(x) = exp( i ∑_{j=1}^4 x_j Z_j + i ∑_{j<k} (π - x_j)(π - x_k) Z_j Z_k ) · H^⊗4"}
                  </div>
                  <div className="text-slate-500 text-[11px] pt-1">// Hermitian Parity Observable &amp; Measurement</div>
                  <div className="text-cyan-300 font-semibold p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/50 overflow-x-auto text-[11px]">
                    {"⟨M⟩ = ⟨ψ(x,θ)| Z₀ ⊗ Z₁ ⊗ Z₂ ⊗ Z₃ |ψ(x,θ)⟩ ∈ [-1, +1]"}
                  </div>
                  <div className="text-slate-500 text-[11px] pt-1">// Sigmoidal Clinical Risk Calibration</div>
                  <div className="text-emerald-300 font-semibold p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 overflow-x-auto text-[11px]">
                    {"P(Risk = 1 | x) = σ( β ⟨M⟩ + α ) = 1 / ( 1 + exp(-(β ⟨M⟩ + α)) )"}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "entanglement" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                    <Network className="w-5 h-5 text-indigo-400" />
                    <span>von Neumann Mutual Information I(A:B)</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    In cardiovascular pathology, disease markers act synergistically rather than independently. 
                    The parameterized entangling ansatz creates non-separable bipartite density matrices ρ<sub>AB</sub> ≠ ρ<sub>A</sub> ⊗ ρ<sub>B</sub>, 
                    quantified directly via quantum mutual information.
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs">
                    <span className="text-slate-400 block mb-1 text-[11px]">Rigorous Mutual Information Formula:</span>
                    <span className="text-indigo-300 font-bold">{"I(A:B) = S(ρ_A) + S(ρ_B) - S(ρ_AB)"}</span>
                    <span className="text-[10px] text-slate-500 block mt-1">{"where S(ρ) = -Tr(ρ log₂ ρ) is von Neumann entropy"}</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-center space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">q₀ ↔ q₂ (Chest Pain : ST Depression)</span>
                      <span className="text-rose-400 font-bold">I = 0.64 (High Synergy)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" style={{ width: "64%" }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">ECG ST downsloping amplifies clinical significance of angina</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">q₁ ↔ q₃ (Max HR : Major Fluoroscopy Vessels)</span>
                      <span className="text-cyan-400 font-bold">I = 0.48 (Moderate Synergy)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full" style={{ width: "48%" }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Low peak chronotropic stress corroborates multi-vessel stenosis</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "baselines" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-teal-400" />
                    <span>Extreme Parameter Compression</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    The Variational Quantum Classifier achieves <strong className="text-teal-400 font-bold">&gt;81% AUROC with only 8 parameters</strong>, 
                    whereas classical Random Forest requires ~12,000 parameters across 100 bagged trees. 
                    This 1,500x parameter compression demonstrates the representational density of Hilbert space.
                  </p>
                  <Link
                    href="/compare"
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                  >
                    <span>View Complete 8-Model Leaderboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <span className="text-slate-200 font-bold">VQC (2 Layers RealAmplitudes)</span>
                    <span className="text-teal-400 font-bold">8 params • 81.2% AUROC</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <span className="text-slate-200 font-bold">PennyLane Hybrid QNN</span>
                    <span className="text-cyan-400 font-bold">60 params • 84.1% AUROC</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <span className="text-slate-200 font-bold">Quantum SVM (Fidelity Kernel)</span>
                    <span className="text-indigo-400 font-bold">O(N²) kernel • 83.5% AUROC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Random Forest (100 Trees)</span>
                    <span className="text-emerald-400 font-medium">~12,000 params • 88.4% AUROC</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Link
            href="/lab"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/90 transition group flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1.5">3D Quantum Lab</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bloch Observatory, Entanglement Topology, Circuit Flow, and 16-state Hilbert prisms with turntable rotation.
              </p>
            </div>
            <div className="text-xs font-semibold text-teal-400 flex items-center space-x-1 mt-5">
              <span>Launch Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/intake"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition group flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1.5">Patient Intake</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adjust clinical vitals or load test benchmark profiles (Heart &amp; Diabetes cohorts) with direct medical context.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1 mt-5">
              <span>Input Vitals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/noise"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition group flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1.5">Noise Lab</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulate depolarizing Kraus error channels and finite measurement shot variance on real IBM QPUs.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-400 flex items-center space-x-1 mt-5">
              <span>Simulate Noise</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/compare"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition group flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1.5">Model Benchmarks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                5-Fold cross-validation comparison across 8 quantum &amp; classical architectures with parameter audit.
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-400 flex items-center space-x-1 mt-5">
              <span>View Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
