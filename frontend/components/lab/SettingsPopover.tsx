"use client";

import React from "react";
import { useQuantumStore } from "@/lib/store";
import { Settings, RotateCw, Monitor, RefreshCw, X } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";

export function SettingsPopover() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    autoRotate,
    setAutoRotate,
    use2DFallback,
    setUse2DFallback,
    activeModel,
    setActiveModel,
  } = useQuantumStore();

  if (!isSettingsOpen) {
    return (
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-surface-1/80 hover:bg-surface-2 border border-hairline text-bone/70 hover:text-bone transition shadow-lg backdrop-blur-md"
        title="Scene & Model Settings"
      >
        <Settings className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-30 w-72">
      <GlassPanel className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-hairline">
          <span className="text-xs font-mono font-bold text-bone flex items-center space-x-1.5">
            <Settings className="w-3.5 h-3.5 text-amber-signal" />
            <span>Display &amp; Model Options</span>
          </span>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded text-bone/50 hover:text-bone"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-3 text-xs">
          {/* Turntable Auto-Rotate */}
          <div className="flex items-center justify-between">
            <span className="text-bone/70 flex items-center space-x-1.5">
              <RotateCw className="w-3.5 h-3.5 text-amber-signal" />
              <span>Turntable Orbit</span>
            </span>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              className="accent-amber-signal cursor-pointer"
            />
          </div>

          {/* 2D SVG View */}
          <div className="flex items-center justify-between">
            <span className="text-bone/70 flex items-center space-x-1.5">
              <Monitor className="w-3.5 h-3.5 text-amber-signal" />
              <span>2D SVG Fallback</span>
            </span>
            <input
              type="checkbox"
              checked={use2DFallback}
              onChange={(e) => setUse2DFallback(e.target.checked)}
              className="accent-amber-signal cursor-pointer"
            />
          </div>
        </div>

        {/* Target Quantum Classifier */}
        <div className="space-y-1.5 pt-2 border-t border-hairline text-xs">
          <label className="text-[11px] font-mono text-bone/50">Quantum Model Engine:</label>
          <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
            {(["vqc", "qsvm", "hybrid"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveModel(m)}
                className={`py-1 rounded border text-center uppercase transition ${
                  activeModel === m
                    ? "bg-amber-signal/20 border-amber-signal text-amber-signal font-bold"
                    : "bg-surface-2 border-hairline text-bone/50 hover:text-bone"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
