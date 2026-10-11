"use client";

import React from "react";
import { getRiskColor, RiskTier } from "@/lib/tokens";

interface VerdictRingProps {
  probability: number; // 0.0 to 1.0
  riskLevel: RiskTier | string;
  isRevealed: boolean;
  size?: number;
  strokeWidth?: number;
}

export function VerdictRing({
  probability,
  riskLevel,
  isRevealed,
  size = 140,
  strokeWidth = 10,
}: VerdictRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, Math.round(probability * 100)));
  const strokeDashoffset = circumference - (circumference * (isRevealed ? percent : 20)) / 100;
  const color = isRevealed ? getRiskColor(riskLevel) : "#4B5563";

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(237, 231, 219, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {isRevealed ? (
          <>
            <span className="font-mono-numbers text-3xl font-bold tracking-tight text-bone">
              {percent}%
            </span>
            <span
              className="font-serif text-xs font-semibold uppercase tracking-wider mt-0.5"
              style={{ color }}
            >
              {riskLevel} Risk
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[11px] font-mono text-bone/40 uppercase tracking-widest">
              State
            </span>
            <span className="text-xs font-mono text-amber-signal/70 animate-pulse">
              Computing
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
