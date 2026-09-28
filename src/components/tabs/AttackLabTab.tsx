import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Play, 
  Radio, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Cpu, 
  Zap, 
  Layers, 
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ATTACK_VECTORS } from '../../utils/initialData';

export const AttackLabTab: React.FC = () => {
  const { 
    selectedNodeId, 
    setSelectedNodeId, 
    displayNodes, 
    launchAttack, 
    activeAttackId, 
    attackPhase, 
    attackLog,
    loadScenario,
    securityEvents
  } = useSimulation();

  const [selectedAttackVectorId, setSelectedAttackVectorId] = useState<string>('replay_attack');
  const activeVector = ATTACK_VECTORS.find(a => a.id === selectedAttackVectorId) || ATTACK_VECTORS[0];

  const handleLaunch = () => {
    launchAttack(selectedAttackVectorId, selectedNodeId);
  };

  const isAttacking = attackPhase !== 'IDLE' && attackPhase !== 'RESOLVED';

  const scenarios = [
    { name: 'NORMAL OPERATION', desc: 'Restores all nodes to 98% nominal zero-trust state' },
    { name: 'REPLAY ATTACK', desc: 'Incursions on node D047 with stale nonces' },
    { name: 'DEVICE CLONING', desc: 'Attempts counterfeit silicon signature' },
    { name: 'ENVIRONMENTAL STRESS', desc: 'Drifts supply voltage and temperature' },
    { name: 'TRANSACTION FLOOD', desc: 'Simulates 80 tx/s mempool flooding' },
    { name: 'MALICIOUS VALIDATORS', desc: 'Equivocation and double-signing detection' },
    { name: 'COMBINED ATTACK', desc: 'Multi-vector synchronized stress test' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Academic Notice */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Zero-Trust Attack Simulation &amp; Heuristic Mitigation Lab
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Test resilience against cyber-physical intrusion across 10 specialized attack vectors with 4-phase automated response.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono max-w-md">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Academic Safety Notice</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scenarios represent conceptual security state machines for educational defense evaluation. No offensive attack tooling or exploitation payloads are provided.
            </p>
          </div>
        </div>

        {/* 7 Preset Live Scenario Trigger Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              1-Click Live Network Scenario Presets:
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {scenarios.map(sc => (
              <button
                key={sc.name}
                onClick={() => loadScenario(sc.name)}
                className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="text-[10px] font-mono font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                  {sc.name}
                </div>
                <div className="text-[9px] text-slate-500 font-mono truncate">
                  {sc.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 10 Attack Buttons Grid */}
      <div className="rounded-2xl glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Select Attack Simulation Vector (10 Available)</span>
          </span>
          <div className="text-xs font-mono text-slate-400">
            Target Node: <strong className="text-cyan-300">{selectedNodeId}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ATTACK_VECTORS.map((vec, idx) => {
            const isSelected = selectedAttackVectorId === vec.id;
            const isCurrentlyRunning = activeAttackId === vec.id && isAttacking;
            return (
              <button
                key={vec.id}
                onClick={() => setSelectedAttackVectorId(vec.id)}
                className={`p-3 rounded-xl border text-left font-mono transition-all relative overflow-hidden ${
                  isCurrentlyRunning
                    ? 'bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/40 animate-pulse'
                    : isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    vec.category === 'IDENTITY' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' :
                    vec.category === 'PHYSICAL' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                    vec.category === 'CONSENSUS' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                    'bg-blue-950 text-blue-400 border border-blue-500/30'
                  }`}>
                    {vec.category}
                  </span>
                </div>

                <div className="text-xs font-bold text-white mt-1 truncate">
                  {vec.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {vec.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Phase Resolution Pipeline Execution Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: 4-Phase Visual Pipeline (ATTACK -> DETECTION -> RESPONSE -> LEDGER RESULT) */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Automated 4-Phase Mitigation Architecture</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Active Vector: <strong className="text-white">{activeVector.name}</strong> &bull; Target: <strong className="text-cyan-300">{selectedNodeId}</strong>
              </p>
            </div>

            <button
              onClick={handleLaunch}
              disabled={isAttacking}
              className="px-5 py-2 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isAttacking ? 'Simulating Attack...' : 'Launch Attack Simulation'}</span>
            </button>
          </div>

          {/* 4 Stages Pipeline Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            {/* Stage 1: ATTACK */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              attackPhase === 'ATTACK'
                ? 'bg-rose-950/80 border-rose-500 shadow-md shadow-rose-500/30 ring-1 ring-rose-400'
                : attackPhase === 'DETECTION' || attackPhase === 'RESPONSE' || attackPhase === 'RESOLVED'
                ? 'bg-slate-900/60 border-slate-700'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-rose-400 uppercase">1. ATTACK</span>
                {attackPhase === 'ATTACK' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
              </div>
              <div className="font-bold text-white text-xs mb-1">Incursion Vector</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {activeVector.attackSteps.attack}
              </p>
            </div>

            {/* Stage 2: DETECTION */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              attackPhase === 'DETECTION'
                ? 'bg-amber-950/80 border-amber-500 shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                : attackPhase === 'RESPONSE' || attackPhase === 'RESOLVED'
                ? 'bg-slate-900/60 border-slate-700'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase">2. DETECTION</span>
                {attackPhase === 'DETECTION' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
              </div>
              <div className="font-bold text-white text-xs mb-1">Zero-Trust Heuristic</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {activeVector.attackSteps.detection}
              </p>
            </div>

            {/* Stage 3: RESPONSE */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              attackPhase === 'RESPONSE'
                ? 'bg-blue-950/80 border-blue-500 shadow-md shadow-blue-500/30 ring-1 ring-blue-400'
                : attackPhase === 'RESOLVED'
                ? 'bg-slate-900/60 border-slate-700'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase">3. RESPONSE</span>
                {attackPhase === 'RESPONSE' && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />}
              </div>
              <div className="font-bold text-white text-xs mb-1">Policy Enforcement</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {activeVector.attackSteps.response}
              </p>
            </div>

            {/* Stage 4: LEDGER RESULT */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              attackPhase === 'RESOLVED'
                ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">4. LEDGER RESULT</span>
                {attackPhase === 'RESOLVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="font-bold text-white text-xs mb-1">Immutable Audit</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {activeVector.attackSteps.ledgerResult}
              </p>
            </div>
          </div>

          {/* Live Execution Console Output */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-[11px] border-b border-slate-800 pb-1">
              <span>SECURITY CONSOLE LOG</span>
              <span>STATE: {attackPhase}</span>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto">
              {attackLog.length === 0 ? (
                <div className="text-slate-600 italic">
                  Press &ldquo;Launch Attack Simulation&rdquo; to observe real-time cyber-physical detection and policy enforcement.
                </div>
              ) : (
                attackLog.map((line, idx) => (
                  <div key={idx} className="text-slate-300 text-[11px]">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Blockchain Security Events Log */}
        <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Immutable Ledger Security Log</span>
            </span>
            <span className="text-[10px] text-slate-500">{securityEvents.length} Events</span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {securityEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-xs">
                Zero security anomalies recorded. Ledger clean.
              </div>
            ) : (
              securityEvents.slice(0, 10).map(evt => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      evt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {evt.type}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px]">
                    {evt.description}
                  </p>

                  <div className="text-[10px] text-cyan-400">
                    Mitigation: {evt.mitigationAction}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
