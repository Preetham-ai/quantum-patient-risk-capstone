"use client";

import React from "react";
import { useQuantumStore } from "@/lib/store";
import { VerdictRing } from "./VerdictRing";
import { GlassPanel } from "../ui/GlassPanel";
import { ShieldCheck, TrendingUp, Cpu, Info } from "lucide-react";
import { getRiskColor } from "@/lib/tokens";

export function RightRail() {
  const { act, mode, result } = useQuantumStore();

  const isRevealed = act === 5 || mode === "explore";
  const probability = result.risk_probability;
  const riskLevel = result.risk_level;
  const riskColor = getRiskColor(riskLevel);

  // Top 3 clinical drivers from explanation
  const driverEntries = Object.entries(result.explanation || {})
    .slice(0, 3)
    .map(([name, impact]) => ({
      name,
      impact: Math.round(impact * 100),
      isAdverse: impact > 0,
    }));

  return (
    <aside className="w-full lg:w-[320px] shrink-0 flex flex-col space-y-4">
      <GlassPanel
        className={`transition-all duration-700 ${
          isRevealed ? "border-hairline-strong" : "opacity-75"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-signal" />
            <h3 className="font-serif font-bold text-sm text-bone">Collective Verdict</h3>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isRevealed
                ? "bg-surface-2 text-bone/90 border border-hairline font-bold"
                : "bg-amber-signal/10 text-amber-signal animate-pulse"
            }`}
          >
            {isRevealed ? "Decided" : "Interrogating..."}
          </span>
        </div>

        {/* Verdict Ring */}
        <div className="flex flex-col items-center justify-center my-2">
          <VerdictRing
            probability={probability}
            riskLevel={riskLevel}
            isRevealed={isRevealed}
            size={136}
            strokeWidth={9}
          />

          {isRevealed && (
            <div className="mt-3 text-center">
              <span className="text-[11px] font-mono text-bone/50 block">
                95% Credible Interval:
              </span>
              <span className="text-xs font-mono font-bold text-bone">
                {Math.round(result.ci[0] * 100)}% – {Math.round(result.ci[1] * 100)}%
                <span className="text-bone/40 text-[10px] ml-1">
                  (±{Math.round(((result.ci[1] - result.ci[0]) / 2) * 100)}%)
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Top 3 Biomarker Drivers */}
        <div className="mt-6 pt-4 border-t border-hairline space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-bone/60">
            <span>Primary Risk Drivers</span>
            <span>Weight</span>
          </div>

          {driverEntries.map((d) => (
            <div key={d.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-bone/80 text-[11px] truncate max-w-[190px]" title={d.name}>
                  {d.name}
                </span>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    d.isAdverse ? "text-risk-high" : "text-risk-low"
                  }`}
                >
                  {d.isAdverse ? `+${d.impact}%` : `${d.impact}%`}
                </span>
              </div>
              <div className="w-full h-1 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.abs(d.impact) * 2)}%`,
                    backgroundColor: d.isAdverse ? "var(--risk-high)" : "var(--risk-low)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quantum vs Classical Model Mini-Bars */}
        <div className="mt-6 pt-4 border-t border-hairline space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-bone/60">
            <span>Model Comparison</span>
            <span>Params</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* VQC */}
            <div className="p-2 rounded-lg bg-surface-2/60 border border-hairline">
              <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                <span className="text-amber-signal font-bold">VQC (Quantum)</span>
                <span className="text-bone/40">8 params</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-bone/70">Risk Estimate:</span>
                <span className="font-bold text-bone">
                  {Math.round(result.risk_probability * 100)}%
                </span>
              </div>
            </div>

            {/* Random Forest */}
            <div className="p-2 rounded-lg bg-surface-2/60 border border-hairline">
              <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                <span className="text-bone font-medium">Random Forest</span>
                <span className="text-bone/40">~12k params</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-bone/70">Risk Estimate:</span>
                <span className="font-bold text-bone">
                  {Math.round((result.baselines?.rf ?? 0.6) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </aside>
  );
}
