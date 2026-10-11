import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartPulse, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-1 py-10 px-6 text-xs text-bone/60 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Branding & Course ID */}
        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center space-x-2 text-bone font-serif text-sm font-bold">
            <HeartPulse className="w-4 h-4 text-amber-signal" />
            <span>QuantumRisk v2</span>
            <span className="text-bone/30 font-sans">•</span>
            <span className="text-bone/70 font-mono text-xs">Capstone 23CSE463</span>
          </div>
          <p className="text-[11px] leading-relaxed text-bone/50">
            Problem Statement #28: Quantum Machine Learning for Clinical Patient Risk Stratification.
            Translating non-invasive clinical biomarkers into simulated entangled quantum states.
          </p>
        </div>

        {/* Center: Prominent Disclaimer */}
        <div className="p-3.5 rounded-xl bg-surface-2/80 border border-hairline max-w-xl text-[11px] leading-relaxed">
          <div className="flex items-center space-x-1.5 font-bold text-bone mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-signal" />
            <span>Academic Research Disclaimer</span>
          </div>
          <p className="text-bone/60">
            QuantumRisk is an academic research prototype. It is <strong>not</strong> an FDA-cleared diagnostic device and should never replace qualified clinical judgment, emergency triage, or formal diagnosis.
          </p>
        </div>

        {/* Right Links */}
        <div className="flex flex-col space-y-1 text-[11px] font-mono">
          <Link href="/benchmarks" className="hover:text-amber-signal transition">
            → 5-Fold Cross Validation
          </Link>
          <Link href="/about" className="hover:text-amber-signal transition">
            → Clinical Governance &amp; Ethics
          </Link>
          <a
            href="https://github.com/Preetham-ai/quantum-patient-risk-capstone"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-signal transition flex items-center space-x-1"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
