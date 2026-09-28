import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Key, 
  Lock, 
  Radio, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Database, 
  Search, 
  RotateCcw, 
  AlertOctagon, 
  ArrowDown, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ArchitectureTab: React.FC = () => {
  const { reEnrollNode, quarantineNode, selectedNodeId } = useSimulation();

  // Selected architecture component for detailed technical drilldown
  const [selectedComponentKey, setSelectedComponentKey] = useState<string>('puf');

  // Interactive Device Lifecycle state
  const [activeLifecycleStage, setActiveLifecycleStage] = useState<number>(5);

  const architecturePipeline = [
    {
      key: 'device',
      name: 'IoT Edge Device',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      subtext: 'Resource-constrained physical sensor or industrial gateway',
      spec: 'Hardware Platform: ARM Cortex-M4 or RISC-V RV32IMC microcontroller with 64KB SRAM and integrated silicon PUF.'
    },
    {
      key: 'puf',
      name: 'Physical Unclonable Function (PUF)',
      icon: <Key className="w-5 h-5 text-emerald-400" />,
      subtext: 'Microscopic silicon process variations (SRAM / Ring Oscillator)',
      spec: 'Evaluates static random threshold mismatch & gate-delay jitter. Generates unforgeable, unclonable 128-bit physical responses.'
    },
    {
      key: 'fuzzy',
      name: 'Fuzzy Extractor (BCH Code)',
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      subtext: 'Error-correction helper data & secure key reproduction',
      spec: 'BCH(128,64,t=14) syndrome coding eliminates environmental thermal bit-flips without leaking secret information on the wire.'
    },
    {
      key: 'identity',
      name: 'Hardware Identity Anchor',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      subtext: 'Stable key commitment published to distributed ledger',
      spec: 'SHA-256 commitment of reproduced stable key anchored immutably during factory enrollment. Secret key is zeroized from RAM after use.'
    },
    {
      key: 'auth',
      name: 'Zero-Trust Authentication',
      icon: <Radio className="w-5 h-5 text-blue-400" />,
      subtext: 'Challenge-response protocol with fresh nonces and counters',
      spec: 'Verifier challenges device with fresh nonce N_V. Device proves ownership of silicon PUF without permanently storing a secret key.'
    },
    {
      key: 'tx_val',
      name: 'Transaction Validation',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      subtext: 'Cryptographic signature checking & telemetry format verification',
      spec: 'Validators verify Schnorr signatures against ledger commitment, check replay nonces, and validate telemetry sensor bounds.'
    },
    {
      key: 'trust_engine',
      name: 'Adaptive Trust Engine',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      subtext: 'Multi-factor dynamic heuristic scoring (0–100)',
      spec: 'Evaluates PUF bit stability, authentication success, transaction frequency, and environment. Automatically isolates anomalous nodes.'
    },
    {
      key: 'consensus',
      name: 'Lightweight Consensus Engine',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      subtext: 'CLFSR-inspired energy-efficient mining for IoT gateways',
      spec: 'Consumes ~0.12 W vs 1.82 W for SHA-256. Proof-of-Work tailored for closed permissioned IoT networks without ASIC vulnerability.'
    },
    {
      key: 'block_val',
      name: 'Block Validator Cluster',
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />,
      subtext: 'Consensus verification & Merkle root integrity checks',
      spec: 'Multi-node Byzantine consensus checks previous-hash links, Merkle tree validity, miner commitments, and transaction signatures.'
    },
    {
      key: 'ledger',
      name: 'Distributed Ledger Core',
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      subtext: 'Immutable blockchain block history & audit logs',
      spec: 'Decentralized distributed state maintaining device enrollment status, cryptographic commitments, revoked keys, and sensor logs.'
    },
    {
      key: 'explorer',
      name: 'Blockchain Explorer & Auditor',
      icon: <Search className="w-5 h-5 text-indigo-400" />,
      subtext: 'Human-verifiable cybersecurity inspection portal',
      spec: 'Provides real-time inspection, cryptographic chain validation (hash links, signatures, commitments), and forensic event tracing.'
    }
  ];

  const lifecycleStages = [
    { stage: 1, name: '1. Manufacturing', desc: 'Silicon die fabrication with inherent microscopic doping process variations.' },
    { stage: 2, name: '2. PUF Enrollment', desc: 'Initial challenge-response measurement in secure factory test environment.' },
    { stage: 3, name: '3. Commitment Registration', desc: 'BCH helper data W and public key commitment SHA256(K) committed to ledger.' },
    { stage: 4, name: '4. Secure Deployment', desc: 'IoT node provisioned into field environment; raw secrets erased from flash.' },
    { stage: 5, name: '5. Zero-Trust Auth', desc: 'Periodic challenge-response authentication with fresh nonces on every transaction.' },
    { stage: 6, name: '6. Ledger Participation', desc: 'Node submits signed telemetry and actuation transactions into mempool.' },
    { stage: 7, name: '7. Continuous Monitoring', desc: 'Trust Engine continuously tracks PUF BER, voltage rails, and transaction rates.' },
    { stage: 8, name: '8. Threat Detection', desc: 'Replay incursion, counterfeit silicon, or enclosure tamper detected by validator.' },
    { stage: 9, name: '9. Quarantine / Revocation', desc: 'Node isolated; revocation certificate registered immutably on blockchain.' },
    { stage: 10, name: '10. Factory Re-enrollment', desc: 'Physical device audited in authorized facility, re-calibrated, and re-admitted.' },
  ];

  const selectedComp = architecturePipeline.find(p => p.key === selectedComponentKey) || architecturePipeline[1];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                PHYLEDGER End-to-End Architectural Trust Chain
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Click any stage in the 11-component hardware-rooted trust pipeline to inspect its cryptographic specifications and threat model assumptions.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Click any node below for detailed technical drilldown</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Pipeline Flow + Technical Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Vertical Interactive Trust Chain Flowchart */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              Hardware-Rooted Zero-Trust Execution Flow (11 Stages)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Top-to-Bottom Pipeline
            </span>
          </div>

          {architecturePipeline.map((comp, idx) => {
            const isSelected = selectedComponentKey === comp.key;
            return (
              <React.Fragment key={comp.key}>
                <div
                  onClick={() => setSelectedComponentKey(comp.key)}
                  className={`p-3.5 rounded-xl border font-mono transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 border border-slate-800'
                    }`}>
                      {comp.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {comp.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-500">
                          Step #{idx + 1}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {comp.subtext}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                    &rarr;
                  </span>
                </div>

                {idx < architecturePipeline.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Column: Selected Component Detailed Technical Drilldown */}
        <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                {selectedComp.icon}
                <span>Technical Specifications</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <h3 className="text-base font-heading font-bold text-white">
                {selectedComp.name}
              </h3>
              <p className="text-xs text-cyan-300/90 leading-relaxed">
                {selectedComp.subtext}
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-slate-300 text-[11px] leading-relaxed">
                {selectedComp.spec}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-slate-400 text-[11px]">
              <div className="font-bold text-white">Zero-Trust Security Principle:</div>
              <div>
                Secrets are derived ephemerally from physical microscopic imperfections when power is applied, and purged completely when execution finishes.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/20 text-slate-500 text-[10px] text-center">
            PHYLEDGER Core Architecture Model &bull; IEEE Verified Primitives
          </div>
        </div>
      </div>

      {/* Device Lifecycle State Machine Section */}
      <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Complete Device Lifecycle &amp; Revocation State Machine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              From silicon manufacturing and factory enrollment through zero-trust monitoring, threat isolation, and re-enrollment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => quarantineNode(selectedNodeId, 'Manual Lifecycle Revocation Demo')}
              className="px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[11px] font-bold transition-colors"
            >
              Simulate Revocation
            </button>
            <button
              onClick={() => reEnrollNode(selectedNodeId)}
              className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition-colors"
            >
              Factory Re-enroll
            </button>
          </div>
        </div>

        {/* 10 Lifecycle Stages Scroller */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {lifecycleStages.map(s => {
            const isCurrent = activeLifecycleStage === s.stage;
            return (
              <div
                key={s.stage}
                onClick={() => setActiveLifecycleStage(s.stage)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="font-bold text-white text-xs mb-1">
                  {s.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-snug">
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
