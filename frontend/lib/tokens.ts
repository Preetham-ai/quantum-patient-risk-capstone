/**
 * frontend/lib/tokens.ts
 * QuantumRisk v2 Design Tokens & System Constants
 */

export const tokens = {
  colors: {
    ink: "#0B0D12",
    bone: "#EDE7DB",
    amber: {
      signal: "#FFB347",
    },
    risk: {
      low: "#7FB59A", // sage
      med: "#FFB347", // amber
      high: "#E5484D", // vermilion
    },
    surface: {
      1: "#12151D",
      2: "#181C26",
      3: "#202533",
    },
    border: {
      hairline: "rgba(237, 231, 219, 0.08)",
      subtle: "rgba(237, 231, 219, 0.14)",
      strong: "rgba(237, 231, 219, 0.24)",
    },
  },
  fonts: {
    serif: 'Fraunces, "Instrument Serif", Georgia, serif',
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
  },
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export type RiskTier = "Low" | "Medium" | "High";

export function getRiskColor(level: RiskTier | string): string {
  switch (level?.toLowerCase()) {
    case "low":
      return tokens.colors.risk.low;
    case "medium":
    case "med":
      return tokens.colors.risk.med;
    case "high":
      return tokens.colors.risk.high;
    default:
      return tokens.colors.amber.signal;
  }
}
