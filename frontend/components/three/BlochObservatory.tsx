"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { QubitState } from "@/lib/types";

interface SingleBlochProps {
  qubit: QubitState;
  featureName: string;
  position: [number, number, number];
  color: string;
  scale?: number;
  showDetails?: boolean;
}

export function SingleBloch({
  qubit,
  featureName,
  position,
  color,
  scale = 1.0,
  showDetails = false,
}: SingleBlochProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Group>(null);

  const [bx, by, bz] = qubit.bloch;
  const purity = Math.max(0.1, Math.min(1.0, qubit.purity));

  // Compute 3D direction vector
  const dir = new THREE.Vector3(bx, by, bz);
  const len = dir.length();
  const dirNorm = len > 1e-4 ? dir.clone().normalize() : new THREE.Vector3(0, 0, 1);
  const vectorLength = 1.0 * purity; // Shrinks inside the unit sphere when mixed/entangled

  // Compute angles theta and phi
  const thetaRad = Math.acos(Math.max(-1, Math.min(1, bz / (len || 1))));
  const phiRad = Math.atan2(by, bx);
  const thetaDeg = (thetaRad * 180 / Math.PI).toFixed(0);
  const phiDeg = (((phiRad >= 0 ? phiRad : phiRad + 2 * Math.PI) * 180 / Math.PI)).toFixed(0);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* 1. Translucent Outer Sphere Shell */}
      <mesh>
        <sphereGeometry args={[1.0, 36, 36]} />
        <meshPhysicalMaterial
          color="#0a1936"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.2}
          transmission={0.7}
          thickness={0.5}
        />
      </mesh>

      {/* 2. Equator Disc Plane (XY Plane) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.99, 48]} />
        <meshBasicMaterial
          color="#1e3a8a"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Equator Glowing Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.97, 1.01, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.DoubleSide}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* 4. Prime Meridian Ring (XZ Plane) */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[0.98, 1.0, 48]} />
        <meshBasicMaterial
          color="#334155"
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* 5. Coordinate Axes */}
      {/* Z-Axis (Vertical |0> to |1>) */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            self.setFromPoints([new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1.2, 0)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#64748b" transparent opacity={0.6} />
      </line>

      {/* X-Axis (Left-Right) */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            self.setFromPoints([new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#64748b" transparent opacity={0.5} />
      </line>

      {/* Y-Axis (Depth) */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            self.setFromPoints([new THREE.Vector3(0, 0, -1.2), new THREE.Vector3(0, 0, 1.2)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#64748b" transparent opacity={0.4} />
      </line>

      {/* Polar State Labels */}
      <Text position={[0, 1.38, 0]} fontSize={0.2} color="#38bdf8" anchorX="center" anchorY="middle">
        |0⟩
      </Text>
      <Text position={[0, -1.38, 0]} fontSize={0.2} color="#f43f5e" anchorX="center" anchorY="middle">
        |1⟩
      </Text>

      {/* 6. Glowing State Vector Arrow */}
      <group ref={arrowRef}>
        {/* Needle Line */}
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              self.setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(dirNorm.x * vectorLength, dirNorm.y * vectorLength, dirNorm.z * vectorLength),
              ]);
            }}
          />
          <lineBasicMaterial attach="material" color={color} linewidth={3} />
        </line>

        {/* Needle Glowing Tip Sphere */}
        <mesh position={[dirNorm.x * vectorLength, dirNorm.y * vectorLength, dirNorm.z * vectorLength]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 7. Information Badge Below Sphere */}
      <group position={[0, -1.75, 0]}>
        <Text fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle">
          {`q${qubit.qubit}: ${featureName}`}
        </Text>
        <Text position={[0, -0.28, 0]} fontSize={0.16} color={color} anchorX="center" anchorY="middle">
          {`Purity: ${(purity * 100).toFixed(0)}%  (r=${purity.toFixed(2)})`}
        </Text>

        {showDetails && (
          <Text position={[0, -0.52, 0]} fontSize={0.13} color="#94a3b8" anchorX="center" anchorY="middle">
            {`θ=${thetaDeg}°  ϕ=${phiDeg}°  z=${bz.toFixed(2)}`}
          </Text>
        )}
      </group>
    </group>
  );
}

interface BlochObservatoryProps {
  qubitStates: QubitState[];
  featuresUsed: string[];
  focusQubit?: number | null; // null means show all 4
}

export function BlochObservatory({
  qubitStates,
  featuresUsed,
  focusQubit = null,
}: BlochObservatoryProps) {
  const qubitColors = ["#00f5ff", "#38bdf8", "#a855f7", "#ec4899"];

  // Layout positions: when focusing on all 4, space them nicely across X
  const allPositions: [number, number, number][] = [
    [-4.8, 0.2, 0],
    [-1.6, 0.2, 0],
    [1.6, 0.2, 0],
    [4.8, 0.2, 0],
  ];

  if (focusQubit !== null && focusQubit >= 0 && focusQubit < qubitStates.length) {
    // Single Qubit Zoom Mode: Center it with large scale and full detail readout
    const q = qubitStates[focusQubit];
    const feat = featuresUsed[focusQubit] || `Feature ${focusQubit}`;
    return (
      <group position={[0, 0, 0]}>
        <SingleBloch
          qubit={q}
          featureName={feat}
          position={[0, 0.2, 0]}
          color={qubitColors[focusQubit % qubitColors.length]}
          scale={1.8}
          showDetails={true}
        />
      </group>
    );
  }

  // All 4 Qubits Mode
  return (
    <group position={[0, 0, 0]}>
      {qubitStates.map((q, idx) => (
        <SingleBloch
          key={q.qubit}
          qubit={q}
          featureName={featuresUsed[idx] || `Feature ${idx}`}
          position={allPositions[idx] || [idx * 3.2 - 4.8, 0.2, 0]}
          color={qubitColors[idx % qubitColors.length]}
          scale={1.15}
          showDetails={true}
        />
      ))}
    </group>
  );
}
