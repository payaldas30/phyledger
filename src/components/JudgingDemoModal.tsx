import React, { useEffect, useState, useCallback } from 'react';
import { 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldAlert, 
  Cpu, 
  Database, 
  Zap, 
  Radio, 
  Play, 
  Pause,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSimulation } from '../context/SimulationContext';

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Initialize 100 Healthy IoT Fleet',
    subtitle: 'Simulating zero-trust baseline across diverse industrial edge nodes',
    badge: 'Baseline Fleet',
    action: 'initialize',
    description: 'The PHYLEDGER network boots with 100 simulated IoT nodes (industrial actuators, smart power meters, environmental probes). Each node possesses an enrolled silicon PUF commitment registered during manufacturing.'
  },
  {
    step: 2,
    title: 'Simulate Normal Telemetry Transactions',
    subtitle: 'Zero-trust signature generation with fresh nonces and PUF commitments',
    badge: 'Mempool Traffic',
    action: 'normal_tx',
    description: 'Active nodes sign periodic telemetry logs using their volatile, device-internal PUF keys. Fresh nonces prevent replay, and signatures match the registered cryptographic commitments.'
  },
  {
    step: 3,
    title: 'Mine Valid Ledger Block',
    subtitle: 'CLFSR-inspired lightweight consensus verification',
    badge: 'Consensus Minting',
    action: 'mine_block',
    description: 'Validator VAL-ALPHA aggregates confirmed transactions, computes the Merkle root, executes simulated lightweight CLFSR mining, and appends the validated block to the immutable chain.'
  },
  {
    step: 4,
    title: 'Open Node D047 Security Profile',
    subtitle: 'Deep inspection of target edge device telemetry and PUF parameters',
    badge: 'Node Inspector',
    action: 'inspect_d047',
    description: 'Selecting device D047 (Industrial Edge Gateway). Current Trust Score: 95/100 (TRUSTED). PUF Status: OPTIMAL. Nominal operating envelope: 25.0°C, 1.20V VDD rail.'
  },
  {
    step: 5,
    title: 'Execute Zero-Trust PUF Authentication',
    subtitle: 'Challenge-response protocol with BCH fuzzy extractor key reconstruction',
    badge: 'Authentication',
    action: 'auth_success',
    description: 'Validator issues fresh challenge C and nonce N_V. D047 evaluates its silicon PUF, runs BCH(128,64) error correction, regenerates transient key K, and signs the challenge. Verification: PASS.'
  },
  {
    step: 6,
    title: 'Adversary Launches Replay Attack',
    subtitle: 'Eavesdropped packet retransmitted by malicious rogue sniffer',
    badge: 'Attack Vector 01',
    action: 'replay_attack',
    description: 'An attacker intercepts a previously broadcast telemetry packet from D047 and retransmits it to Validator VAL-ALPHA without knowing D047’s internal PUF secret.'
  },
  {
    step: 7,
    title: 'Validator Detects Duplicated Nonce',
    subtitle: 'Monotonic sequence counter and freshness verification',
    badge: 'Intrusion Detection',
    action: 'detect_nonce',
    description: 'The validator verifies incoming packet metadata against the ledger history. Nonce N_prev is already registered in block memory. Freshness check fails.'
  },
  {
    step: 8,
    title: 'Transaction Rejected & Dropped',
    subtitle: 'Replay mitigation prevents unauthorized ledger injection',
    badge: 'Packet Drop',
    action: 'reject_tx',
    description: 'The forged transaction is immediately purged from the validator mempool. A non-critical security anomaly is logged against D047’s session history.'
  },
  {
    step: 9,
    title: 'Adversary Launches Device Cloning Attack',
    subtitle: 'Firmware copied to commodity microcontroller lacking golden silicon PUF',
    badge: 'Attack Vector 02',
    action: 'clone_attack',
    description: 'Adversary dumps flash firmware from D047 and burns it onto a cloned STM32 chip. The rogue device attempts to authenticate with D047’s MAC and Device ID.'
  },
  {
    step: 10,
    title: 'PUF Commitment Mismatch Detected',
    subtitle: 'Hardware unclonability exposes counterfeit silicon',
    badge: 'Physical Proof Failure',
    action: 'puf_mismatch',
    description: 'When challenged by the zero-trust validator, the cloned chip cannot reproduce D047’s unique microscopic silicon delays. Fuzzy extractor commitment does not match the ledger anchor.'
  },
  {
    step: 11,
    title: 'Immediate Node Quarantine',
    subtitle: 'Zero-Trust policy isolates compromised device identifier',
    badge: 'Isolation Protocol',
    action: 'quarantine_d047',
    description: 'Validator issues an automated isolation order. D047 is transitioned to QUARANTINED status. Future transactions signed under ID D047 are rejected unconditionally.'
  },
  {
    step: 12,
    title: 'Adaptive Trust Score Recalculation',
    subtitle: 'Multi-factor algorithm penalizes device to critical levels',
    badge: 'Trust Degradation',
    action: 'update_trust',
    description: 'Adaptive Trust Engine recalculates D047: PUF Reliability drops to 0%, Security Events penalty applies. Composite Trust Score plunges from 95 to 8/100.'
  },
  {
    step: 13,
    title: 'Blockchain Security Event Recorded',
    subtitle: 'Immutable audit trail on distributed ledger',
    badge: 'Audit Trail',
    action: 'log_security_event',
    description: 'A critical event "NODE_QUARANTINED" is committed onto the blockchain. All participating validator nodes sync this revocation certificate in consensus.'
  },
  {
    step: 14,
    title: 'Before & After Network Health Assessment',
    subtitle: 'Quantifying zero-trust resiliency across the 100-node fleet',
    badge: 'Fleet Telemetry',
    action: 'network_health',
    description: 'Pre-Attack: 100 Trusted, 0 Quarantined, Health 98.4%. Post-Attack: 99 Trusted, 1 Quarantined, Rogue Transaction Exposure: 0. Zero unauthorized ledger modifications occurred.'
  },
  {
    step: 15,
    title: 'Consensus Energy Efficiency Benchmark',
    subtitle: 'CLFSR-inspired lightweight simulation vs reference SHA-256',
    badge: 'Energy Evaluation',
    action: 'energy_comparison',
    description: 'Simulated lightweight consensus consumes ~0.12 W (Artix-7 benchmark) vs 1.82 W for standard SHA-256 mining, yielding a 93.4% reduction in IoT energy expenditure.'
  },
  {
    step: 16,
    title: 'Summary & Scientific Conclusion',
    subtitle: 'Hardware-Rooted Zero-Trust Blockchain for Resource-Constrained IoT',
    badge: 'Verdict',
    action: 'finish_summary',
    description: '“Hardware-rooted identity prevents unauthorized devices from participating in the simulated IoT ledger.” Physical unclonability protects against key extraction, while adaptive trust isolates compromised nodes.'
  }
];

