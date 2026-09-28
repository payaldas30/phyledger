import React from 'react';
import { ShieldCheck, Cpu, Key, Radio, CheckCircle, Database, Lock, AlertCircle } from 'lucide-react';

interface HeroBannerProps {
  onNavigateToArchitecture?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigateToArchitecture }) => {
  const trustChainSteps = [
    { label: 'Physical Silicon', icon: <Cpu className="w-3.5 h-3.5" /> },
    { label: 'Simulated PUF', icon: <Key className="w-3.5 h-3.5" /> },
    { label: 'Hardware Identity', icon: <Lock className="w-3.5 h-3.5" /> },
    { label: 'Zero-Trust Auth', icon: <Radio className="w-3.5 h-3.5" /> },
    { label: 'Tx Validation', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { label: 'Adaptive Trust', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { label: 'Lightweight Consensus', icon: <Cpu className="w-3.5 h-3.5" /> },
    { label: 'Block Validation', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { label: 'Distributed Ledger', icon: <Database className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-950/95 p-6 mb-6 shadow-xl shadow-cyan-950/20 cyber-grid">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-32 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-32 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Hardware-Rooted IoT Cybersecurity Architecture
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight leading-tight">
            From Silicon to Ledger: <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              A hardware-rooted chain of trust for the IoT.
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            PHYLEDGER combines simulated PUF-based device identity, adaptive trust, lightweight permissioned consensus, and attack-aware blockchain validation in one interactive cyber-physical security platform.
          </p>
        </div>

        {/* Academic Requirement & Scope Notice Card */}
        <div className="lg:w-80 flex-shrink-0 p-3.5 rounded-lg bg-slate-900/80 border border-amber-500/30 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Academic Simulation Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Simulated results are generated dynamically in-browser for educational exploration. Reference-paper experimental benchmarks (e.g. Artix-7 FPGA measurements) are clearly demarcated. Raw PUF secrets remain device-local in the conceptual model and are never persisted.
          </p>
        </div>
      </div>

      {/* Visual Trust Chain Pipeline Breadcrumb */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Complete Hardware-Rooted Zero-Trust Pipeline:
          </span>
          {onNavigateToArchitecture && (
            <button
              onClick={onNavigateToArchitecture}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
            >
              Interactive Architecture View &rarr;
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {trustChainSteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/70 border border-slate-700/60 text-slate-300 text-[11px] font-mono whitespace-nowrap shadow-sm">
                <span className="text-cyan-400">{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {idx < trustChainSteps.length - 1 && (
                <span className="text-slate-600 font-mono text-xs select-none">&rarr;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
