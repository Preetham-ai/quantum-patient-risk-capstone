"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, Eye, Database, FileText, CheckCircle2 } from "lucide-react";

export default function EthicsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-100">
      {/* Header */}
      <div className="pb-8 border-b border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Clinical Governance &amp; Responsible AI Framework</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Clinical Ethics, Limitations &amp; Governance
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Academic disclosure regarding medical disclaimers, demographic data representation, NISQ hardware limits, and quantum algorithmic auditability for Capstone PS #28.
        </p>
      </div>

      {/* Prominent Warning Callout */}
      <div className="my-8 p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 shadow-xl backdrop-blur-md">
        <div className="flex items-start space-x-3.5">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-white">
              Medical Device &amp; Diagnostic Disclaimer
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed mt-1.5">
              QuantumRisk is an academic research prototype developed strictly for Capstone 23CSE463 (Problem Statement #28). It is <strong>NOT</strong> an FDA-cleared, CE-marked, or clinically validated diagnostic medical device. It must never be used as the sole basis for clinical treatment, diagnosis, triage, or medication adjustment. Always consult qualified healthcare professionals for medical guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Four Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Pillar 1: Patient Privacy */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">1. Data Privacy &amp; Zero PHI Storage</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All experiments utilize publicly de-identified benchmarks: the UCI Cleveland Heart Disease dataset (303 records) and the NIH/NIDDK Pima Indians Diabetes dataset (768 records). No Protected Health Information (PHI) is ingested, tracked, or persisted in local storage or external databases. Inferences run transiently in volatile memory.
          </p>
        </div>

        {/* Pillar 2: Dataset Representation */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">2. Demographic Representation &amp; Bias</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Historical clinical datasets carry documented demographic sampling biases. The UCI Cleveland cohort reflects an older demographic with a high male-to-female ratio, while the Pima dataset is restricted to female patients of specific ancestry. Clinical models trained on localized cohorts cannot be generalized to broader multicultural patient cohorts without multi-center stratified calibration.
          </p>
        </div>

        {/* Pillar 3: NISQ Hardware Realities */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">3. NISQ Era Hardware Constraints</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Current quantum processors are Noisy Intermediate-Scale Quantum (NISQ) systems. Thermal relaxation (T₁), dephasing (T₂), two-qubit CNOT gate infidelities (~0.5%–1.5%), and shot variance cause expectation decay. The prototype explicitly models these physical noise channels in the Noise Lab to demonstrate why fault-tolerant QEC (Quantum Error Correction) is essential for mission-critical medical deployment.
          </p>
        </div>

        {/* Pillar 4: Explainability & Auditability */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">4. Transparent Feature Attribution</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To prevent black-box opacity in healthcare, QuantumRisk pairs every prediction with permutation feature importance, individual Bloch sphere rotation angles (θ<sub>j</sub> = 2x<sub>j</sub>), and mutual information entanglement matrices. This provides clinicians with auditable insights into which biomarkers drove the quantum expectation value.
          </p>
        </div>
      </div>

      {/* Governance Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl mt-10">
        <h3 className="text-base font-bold text-white mb-4">
          Regulatory &amp; Academic Checklist (23CSE463)
        </h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Stratified 5-Fold Cross-Validation ensures no data leakage between train and test splits.</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Honest comparison against 5 industry-standard classical machine learning baselines without cherry-picking.</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Deterministic random seeding (seed=42) across classical and quantum statevector samplers for reproducibility.</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Complete open-source codebase with automated unit test suite and local environment reproducibility.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
