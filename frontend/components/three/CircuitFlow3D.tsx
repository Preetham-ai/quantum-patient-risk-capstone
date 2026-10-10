"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { CircuitGate } from "@/lib/types";

interface CircuitFlow3DProps {
  gates: CircuitGate[];
  nQubits?: number;
  highlightLayer?: number | null;
}

export function CircuitFlow3D({
  gates,
  nQubits = 4,
  highlightLayer = null,
}: CircuitFlow3DProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const wireLength = 13.0;
  const wireSpacing = 0.85;

  useFrame((state) => {
    if (pulseRef.current) {
      const speed = 1.0;
      const t = (state.clock.elapsedTime * speed) % 1.0;
      pulseRef.current.position.x = -wireLength / 2 + t * wireLength;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Qubit Wire Lines */}
      {Array.from({ length: nQubits }).map((_, q) => {
        const y = (nQubits / 2 - q - 0.5) * wireSpacing;
        return (
          <group key={`wire-${q}`}>
            {/* Wire Label Left */}
            <Text
              position={[-wireLength / 2 - 0.7, y, 0]}
              fontSize={0.24}
              color="#38bdf8"
              anchorX="right"
              anchorY="middle"
            >
              {`q[${q}]`}
            </Text>

            {/* Wire Line */}
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  self.setFromPoints([
                    new THREE.Vector3(-wireLength / 2, y, 0),
                    new THREE.Vector3(wireLength / 2, y, 0),
                  ]);
                }}
              />
              <lineBasicMaterial attach="material" color="#334155" transparent opacity={0.7} />
            </line>
          </group>
        );
      })}

      {/* 2. Quantum Gate 3D Tiles along Wires */}
      {gates.slice(0, 16).map((g, idx) => {
        const xPos = -wireLength / 2 + 1.2 + idx * 0.75;
        const q0 = g.qubits[0] ?? 0;
        const yPos = (nQubits / 2 - q0 - 0.5) * wireSpacing;

        const isCX = g.gate === "CX";
        const isH = g.gate === "H";
        const isRz = g.gate === "RZ";
        const isRy = g.gate === "RY";

        const tileColor = isH
          ? "#00f5ff"
          : isRz
          ? "#38bdf8"
          : isRy
          ? "#818cf8"
          : "#ec4899";

        const isHighlighted = highlightLayer === null || g.layer === highlightLayer;

        return (
          <group key={`gate-${idx}`} position={[xPos, yPos, 0.05]}>
            {/* Gate Box */}
            <mesh>
              <boxGeometry args={[0.56, 0.52, 0.16]} />
              <meshStandardMaterial
                color={tileColor}
                emissive={tileColor}
                emissiveIntensity={isHighlighted ? 0.35 : 0.05}
                roughness={0.2}
                metalness={0.6}
              />
            </mesh>

            {/* Gate Text */}
            <Text
              position={[0, 0, 0.14]}
              fontSize={0.18}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {g.gate}
            </Text>

            {/* CX Entanglement Vertical Connector */}
            {isCX && g.qubits.length > 1 && (
              <line>
                <bufferGeometry
                  attach="geometry"
                  onUpdate={(self) => {
                    const targetY = (nQubits / 2 - g.qubits[1] - 0.5) * wireSpacing;
                    self.setFromPoints([
                      new THREE.Vector3(0, 0, 0),
                      new THREE.Vector3(0, targetY - yPos, 0),
                    ]);
                  }}
                />
                <lineBasicMaterial attach="material" color="#ec4899" linewidth={3} />
              </line>
            )}
          </group>
        );
      })}

      {/* 3. Traveling Quantum Photon */}
      <mesh ref={pulseRef} position={[0, (nQubits / 2 - 0.5) * wireSpacing, 0.15]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#00f5ff" />
        <pointLight color="#00f5ff" intensity={3.0} distance={2.5} />
      </mesh>
    </group>
  );
}
