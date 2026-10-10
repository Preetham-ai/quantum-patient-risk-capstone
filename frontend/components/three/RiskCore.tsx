"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface RiskCoreProps {
  riskProbability: number;
  riskLevel: "Low" | "Medium" | "High";
  position?: [number, number, number];
}

export function RiskCore({
  riskProbability,
  riskLevel,
  position = [5.5, 0, 0],
}: RiskCoreProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  // Color mapping: Low -> Emerald, Medium -> Amber, High -> Crimson/Magenta
  const coreColor =
    riskLevel === "High"
      ? "#ef4444"
      : riskLevel === "Medium"
      ? "#f59e0b"
      : "#10b981";

  // Pulse speed scales with risk
  const pulseSpeed = 1.5 + riskProbability * 3.5;

  useFrame((state) => {
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.12;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += 0.01;
      outerRingRef.current.rotation.y += 0.015;
    }
  });

  return (
    <group position={position}>
      {/* Central Pulsing Energy Orb */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>

      {/* Point Light emanating from core */}
      <pointLight color={coreColor} intensity={4.0} distance={6.0} />

      {/* Rotating Outer Energy Rings */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.35, 0.03, 16, 64]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.6} />
      </mesh>

      {/* Risk Percentage Text Label */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`${(riskProbability * 100).toFixed(1)}%`}
      </Text>

      {/* Risk Level Badge */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.22}
        color={coreColor}
        anchorX="center"
        anchorY="middle"
      >
        {`${riskLevel.toUpperCase()} RISK`}
      </Text>

      <Text
        position={[0, -1.6, 0]}
        fontSize={0.18}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Quantum Risk Core
      </Text>
    </group>
  );
}
