"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuantumStore } from "@/lib/store";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  HeartPulse,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatNumber } from "@/components/ui/StatNumber";

export default function LandingPage() {
  const router = useRouter();
  const { selectSample, setAct, setMode } = useQuantumStore();

  const handleLaunchSample = (sample: "low" | "medium" | "high") => {
    selectSample(sample);
    setAct(1);
    setMode("story");
    router.push("/lab");
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto px-6 py-12 lg:py-16 text-bone space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Course Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface-2 border border-hairline text-amber-signal text-xs font-mono font-medium shadow-sm">
          <HeartPulse className="w-3.5 h-3.5 text-amber-signal" />
          <span>Capstone 23CSE463 • Problem Statement #28</span>
          <span className="text-bone/30">•</span>
          <span className="text-bone/80">Simulated 4-Qubit Exact Statevector</span>
        </div>

        {/* Hero Title in Fraunces display serif */}
        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-bone leading-[1.12]">
          Quantum Machine Learning for{" "}
          <span className="text-amber-signal italic">
            Clinical Patient Risk Stratification
          </span>
        </h1>

        {/* Concise Pitch */}
        <p className="text-base sm:text-lg text-bone/70 max-w-2xl mx-auto leading-relaxed">
          Four clinical biomarkers are mapped to single-qubit rotations and entangled across a 16-dimensional Hilbert space. Experience a 5-act decision story culminating in a collective quantum risk verdict.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleLaunchSample("medium")}
            icon={<Compass className="w-4 h-4 text-ink" />}
          >
            Start the 5-Act Story
          </Button>

          <Link href="/benchmarks">
            <Button variant="outline" size="lg" icon={<Layers className="w-4 h-4 text-bone/70" />}>
              5-Fold Benchmarks
            </Button>
          </Link>
        </div>
      </section>

      {/* Pre-loaded Sample Patient Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-bone/60 uppercase tracking-wider">
            Launch with Sample Cohort Patient:
          </span>
          <span className="text-[11px] font-mono text-amber-signal">
            Instant live simulation — no empty state
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Patient Low */}
          <GlassPanel
            className="hover:border-risk-low/60 transition group cursor-pointer flex flex-col justify-between"
            onClick={() => handleLaunchSample("low")}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-risk-low px-2 py-0.5 rounded bg-risk-low/10 border border-risk-low/30">
                  Cohort A: Low Risk (18%)
                </span>
                <span className="text-[11px] font-mono text-bone/40">42 yrs</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-bone group-hover:text-amber-signal transition">
                Optimal Biomarkers
              </h3>
              <p className="text-xs text-bone/60 leading-relaxed">
                Normotensive, robust treadmill chronotropic response (168 bpm), isoelectric ST segment (0.2 mm), and patent coronary arteries.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-risk-low">
              <span>Inspect Quantum State</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassPanel>

          {/* Patient Medium */}
          <GlassPanel
            className="hover:border-amber-signal/60 transition group cursor-pointer flex flex-col justify-between border-amber-signal/30 bg-surface-2/70"
            onClick={() => handleLaunchSample("medium")}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-signal px-2 py-0.5 rounded bg-amber-signal/10 border border-amber-signal/30">
                  Cohort B: Medium Risk (52%)
                </span>
                <span className="text-[11px] font-mono text-bone/40">58 yrs</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-bone group-hover:text-amber-signal transition">
                Borderline Hypertension
              </h3>
              <p className="text-xs text-bone/60 leading-relaxed">
                Stage 1 systolic pressure (138 mmHg), moderate ST depression (1.4 mm), and single vessel fluoroscopy calcification.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-amber-signal">
              <span>Inspect Quantum State</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassPanel>

          {/* Patient High */}
          <GlassPanel
            className="hover:border-risk-high/60 transition group cursor-pointer flex flex-col justify-between"
            onClick={() => handleLaunchSample("high")}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-risk-high px-2 py-0.5 rounded bg-risk-high/10 border border-risk-high/30">
                  Cohort C: High Risk (78%)
                </span>
                <span className="text-[11px] font-mono text-bone/40">65 yrs</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-bone group-hover:text-amber-signal transition">
                Active Exertional Ischemia
              </h3>
              <p className="text-xs text-bone/60 leading-relaxed">
                Severe exercise-induced ST depression (3.2 mm), multi-vessel stenosis (3 vessels), and blunted chronotropic capacity (112 bpm).
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-risk-high">
              <span>Inspect Quantum State</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Key Numbers & Parameter Efficiency */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <GlassPanel>
          <StatNumber
            label="Quantum Model Parameters"
            value="8"
            unit="rotations"
            color="text-amber-signal"
            size="lg"
          />
          <p className="text-[11px] text-bone/50 mt-1">
            2 RealAmplitudes layers
          </p>
        </GlassPanel>

        <GlassPanel>
          <StatNumber
            label="Hilbert State Dimension"
            value="16"
            unit="states"
            color="text-bone"
            size="lg"
          />
          <p className="text-[11px] text-bone/50 mt-1">
            2⁴ basis state register
          </p>
        </GlassPanel>

        <GlassPanel>
          <StatNumber
            label="VQC 5-Fold AUROC"
            value="81.2%"
            color="text-risk-low"
            size="lg"
          />
          <p className="text-[11px] text-bone/50 mt-1">
            Stratified cross-validation
          </p>
        </GlassPanel>

        <GlassPanel>
          <StatNumber
            label="Random Forest Params"
            value="~12k"
            unit="nodes"
            color="text-bone/70"
            size="lg"
          />
          <p className="text-[11px] text-bone/50 mt-1">
            1,500x parameter compression
          </p>
        </GlassPanel>
      </section>
    </div>
  );
}
