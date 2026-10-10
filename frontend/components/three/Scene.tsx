"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { BlochSphere } from "./BlochSphere";
import { EntanglementBeams } from "./EntanglementBeams";
import { CircuitTimeline } from "./CircuitTimeline";
import { ProbabilityLandscape } from "./ProbabilityLandscape";
import { RiskCore } from "./RiskCore";
import { CameraRig } from "./CameraRig";
import { PredictResponse } from "@/lib/types";
import { GuidedStep } from "@/lib/store";

interface QuantumSceneProps {
  data: PredictResponse;
  activeStep: GuidedStep;
  isFreeOrbit: boolean;
}

export function QuantumScene({
  data,
  activeStep,
  isFreeOrbit,
}: QuantumSceneProps) {
  // 4 Qubit Bloch Sphere 3D coordinates
  const qubitPositions: [number, number, number][] = [
    [-4.5, 0.4, -0.5],
    [-1.5, 0.4, 0.0],
    [1.5, 0.4, 0.0],
    [4.5, 0.4, -0.5],
  ];

  const qubitColors = ["#00f5ff", "#38bdf8", "#818cf8", "#c084fc"];

  return (
    <div className="w-full h-full relative bg-[#02050e] rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl">
      <Canvas
        camera={{ position: [0, 1.5, 9.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Cap devicePixelRatio at 2 for performance
      >
        <color attach="background" args={["#030712"]} />

        {/* Ambient & Directed Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 12, 10]} intensity={0.8} />
        <pointLight position={[-10, -5, -5]} color="#3b82f6" intensity={1.5} />

        {/* Subtle Cosmic Particle Starfield */}
        <Stars radius={40} depth={30} count={1200} factor={3} saturation={0.5} fade speed={1.2} />

        <Suspense fallback={null}>
          {/* 1. Bloch Spheres for Each Qubit */}
          {data.qubit_states.map((q, idx) => (
            <BlochSphere
              key={q.qubit}
              qubit={q}
              featureName={data.features_used[idx] || `Feature ${idx}`}
              position={qubitPositions[idx] || [idx * 2.5 - 3.5, 0, 0]}
              color={qubitColors[idx % qubitColors.length]}
            />
          ))}

          {/* 2. Entanglement Beams */}
          <EntanglementBeams
            qubitPositions={qubitPositions}
            entanglementMatrix={data.entanglement}
          />

          {/* 3. 3D Circuit Timeline */}
          <CircuitTimeline
            gates={data.circuit}
            nQubits={data.n_qubits}
            position={[0, -2.8, 0]}
          />

          {/* 4. Probability Landscape (16 Basis State Bars) */}
          {activeStep === "measure" && (
            <ProbabilityLandscape
              probabilities={data.state_probabilities}
              position={[0, -0.8, 2.5]}
            />
          )}

          {/* 5. Risk Core Orb */}
          {activeStep === "result" && (
            <RiskCore
              riskProbability={data.risk_probability}
              riskLevel={data.risk_level}
              position={[0, 0.4, 3.2]}
            />
          )}

          {/* 6. Guided Camera Rig */}
          <CameraRig activeStep={activeStep} isFreeOrbit={isFreeOrbit} />
        </Suspense>
      </Canvas>
    </div>
  );
}
