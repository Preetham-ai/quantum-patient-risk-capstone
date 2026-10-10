"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Activity, Cpu, Sparkles, CheckCircle2, RefreshCw, BookOpen } from "lucide-react";

interface EpochMetric {
  epoch: number;
  total_epochs: number;
  loss: number;
  train_acc: number;
  val_auroc: number;
  grad_norm: number;
  time_ms: number;
}

export default function TrainingTheatrePage() {
  const [modelType, setModelType] = useState<"vqc" | "hybrid">("vqc");
  const [condition, setCondition] = useState<string>("heart");
  const [epochs, setEpochs] = useState<number>(15);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<EpochMetric[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("Ready to optimize variational parameters");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);

  const startTraining = () => {
    setMetrics([]);
    setIsCompleted(false);
    setIsTraining(true);
    setStatusMessage("Connecting to quantum training backend...");

    const wsUrl = `ws://localhost:8000/ws/train?condition=${condition}&model=${modelType}&epochs=${epochs}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setStatusMessage("Quantum training session initialized. Optimizing parameters...");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "epoch_update") {
          setMetrics((prev) => [...prev, data.metrics]);
        } else if (data.type === "training_complete") {
          setIsCompleted(true);
          setIsTraining(false);
          setStatusMessage("Training completed successfully! Variational parameters converged.");
        } else if (data.type === "error") {
          setStatusMessage(`Error: ${data.message}`);
          setIsTraining(false);
        }
      } catch (err) {
        console.error("WS Parse error", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      setStatusMessage("WebSocket connection failed. Ensure backend uvicorn is running on port 8000.");
      setIsTraining(false);
    };

    ws.onclose = () => {
      setIsTraining(false);
    };
  };

  const stopTraining = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsTraining(false);
    setStatusMessage("Training stopped by user.");
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const latestMetric = metrics[metrics.length - 1];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Live Quantum Parameter Optimization Theatre</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Real-Time QML Training Stream
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Streaming live loss landscape descent, parameter-shift rule gradients, and validation AUROC via WebSockets.
          </p>
        </div>
      </div>

      {/* WHY, WHAT, HOW Callout for Live Theatre */}
      <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-teal-500/30 shadow-xl backdrop-blur-md">
        <div className="flex items-start space-x-3.5">
          <BookOpen className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <h3 className="font-bold text-white text-sm">
              Why, What &amp; How: The Live Training Theatre
            </h3>
            <p>
              <strong className="text-teal-400">WHY:</strong> Clinical AI cannot be an unmonitored black box. Clinicians and reviewers need empirical proof that variational quantum parameters (θ ∈ ℝ⁸) are descending a well-behaved loss landscape without suffering from <em>barren plateaus</em> (exponential gradient vanishing: Var(∂⟨M⟩/∂θ) ~ O(2⁻ⁿ)).
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] space-y-1">
              <span className="text-slate-400 block">// Exact Analytic Quantum Gradient via Parameter Shift Rule:</span>
              <span className="text-cyan-300 font-bold block">
                {"∂⟨M⟩ / ∂θ_j = (1/2) · [ ⟨M⟩_(θ_j + π/2) - ⟨M⟩_(θ_j - π/2) ]"}
              </span>
              <span className="text-slate-400 block pt-1">// Empirical Risk Minimization Loss Function:</span>
              <span className="text-emerald-300 font-bold block">
                {"L_BCE(θ) = -(1/N) ∑ [ y_i log ŷ_i(θ) + (1 - y_i) log(1 - ŷ_i(θ)) ] + (λ/2) ||θ||²"}
              </span>
            </div>
            <p className="pt-1">
              <strong className="text-teal-400">WHAT &amp; HOW:</strong> The theatre executes live iterations via Python backend WebSockets (ws://localhost:8000/ws/train), reporting epoch losses, batch convergence accuracies, and test AUROCs directly in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {/* Model Selection */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
            Model
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setModelType("vqc")}
              disabled={isTraining}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                modelType === "vqc"
                  ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25"
                  : "bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              VQC (8 params)
            </button>
            <button
              onClick={() => setModelType("hybrid")}
              disabled={isTraining}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                modelType === "hybrid"
                  ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25"
                  : "bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Hybrid (PennyLane)
            </button>
          </div>
        </div>

        {/* Dataset Selection */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
            Dataset
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setCondition("heart")}
              disabled={isTraining}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                condition === "heart"
                  ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25"
                  : "bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Heart (303)
            </button>
            <button
              onClick={() => setCondition("pima")}
              disabled={isTraining}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                condition === "pima"
                  ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25"
                  : "bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Pima (768)
            </button>
          </div>
        </div>

        {/* Epochs Slider */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Epochs
            </label>
            <span className="font-mono text-teal-400 text-xs font-bold">{epochs}</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={epochs}
            disabled={isTraining}
            onChange={(e) => setEpochs(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* Action Button */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center">
          {isTraining ? (
            <button
              onClick={stopTraining}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2 shadow-md shadow-rose-600/30"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Halt Optimization</span>
            </button>
          ) : (
            <button
              onClick={startTraining}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2 shadow-md shadow-teal-500/25"
            >
              <Play className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>Start Training Stream</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Status Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 shadow-lg">
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-mono text-slate-400 font-bold">Status:</span>
          <span className="font-semibold text-white">{statusMessage}</span>
        </div>

        {isTraining && (
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono font-bold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Streaming Live WS Telemetry</span>
          </div>
        )}
      </div>

      {/* Live Metrics Tiles */}
      {latestMetric && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Current Loss</span>
            <div className="text-2xl font-bold font-mono text-teal-400">
              {latestMetric.loss.toFixed(4)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Binary cross-entropy loss</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Validation AUROC</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {(latestMetric.val_auroc * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Cross-validation fold</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Train Accuracy</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {(latestMetric.train_acc * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Batch convergence</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Epoch Time</span>
            <div className="text-2xl font-bold font-mono text-slate-300">
              {latestMetric.time_ms.toFixed(0)} ms
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Simulation step latency</div>
          </div>
        </div>
      )}

      {/* Stream Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 font-mono text-slate-400 bg-slate-950/60">
              <th className="py-3 px-4">Epoch</th>
              <th className="py-3 px-4">Loss</th>
              <th className="py-3 px-4">Train Acc</th>
              <th className="py-3 px-4">Val AUROC</th>
              <th className="py-3 px-4">Grad Norm</th>
              <th className="py-3 px-4">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {metrics.map((m) => (
              <tr key={m.epoch} className="hover:bg-slate-800/40 transition">
                <td className="py-2.5 px-4 font-bold text-white">
                  {m.epoch} / {m.total_epochs}
                </td>
                <td className="py-2.5 px-4 text-teal-400">{m.loss.toFixed(4)}</td>
                <td className="py-2.5 px-4 text-cyan-300">{(m.train_acc * 100).toFixed(1)}%</td>
                <td className="py-2.5 px-4 font-bold text-emerald-400">{(m.val_auroc * 100).toFixed(1)}%</td>
                <td className="py-2.5 px-4 text-slate-300">{m.grad_norm.toFixed(4)}</td>
                <td className="py-2.5 px-4 text-slate-400">{m.time_ms.toFixed(0)} ms</td>
              </tr>
            ))}
            {metrics.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No training stream active. Click &quot;Start Training Stream&quot; to begin optimizing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
