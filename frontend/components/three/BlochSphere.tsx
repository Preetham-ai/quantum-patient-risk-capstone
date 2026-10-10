"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { QubitState } from "@/lib/types";

interface BlochSphereProps {
  qubit: QubitState;
  featureName: string;
  position: [number, number, number];
  color?: string;
}

export function BlochSphere({
  qubit,
  featureName,
  position,
  color = "#00f5ff",
}: BlochSphereProps) {
  const arrowRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const [bx, by, bz] = qubit.bloch;
  const purity = Math.max(0.1, Math.min(1.0, qubit.purity));

  // Compute direction and arrow length (arrow length = purity)
  const dir = new THREE.Vector3(bx, by, bz);
  const len = dir.length();
  const dirNorm = len > 1e-4 ? dir.clone().normalize() : new THREE.Vector3(0, 0, 1);
  const arrowLength = 1.0 * purity; // visibly shrinks inside sphere when entangled

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Translucent Bloch Sphere Shell */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshPhysicalMaterial
          color="#0b1a3a"
          transparent
          opacity={0.32}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          wireframe={false}
        />
      </mesh>

      {/* Equator Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.98, 1.02, 64]} />
        <meshBasicMaterial color="#1e3a8a" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* Coordinate Axes */}
      {/* Z Axis (Vertical) */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            self.setFromPoints([new THREE.Vector3(0, -1.15, 0), new THREE.Vector3(0, 1.15, 0)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#475569" transparent opacity={0.5} />
      </line>

      {/* X Axis */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            self.setFromPoints([new THREE.Vector3(-1.15, 0, 0), new THREE.Vector3(1.15, 0, 0)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#475569" transparent opacity={0.4} />
      </line>

      {/* |0> and |1> Labels */}
      <Text position={[0, 1.35, 0]} fontSize={0.22} color="#94a3b8" anchorX="center" anchorY="middle">
        |0⟩
      </Text>
      <Text position={[0, -1.35, 0]} fontSize={0.22} color="#94a3b8" anchorX="center" anchorY="middle">
        |1⟩
      </Text>

      {/* State Vector Arrow (Length = Purity) */}
      <group ref={arrowRef}>
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              self.setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(dirNorm.x * arrowLength, dirNorm.y * arrowLength, dirNorm.z * arrowLength),
              ]);
            }}
          />
          <lineBasicMaterial attach="material" color={color} linewidth={2} />
        </line>
        {/* State Vector Head Tip */}
        <mesh position={[dirNorm.x * arrowLength, dirNorm.y * arrowLength, dirNorm.z * arrowLength]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Qubit & Clinical Feature Badge */}
      <group position={[0, -1.75, 0]}>
        <Text fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle">
          {`q${qubit.qubit}: ${featureName}`}
        </Text>
        <Text position={[0, -0.28, 0]} fontSize={0.16} color="#38bdf8" anchorX="center" anchorY="middle">
          {`Purity: ${(purity * 100).toFixed(0)}%`}
        </Text>
      </group>
    </group>
  );
}
