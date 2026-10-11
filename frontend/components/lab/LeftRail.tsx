"use client";

import React, { useState } from "react";
import { useQuantumStore } from "@/lib/store";
import { GlassPanel } from "../ui/GlassPanel";
import { Button } from "../ui/Button";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  User,
  Activity,
  Edit3,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export function LeftRail() {
  const { act, mode, vitals, setIsEditDrawerOpen, selectedSample } = useQuantumStore();
  const [whyOpen, setWhyOpen] = useState(false);

  const actContent = {
    1: {
      number: "Act 1",
      title: "The Patient",
      headline: "Four clinical biomarkers describe this patient's cardiovascular system.",
      why: "Instead of treating patient symptoms in isolation, non-invasive clinical biomarkers are extracted as high-dimensional continuous features for quantum feature mapping.",
    },
    2: {
      number: "Act 2",
      title: "Feature Encoding",
      headline: "Each biomarker angle rotates a simulated qubit onto the Bloch sphere.",
      why: "Continuous features are scaled into rotation angles θ_j ∈ [0, π]. Pure states sit on the unit sphere surface with Tr(ρ²) = 1.0.",
    },
    3: {
      number: "Act 3",
      title: "Biomarker Synergy",
      headline: "Entangling CNOT gates model how clinical symptoms amplify one another.",
      why: "Chest pain and ECG ST depression correlate non-linearly. The ZZ entangler builds quantum mutual information I(A:B), causing subsystem purity to contract inward.",
    },
    4: {
      number: "Act 4",
      title: "State Collapse",
      headline: "The 16 basis states rise into a Hilbert distribution, collapsing under parity measurement.",
      why: "A 4-qubit register creates 2⁴ = 16 basis states. Measuring parity ⟨Z₀Z₁Z₂Z₃⟩ splits states into even (low risk) and odd (high risk) projections.",
    },
    5: {
      number: "Act 5",
      title: "The Verdict",
      headline: "Quantum expectation values deliver a calibrated collective risk probability.",
      why: "A sigmoidal readout σ(β⟨M⟩ + α) transforms the parity observable into a bounded probability with 95% credible intervals.",
    },
  }[act];

  const biomarkerList = [
    {
      code: "q0",
      label: "Chest Pain Type",
      val: vitals.cp ?? 2,
      unit: "grade (0-3)",
      note: "Ischemic angina severity",
    },
    {
      code: "q1",
      label: "Max Heart Rate",
      val: vitals.thalach ?? 145,
      unit: "bpm",
      note: "Peak treadmill chronotropic response",
    },
    {
      code: "q2",
      label: "ST Depression",
      val: vitals.oldpeak ?? 1.4,
      unit: "mm",
      note: "Electrocardiographic subendocardial ischemia",
    },
    {
      code: "q3",
      label: "Major Vessels",
      val: vitals.ca ?? 1,
      unit: "count",
      note: "Fluoroscopy vessel stenosis",
    },
  ];

  return (
    <aside className="w-full lg:w-[360px] shrink-0 flex flex-col space-y-4">
      <GlassPanel>
        {/* Act Header */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-signal/10 border border-amber-signal/30 text-amber-signal font-semibold">
              {mode === "story" ? `${actContent.number} of 5` : "Explore Mode"}
            </span>
            <span className="text-[11px] font-mono text-bone/40 uppercase">
              Cohort: {selectedSample}
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-bone mt-2">
            {mode === "story" ? actContent.title : "Interactive Laboratory"}
          </h2>
          <p className="font-serif italic text-sm text-bone/80 leading-snug pt-1">
            &ldquo;{mode === "story" ? actContent.headline : "Modify biomarkers, examine quantum state changes, or test noise robustness."}&rdquo;
          </p>
        </div>

        {/* Why? Expandable Drawer */}
        <div className="border-t border-hairline pt-3 mb-4">
          <button
            onClick={() => setWhyOpen(!whyOpen)}
            className="w-full flex items-center justify-between text-xs text-bone/60 hover:text-amber-signal font-mono transition py-1"
          >
            <div className="flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Clinical &amp; Quantum Rationale</span>
            </div>
            {whyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {whyOpen && (
            <p className="mt-2 text-xs text-bone/70 leading-relaxed p-3 rounded-xl bg-surface-2/60 border border-hairline">
              {actContent.why}
            </p>
          )}
        </div>

        {/* Patient Dossier (4 Biomarkers) */}
        <div className="border-t border-hairline pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-bone flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-amber-signal" />
              <span>Active Biomarker Dossier</span>
            </span>
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="text-[11px] font-mono text-amber-signal hover:underline flex items-center space-x-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {biomarkerList.map((b) => (
              <div
                key={b.code}
                className="p-2.5 rounded-xl bg-surface-2/60 border border-hairline hover:border-hairline-strong transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-amber-signal/90 font-bold">{b.code}</span>
                  <span className="font-mono-numbers font-bold text-bone text-xs">
                    {b.val} <span className="text-[10px] text-bone/40">{b.unit}</span>
                  </span>
                </div>
                <div className="text-[10px] text-bone/70 font-medium truncate mt-1">
                  {b.label}
                </div>
                <div className="text-[9px] text-bone/40 truncate">
                  {b.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>
    </aside>
  );
}
