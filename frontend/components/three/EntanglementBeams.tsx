"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EntanglementBeamsProps {
  qubitPositions: [number, number, number][];
  entanglementMatrix: number[][]; // Mutual information values
}

export function EntanglementBeams({
  qubitPositions,
  entanglementMatrix,
}: EntanglementBeamsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Extract non-zero entangled pairs
  const arcs = useMemo(() => {
    const list: {
      points: THREE.Vector3[];
      mi: number;
      color: string;
      id: string;
    }[] = [];

    const n = Math.min(qubitPositions.length, entanglementMatrix.length);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const mi = entanglementMatrix[i]?.[j] || 0;
        if (mi > 0.04) {
          const p1 = new THREE.Vector3(...qubitPositions[i]);
          const p2 = new THREE.Vector3(...qubitPositions[j]);

          // Midpoint arched upward in Y and Z for dramatic 3D beam effect
          const mid = new THREE.Vector3()
            .addVectors(p1, p2)
            .multiplyScalar(0.5);
          const dist = p1.distanceTo(p2);
          mid.y += Math.max(0.6, dist * 0.4);
          mid.z += 0.3;

          const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
          const points = curve.getPoints(32);

          // Color shifts from violet to neon magenta as entanglement intensifies
          const color = mi > 0.6 ? "#ff007f" : mi > 0.25 ? "#c084fc" : "#818cf8";
          list.push({ points, mi, color, id: `${i}-${j}` });
        }
      }
    }
    return list;
  }, [qubitPositions, entanglementMatrix]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rhythmic breathing of beams
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      groupRef.current.scale.set(1, s, 1);
    }
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc) => {
        const lineGeo = new THREE.BufferGeometry().setFromPoints(arc.points);
        const opacity = Math.min(1.0, 0.3 + arc.mi * 0.7);

        return (
          <group key={arc.id}>
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
                opacity={opacity}
              />
            </line>
          </group>
        );
      })}
    </group>
  );
}
