import React from "react";

interface StatNumberProps {
  value: string | number;
  unit?: string;
  label?: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function StatNumber({
  value,
  unit,
  label,
  color = "text-bone",
  size = "md",
  className = "",
}: StatNumberProps) {
  const sizeClass =
    size === "xl"
      ? "text-4xl sm:text-5xl"
      : size === "lg"
      ? "text-3xl"
      : size === "sm"
      ? "text-lg"
      : "text-2xl";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <span className="text-[11px] font-mono text-bone/60 uppercase tracking-wider mb-1">
          {label}
        </span>
      )}
      <div className="flex items-baseline space-x-1.5 font-mono-numbers">
        <span className={`font-bold ${sizeClass} ${color}`}>{value}</span>
        {unit && <span className="text-xs font-mono text-bone/50">{unit}</span>}
      </div>
    </div>
  );
}
