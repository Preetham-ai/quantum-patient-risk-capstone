"use client";

import React, { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useQuantumStore } from "@/lib/store";
import { LeftRail } from "@/components/lab/LeftRail";
import { RightRail } from "@/components/lab/RightRail";
import { ProgressBar } from "@/components/lab/ProgressBar";
import { ExplorePanel } from "@/components/lab/ExplorePanel";
import { EditPatientDrawer } from "@/components/lab/EditPatientDrawer";
import { SettingsPopover } from "@/components/lab/SettingsPopover";

// Dynamically load the 3D Verdict Chamber canvas to meet performance budget
const VerdictChamber3D = dynamic(
  () =>
    import("@/components/three/VerdictChamber3D").then((mod) => mod.VerdictChamber3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] rounded-2xl bg-surface-1 border border-hairline flex flex-col items-center justify-center space-y-3 text-bone select-none">
        <div className="w-8 h-8 rounded-full border-2 border-amber-signal/30 border-t-amber-signal animate-spin" />
        <span className="text-xs font-mono text-bone/60">
          Initializing 4-Qubit Quantum Statevector...
        </span>
      </div>
    ),
  }
);

function LabContent() {
  const searchParams = useSearchParams();
  const { selectSample, setMode, mode, updateVital } = useQuantumStore();

  // Handle URL state sync on mount
  useEffect(() => {
    const sampleParam = searchParams.get("sample");
    if (sampleParam === "low" || sampleParam === "medium" || sampleParam === "high") {
      selectSample(sampleParam);
    }
    const modeParam = searchParams.get("mode");
    if (modeParam === "explore" || modeParam === "story") {
      setMode(modeParam);
    }
    // Parse individual vitals if present in query string
    ["cp", "thalach", "oldpeak", "ca", "trestbps", "chol"].forEach((key) => {
      const val = searchParams.get(key);
      if (val) {
        updateVital(key, parseFloat(val));
      }
    });
  }, [searchParams, selectSample, setMode, updateVital]);

  return (
    <div className="flex-1 flex flex-col justify-between max-w-[1600px] w-full mx-auto px-4 sm:px-6 pt-4 pb-2">
      {/* 3-Column Desktop / Responsive Stacked Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 items-stretch min-h-[620px]">
        {/* Left Rail (360px): Act narration & Patient Dossier */}
        <LeftRail />

        {/* Center Stage: Pinned 3D Verdict Chamber */}
        <div className="flex-1 relative min-h-[460px] flex flex-col rounded-2xl">
          <SettingsPopover />
          <VerdictChamber3D />
        </div>

        {/* Right Rail (320px): Verdict Ring & Drivers */}
        <RightRail />
      </div>

      {/* Explore Mode Unpinned Controls */}
      {mode === "explore" && <ExplorePanel />}

      {/* Slide-over Patient Vitals Editor */}
      <EditPatientDrawer />

      {/* Fixed Bottom Progress Bar */}
      <div className="mt-4">
        <ProgressBar />
      </div>
    </div>
  );
}

export default function QuantumLabPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-xs font-mono text-bone/60">
          Loading Quantum Decision Chamber...
        </div>
      }
    >
      <LabContent />
    </Suspense>
  );
}
