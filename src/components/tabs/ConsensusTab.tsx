import React, { useState } from 'react';
import { 
  Zap, 
  Cpu, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Info,
  Clock,
  Layers,
  Activity
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { REFERENCE_BENCHMARKS } from '../../utils/initialData';

export const ConsensusTab: React.FC = () => {
  const { 
    consensusAlgorithm, 
    setConsensusAlgorithm, 
    consensusDifficulty, 
    setConsensusDifficulty,
    mineNewBlock,
    isMining,
    miningMetrics,
    blocks
  } = useSimulation();

  const [activeMiningTab, setActiveMiningTab] = useState<'SIMULATOR' | 'FPGA_BENCHMARKS'>('SIMULATOR');

  // Comparison specs between the two modes
  const modeData = {
    'CLFSR-SIMULATED': {
      name: 'CLFSR-Inspired Lightweight Simulation',
      tagline: 'Cascaded Linear Feedback Shift Register Mining Core for Resource-Constrained IoT',
      powerEstimate: '0.12 W (120 mW)',
      throughputEstimate: '3.13 Mhash/s',
      energyPerHash: '38.3 nJ / hash',
      fpgaResources: '142 LUTs / 88 FFs (0.4% Artix-7)',
      suitability: 'Low-power IoT Gateways, Smart Grid nodes, Microcontrollers',
      cryptoNotes: 'Simulated lightweight consensus — for permissioned IoT networks with hardware-rooted identity.'
    },
    'SHA-256-REF': {
      name: 'SHA-256 Reference Benchmark Mode',
      tagline: 'Full Cryptographic 64-Round Double-SHA-256 Hash Engine',
      powerEstimate: '1.82 W (1820 mW)',
      throughputEstimate: '2.40 Mhash/s',
      energyPerHash: '758.3 nJ / hash',
      fpgaResources: '1,840 LUTs / 1,220 FFs (6.1% Artix-7)',
      suitability: 'High-power Servers, ASIC Miners, Enterprise Gateways',
      cryptoNotes: 'Full collision-resistant cryptographic hash for unpermissioned public ledgers.'
    }
  };

  const currentMode = modeData[consensusAlgorithm];

  return (
    <div className="space-y-6">
      {/* Top Banner with Strict Required Label */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Consensus Simulator: SHA-256 Reference vs CLFSR Lightweight Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Evaluate hardware resource, thermal power, and energy consumption tradeoffs in permissioned IoT consensus.
            </p>
          </div>

          {/* REQUIRED DISCLAIMER BANNER */}
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-2 max-w-md">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="font-bold">
              “SIMULATED LIGHTWEIGHT CONSENSUS — NOT A CRYPTOGRAPHIC HASH REPLACEMENT.”
            </span>
          </div>
        </div>

        {/* Algorithm Switcher Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setConsensusAlgorithm('CLFSR-SIMULATED')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                consensusAlgorithm === 'CLFSR-SIMULATED'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CLFSR-Inspired Lightweight Simulation
            </button>
            <button
              onClick={() => setConsensusAlgorithm('SHA-256-REF')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                consensusAlgorithm === 'SHA-256-REF'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SHA-256 Reference Mode
            </button>
          </div>

          {/* Difficulty Slider */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Target Difficulty:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(d => (
                <button
                  key={d}
                  onClick={() => setConsensusDifficulty(d)}
                  className={`w-7 h-7 rounded text-xs font-bold border ${
                    consensusDifficulty === d
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500">({'0'.repeat(consensusDifficulty)} prefix)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Mining Simulator & Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Interactive Mining Engine */}
        <div className="rounded-2xl glass-panel p-5 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Live Consensus Mining Engine</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                Block #{blocks.length}
              </span>
            </div>

            {/* Mining Status Viewport */}
            <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Algorithm:</span>
                <span className="font-bold text-white">{currentMode.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Difficulty Target:</span>
                <span className="text-amber-400 font-bold">
                  {consensusDifficulty} Leading Zeros ({'0'.repeat(consensusDifficulty)}...)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Simulated Hash Attempts:</span>
                <span className="text-cyan-300 font-bold">
                  {isMining ? 'Calculating proof...' : `${miningMetrics.hashesAttempted.toLocaleString()} attempts`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Execution Latency:</span>
                <span className="text-emerald-400 font-bold">
                  {isMining ? 'Spinning cycles...' : `${miningMetrics.elapsedMs} ms`}
                </span>
              </div>

              {miningMetrics.foundNonce !== null && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>CONSENSUS PROOF DISCOVERED!</span>
                  </div>
                  <div className="text-[11px]">
                    Valid Nonce: <span className="text-white font-bold">{miningMetrics.foundNonce}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => mineNewBlock()}
            disabled={isMining}
            className="w-full py-3 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-4"
          >
            {isMining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Solving Simulated Proof of Consensus...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Execute Mining Cycle ({consensusAlgorithm === 'CLFSR-SIMULATED' ? 'Lightweight' : 'SHA-256'})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Comparative Metrics & Tradeoffs */}
        <div className="rounded-2xl glass-panel p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Comparative Technical Parameters</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Simulation Model
            </span>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[11px] uppercase">Estimated Power Draw</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                {currentMode.powerEstimate}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {consensusAlgorithm === 'CLFSR-SIMULATED' ? '15x lower power than SHA-256' : 'Standard FPGA power dissipation'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[11px] uppercase">Simulated Throughput</span>
              <div className="text-xl font-bold text-cyan-300 mt-1">
                {currentMode.throughputEstimate}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                At 50 MHz core frequency
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[11px] uppercase">Energy Per Hash Attempt</span>
              <div className="text-xl font-bold text-amber-400 mt-1">
                {currentMode.energyPerHash}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {consensusAlgorithm === 'CLFSR-SIMULATED' ? '94.9% energy saving' : 'Baseline cryptographic cost'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[11px] uppercase">FPGA Slice Utilization</span>
              <div className="text-xl font-bold text-indigo-400 mt-1">
                {currentMode.fpgaResources}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Xilinx Artix-7 XC7A100T
              </div>
            </div>
          </div>

          {/* Theoretical Suitability Note */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1.5">
            <div className="text-slate-400">
              <strong>Target Application:</strong> {currentMode.suitability}
            </div>
            <div className="text-slate-400">
              <strong>Cryptographic Scope:</strong> {currentMode.cryptoNotes}
            </div>
          </div>
        </div>
      </div>

      {/* Reference-Paper Experimental Benchmarks Section (Required to be clearly separated) */}
      <div className="rounded-2xl glass-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                Reference-Paper Experimental Benchmarks
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Strictly cited from peer-reviewed literature. Clearly distinct from in-browser simulation metrics.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
            Published Hardware Benchmarks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REFERENCE_BENCHMARKS.map((bm, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono text-xs space-y-2.5 relative overflow-hidden"
            >
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Reference Benchmark #{idx + 1}
              </div>
              <div className="text-sm font-heading font-bold text-white">
                {bm.title}
              </div>

              <div className="space-y-1 text-slate-300 text-[11px] pt-1 border-t border-slate-800">
                <div>Target Hardware: <span className="text-white font-medium">{bm.platform}</span></div>
                <div>Measured Throughput: <span className="text-emerald-400 font-bold">{bm.throughput}</span></div>
                <div>Measured Power: <span className="text-amber-400 font-bold">{bm.power}</span></div>
                <div>Energy / Unit: <span className="text-cyan-300 font-bold">{bm.energyPerHash}</span></div>
                <div>FPGA LUTs: <span className="text-white">{bm.fpgaLutUsage}</span></div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                &ldquo;{bm.notes}&rdquo;
              </div>

              <div className="text-[10px] text-slate-500 italic">
                Citation: {bm.citation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
