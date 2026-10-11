"use client";

import React from "react";
import { useQuantumStore } from "@/lib/store";
import { GlassPanel } from "../ui/GlassPanel";
import { Button } from "../ui/Button";
import {
  Sliders,
  ShieldCheck,
  Radio,
  Printer,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

export function ExplorePanel() {
  const {
    vitals,
    updateVital,
    result,
    shots,
    setShots,
    noiseLevel,
    setNoiseLevel,
  } = useQuantumStore();

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const sliders = [
    { key: "cp", label: "Chest Pain Type", min: 0, max: 3, step: 1, unit: "class" },
    { key: "thalach", label: "Max Heart Rate", min: 70, max: 210, step: 1, unit: "bpm" },
    { key: "oldpeak", label: "ST Depression", min: 0.0, max: 6.0, step: 0.1, unit: "mm" },
    { key: "ca", label: "Major Vessels", min: 0, max: 3, step: 1, unit: "vessels" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* 1. What-If Sliders */}
      <GlassPanel className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-signal">
          <Sliders className="w-3.5 h-3.5" />
          <span>Real-Time What-If Sliders</span>
        </div>
        <p className="text-[11px] text-bone/60 leading-tight">
          Adjust values to watch the 3D quantum Bloch angles and Hilbert probabilities recompute in real time.
        </p>

        <div className="space-y-3 pt-2">
          {sliders.map((s) => {
            const val = vitals[s.key] ?? s.min;
            return (
              <div key={s.key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-bone/80">{s.label}</span>
                  <span className="text-amber-signal font-bold">
                    {val} {s.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={val}
                  onChange={(e) => updateVital(s.key, parseFloat(e.target.value))}
                  className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-amber-signal"
                />
              </div>
            );
          })}
        </div>
      </GlassPanel>

      {/* 2. Counterfactual Analysis Card */}
      <GlassPanel className="space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-risk-low">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Counterfactual Intervention</span>
          </div>
          <p className="text-[11px] text-bone/60 leading-tight mt-1">
            Algorithmically computed smallest vitals adjustment that alters risk classification.
          </p>

          <div className="mt-4 p-3 rounded-xl bg-surface-2/80 border border-hairline text-xs leading-relaxed text-bone/80">
            {result.counterfactual ||
              "Patient is in low-risk boundaries. Standard cardiac monitoring advised."}
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handlePrint}
            icon={<Printer className="w-3.5 h-3.5 text-amber-signal" />}
          >
            Export Clinical Report (PDF)
          </Button>
        </div>
      </GlassPanel>

      {/* 3. Noise & Shot Uncertainty */}
      <GlassPanel className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-bone">
          <Radio className="w-3.5 h-3.5 text-amber-signal" />
          <span>NISQ Noise &amp; Shot Variance</span>
        </div>
        <p className="text-[11px] text-bone/60 leading-tight">
          Test thermal relaxation decoherence (T₁, T₂) and measurement variance on real QPUs.
        </p>

        <div className="space-y-3 pt-2 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-bone/70">Error Rate:</span>
              <span className="text-amber-signal font-bold">{(noiseLevel * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={0.08}
              step={0.005}
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-amber-signal"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-bone/70">Shot Budget:</span>
              <span className="text-amber-signal font-bold">{shots} shots</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              {[128, 512, 1024, 4096].map((s) => (
                <button
                  key={s}
                  onClick={() => setShots(s)}
                  className={`py-1 rounded border text-center transition ${
                    shots === s
                      ? "bg-amber-signal/20 border-amber-signal text-amber-signal font-bold"
                      : "bg-surface-2 border-hairline text-bone/50 hover:text-bone"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
