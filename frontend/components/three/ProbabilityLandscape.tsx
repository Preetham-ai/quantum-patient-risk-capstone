"use client";

import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface ProbabilityLandscapeProps {
  probabilities: Record<string, number>;
  position?: [number, number, number];
}

export function ProbabilityLandscape({
  probabilities,
  position = [0, -1.0, 3.5],
}: ProbabilityLandscapeProps) {
  const entries = Object.entries(probabilities).slice(0, 16);
  const barSpacing = 0.55;
  const totalWidth = entries.length * barSpacing;

  return (
    <group position={position}>
      {/* Title Label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.25}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
      >
        Basis-State Probability Landscape (2⁴ = 16 States)
      </Text>

      {/* Grid of 16 Glowing Probability Bars */}
      {entries.map(([bstr, prob], idx) => {
        const xPos = -totalWidth / 2 + idx * barSpacing;
        const height = Math.max(0.08, prob * 6.0); // Scaled height for visibility

        // Parity: sum of '1' bits odd -> high-risk parity (magenta), even -> low-risk (cyan)
        const numOnes = bstr.split("").filter((c) => c === "1").length;
        const isHighRiskParity = numOnes % 2 === 1;
        const barColor = isHighRiskParity ? "#ff007f" : "#00f5ff";

        return (
          <group key={bstr} position={[xPos, 0, 0]}>
            {/* Probability 3D Bar */}
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[0.38, height, 0.38]} />
              <meshStandardMaterial
                color={barColor}
                emissive={barColor}
                emissiveIntensity={0.4}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Binary String Label under bar */}
            <Text
              position={[0, -0.25, 0]}
              rotation={[-Math.PI / 4, 0, 0]}
              fontSize={0.14}
              color="#94a3b8"
              anchorX="center"
              anchorY="top"
            >
              {`|${bstr}⟩`}
            </Text>

            {/* Probability Percentage Label above bar if non-trivial */}
            {prob > 0.04 && (
              <Text
                position={[0, height + 0.18, 0]}
                fontSize={0.13}
                color={barColor}
                anchorX="center"
                anchorY="bottom"
              >
                {`${(prob * 100).toFixed(0)}%`}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}
