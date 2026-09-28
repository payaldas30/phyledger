import React from 'react';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Radio, 
  RotateCcw, 
  AlertOctagon, 
  CheckCircle2, 
  Lock,
  Thermometer,
  Key
} from 'lucide-react';
import { IoTNode } from '../types';
import { useSimulation } from '../context/SimulationContext';

interface NodeSecurityModalProps {
  node: IoTNode | null;
  onClose: () => void;
}

export const NodeSecurityModal: React.FC<NodeSecurityModalProps> = ({ node, onClose }) => {
  const { quarantineNode, reEnrollNode, updateNodePufEnvironment, launchAttack } = useSimulation();

  if (!node) return null;

  const statusColors = {
    TRUSTED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    WATCHLIST: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    SUSPICIOUS: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    QUARANTINED: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl border border-cyan-500/30 bg-slate-900/95 shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-heading font-bold text-white tracking-wide">
                  Device Security Profile: {node.id}
                </h3>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${statusColors[node.trustStatus]}`}>
                  {node.trustStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {node.type} &bull; MAC: {node.mac} &bull; FW: {node.firmwareVersion}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Trust Score & Health Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-mono uppercase text-slate-400">Composite Trust</span>
              <div className="text-2xl font-heading font-extrabold text-white mt-1">
                {node.trustScore}<span className="text-sm font-normal text-slate-500">/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    node.trustScore >= 80 ? 'bg-emerald-400' : node.trustScore >= 50 ? 'bg-cyan-400' : node.trustScore >= 20 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${node.trustScore}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-mono uppercase text-slate-400">PUF Reliability</span>
              <div className="text-2xl font-heading font-extrabold text-cyan-300 mt-1">
                {node.pufProfile.currentReliability}%
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                BER: {node.pufProfile.currentBER}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-mono uppercase text-slate-400">Auth Health</span>
              <div className="text-2xl font-heading font-extrabold text-emerald-400 mt-1">
                {node.authHealth}%
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                {node.successfulAuths} passed / {node.failedAuths} failed
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-mono uppercase text-slate-400">Tx Behavior</span>
              <div className="text-2xl font-heading font-extrabold text-blue-400 mt-1">
                {node.txBehavior}%
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Current: {node.txRate} tx/s
              </div>
            </div>
          </div>

          {/* Silicon PUF & Fuzzy Extractor Cryptographic Commitment */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Hardware Silicon PUF &amp; BCH Fuzzy Extractor Commitment</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                Process Variation: &plusmn;{node.pufProfile.siliconProcessVariance}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 text-[11px]">Ledger-Anchored Stable Key Commitment (SHA-256):</span>
                <div className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] break-all select-all">
                  {node.pufProfile.stableKeyCommitment}
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Public zero-trust anchor. Verifiers compare signatures against this commitment without knowing the key.
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">BCH(128,64,t=14) Helper Data Syndrome (W):</span>
                <div className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300/90 font-mono text-[11px] break-all select-all">
                  {node.pufProfile.helperDataSyndrome}
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Public error-correction syndrome. Leaks no information regarding the raw response bits.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Operating Environment:</span>
              <span className="text-white font-medium">
                {node.pufProfile.temperature}&deg;C &bull; {node.pufProfile.voltage}V &bull; Noise: {node.pufProfile.noise}%
              </span>
            </div>
          </div>

          {/* Session Telemetry & Nonce Counter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Fresh Nonce Counter:</span>
              <div className="text-base font-bold text-white mt-0.5">#{node.lastNonce}</div>
              <div className="text-[10px] text-slate-500">Monotonically incrementing</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Replay Incursions:</span>
              <div className={`text-base font-bold mt-0.5 ${node.replayAttempts > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                {node.replayAttempts} attempts
              </div>
              <div className="text-[10px] text-slate-500">Dropped at validator level</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Connected Validator:</span>
              <div className="text-base font-bold text-cyan-300 mt-0.5">{node.connectedValidatorId}</div>
              <div className="text-[10px] text-slate-500">Consensus peer node</div>
            </div>
          </div>

          {/* Administrative Simulation Actions */}
          <div className="border-t border-slate-800 pt-4">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 block">
              Device Administrative &amp; Attack Simulation Controls:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => updateNodePufEnvironment(node.id, 75, 0.92, 7.0)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Thermal Stress (75&deg;C)</span>
              </button>

              <button
                onClick={() => launchAttack('replay_attack', node.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Replay Attack</span>
              </button>

              {node.isQuarantined ? (
                <button
                  onClick={() => reEnrollNode(node.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Factory Re-Enroll Device</span>
                </button>
              ) : (
                <button
                  onClick={() => quarantineNode(node.id, 'Manual Zero-Trust Security Officer Isolation')}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-rose-600/80 hover:bg-rose-600 text-white flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Quarantine Device</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>“Raw PUF response remains device-local in the conceptual model.”</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
