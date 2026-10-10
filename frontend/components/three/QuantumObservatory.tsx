"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { BlochObservatory } from "./BlochObservatory";
import { EntanglementNetwork } from "./EntanglementNetwork";
import { HilbertLandscape } from "./HilbertLandscape";
import { CircuitFlow3D } from "./CircuitFlow3D";
import { PredictResponse } from "@/lib/types";

export type ViewMode = "bloch" | "entanglement" | "circuit" | "hilbert" | "cockpit";
export type CameraPreset = "front" | "iso" | "top" | "side" | "reset";

interface CameraManagerProps {
  viewMode: ViewMode;
  cameraPreset: CameraPreset;
  autoRotate: boolean;
}

function CameraManager({ viewMode, cameraPreset, autoRotate }: CameraManagerProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    // Adjust camera position based on preset and viewMode
    let target = new THREE.Vector3(0, 0, 0);
    let pos = new THREE.Vector3(0, 1.5, 9.5);

    if (viewMode === "bloch") {
      pos.set(0, 0.5, 9.0);
    } else if (viewMode === "entanglement") {
      pos.set(0, 0.8, 8.5);
    } else if (viewMode === "circuit") {
      pos.set(0, 0.2, 11.0);
    } else if (viewMode === "hilbert") {
      pos.set(0, 4.5, 7.5);
    }

    if (cameraPreset === "top") {
      pos.set(0, 11.0, 0.1);
    } else if (cameraPreset === "front") {
      pos.set(0, 0.5, 9.0);
    } else if (cameraPreset === "iso") {
      pos.set(6.5, 5.0, 7.0);
    } else if (cameraPreset === "side") {
      pos.set(9.0, 0.5, 0);
    }

    camera.position.copy(pos);
    camera.lookAt(target);
    controlsRef.current.target.copy(target);
    controlsRef.current.update();
  }, [viewMode, cameraPreset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={0.9}
      panSpeed={0.8}
      minDistance={2.5}
      maxDistance={22}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
    />
  );
}

interface QuantumObservatoryProps {
  data: PredictResponse;
  viewMode: ViewMode;
  focusQubit?: number | null;
  cameraPreset?: CameraPreset;
  autoRotate?: boolean;
}

export function QuantumObservatory({
  data,
  viewMode,
  focusQubit = null,
  cameraPreset = "front",
  autoRotate = false,
}: QuantumObservatoryProps) {
  return (
    <div className="w-full h-full relative bg-[#020617] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl">
      <Canvas
        camera={{ position: [0, 1.2, 9.0], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#020617"]} />

        {/* Dynamic Studio Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={0.9} />
        <pointLight position={[-10, -5, -6]} color="#38bdf8" intensity={1.8} />
        <pointLight position={[10, -5, 6]} color="#ec4899" intensity={1.5} />

        {/* Starfield particles */}
        <Stars radius={45} depth={30} count={1400} factor={3.5} saturation={0.5} fade speed={1.0} />

        <Suspense fallback={null}>
          {/* Active Visualization Mode */}
          {viewMode === "bloch" && (
            <BlochObservatory
              qubitStates={data.qubit_states}
              featuresUsed={data.features_used}
              focusQubit={focusQubit}
            />
          )}

          {viewMode === "entanglement" && (
            <EntanglementNetwork
              qubitStates={data.qubit_states}
              featuresUsed={data.features_used}
              entanglementMatrix={data.entanglement}
            />
          )}

          {viewMode === "circuit" && (
            <CircuitFlow3D
              gates={data.circuit}
              nQubits={data.n_qubits}
            />
          )}

          {viewMode === "hilbert" && (
            <HilbertLandscape
              stateProbabilities={data.state_probabilities}
            />
          )}

          {viewMode === "cockpit" && (
            <group>
              {/* Cockpit Mode: Left Bloch Spheres, Right Entanglement & Ground Grid */}
              <group position={[-2.8, 0.4, 0]} scale={[0.7, 0.7, 0.7]}>
                <BlochObservatory
                  qubitStates={data.qubit_states}
                  featuresUsed={data.features_used}
                  focusQubit={null}
                />
              </group>
              <group position={[3.2, 0, 0]} scale={[0.65, 0.65, 0.65]}>
                <EntanglementNetwork
                  qubitStates={data.qubit_states}
                  featuresUsed={data.features_used}
                  entanglementMatrix={data.entanglement}
                />
              </group>
            </group>
          )}

          {/* Silky Orbit Controls & Camera Preset Handler */}
          <CameraManager
            viewMode={viewMode}
            cameraPreset={cameraPreset}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
