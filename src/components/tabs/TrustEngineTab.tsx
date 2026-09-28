import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  RotateCcw, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  AlertOctagon,
  TrendingDown,
  Activity,
  Layers
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const TrustEngineTab: React.FC = () => {
  const { 
    trustWeights, 
    updateTrustWeights, 
    trustThresholds, 
    updateTrustThresholds, 
    displayNodes,
    selectedNodeId,
    setSelectedNodeId
  } = useSimulation();

  // Test sandbox parameters for interactive experimentation
  const [sandboxPufRel, setSandboxPufRel] = useState<number>(98.5);
  const [sandboxAuthHealth, setSandboxAuthHealth] = useState<number>(95);
  const [sandboxTxBehavior, setSandboxTxBehavior] = useState<number>(90);
  const [sandboxEnvHealth, setSandboxEnvHealth] = useState<number>(96);
  const [sandboxSecurityEventsCount, setSandboxSecurityEventsCount] = useState<number>(0);

  // Compute live sandbox score
  const secPenalty = Math.max(0, 100 - sandboxSecurityEventsCount * 25);
  const computedSandboxScore = Math.max(0, Math.min(100, Math.round(
    trustWeights.pufReliability * sandboxPufRel +
    trustWeights.authHealth * sandboxAuthHealth +
    trustWeights.txBehavior * sandboxTxBehavior +
    trustWeights.envHealth * sandboxEnvHealth +
    trustWeights.securityEvents * secPenalty
  )));

  let computedSandboxStatus: 'TRUSTED' | 'WATCHLIST' | 'SUSPICIOUS' | 'QUARANTINED' = 'QUARANTINED';
  if (computedSandboxScore >= trustThresholds.trusted) computedSandboxStatus = 'TRUSTED';
  else if (computedSandboxScore >= trustThresholds.watchlist) computedSandboxStatus = 'WATCHLIST';
  else if (computedSandboxScore >= trustThresholds.suspicious) computedSandboxStatus = 'SUSPICIOUS';

  const resetWeights = () => {
    updateTrustWeights({
      pufReliability: 0.30,
      authHealth: 0.20,
      txBehavior: 0.15,
      envHealth: 0.15,
      securityEvents: 0.20,
    });
  };

  const resetThresholds = () => {
    updateTrustThresholds({
      trusted: 80,
      watchlist: 50,
      suspicious: 20,
    });
  };

  const statusColors = {
    TRUSTED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40',
    WATCHLIST: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/40',
    SUSPICIOUS: 'text-amber-400 bg-amber-500/10 border-amber-500/40',
    QUARANTINED: 'text-rose-400 bg-rose-500/10 border-rose-500/40',
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Mathematical Formula Banner */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Adaptive Multi-Factor Trust Model
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Dynamic zero-trust behavioral evaluation combining physical silicon stability, challenge-response health, and mempool anomalies.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono max-w-md">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Simulation Heuristic Metric</span>
            </div>
            <p className="text-[11px] text-slate-400">
              The trust score is a simulated cyber-physical heuristic used for automated node isolation. It is not presented as an absolute real-world cryptographic guarantee.
            </p>
          </div>
        </div>

        {/* Transparent Formula Display Box */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 font-mono text-xs space-y-2">
          <div className="text-cyan-400 font-bold flex items-center justify-between">
            <span>MATHEMATICAL TRUST FORMULATION:</span>
            <span className="text-[10px] text-slate-500">&Sigma; w_i = {(
              trustWeights.pufReliability + 
              trustWeights.authHealth + 
              trustWeights.txBehavior + 
              trustWeights.envHealth + 
              trustWeights.securityEvents
            ).toFixed(2)}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 overflow-x-auto text-xs sm:text-sm">
            <span className="text-cyan-300 font-bold">Trust Score</span> = (
            <span className="text-emerald-400">{trustWeights.pufReliability.toFixed(2)}</span> &times; PUF_Reliability) + (
            <span className="text-blue-400">{trustWeights.authHealth.toFixed(2)}</span> &times; Auth_Health) + (
            <span className="text-indigo-400">{trustWeights.txBehavior.toFixed(2)}</span> &times; Tx_Behavior) + (
            <span className="text-amber-400">{trustWeights.envHealth.toFixed(2)}</span> &times; Env_Health) + (
            <span className="text-rose-400">{trustWeights.securityEvents.toFixed(2)}</span> &times; Security_Penalty)
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-400">
            <span>Classification Ranges:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {trustThresholds.trusted}–100 : TRUSTED
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {trustThresholds.watchlist}–{trustThresholds.trusted - 1} : WATCHLIST
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {trustThresholds.suspicious}–{trustThresholds.watchlist - 1} : SUSPICIOUS
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              0–{trustThresholds.suspicious - 1} : QUARANTINED
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Configurable Weights + Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Configurable Factor Weights & Thresholds */}
        <div className="rounded-2xl glass-panel p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Factor Weights Configuration</span>
            </span>
            <button
              onClick={resetWeights}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Weight Sliders */}
          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">PUF Reliability Weight (w_puf):</span>
                <span className="font-bold text-emerald-400">{trustWeights.pufReliability.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={trustWeights.pufReliability}
                onChange={e => updateTrustWeights({ pufReliability: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Silicon bit-flip stability &amp; BCH correction margin</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Auth Health Weight (w_auth):</span>
                <span className="font-bold text-blue-400">{trustWeights.authHealth.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={trustWeights.authHealth}
                onChange={e => updateTrustWeights({ authHealth: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Fresh nonce validation &amp; challenge-response success</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Tx Behavior Weight (w_tx):</span>
                <span className="font-bold text-indigo-400">{trustWeights.txBehavior.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={trustWeights.txBehavior}
                onChange={e => updateTrustWeights({ txBehavior: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Mempool flooding &amp; payload signature integrity</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Env Health Weight (w_env):</span>
                <span className="font-bold text-amber-400">{trustWeights.envHealth.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={trustWeights.envHealth}
                onChange={e => updateTrustWeights({ envHealth: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Temperature &amp; supply voltage stability</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Security Events Weight (w_sec):</span>
                <span className="font-bold text-rose-400">{trustWeights.securityEvents.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={trustWeights.securityEvents}
                onChange={e => updateTrustWeights({ securityEvents: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Penalty for replay incursions, cloning attempts &amp; tampers</span>
            </div>
          </div>

          {/* Configurable Status Thresholds */}
          <div className="pt-4 border-t border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider">
                Status Quarantine Thresholds:
              </span>
              <button
                onClick={resetThresholds}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 text-[10px]">Trusted Cutoff:</span>
                <input
                  type="number"
                  min="60"
                  max="95"
                  value={trustThresholds.trusted}
                  onChange={e => updateTrustThresholds({ trusted: parseInt(e.target.value) || 80 })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold"
                />
              </div>

              <div>
                <span className="text-slate-400 text-[10px]">Watchlist Cutoff:</span>
                <input
                  type="number"
                  min="30"
                  max="70"
                  value={trustThresholds.watchlist}
                  onChange={e => updateTrustThresholds({ watchlist: parseInt(e.target.value) || 50 })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold"
                />
              </div>

              <div>
                <span className="text-slate-400 text-[10px]">Suspicious Cutoff:</span>
                <input
                  type="number"
                  min="10"
                  max="40"
                  value={trustThresholds.suspicious}
                  onChange={e => updateTrustThresholds({ suspicious: parseInt(e.target.value) || 20 })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Trust Score Simulator Sandbox */}
        <div className="rounded-2xl glass-panel p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Stress Simulator Sandbox</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Interactive Testbench
            </span>
          </div>

          {/* Computed Score Output Display */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-center relative overflow-hidden">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Simulated Composite Trust Score:
            </span>
            <div className="text-5xl font-heading font-black text-white mt-2">
              {computedSandboxScore}
              <span className="text-xl font-normal text-slate-500">/100</span>
            </div>

            <div className="mt-3 inline-block">
              <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border uppercase tracking-wider ${statusColors[computedSandboxStatus]}`}>
                Classification: {computedSandboxStatus}
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  computedSandboxScore >= trustThresholds.trusted ? 'bg-emerald-400' :
                  computedSandboxScore >= trustThresholds.watchlist ? 'bg-cyan-400' :
                  computedSandboxScore >= trustThresholds.suspicious ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${computedSandboxScore}%` }}
              />
            </div>
          </div>

          {/* Interactive Factor Adjusters */}
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">PUF Reliability Input:</span>
                <span className="font-bold text-emerald-400">{sandboxPufRel.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sandboxPufRel}
                onChange={e => setSandboxPufRel(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Auth Health Input:</span>
                <span className="font-bold text-blue-400">{sandboxAuthHealth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sandboxAuthHealth}
                onChange={e => setSandboxAuthHealth(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Tx Behavior Health Input:</span>
                <span className="font-bold text-indigo-400">{sandboxTxBehavior}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sandboxTxBehavior}
                onChange={e => setSandboxTxBehavior(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Environment Health Input:</span>
                <span className="font-bold text-amber-400">{sandboxEnvHealth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sandboxEnvHealth}
                onChange={e => setSandboxEnvHealth(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Security Incursions Count:</span>
                <span className={`font-bold ${sandboxSecurityEventsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {sandboxSecurityEventsCount} ({secPenalty}% net)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={sandboxSecurityEventsCount}
                onChange={e => setSandboxSecurityEventsCount(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
