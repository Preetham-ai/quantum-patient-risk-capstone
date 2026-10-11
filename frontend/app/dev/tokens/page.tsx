"use client";

import React from "react";
import { tokens } from "@/lib/tokens";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatNumber } from "@/components/ui/StatNumber";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";

export default function DevTokensPage() {
  const colorSwatches = [
    { name: "ink", value: tokens.colors.ink, text: "text-bone" },
    { name: "bone", value: tokens.colors.bone, text: "text-ink" },
    { name: "amber.signal", value: tokens.colors.amber.signal, text: "text-ink" },
    { name: "risk.low (sage)", value: tokens.colors.risk.low, text: "text-ink" },
    { name: "risk.med (amber)", value: tokens.colors.risk.med, text: "text-ink" },
    { name: "risk.high (vermilion)", value: tokens.colors.risk.high, text: "text-bone" },
    { name: "surface.1", value: tokens.colors.surface[1], text: "text-bone" },
    { name: "surface.2", value: tokens.colors.surface[2], text: "text-bone" },
    { name: "surface.3", value: tokens.colors.surface[3], text: "text-bone" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <SectionTitle
        eyebrow="QuantumRisk v2 System"
        title="Design Tokens & Component Verification"
        description="Strict palette enforcement: ink black, warm bone, signal amber, 3 risk tiers (sage, amber, vermilion), and 3 surface levels."
      />

      {/* Colors */}
      <GlassPanel>
        <h3 className="font-serif font-bold text-lg mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {colorSwatches.map((s) => (
            <div
              key={s.name}
              className="p-3 rounded-xl border border-hairline flex flex-col justify-between h-24"
              style={{ backgroundColor: s.value }}
            >
              <span className={`text-xs font-mono font-bold ${s.text}`}>{s.name}</span>
              <span className={`text-[10px] font-mono ${s.text} opacity-80`}>{s.value}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Typography & Stats */}
      <GlassPanel>
        <h3 className="font-serif font-bold text-lg mb-4">Typography & Tabular Numbers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatNumber label="VQC AUROC" value="81.2%" size="lg" color="text-risk-low" />
          <StatNumber label="Circuit Parameters" value="8" unit="params" size="lg" color="text-amber-signal" />
          <StatNumber label="Active Risk Verdict" value="73%" unit="High" size="lg" color="text-risk-high" />
          <StatNumber label="Inference Latency" value="14.2" unit="ms" size="lg" color="text-bone" />
        </div>
      </GlassPanel>

      {/* Base Buttons */}
      <GlassPanel>
        <h3 className="font-serif font-bold text-lg mb-4">Button System</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary Amber</Button>
          <Button variant="outline">Outline Surface</Button>
          <Button variant="ghost">Ghost Nav</Button>
          <Button variant="danger">High Risk Alert</Button>
        </div>
      </GlassPanel>
    </div>
  );
}
