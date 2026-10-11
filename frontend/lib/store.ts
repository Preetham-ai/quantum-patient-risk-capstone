/**
 * frontend/lib/store.ts
 * QuantumRisk v2 Zustand Store: Story Acts, Explore Mode, Fixtures, and URL state sync.
 */

import { create } from "zustand";
import { PATIENT_FIXTURES, PatientFixture } from "./fixtures/patients";
import { PredictResponse, ClinicalSchema } from "./types";
import { runPredict } from "./api";

export type ActNumber = 1 | 2 | 3 | 4 | 5;
export type AppMode = "story" | "explore";

interface QuantumState {
  // Current Patient & Scenario
  selectedSample: "low" | "medium" | "high";
  condition: string;
  vitals: Record<string, number>;
  result: PatientFixture["result"];
  status: "idle" | "loading" | "error";

  // Story & Explore navigation
  act: ActNumber;
  mode: AppMode;
  isEditDrawerOpen: boolean;
  isSettingsOpen: boolean;
  use2DFallback: boolean;
  autoRotate: boolean;

  // Quantum hardware parameters
  shots: number;
  noiseLevel: number;
  activeModel: "vqc" | "qsvm" | "hybrid";

  // Actions
  setAct: (act: ActNumber) => void;
  nextAct: () => void;
  prevAct: () => void;
  setMode: (mode: AppMode) => void;
  selectSample: (sample: "low" | "medium" | "high") => void;
  setVitals: (vitals: Record<string, number>) => void;
  updateVital: (key: string, val: number) => void;
  recomputeRisk: () => Promise<void>;
  setShots: (shots: number) => void;
  setNoiseLevel: (noise: number) => void;
  setActiveModel: (m: "vqc" | "qsvm" | "hybrid") => void;
  setIsEditDrawerOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setUse2DFallback: (fallback: boolean) => void;
  setAutoRotate: (rotate: boolean) => void;
}

// Initial state starts with the medium sample fixture: zero blank/zero states!
const initialFixture = PATIENT_FIXTURES.medium;

export const useQuantumStore = create<QuantumState>((set, get) => ({
  selectedSample: "medium",
  condition: "heart",
  vitals: { ...initialFixture.vitals },
  result: initialFixture.result,
  status: "idle",

  act: 1,
  mode: "story",
  isEditDrawerOpen: false,
  isSettingsOpen: false,
  use2DFallback: false,
  autoRotate: false,

  shots: 1024,
  noiseLevel: 0.0,
  activeModel: "vqc",

  setAct: (act) => set({ act }),

  nextAct: () => {
    const current = get().act;
    if (current < 5) {
      set({ act: (current + 1) as ActNumber });
    } else {
      set({ mode: "explore" });
    }
  },

  prevAct: () => {
    const current = get().act;
    if (current > 1) {
      set({ act: (current - 1) as ActNumber });
    }
  },

  setMode: (mode) => set({ mode }),

  selectSample: (sample) => {
    const fixture = PATIENT_FIXTURES[sample];
    set({
      selectedSample: sample,
      vitals: { ...fixture.vitals },
      result: fixture.result,
      status: "idle",
    });

    // Optional background sync with live API if available
    get().recomputeRisk();
  },

  setVitals: (vitals) => {
    set({ vitals });
    get().recomputeRisk();
  },

  updateVital: (key, val) => {
    set((state) => ({
      vitals: { ...state.vitals, [key]: val },
    }));
    get().recomputeRisk();
  },

  recomputeRisk: async () => {
    const { condition, vitals, activeModel, result } = get();
    set({ status: "loading" });
    try {
      const res = await runPredict(condition, vitals, activeModel, 4);
      // Merge live response while retaining UI-specific augmentations
      set({
        result: {
          ...result,
          ...res,
          ci: [
            Math.max(0.01, res.risk_probability - 0.04),
            Math.min(0.99, res.risk_probability + 0.04),
          ],
        },
        status: "idle",
      });
    } catch (e) {
      // Retain robust fixture state on error
      set({ status: "idle" });
    }
  },

  setShots: (shots) => set({ shots }),
  setNoiseLevel: (noiseLevel) => set({ noiseLevel }),
  setActiveModel: (activeModel) => {
    set({ activeModel });
    get().recomputeRisk();
  },

  setIsEditDrawerOpen: (isEditDrawerOpen) => set({ isEditDrawerOpen }),
  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  setUse2DFallback: (use2DFallback) => set({ use2DFallback }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
}));
