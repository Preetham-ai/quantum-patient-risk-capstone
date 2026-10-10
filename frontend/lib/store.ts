/**
 * frontend/lib/store.ts
 * Global application state management with Zustand.
 */

import { create } from "zustand";
import { PredictResponse, ClinicalSchema } from "./types";

export type GuidedStep = "intake" | "encode" | "entangle" | "measure" | "result";

interface AppState {
  condition: string;
  setCondition: (c: string) => void;
  
  vitals: Record<string, number>;
  setVitals: (v: Record<string, number>) => void;
  updateVital: (key: string, val: number) => void;
  
  activeModel: "vqc" | "qsvm" | "hybrid";
  setActiveModel: (m: "vqc" | "qsvm" | "hybrid") => void;
  
  predictResult: PredictResponse | null;
  setPredictResult: (r: PredictResponse | null) => void;
  
  activeStep: GuidedStep;
  setActiveStep: (s: GuidedStep) => void;
  
  isFreeOrbit: boolean;
  setIsFreeOrbit: (b: boolean) => void;
  
  schema: ClinicalSchema | null;
  setSchema: (s: ClinicalSchema | null) => void;
}

export const useQuantumStore = create<AppState>((set) => ({
  condition: "heart",
  setCondition: (condition) => set({ condition }),
  
  vitals: {
    age: 55,
    sex: 1,
    cp: 2,
    trestbps: 135,
    chol: 245,
    fbs: 0,
    restecg: 1,
    thalach: 145,
    exang: 0,
    oldpeak: 1.4,
    slope: 1,
    ca: 1,
    thal: 2,
  },
  setVitals: (vitals) => set({ vitals }),
  updateVital: (key, val) =>
    set((state) => ({
      vitals: { ...state.vitals, [key]: val },
    })),
    
  activeModel: "vqc",
  setActiveModel: (activeModel) => set({ activeModel }),
  
  predictResult: null,
  setPredictResult: (predictResult) => set({ predictResult }),
  
  activeStep: "intake",
  setActiveStep: (activeStep) => set({ activeStep }),
  
  isFreeOrbit: false,
  setIsFreeOrbit: (isFreeOrbit) => set({ isFreeOrbit }),
  
  schema: null,
  setSchema: (schema) => set({ schema }),
}));