export const JudgingDemoModal: React.FC = () => {
  const { 
    isJudgingDemoActive, 
    stopJudgingDemo, 
    judgingStep, 
    nextJudgingStep, 
    prevJudgingStep, 
    jumpToJudgingStep,
    setSelectedNodeId,
    mineNewBlock,
    quarantineNode,
    reEnrollNode,
    launchAttack,
    displayNodes,
    blocks
  } = useSimulation();

  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const currentStepData = DEMO_STEPS[judgingStep - 1] || DEMO_STEPS[0];

  // Execute step effects
  const executeStepAction = useCallback((stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        // Initialize 100 healthy
        reEnrollNode('D047');
        break;
      case 2:
        // Normal tx
        break;
      case 3:
        // Mine block
        mineNewBlock();
        break;
      case 4:
        // Inspect D047
        setSelectedNodeId('D047');
        break;
      case 5:
        // Auth success
        setSelectedNodeId('D047');
        break;
      case 6:
        // Replay attack
        launchAttack('replay_attack', 'D047');
        break;
      case 7:
      case 8:
        break;
      case 9:
        // Clone attack
        launchAttack('device_cloning', 'D047');
        break;
      case 10:
        break;
      case 11:
      case 12:
        // Quarantine
        quarantineNode('D047', 'Device Cloning & PUF Commitment Mismatch Detected');
        break;
      case 13:
      case 14:
      case 15:
        break;
      case 16:
        // Final celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
        break;
      default:
        break;
    }
  }, [reEnrollNode, mineNewBlock, setSelectedNodeId, launchAttack, quarantineNode]);

  useEffect(() => {
    if (isJudgingDemoActive) {
      executeStepAction(judgingStep);
    }
  }, [judgingStep, isJudgingDemoActive, executeStepAction]);

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && isJudgingDemoActive) {
      timer = setTimeout(() => {
        if (judgingStep < 16) {
          nextJudgingStep();
        } else {
          setIsAutoPlaying(false);
        }
      }, 4500);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, judgingStep, isJudgingDemoActive, nextJudgingStep]);

  if (!isJudgingDemoActive) return null;

  const targetNode = displayNodes.find(n => n.id === 'D047');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
              <Award className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-heading font-bold text-white tracking-wide">
                  SYSTEM ARCHITECTURE &amp; SECURITY TOUR
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  Step {judgingStep} of 16
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Automated 16-phase demonstration of hardware-rooted IoT zero-trust blockchain
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause Auto' : 'Auto Play (4.5s)'}</span>
            </button>

            <button
              onClick={stopJudgingDemo}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Timeline Scroller */}
        <div className="px-6 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-[700px]">
            {DEMO_STEPS.map((s) => {
              const isPassed = s.step < judgingStep;
              const isCurrent = s.step === judgingStep;
              return (
                <button
                  key={s.step}
                  onClick={() => jumpToJudgingStep(s.step)}
                  className={`flex-1 py-1.5 px-1 text-center rounded transition-all text-[11px] font-mono border ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                      : isPassed
                      ? 'bg-slate-800/50 border-slate-700/80 text-emerald-400'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  title={`${s.step}. ${s.title}`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {isPassed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span>{s.step}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium uppercase tracking-wider bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-2">
                {currentStepData.badge}
              </span>
              <h3 className="text-xl font-heading font-bold text-white">
                {currentStepData.title}
              </h3>
              <p className="text-sm font-mono text-cyan-300/80 mt-0.5">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Target Node D047 Live Badge */}
            {targetNode && (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-3 min-w-[200px]">
                <div className={`w-3 h-3 rounded-full ${
                  targetNode.isQuarantined 
                    ? 'bg-rose-500 animate-ping' 
                    : targetNode.trustScore >= 80 
                    ? 'bg-emerald-400' 
                    : 'bg-amber-400'
                }`} />
                <div>
                  <div className="text-xs font-mono text-slate-400">Target Node Status:</div>
                  <div className="text-sm font-mono font-bold flex items-center gap-2">
                    <span className="text-white">D047</span>
                    <span className={`text-xs px-1.5 py-0.2 rounded font-mono ${
                      targetNode.isQuarantined 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {targetNode.trustStatus} ({targetNode.trustScore}/100)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed explanation text */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
            {currentStepData.description}
          </div>

          {/* Interactive Visual Preview for the Current Step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/90 border border-cyan-500/20 font-mono text-xs space-y-1.5">
              <div className="text-cyan-400 flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5" /> Silicon PUF State
              </div>
              <div className="text-slate-400">Device ID: <span className="text-white">D047</span></div>
              <div className="text-slate-400">PUF Stability: <span className="text-emerald-400">{targetNode?.pufProfile.currentReliability}%</span></div>
              <div className="text-slate-400">Bit Error Rate: <span className="text-cyan-300">{targetNode?.pufProfile.currentBER}%</span></div>
              <div className="text-slate-400 truncate">Commitment: <span className="text-slate-500 text-[10px]">{targetNode?.pufProfile.stableKeyCommitment.substring(0, 16)}...</span></div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/90 border border-cyan-500/20 font-mono text-xs space-y-1.5">
              <div className="text-cyan-400 flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" /> Zero-Trust Policy
              </div>
              <div className="text-slate-400">Auth Health: <span className="text-white">{targetNode?.authHealth}/100</span></div>
              <div className="text-slate-400">Replay Attempts: <span className={targetNode?.replayAttempts ? "text-amber-400 font-bold" : "text-white"}>{targetNode?.replayAttempts}</span></div>
              <div className="text-slate-400">Failed Auths: <span className={targetNode?.failedAuths ? "text-rose-400 font-bold" : "text-white"}>{targetNode?.failedAuths}</span></div>
              <div className="text-slate-400">Isolation: <span className={targetNode?.isQuarantined ? "text-rose-400 font-bold" : "text-emerald-400"}>{targetNode?.isQuarantined ? 'ISOLATED' : 'PERMITTED'}</span></div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/90 border border-cyan-500/20 font-mono text-xs space-y-1.5">
              <div className="text-cyan-400 flex items-center gap-1.5 font-bold">
                <Database className="w-3.5 h-3.5" /> Ledger State
              </div>
              <div className="text-slate-400">Total Blocks: <span className="text-white">{blocks.length}</span></div>
              <div className="text-slate-400">Consensus Mode: <span className="text-cyan-300">CLFSR-Simulated</span></div>
              <div className="text-slate-400">Chain Audit: <span className="text-emerald-400">PASS (All Verified)</span></div>
              <div className="text-slate-400">Validator Load: <span className="text-white">12.4%</span></div>
            </div>
          </div>

          {/* Step 16 final banner */}
          {judgingStep === 16 && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 border border-cyan-400/50 shadow-lg text-center space-y-2">
              <Award className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-heading font-extrabold text-white">
                “Hardware-rooted identity prevents unauthorized devices from participating in the simulated IoT ledger.”
              </h4>
              <p className="text-xs font-mono text-slate-300 max-w-2xl mx-auto">
                Silicon-level physical variations guarantee unique unforgeable commitments. Combined with fresh nonces, adaptive trust scoring, and lightweight permissioned consensus, the network achieves comprehensive cyber-physical resilience.
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-cyan-500/20 bg-slate-950/90 flex items-center justify-between">
          <button
            onClick={prevJudgingStep}
            disabled={judgingStep === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-mono font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Phase</span>
          </button>

          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            Phase {judgingStep} / 16 — Click Next or enable Auto-Play
          </div>

          {judgingStep < 16 ? (
            <button
              onClick={nextJudgingStep}
              className="flex items-center gap-1 px-5 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all"
            >
              <span>Next Phase</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={stopJudgingDemo}
              className="flex items-center gap-1 px-5 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all"
            >
              <span>Complete Walkthrough</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
