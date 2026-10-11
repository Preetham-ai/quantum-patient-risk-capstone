"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { useQuantumStore, ActNumber } from "@/lib/store";
import { tokens, getRiskColor } from "@/lib/tokens";

// 2D SVG Fallback View for reduced motion or WebGL absence
export function Fallback2DView() {
  const { result } = useQuantumStore();
  const probabilities = Object.entries(result.state_probabilities || {});

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between bg-surface-1 text-bone select-none">
      <div className="flex items-center justify-between pb-4 border-b border-hairline">
        <div>
          <span className="text-[11px] font-mono text-amber-signal uppercase tracking-wider font-semibold">
            2D Quantum State Fallback (SVG)
          </span>
          <h3 className="font-serif font-bold text-lg text-bone">
            Simulated 4-Qubit Bloch Discs &amp; Parity Spectrum
          </h3>
        </div>
        <span className="text-xs font-mono text-bone/60">
          Tr(ρ²) Subsystem Purity
        </span>
      </div>

      {/* 4 Bloch Discs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        {result.qubit_states.map((q, idx) => {
          const angle = result.encoded_angles[idx] ?? 0;
          const purity = q.purity ?? 1.0;
          const needleLength = 32 * purity;
          const dx = needleLength * Math.sin(angle);
          const dy = -needleLength * Math.cos(angle);

          return (
            <div
              key={q.qubit}
              className="p-4 rounded-xl bg-surface-2/80 border border-hairline flex flex-col items-center text-center space-y-2"
            >
              <span className="font-mono text-xs text-amber-signal font-bold">
                q{q.qubit}: {result.features_used[idx]}
              </span>

              {/* Disc */}
              <svg width="80" height="80" className="my-1">
                <circle cx="40" cy="40" r="34" stroke="rgba(237, 231, 219, 0.15)" strokeWidth="1.5" fill="none" />
                <line x1="40" y1="6" x2="40" y2="74" stroke="rgba(237, 231, 219, 0.08)" strokeDasharray="2 2" />
                <line x1="6" y1="40" x2="74" y2="40" stroke="rgba(237, 231, 219, 0.08)" strokeDasharray="2 2" />
                <circle cx="40" cy="40" r="2.5" fill="var(--amber-signal)" />
                {/* Needle */}
                <line
                  x1="40"
                  y1="40"
                  x2={40 + dx}
                  y2={40 + dy}
                  stroke="var(--amber-signal)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex justify-between w-full text-[10px] font-mono text-bone/60 pt-1 border-t border-hairline">
                <span>θ={angle.toFixed(2)} rad</span>
                <span>{(purity * 100).toFixed(0)}% Pure</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 16 Hilbert State Probability Spectrum */}
      <div className="p-4 rounded-xl bg-surface-2/60 border border-hairline">
        <div className="flex items-center justify-between text-xs font-mono text-bone/70 mb-2">
          <span>16-State Hilbert Probability Distribution (2⁴ = 16)</span>
          <span className="text-[11px] text-bone/40">Parity Split: Sage (Even / Low) vs Vermilion (Odd / High)</span>
        </div>
        <div className="grid grid-cols-16 gap-1 h-20 items-end">
          {probabilities.map(([state, prob]) => {
            const numOnes = state.split("").filter((b) => b === "1").length;
            const isEven = numOnes % 2 === 0;
            const barColor = isEven ? tokens.colors.risk.low : tokens.colors.risk.high;

            return (
              <div key={state} className="flex flex-col items-center h-full justify-end group">
                <div
                  className="w-full rounded-t transition-all duration-300"
                  style={{
                    height: `${Math.max(4, Math.round(prob * 100 * 1.8))}%`,
                    backgroundColor: barColor,
                  }}
                  title={`|${state}⟩: ${(prob * 100).toFixed(1)}%`}
                />
                <span className="text-[7px] font-mono text-bone/40 mt-1 truncate">
                  {state.slice(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 3D Camera Rig with Damped Easing per Act
function CameraRigController({ act, mode }: { act: ActNumber; mode: string }) {
  useFrame(({ camera }) => {
    let targetPos = new THREE.Vector3(0, 1.2, 9.0);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (mode === "explore") {
      return; // Handled by OrbitControls
    }

    switch (act) {
      case 1: // The Patient
        targetPos.set(0, 0.5, 7.5);
        targetLook.set(0, 0, 0);
        break;
      case 2: // Feature Encoding
        targetPos.set(0, 1.0, 7.8);
        targetLook.set(0, 0.4, 0);
        break;
      case 3: // Biomarker Synergy / Entanglement
        targetPos.set(0, 1.8, 8.8);
        targetLook.set(0, -0.2, 0);
        break;
      case 4: // State Collapse / Measurement Pillars
        targetPos.set(0, 3.2, 6.2);
        targetLook.set(0, -0.6, 0.5);
        break;
      case 5: // The Verdict
        targetPos.set(0, 0.8, 6.5);
        targetLook.set(0, 0.3, 0);
        break;
    }

    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(targetLook);
  });

  return null;
}

// Act 1: Floating Biomarker Cards / Dials
function Act1PatientView() {
  const { result } = useQuantumStore();
  const positions: [number, number, number][] = [
    [-3.6, 0.5, 0],
    [-1.2, 0.5, 0],
    [1.2, 0.5, 0],
    [3.6, 0.5, 0],
  ];

  return (
    <group>
      {/* Faint Torso Wireframe Ring Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <ringGeometry args={[2.8, 2.9, 64]} />
        <meshBasicMaterial color="#FFB347" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* 4 Floating Biomarker Token Cards */}
      {result.qubit_states.map((q, idx) => {
        const feature = result.features_used[idx] || `Vital ${idx}`;
        const angle = result.encoded_angles[idx] ?? 0;
        return (
          <Float key={q.qubit} speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <group position={positions[idx]}>
              <mesh>
                <boxGeometry args={[2.0, 2.4, 0.08]} />
                <meshStandardMaterial color="#181C26" roughness={0.4} metalness={0.2} />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(2.0, 2.4, 0.08)]} />
                <lineBasicMaterial color="#FFB347" transparent opacity={0.4} />
              </lineSegments>

              <Text position={[0, 0.7, 0.06]} fontSize={0.22} color="#FFB347" font={undefined}>
                {`q${q.qubit}: ${feature}`}
              </Text>
              <Text position={[0, 0.1, 0.06]} fontSize={0.16} color="#EDE7DB" font={undefined}>
                {`θ = ${angle.toFixed(2)} rad`}
              </Text>
              <Text position={[0, -0.5, 0.06]} fontSize={0.12} color="#7FB59A" font={undefined}>
                {`Purity ${(q.purity * 100).toFixed(0)}%`}
              </Text>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

// Act 2: Thin-Line Wireframe Bloch Spheres
function Act2BlochSpheres() {
  const { result } = useQuantumStore();
  const positions: [number, number, number][] = [
    [-3.8, 0.3, 0],
    [-1.3, 0.3, 0],
    [1.3, 0.3, 0],
    [3.8, 0.3, 0],
  ];

  return (
    <group>
      {result.qubit_states.map((q, idx) => {
        const angle = result.encoded_angles[idx] ?? 0;
        const purity = q.purity ?? 1.0;
        const arrowLength = 1.35 * purity;

        return (
          <group key={q.qubit} position={positions[idx]}>
            {/* Sphere Wireframe */}
            <mesh>
              <sphereGeometry args={[1.2, 24, 16]} />
              <meshBasicMaterial color="#EDE7DB" wireframe transparent opacity={0.15} />
            </mesh>

            {/* Equator Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.18, 1.2, 48]} />
              <meshBasicMaterial color="#FFB347" transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>

            {/* Glowing Arrow needle */}
            <group rotation={[angle, 0, 0]}>
              <mesh position={[0, arrowLength / 2, 0]}>
                <cylinderGeometry args={[0.03, 0.03, arrowLength, 12]} />
                <meshStandardMaterial color="#FFB347" emissive="#FFB347" emissiveIntensity={0.6} />
              </mesh>
              <mesh position={[0, arrowLength, 0]}>
                <coneGeometry args={[0.1, 0.22, 12]} />
                <meshStandardMaterial color="#FFB347" emissive="#FFB347" emissiveIntensity={0.9} />
              </mesh>
            </group>

            {/* Label */}
            <Text position={[0, -1.6, 0]} fontSize={0.2} color="#EDE7DB" font={undefined}>
              {`q${q.qubit}: ${result.features_used[idx]}`}
            </Text>
            <Text position={[0, -1.9, 0]} fontSize={0.14} color="#FFB347" font={undefined}>
              {`θ = ${angle.toFixed(2)} rad • ${(purity * 100).toFixed(0)}%`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Act 3: Entanglement Threads & Flat Circuit Strip
function Act3EntanglementView() {
  const { result } = useQuantumStore();
  const positions: [number, number, number][] = [
    [-3.8, 0.4, 0],
    [-1.3, 0.4, 0],
    [1.3, 0.4, 0],
    [3.8, 0.4, 0],
  ];

  // Draw light threads between coupled qubits
  const threads = [
    { from: 0, to: 1, val: result.entanglement[0]?.[1] ?? 0.35 },
    { from: 1, to: 2, val: result.entanglement[1]?.[2] ?? 0.45 },
    { from: 2, to: 3, val: result.entanglement[2]?.[3] ?? 0.38 },
    { from: 0, to: 2, val: result.entanglement[0]?.[2] ?? 0.55 }, // High synergy chest pain + ST depression
  ];

  return (
    <group>
      <Act2BlochSpheres />

      {/* Curved Entanglement Beams */}
      {threads.map((t, i) => {
        const p1 = new THREE.Vector3(...positions[t.from]);
        const p2 = new THREE.Vector3(...positions[t.to]);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        mid.y += 1.2 + i * 0.3; // Arch upwards

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(32);
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color: "#FFB347",
          transparent: true,
          opacity: Math.min(0.9, Math.max(0.2, t.val)),
        });
        const lineObj = new THREE.Line(geom, mat);

        return <primitive key={i} object={lineObj} />;
      })}

      {/* Flat Circuit Strip below */}
      <mesh position={[0, -2.4, 0]}>
        <planeGeometry args={[9.5, 0.9]} />
        <meshStandardMaterial color="#12151D" transparent opacity={0.9} />
      </mesh>
      <lineSegments position={[0, -2.4, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(9.5, 0.9)]} />
        <lineBasicMaterial color="#FFB347" transparent opacity={0.25} />
      </lineSegments>
      <Text position={[0, -2.4, 0.02]} fontSize={0.16} color="#EDE7DB" font={undefined}>
        {"U_Φ(x) Feature Map  ──►  ZZ Entangling Gates (CNOT)  ──►  RealAmplitudes Ansatz W(θ)"}
      </Text>
    </group>
  );
}

// Act 4: 16 Basis State Probability Pillars
function Act4MeasurementPillars() {
  const { result } = useQuantumStore();
  const entries = Object.entries(result.state_probabilities || {});

  return (
    <group position={[0, -1.2, 0]}>
      {entries.map(([state, prob], i) => {
        const x = (i % 8) * 1.15 - 4.0;
        const z = Math.floor(i / 8) * 1.4 - 0.7;
        const height = Math.max(0.15, prob * 14);

        const numOnes = state.split("").filter((b) => b === "1").length;
        const isEven = numOnes % 2 === 0;
        const pillarColor = isEven ? tokens.colors.risk.low : tokens.colors.risk.high;

        return (
          <group key={state} position={[x, 0, z]}>
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[0.55, height, 0.55]} />
              <meshStandardMaterial
                color={pillarColor}
                emissive={pillarColor}
                emissiveIntensity={0.35}
                roughness={0.3}
              />
            </mesh>
            <Text position={[0, -0.2, 0.35]} fontSize={0.12} color="#EDE7DB" font={undefined}>
              {`|${state}⟩`}
            </Text>
            <Text position={[0, height + 0.2, 0]} fontSize={0.11} color="#FFB347" font={undefined}>
              {`${(prob * 100).toFixed(0)}%`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Act 5: Luminous Verdict Core Gauge
function Act5VerdictCore() {
  const { result } = useQuantumStore();
  const coreRef = useRef<THREE.Group>(null);
  const color = getRiskColor(result.risk_level);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Rotating Core Group */}
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.65}
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Ground Glow Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <ringGeometry args={[1.8, 2.2, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Label */}
      <Text position={[0, -2.1, 0]} fontSize={0.32} color="#EDE7DB" font={undefined}>
        {`${result.risk_level.toUpperCase()} RISK: ${(result.risk_probability * 100).toFixed(1)}%`}
      </Text>
    </group>
  );
}

// Master Verdict Chamber 3D Canvas
export function VerdictChamber3D() {
  const { act, mode, use2DFallback, autoRotate } = useQuantumStore();

  if (use2DFallback) {
    return <Fallback2DView />;
  }

  return (
    <div className="w-full h-full relative bg-ink select-none overflow-hidden rounded-2xl border border-hairline shadow-2xl">
      <Canvas
        camera={{ position: [0, 1.2, 9.0], fov: 46 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={[tokens.colors.ink]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 8]} intensity={0.9} color="#EDE7DB" />
        <pointLight position={[-6, -4, -4]} intensity={1.2} color="#FFB347" />

        {/* Camera Rig with smooth act transitions */}
        <CameraRigController act={act} mode={mode} />

        {/* Orbit Controls (Only in Explore mode or with autoRotate) */}
        {(mode === "explore" || autoRotate) && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate={autoRotate}
            autoRotateSpeed={1.0}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minDistance={4}
            maxDistance={14}
          />
        )}

        {/* Suspended 3D Scenes by Act */}
        <Suspense fallback={null}>
          {act === 1 && <Act1PatientView />}
          {act === 2 && <Act2BlochSpheres />}
          {act === 3 && <Act3EntanglementView />}
          {act === 4 && <Act4MeasurementPillars />}
          {act === 5 && <Act5VerdictCore />}
          {mode === "explore" && act !== 4 && act !== 5 && <Act3EntanglementView />}
          {mode === "explore" && (act === 4 || act === 5) && <Act5VerdictCore />}
        </Suspense>
      </Canvas>
    </div>
  );
}
