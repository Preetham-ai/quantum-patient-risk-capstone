"use client";

import React, { useEffect } from "react";
import { useQuantumStore, ActNumber } from "@/lib/store";
import { ArrowLeft, ArrowRight, Play, Sliders } from "lucide-react";
import { Button } from "../ui/Button";

export function ProgressBar() {
  const { act, setAct, nextAct, prevAct, mode, setMode } = useQuantumStore();

  const acts: { number: ActNumber; label: string }[] = [
    { number: 1, label: "Patient" },
    { number: 2, label: "Encode" },
    { number: 3, label: "Entangle" },
    { number: 4, label: "Measure" },
    { number: 5, label: "Verdict" },
  ];

  // Global Keyboard listener: Left / Right arrow keys change acts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === "ArrowRight") {
        nextAct();
      } else if (e.key === "ArrowLeft") {
        prevAct();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextAct, prevAct]);

  return (
    <div className="h-14 bg-surface-1/95 backdrop-blur-md border-t border-hairline px-6 flex items-center justify-between text-xs z-30">
      {/* Left: Mode Toggle */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-surface-2 border border-hairline rounded-xl p-0.5 font-mono text-[11px]">
          <button
            onClick={() => setMode("story")}
            className={`px-3 py-1 rounded-lg transition flex items-center space-x-1.5 ${
              mode === "story"
                ? "bg-amber-signal text-ink font-bold shadow-xs"
                : "text-bone/50 hover:text-bone"
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Story</span>
          </button>
          <button
            onClick={() => setMode("explore")}
            className={`px-3 py-1 rounded-lg transition flex items-center space-x-1.5 ${
              mode === "explore"
                ? "bg-amber-signal text-ink font-bold shadow-xs"
                : "text-bone/50 hover:text-bone"
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Explore</span>
          </button>
        </div>
      </div>

      {/* Center: 5 Act Dots (Story Mode) */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {acts.map((a) => {
          const isActive = act === a.number;
          const isPassed = act > a.number;

          return (
            <button
              key={a.number}
              onClick={() => {
                setAct(a.number);
                setMode("story");
              }}
              className="group flex items-center space-x-1.5 py-1 focus:outline-none"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-amber-signal scale-125 ring-4 ring-amber-signal/20 shadow-md shadow-amber-signal/30"
                    : isPassed
                    ? "bg-amber-signal/50"
                    : "bg-surface-3 hover:bg-bone/40"
                }`}
              />
              <span
                className={`hidden sm:inline font-mono text-[11px] transition ${
                  isActive
                    ? "text-bone font-bold"
                    : isPassed
                    ? "text-bone/60"
                    : "text-bone/30 group-hover:text-bone/60"
                }`}
              >
                {a.number}. {a.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Prev & Next Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={act === 1}
          onClick={prevAct}
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          <span className="hidden sm:inline">Prev</span>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={nextAct}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          <span>{act === 5 ? "Explore Mode" : "Next Act"}</span>
        </Button>
      </div>
    </div>
  );
}
