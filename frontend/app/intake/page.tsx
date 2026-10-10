"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuantumStore } from "@/lib/store";
import { runPredict, fetchSchema } from "@/lib/api";
import {
  Activity,
  Sparkles,
  ChevronRight,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  Cpu,
  HeartPulse,
  Stethoscope,
  Info,
  ShieldAlert,
} from "lucide-react";

export default function PatientIntakePage() {
  const router = useRouter();
  const {
    condition,
    setCondition,
    vitals,
    setVitals,
    updateVital,
    activeModel,
    setActiveModel,
    setPredictResult,
    schema,
    setSchema,
  } = useQuantumStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch condition schema on mount or when condition changes
  useEffect(() => {
    async function loadSchema() {
      try {
        const s = await fetchSchema(condition);
        setSchema(s);
      } catch (e) {
        console.error("Schema fetch error:", e);
      }
    }
    loadSchema();
  }, [condition, setSchema]);

  // Heart clinical features with rich medical interpretation notes
  const heartFeatures = [
    {
      key: "age",
      label: "Patient Age",
      min: 25,
      max: 80,
      step: 1,
      unit: "years",
      default: 55,
      medNote: "Non-modifiable cardiovascular risk factor. Risk doubles every decade above 45 in males.",
    },
    {
      key: "trestbps",
      label: "Resting Blood Pressure",
      min: 90,
      max: 200,
      step: 1,
      unit: "mmHg",
      default: 135,
      medNote: "Systolic arterial pressure. >140 mmHg indicates Stage 2 hypertension causing vascular shear stress.",
    },
    {
      key: "chol",
      label: "Serum Cholesterol",
      min: 120,
      max: 400,
      step: 1,
      unit: "mg/dL",
      default: 245,
      medNote: "Total blood cholesterol. >240 mg/dL accelerates atheromatous plaque formation in coronary arteries.",
    },
    {
      key: "thalach",
      label: "Max Heart Rate Achieved",
      min: 70,
      max: 210,
      step: 1,
      unit: "bpm",
      default: 145,
      medNote: "Peak chronotropic response on treadmill stress test. Low values indicate chronotropic incompetence.",
    },
    {
      key: "oldpeak",
      label: "ST Depression (Exercise)",
      min: 0.0,
      max: 6.0,
      step: 0.1,
      unit: "mm",
      default: 1.2,
      medNote: "ECG ST segment depression induced by exercise. >1.5 mm is strongly diagnostic of myocardial ischemia.",
    },
    {
      key: "cp",
      label: "Chest Pain Type",
      min: 0,
      max: 3,
      step: 1,
      unit: "class",
      default: 2,
      medNote: "0: Asymptomatic (silent ischemia), 1: Atypical angina, 2: Non-anginal pain, 3: Typical angina.",
    },
    {
      key: "ca",
      label: "Major Vessels (Fluoroscopy)",
      min: 0,
      max: 3,
      step: 1,
      unit: "vessels",
      default: 1,
      medNote: "Number of major coronary vessels colored by fluoroscopy dye (0-3). Reflects anatomical stenosis.",
    },
    {
      key: "thal",
      label: "Thallium Stress Scintigraphy",
      min: 1,
      max: 3,
      step: 1,
      unit: "class",
      default: 2,
      medNote: "1: Normal blood perfusion, 2: Fixed perfusion defect (old infarct), 3: Reversible defect (active ischemia).",
    },
    {
      key: "sex",
      label: "Biological Sex",
      min: 0,
      max: 1,
      step: 1,
      unit: "binary",
      default: 1,
      medNote: "0: Female, 1: Male. Males historically display earlier onset of coronary artery disease.",
    },
    {
      key: "fbs",
      label: "Fasting Blood Sugar > 120 mg/dl",
      min: 0,
      max: 1,
      step: 1,
      unit: "binary",
      default: 0,
      medNote: "1: Elevated fasting blood glucose (diabetic metabolic stress), 0: Normal glucose homeostasis.",
    },
    {
      key: "restecg",
      label: "Resting ECG Results",
      min: 0,
      max: 2,
      step: 1,
      unit: "class",
      default: 1,
      medNote: "0: Normal, 1: ST-T wave abnormality (T wave inversions), 2: Left ventricular hypertrophy.",
    },
    {
      key: "exang",
      label: "Exercise Induced Angina",
      min: 0,
      max: 1,
      step: 1,
      unit: "binary",
      default: 0,
      medNote: "1: Chest pain provoked by physical exertion due to coronary blood supply insufficiency, 0: No.",
    },
    {
      key: "slope",
      label: "Slope of Peak Exercise ST",
      min: 0,
      max: 2,
      step: 1,
      unit: "class",
      default: 1,
      medNote: "0: Upsloping (normal), 1: Flat (borderline ischemia), 2: Downsloping (severe ischemia).",
    },
  ];

  // Pima features
  const pimaFeatures = [
    {
      key: "Glucose",
      label: "Plasma Glucose Concentration",
      min: 50,
      max: 200,
      step: 1,
      unit: "mg/dL",
      default: 120,
      medNote: "2-hour oral glucose tolerance test. >140 mg/dL indicates impaired glucose tolerance; >200 mg/dL diabetes.",
    },
    {
      key: "BMI",
      label: "Body Mass Index",
      min: 18.0,
      max: 55.0,
      step: 0.1,
      unit: "kg/m²",
      default: 28.5,
      medNote: "Weight in kg/(height in m)². >30 kg/m² indicates obesity driving peripheral insulin resistance.",
    },
    {
      key: "Age",
      label: "Patient Age",
      min: 21,
      max: 80,
      step: 1,
      unit: "years",
      default: 35,
      medNote: "Metabolic pancreatic beta-cell reserve declines progressively with age.",
    },
    {
      key: "BloodPressure",
      label: "Diastolic Blood Pressure",
      min: 40,
      max: 130,
      step: 1,
      unit: "mmHg",
      default: 72,
      medNote: "Diastolic arterial pressure. Hypertension strongly accelerates diabetic nephropathy.",
    },
    {
      key: "DiabetesPedigreeFunction",
      label: "Diabetes Pedigree Function",
      min: 0.08,
      max: 2.4,
      step: 0.01,
      unit: "score",
      default: 0.47,
      medNote: "Genetic score synthesizing family history of diabetes across first and second-degree relatives.",
    },
    {
      key: "Pregnancies",
      label: "Number of Pregnancies",
      min: 0,
      max: 15,
      step: 1,
      unit: "count",
      default: 1,
      medNote: "Multiparity correlates with gestational diabetic episodes and prolonged insulin resistance.",
    },
    {
      key: "SkinThickness",
      label: "Triceps Skinfold Thickness",
      min: 10,
      max: 70,
      step: 1,
      unit: "mm",
      default: 25,
      medNote: "Subcutaneous adipose fat caliper measure estimating central body adiposity.",
    },
    {
      key: "Insulin",
      label: "2-Hour Serum Insulin",
      min: 15,
      max: 600,
      step: 1,
      unit: "μU/mL",
      default: 85,
      medNote: "Post-prandial serum insulin level. Hyperinsulinemia reflects systemic insulin resistance.",
    },
  ];

  const currentFeatures = condition === "heart" ? heartFeatures : pimaFeatures;

  // Preset Handlers with clinical narrative
  const applyPreset = (riskLevel: "low" | "medium" | "high") => {
    if (condition === "heart") {
      if (riskLevel === "low") {
        setVitals({
          age: 38, sex: 0, cp: 1, trestbps: 112, chol: 175, fbs: 0,
          restecg: 0, thalach: 178, exang: 0, oldpeak: 0.2, slope: 2, ca: 0, thal: 2
        });
      } else if (riskLevel === "medium") {
        setVitals({
          age: 54, sex: 1, cp: 2, trestbps: 135, chol: 240, fbs: 0,
          restecg: 1, thalach: 142, exang: 0, oldpeak: 1.4, slope: 1, ca: 1, thal: 2
        });
      } else {
        setVitals({
          age: 68, sex: 1, cp: 0, trestbps: 168, chol: 295, fbs: 1,
          restecg: 2, thalach: 108, exang: 1, oldpeak: 3.2, slope: 1, ca: 2, thal: 3
        });
      }
    } else {
      if (riskLevel === "low") {
        setVitals({
          Pregnancies: 1, Glucose: 88, BloodPressure: 66, SkinThickness: 18,
          Insulin: 45, BMI: 22.4, DiabetesPedigreeFunction: 0.24, Age: 24
        });
      } else if (riskLevel === "medium") {
        setVitals({
          Pregnancies: 3, Glucose: 132, BloodPressure: 78, SkinThickness: 28,
          Insulin: 115, BMI: 31.5, DiabetesPedigreeFunction: 0.52, Age: 42
        });
      } else {
        setVitals({
          Pregnancies: 6, Glucose: 184, BloodPressure: 88, SkinThickness: 42,
          Insulin: 280, BMI: 39.8, DiabetesPedigreeFunction: 1.15, Age: 55
        });
      }
    }
  };

  const handleConditionChange = (c: string) => {
    setCondition(c);
    if (c === "heart") {
      setVitals({
        age: 55, sex: 1, cp: 2, trestbps: 135, chol: 245, fbs: 0,
        restecg: 1, thalach: 145, exang: 0, oldpeak: 1.2, slope: 1, ca: 1, thal: 2
      });
    } else {
      setVitals({
        Pregnancies: 2, Glucose: 125, BloodPressure: 75, SkinThickness: 26,
        Insulin: 90, BMI: 29.5, DiabetesPedigreeFunction: 0.45, Age: 36
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await runPredict(condition, vitals, activeModel, 4);
      setPredictResult(res);
      router.push("/lab");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to execute quantum inference. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Medical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-teal-900/40">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-mono mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
            <span>Clinical Vitals Intake Engine • Problem Statement #28</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Patient Biomarker Profile Entry
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Input non-invasive clinical biomarkers. Mutual information extracts the top-4 dominant drivers into a 4-qubit Hilbert space.
          </p>
        </div>

        {/* Dataset Toggle */}
        <div className="flex items-center bg-[#030d22] border border-teal-900/60 rounded-xl p-1 shadow-inner">
          <button
            type="button"
            onClick={() => handleConditionChange("heart")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              condition === "heart"
                ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cleveland Heart Disease (303)
          </button>
          <button
            type="button"
            onClick={() => handleConditionChange("pima")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              condition === "pima"
                ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-bold shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pima Indians Diabetes (768)
          </button>
        </div>
      </div>

      {/* Preset Benchmarks Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* Quick Presets */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-[#030d22]/80 border border-teal-900/50 backdrop-blur-md shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 font-mono">
            Clinical Benchmark Patient Profiles
          </span>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => applyPreset("low")}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium transition flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Low Risk (Optimal Vitals)</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset("medium")}
              className="px-3.5 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 text-xs font-medium transition flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Medium Risk (Borderline Hypertension)</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset("high")}
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-medium transition flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>High Risk (Active Ischemia)</span>
            </button>
          </div>
        </div>

        {/* Quantum Architecture Selector */}
        <div className="p-5 rounded-2xl bg-[#030d22]/80 border border-teal-900/50 backdrop-blur-md shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 font-mono">
            Target Quantum Classifier
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveModel("vqc")}
              className={`p-2 rounded-xl text-xs font-medium text-center transition ${
                activeModel === "vqc"
                  ? "bg-teal-400/20 text-teal-300 border border-teal-500 font-bold"
                  : "bg-slate-900 text-slate-400 border border-transparent hover:text-white"
              }`}
            >
              VQC (Qiskit)
            </button>
            <button
              type="button"
              onClick={() => setActiveModel("qsvm")}
              className={`p-2 rounded-xl text-xs font-medium text-center transition ${
                activeModel === "qsvm"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500 font-bold"
                  : "bg-slate-900 text-slate-400 border border-transparent hover:text-white"
              }`}
            >
              QSVM (Kernel)
            </button>
            <button
              type="button"
              onClick={() => setActiveModel("hybrid")}
              className={`p-2 rounded-xl text-xs font-medium text-center transition ${
                activeModel === "hybrid"
                  ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500 font-bold"
                  : "bg-slate-900 text-slate-400 border border-transparent hover:text-white"
              }`}
            >
              Hybrid QNN
            </button>
          </div>
        </div>
      </div>

      {/* Main Form with Clinical Feature Explanations */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl bg-[#030d22]/80 border border-teal-900/50 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {currentFeatures.map((feat) => {
              const currentVal = vitals[feat.key] ?? feat.default;
              return (
                <div key={feat.key} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-teal-900/30">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-white">
                      {feat.label}
                    </label>
                    <span className="font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/80 font-bold">
                      {currentVal} {feat.unit}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={feat.min}
                    max={feat.max}
                    step={feat.step}
                    value={currentVal}
                    onChange={(e) => updateVital(feat.key, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400 hover:accent-teal-300"
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Min: {feat.min} {feat.unit}</span>
                    <span>Max: {feat.max} {feat.unit}</span>
                  </div>

                  {/* Plain-English Medical Meaning */}
                  <div className="text-[10px] text-slate-400 leading-tight pt-1">
                    {feat.medNote}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t border-teal-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>
                {condition === "heart"
                  ? "Top 4 features (cp, thalach, oldpeak, ca) will be mapped to qubits q[0]..q[3] via ZZFeatureMap."
                  : "Top 4 features (Glucose, BMI, Age, Insulin) will be mapped to qubits q[0]..q[3]."}
              </span>
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 px-3 py-1.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Quantum State...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Compute Quantum Risk & Launch 3D Lab</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
