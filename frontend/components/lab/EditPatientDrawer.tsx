"use client";

import React from "react";
import { useQuantumStore } from "@/lib/store";
import { X, RefreshCw, UserCheck, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

export function EditPatientDrawer() {
  const {
    isEditDrawerOpen,
    setIsEditDrawerOpen,
    vitals,
    updateVital,
    selectSample,
    selectedSample,
  } = useQuantumStore();

  if (!isEditDrawerOpen) return null;

  const features = [
    { key: "cp", label: "Chest Pain Type", min: 0, max: 3, step: 1, unit: "class (0: None, 3: Severe)" },
    { key: "thalach", label: "Max Heart Rate Achieved", min: 70, max: 210, step: 1, unit: "bpm" },
    { key: "oldpeak", label: "ST Depression (Exercise)", min: 0.0, max: 6.0, step: 0.1, unit: "mm" },
    { key: "ca", label: "Major Vessels (Fluoroscopy)", min: 0, max: 3, step: 1, unit: "vessels" },
    { key: "trestbps", label: "Resting Blood Pressure", min: 90, max: 200, step: 1, unit: "mmHg" },
    { key: "chol", label: "Serum Cholesterol", min: 120, max: 400, step: 1, unit: "mg/dL" },
    { key: "age", label: "Patient Age", min: 25, max: 80, step: 1, unit: "years" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsEditDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-surface-1 border-l border-hairline shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10 text-bone">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
            <div>
              <span className="text-[11px] font-mono text-amber-signal uppercase tracking-wider font-semibold">
                Patient Dossier Editor
              </span>
              <h3 className="font-serif font-bold text-xl text-bone">
                Adjust Clinical Biomarkers
              </h3>
            </div>
            <button
              onClick={() => setIsEditDrawerOpen(false)}
              className="p-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-hairline text-bone transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="mb-6 space-y-2">
            <label className="text-xs font-mono text-bone/60">Load Clinical Preset:</label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                onClick={() => selectSample("low")}
                className={`p-2 rounded-xl border text-center transition ${
                  selectedSample === "low"
                    ? "bg-risk-low/20 border-risk-low text-risk-low font-bold"
                    : "bg-surface-2 border-hairline text-bone/60 hover:text-bone"
                }`}
              >
                Low Risk
              </button>
              <button
                onClick={() => selectSample("medium")}
                className={`p-2 rounded-xl border text-center transition ${
                  selectedSample === "medium"
                    ? "bg-risk-med/20 border-risk-med text-risk-med font-bold"
                    : "bg-surface-2 border-hairline text-bone/60 hover:text-bone"
                }`}
              >
                Med Risk
              </button>
              <button
                onClick={() => selectSample("high")}
                className={`p-2 rounded-xl border text-center transition ${
                  selectedSample === "high"
                    ? "bg-risk-high/20 border-risk-high text-risk-high font-bold"
                    : "bg-surface-2 border-hairline text-bone/60 hover:text-bone"
                }`}
              >
                High Risk
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {features.map((f) => {
              const val = vitals[f.key] ?? f.min;
              return (
                <div key={f.key} className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-bone">{f.label}</span>
                    <span className="text-amber-signal font-bold">
                      {val} {f.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={val}
                    onChange={(e) => updateVital(f.key, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-amber-signal"
                  />
                  <div className="flex justify-between text-[10px] text-bone/40 font-mono">
                    <span>Min: {f.min}</span>
                    <span>Max: {f.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-hairline">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setIsEditDrawerOpen(false)}
          >
            Apply to Quantum State &amp; Close
          </Button>
        </div>
      </div>
    </div>
  );
}
