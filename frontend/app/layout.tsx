import "./globals.css";
import React from "react";
import Link from "next/link";
import { Activity, Cpu, Layers, ShieldCheck, Radio, HeartPulse, Sparkles } from "lucide-react";

export const metadata = {
  title: "QuantumRisk | Hybrid QML Patient Risk Prediction (PS #28)",
  description: "Capstone 23CSE463: Quantum Machine Learning for Clinical Risk Stratification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col antialiased selection:bg-teal-500 selection:text-black relative overflow-x-hidden clinical-subtle-grid">
        {/* Soft Moving Ambient Background Aurora Blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-teal-500/10 via-cyan-500/08 to-transparent blur-[120px] animate-aurora-1" />
          <div className="absolute top-[25%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-600/10 via-indigo-600/08 to-teal-500/08 blur-[130px] animate-aurora-2" />
          <div className="absolute -bottom-[15%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-t from-emerald-500/10 via-teal-500/08 to-transparent blur-[110px] animate-aurora-1" />
        </div>

        {/* Top Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#080d1a]/85 border-b border-slate-800/80 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 p-0.5 shadow-md shadow-teal-500/20 group-hover:shadow-teal-500/40 transition">
                <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                    QuantumRisk
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-800/80 font-mono font-bold">
                    PS #28
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Hybrid QML Clinical Risk Prediction
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-xs text-slate-300">
              <Link
                href="/intake"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1.5"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Patient Intake</span>
              </Link>

              <Link
                href="/lab"
                className="px-3.5 py-2 rounded-lg bg-teal-950/40 border border-teal-800/60 text-teal-300 font-semibold hover:bg-teal-900/50 transition flex items-center space-x-1.5"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>3D Quantum Lab</span>
              </Link>

              <Link
                href="/compare"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1.5"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Model Benchmarks</span>
              </Link>

              <Link
                href="/noise"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1.5"
              >
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Noise Lab</span>
              </Link>

              <Link
                href="/training"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span>Live Theatre</span>
              </Link>

              <Link
                href="/ethics"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1.5 text-slate-400"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Governance & Ethics</span>
              </Link>
            </nav>

            {/* Quick Launch CTA */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Simulator Ready</span>
              </div>

              <Link
                href="/lab"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs tracking-wide shadow-md shadow-teal-500/20 transition flex items-center space-x-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Open 3D Lab</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Page Body */}
        <main className="flex-1 relative z-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#060914] py-6 px-6 text-xs text-slate-500 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-teal-400">QuantumRisk (PS #28)</span>
              <span>•</span>
              <span>Capstone 23CSE463: Quantum Computing</span>
              <span>•</span>
              <span>UCI Cleveland Heart & Pima Indians Diabetes</span>
            </div>
            <div className="text-amber-400/90 font-mono text-[11px] flex items-center space-x-1.5">
              <span>⚠️</span>
              <span>Clinical Decision-Support Research Prototype. Educational & Exploratory.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
