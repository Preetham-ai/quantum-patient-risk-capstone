"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GuidedStep } from "@/lib/store";

interface CameraRigProps {
  activeStep: GuidedStep;
  isFreeOrbit: boolean;
}

export function CameraRig({ activeStep, isFreeOrbit }: CameraRigProps) {
  const targetPos = useRef(new THREE.Vector3(0, 1, 10));
  const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));

  // Determine target camera coordinates based on guided tour stage
  switch (activeStep) {
    case "encode":
      targetPos.current.set(-1.0, 0.5, 7.5);
      lookAtPos.current.set(-1.0, 0, 0);
      break;
    case "entangle":
      targetPos.current.set(-1.0, 2.8, 6.0);
      lookAtPos.current.set(-1.0, 0, 0);
      break;
    case "measure":
      targetPos.current.set(0, 1.2, 7.2);
      lookAtPos.current.set(0, -0.6, 2.5);
      break;
    case "result":
      targetPos.current.set(5.2, 0.5, 4.2);
      lookAtPos.current.set(5.5, 0, 0);
      break;
    case "intake":
    default:
      targetPos.current.set(0, 1.5, 9.5);
      lookAtPos.current.set(0, 0, 0);
      break;
  }

  useFrame((state, delta) => {
    if (!isFreeOrbit) {
      // Smooth lerp camera movement
      state.camera.position.lerp(targetPos.current, 0.05);
      const currentLookAt = new THREE.Vector3(0, 0, 0);
      state.camera.getWorldDirection(currentLookAt);
      state.camera.lookAt(lookAtPos.current);
    }
  });

  return isFreeOrbit ? <OrbitControls enableDamping dampingFactor={0.05} /> : null;
}
