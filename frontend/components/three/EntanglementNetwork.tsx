"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { QubitState } from "@/lib/types";

interface EntanglementNetworkProps {
  qubitStates: QubitState[];
  featuresUsed: string[];
  entanglementMatrix: number[][]; // Mutual information matrix
}

export function EntanglementNetwork({
  qubitStates,
  featuresUsed,
  entanglementMatrix,
}: EntanglementNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Group>(null);

  // Arrange 4 Qubits in a spacious diamond constellation
  const nodePositions: [number, number, number][] = [
    [-3.2, 0, 0],   // Left (q0)
    [0, 2.4, 0],    // Top (q1)
    [3.2, 0, 0],    // Right (q2)
    [0, -2.4, 0],   // Bottom (q3)
  ];

  const nodeColors = ["#00f5ff", "#38bdf8", "#a855f7", "#ec4899"];

  // Compute Pairwise Entanglement Arcs
  const arcs = useMemo(() => {
    const list: {
      id: string;
      fromIdx: number;
      toIdx: number;
      p1: THREE.Vector3;
      p2: THREE.Vector3;
      mid: THREE.Vector3;
      points: THREE.Vector3[];
      mi: number;
      color: string;
    }[] = [];

    const n = Math.min(4, nodePositions.length);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const mi = entanglementMatrix[i]?.[j] ?? 0;
        const p1 = new THREE.Vector3(...nodePositions[i]);
        const p2 = new THREE.Vector3(...nodePositions[j]);

        // Elevate midpoint along Z and Y to create arched 3D beam
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        mid.z += Math.max(0.8, mi * 2.2);

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(36);

        // Color mapped to mutual information intensity
        const color =
          mi > 0.5 ? "#f43f5e" : mi > 0.25 ? "#ec4899" : mi > 0.08 ? "#818cf8" : "#334155";

        list.push({
          id: `${i}-${j}`,
          fromIdx: i,
          toIdx: j,
          p1,
          p2,
          mid,
          points,
          mi,
          color,
        });
      }
    }
    return list;
  }, [entanglementMatrix]);

  // Subtle breathing rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Ground Reference Rings */}
      <mesh position={[0, 0, -0.6]} rotation={[0, 0, 0]}>
        <ringGeometry args={[3.8, 3.84, 64]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.6]} rotation={[0, 0, 0]}>
        <ringGeometry args={[2.0, 2.03, 48]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.3} />
      </mesh>

      {/* 2. Entanglement Arcs between Qubits */}
      {arcs.map((arc) => {
        const isStrong = arc.mi > 0.2;
        return (
          <group key={arc.id}>
            {/* Arched Connecting Line */}
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  self.setFromPoints(arc.points);
                }}
              />
              <lineBasicMaterial
                attach="material"
                color={arc.color}
                linewidth={Math.max(1, Math.min(5, arc.mi * 4))}
                transparent
                opacity={Math.max(0.3, Math.min(1.0, 0.3 + arc.mi * 0.7))}
              />
            </line>

            {/* Midpoint Mutual Information Tag */}
            {isStrong && (
              <group position={[arc.mid.x, arc.mid.y, arc.mid.z + 0.15]}>
                <mesh>
                  <sphereGeometry args={[0.18, 16, 16]} />
                  <meshStandardMaterial
                    color={arc.color}
                    emissive={arc.color}
                    emissiveIntensity={0.6}
                  />
                </mesh>
                <Text
                  position={[0, 0.32, 0]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {`I = ${arc.mi.toFixed(2)}`}
                </Text>
              </group>
            )}
          </group>
        );
      })}

      {/* 3. Four Qubit Nodes */}
      {nodePositions.map((pos, idx) => {
        const color = nodeColors[idx % nodeColors.length];
        const feat = featuresUsed[idx] || `Feature ${idx}`;
        const qState = qubitStates[idx];
        const purity = qState ? qState.purity : 1.0;

        return (
          <group key={`node-${idx}`} position={pos}>
            {/* Outer Glowing Halo */}
            <mesh>
              <sphereGeometry args={[0.55, 32, 32]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.2}
                wireframe={false}
              />
            </mesh>

            {/* Core Solid Node Orb */}
            <mesh>
              <sphereGeometry args={[0.38, 32, 32]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>

            {/* Pulsing Light */}
            <pointLight color={color} intensity={2.0} distance={3.0} />

            {/* Node Labels */}
            <Text
              position={[0, 0.8, 0]}
              fontSize={0.28}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {`q${idx}: ${feat}`}
            </Text>
            <Text
              position={[0, -0.65, 0]}
              fontSize={0.18}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
            >
              {`Purity: ${(purity * 100).toFixed(0)}%`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
