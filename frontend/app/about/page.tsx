"use client";

import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  ShieldCheck,
  AlertTriangle,
  Database,
  Cpu,
  Eye,
  CheckCircle2,
  BookOpen,
  FileText,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 text-bone">
      {/* Header */}
      <div className="space-y-3 pb-8 border-b border-hairline">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-signal/10 border border-amber-signal/30 text-amber-signal text-xs font-mono font-medium">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Capstone 23CSE463 • Problem Statement #28</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-bone">
          Methodology, Clinical Governance &amp; Model Card
        </h1>
        <p className="text-sm text-bone/70 max-w-2xl leading-relaxed">
          Comprehensive academic disclosure regarding hybrid quantum machine learning architectures, de-identified clinical cohorts, physical NISQ boundaries, and responsible healthcare AI governance.
        </p>
      </div>

      {/* Prominent Medical Device Disclaimer */}
      <div className="p-5 rounded-2xl bg-surface-2 border border-amber-signal/40 text-bone shadow-xl">
        <div className="flex items-start space-x-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-signal shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-sm text-amber-signal">
              Medical Device Disclaimer (Investigational Use Only)
            </h3>
            <p className="text-xs text-bone/80 leading-relaxed">
              QuantumRisk is an academic prototype developed strictly for Capstone 23CSE463. It is <strong>not</strong> an FDA-cleared, CE-marked, or clinically validated diagnostic medical device. It should never be used as the sole basis for clinical treatment, diagnosis, triage, or medication adjustment. Always consult qualified healthcare professionals for medical guidance.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Patient Privacy */}
        <GlassPanel className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-hairline flex items-center justify-center text-amber-signal">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-bone">
            1. Zero PHI Storage &amp; De-identified Data
          </h3>
          <p className="text-xs text-bone/70 leading-relaxed">
            All training and evaluation utilizes publicly de-identified benchmarks: the UCI Cleveland Heart Disease dataset (303 records) and the NIH/NIDDK Pima Indians Diabetes dataset (768 records). No Protected Health Information (PHI) is persisted on disk or transmitted across untrusted networks.
          </p>
        </GlassPanel>

        {/* Pillar 2: Representational Bias */}
        <GlassPanel className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-hairline flex items-center justify-center text-amber-signal">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-bone">
            2. Demographic Cohort Sampling Limits
          </h3>
          <p className="text-xs text-bone/70 leading-relaxed">
            Historical cohorts contain known demographic biases: the UCI Cleveland dataset reflects an older male-predominant cohort, while the Pima dataset reflects female patients of specific ancestry. Clinical models trained on localized cohorts cannot be generalized to broader populations without multi-center stratified calibration.
          </p>
        </GlassPanel>

        {/* Pillar 3: Physical NISQ Hardware Constraints */}
        <GlassPanel className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-hairline flex items-center justify-center text-amber-signal">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-bone">
            3. Simulated vs. Physical NISQ Hardware
          </h3>
          <p className="text-xs text-bone/70 leading-relaxed">
            Calculations run via exact statevector quantum simulation on Qiskit Aer. Real superconducting QPUs experience thermal relaxation (T₁), dephasing (T₂), and gate infidelities (~0.8%–1.4%). The prototype models these depolarizing channels in the Benchmarks laboratory.
          </p>
        </GlassPanel>

        {/* Pillar 4: Transparent Feature Attribution */}
        <GlassPanel className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-hairline flex items-center justify-center text-amber-signal">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-bone">
            4. Explainability &amp; Feature Attribution
          </h3>
          <p className="text-xs text-bone/70 leading-relaxed">
            To prevent black-box opacity in healthcare, QuantumRisk pairs every prediction with individual Bloch sphere rotation angles (θ = 2x), mutual information entanglement matrices, and counterfactual intervention guidelines.
          </p>
        </GlassPanel>
      </div>

      {/* Model Card Specification */}
      <GlassPanel className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-bone">
          Academic Model Card Specification (PS #28)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-1">
            <span className="text-bone/40 block">Architecture:</span>
            <span className="font-bold text-bone">Variational Quantum Classifier (VQC)</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-1">
            <span className="text-bone/40 block">Feature Dimension:</span>
            <span className="font-bold text-bone">4 simulated qubits (2⁴ = 16 Hilbert states)</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-1">
            <span className="text-bone/40 block">Feature Map Unitary:</span>
            <span className="font-bold text-bone">ZZFeatureMap (linear entanglement, reps=2)</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-1">
            <span className="text-bone/40 block">Ansatz:</span>
            <span className="font-bold text-bone">RealAmplitudes (2 layers, 8 parameters)</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-1">
            <span className="text-bone/40 block">Measurement Operator:</span>
            <span className="font-bold text-bone">Parity Observable ⟨Z₀ ⊗ Z₁ ⊗ Z₂ ⊗ Z₃⟩</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-1">
            <span className="text-bone/40 block">Calibration:</span>
            <span className="font-bold text-bone">Sigmoidal risk mapping σ(β⟨M⟩ + α)</span>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
