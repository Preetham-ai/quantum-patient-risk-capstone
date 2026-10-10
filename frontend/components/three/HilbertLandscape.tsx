"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface HilbertLandscapeProps {
  stateProbabilities: Record<string, number>;
  sortBy?: "binary" | "probability";
}

export function HilbertLandscape({
  stateProbabilities,
  sortBy = "binary",
}: HilbertLandscapeProps) {
  // Process entries and sorting
  const entries = useMemo(() => {
    const raw = Object.entries(stateProbabilities);
    if (sortBy === "probability") {
      return [...raw].sort((a, b) => b[1] - a[1]);
    }
    // Natural binary order
    return [...raw].sort((a, b) => parseInt(a[0], 2) - parseInt(b[0], 2));
  }, [stateProbabilities, sortBy]);

  // Arrange into a 4 x 4 grid for maximum 3D clarity and depth
  const gridSize = 4;
  const spacing = 1.35;

  return (
    <group position={[0, -0.6, 0]}>
      {/* 1. Ground Grid Matrix */}
      <gridHelper
        args={[7.5, 8, "#38bdf8", "#1e293b"]}
        position={[0, -0.01, 0]}
      />

      {/* 2. 16 Basis State Probability Prisms (4x4 Matrix) */}
      {entries.map(([bstr, prob], idx) => {
        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;
        const xPos = (col - (gridSize - 1) / 2) * spacing;
        const zPos = (row - (gridSize - 1) / 2) * spacing;

        const height = Math.max(0.12, prob * 7.5); // Scaled height for dramatic 3D impact

        // Quantum Parity Rule: sum of '1' bits
        const numOnes = bstr.split("").filter((c) => c === "1").length;
        const isOddParity = numOnes % 2 === 1; // High Risk parity projection
        const barColor = isOddParity ? "#f43f5e" : "#00f5ff";

        return (
          <group key={bstr} position={[xPos, 0, zPos]}>
            {/* Base Pedestal Marker */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.75, 0.04, 0.75]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>

            {/* Glowing Probability Column */}
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[0.55, height, 0.55]} />
              <meshStandardMaterial
                color={barColor}
                emissive={barColor}
                emissiveIntensity={0.5}
                roughness={0.15}
                metalness={0.7}
              />
            </mesh>

            {/* Binary State Label on Ground */}
            <Text
              position={[0, 0.05, 0.52]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.16}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
            >
              {`|${bstr}⟩`}
            </Text>

            {/* Probability Percentage Label atop bar */}
            {prob > 0.02 && (
              <Text
                position={[0, height + 0.22, 0]}
                fontSize={0.16}
                color={barColor}
                anchorX="center"
                anchorY="middle"
              >
                {`${(prob * 100).toFixed(1)}%`}
              </Text>
            )}
          </group>
        );
      })}

      {/* Title & Legend Anchors */}
      <Text
        position={[0, 3.6, -3.2]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Hilbert Probability Space (2⁴ = 16 Eigenstates)
      </Text>
      <Text
        position={[0, 3.2, -3.2]}
        fontSize={0.18}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
      >
        Cyan: Even Parity (Low Risk)  •  Rose: Odd Parity (High Risk)
      </Text>
    </group>
  );
}
