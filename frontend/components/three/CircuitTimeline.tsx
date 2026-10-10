"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { CircuitGate } from "@/lib/types";

interface CircuitTimelineProps {
  gates: CircuitGate[];
  nQubits: number;
  position?: [number, number, number];
}

export function CircuitTimeline({
  gates,
  nQubits = 4,
  position = [0, -3.2, 0],
}: CircuitTimelineProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const wireLength = 12.0;
  const wireSpacing = 0.6;

  useFrame((state) => {
    if (pulseRef.current) {
      // Traveling pulse left to right across the wires
      const speed = 1.2;
      const t = (state.clock.elapsedTime * speed) % 1.0;
      pulseRef.current.position.x = -wireLength / 2 + t * wireLength;
    }
  });

  return (
    <group position={position}>
      {/* Horizontal Qubit Quantum Wires */}
      {Array.from({ length: nQubits }).map((_, q) => {
        const y = (nQubits / 2 - q) * wireSpacing;
        return (
          <group key={`wire-${q}`}>
            {/* Wire Label */}
            <Text
              position={[-wireLength / 2 - 0.6, y, 0]}
              fontSize={0.2}
              color="#94a3b8"
              anchorX="right"
              anchorY="middle"
            >
              {`q[${q}]`}
            </Text>

            {/* Wire line */}
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
              <lineBasicMaterial attach="material" color="#1e293b" transparent opacity={0.8} />
            </line>
          </group>
        );
      })}

      {/* 3D Gate Tiles along the wires */}
      {gates.slice(0, 16).map((g, idx) => {
        const xPos = -wireLength / 2 + 0.8 + idx * 0.72;
        const q0 = g.qubits[0] ?? 0;
        const yPos = (nQubits / 2 - q0) * wireSpacing;

        const isCX = g.gate === "CX";
        const isH = g.gate === "H";
        const isRz = g.gate === "RZ";

        const tileColor = isH ? "#06b6d4" : isRz ? "#3b82f6" : "#ec4899";

        return (
          <group key={`gate-${idx}`} position={[xPos, yPos, 0.05]}>
            {/* Gate Box */}
            <mesh>
              <boxGeometry args={[0.48, 0.44, 0.12]} />
              <meshStandardMaterial
                color={tileColor}
                emissive={tileColor}
                emissiveIntensity={0.25}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>

            {/* Gate Text */}
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.16}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {g.gate}
            </Text>

            {/* CX Vertical connection to target if multi-qubit */}
            {isCX && g.qubits.length > 1 && (
              <line>
                <bufferGeometry
                  attach="geometry"
                  onUpdate={(self) => {
                    const targetY = (nQubits / 2 - g.qubits[1]) * wireSpacing;
                    self.setFromPoints([
                      new THREE.Vector3(0, 0, 0),
                      new THREE.Vector3(0, targetY - yPos, 0),
                    ]);
                  }}
                />
                <lineBasicMaterial attach="material" color="#ec4899" linewidth={2} />
              </line>
            )}
          </group>
        );
      })}

      {/* Traveling Quantum Light Pulse */}
      <mesh ref={pulseRef} position={[0, wireSpacing, 0.1]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#00f5ff" />
        <pointLight color="#00f5ff" intensity={2.5} distance={1.8} />
      </mesh>
    </group>
  );
}
