import React, { useState } from 'react';
import { 
  Radio, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  Key, 
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { fastSyncHash, generateNonceHex, generatePufSignature } from '../../utils/cryptoSim';

export const AuthenticationTab: React.FC = () => {
  const { selectedNodeId, displayNodes, launchAttack, quarantineNode } = useSimulation();

  const node = displayNodes.find(n => n.id === selectedNodeId) || displayNodes[0];

  // Protocol simulation mode
  const [protocolMode, setProtocolMode] = useState<'GENUINE' | 'REPLAY_ATTACK' | 'CLONED_DEVICE'>('GENUINE');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Dynamic parameters generated during execution
  const [sessionNonce, setSessionNonce] = useState<string>('0x9F41E8C2B013589A');
  const [deviceCounter, setDeviceCounter] = useState<number>(1042);
  const [rawChallenge, setRawChallenge] = useState<string>('0xDEADBEEF42');
  const [generatedSig, setGeneratedSig] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    nonceFresh: boolean;
    commitmentMatched: boolean;
    signatureValid: boolean;
    overallPass: boolean;
  } | null>(null);

  const steps = [
    {
      step: 1,
      title: 'Verifier Generates Fresh Challenge & Nonce',
      actor: 'Validator (VAL-ALPHA)',
      icon: <Radio className="w-4 h-4 text-cyan-400" />,
      desc: 'Validator generates pseudo-random 64-bit Nonce N_V and checks internal session memory to ensure freshness against replay incursions.'
    },
    {
      step: 2,
      title: 'Transmitting Challenge Vector to Device',
      actor: 'Network Transmission',
      icon: <ArrowRight className="w-4 h-4 text-blue-400" />,
      desc: `Payload [Challenge C: ${rawChallenge}, Nonce N_V: ${sessionNonce.substring(0, 10)}...] transmitted over IoT radio to device ${node.id}.`
    },
    {
      step: 3,
      title: 'Silicon PUF Evaluation & Fuzzy Extraction',
      actor: `Device ${node.id} Silicon Core`,
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      desc: 'Device applies Challenge to silicon PUF delay cells, regenerates volatile key K via BCH error correction helper data, and discards raw bits.'
    },
    {
      step: 4,
      title: 'Device Constructs Signature & Updates Counter',
      actor: `Device ${node.id} Crypto Engine`,
      icon: <Key className="w-4 h-4 text-amber-400" />,
      desc: 'Device signs (N_V || Counter || Payload) using reconstructed key K. Nonce prevents replay, while counter guarantees strict monotonic ordering.'
    },
    {
      step: 5,
      title: 'Verifier Cryptographic Verification',
      actor: 'Validator (VAL-ALPHA)',
      icon: <Lock className="w-4 h-4 text-indigo-400" />,
      desc: 'Validator checks: 1) Nonce freshness; 2) Signature against ledger-anchored PUF key commitment; 3) Monotonic counter monotonicity.'
    },
    {
      step: 6,
      title: 'Ledger State & Trust Engine Confirmation',
      actor: 'Distributed Ledger & Trust Engine',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      desc: 'Authentication result recorded into blockchain block. Device trust score updated; future transactions confirmed.'
    }
  ];

  // Execute entire protocol with delay
  const runFullProtocol = async () => {
    setIsExecuting(true);
    setVerificationResult(null);

    // Step 1
    setCurrentStepIndex(1);
    const freshNonce = protocolMode === 'REPLAY_ATTACK' ? '0xSTALE_NONCE_REPLAY' : generateNonceHex(16);
    setSessionNonce(freshNonce);
    await new Promise(r => setTimeout(r, 600));

    // Step 2
    setCurrentStepIndex(2);
    await new Promise(r => setTimeout(r, 600));

    // Step 3
    setCurrentStepIndex(3);
    await new Promise(r => setTimeout(r, 600));

    // Step 4
    setCurrentStepIndex(4);
    const simulatedCommitment = protocolMode === 'CLONED_DEVICE' 
      ? fastSyncHash('ROGUE_CLONED_CHIP_COMMITMENT').substring(0, 64)
      : node.pufProfile.stableKeyCommitment;
    
    const sig = generatePufSignature(simulatedCommitment, `${rawChallenge}_${freshNonce}_${deviceCounter}`);
    setGeneratedSig(sig);
    await new Promise(r => setTimeout(r, 600));

    // Step 5
    setCurrentStepIndex(5);
    const nonceFresh = protocolMode !== 'REPLAY_ATTACK';
    const commitmentMatched = protocolMode !== 'CLONED_DEVICE';
    const signatureValid = commitmentMatched;
    const overallPass = nonceFresh && commitmentMatched && signatureValid;

    setVerificationResult({
      nonceFresh,
      commitmentMatched,
      signatureValid,
      overallPass,
    });
    await new Promise(r => setTimeout(r, 600));

    // Step 6
    setCurrentStepIndex(6);
    setIsExecuting(false);

    // If attack simulation mode, trigger state degradation
    if (protocolMode === 'CLONED_DEVICE') {
      quarantineNode(node.id, 'Cloned Device Hardware Signature Mismatch');
    }
  };

  const resetProtocol = () => {
    setCurrentStepIndex(0);
    setVerificationResult(null);
    setGeneratedSig('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Zero-Trust Challenge-Response Authentication Protocol
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Step-by-step cryptographic protocol verifying volatile PUF-derived key identity without permanent secret key storage.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => { setProtocolMode('GENUINE'); resetProtocol(); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                protocolMode === 'GENUINE' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Genuine Session
            </button>
            <button
              onClick={() => { setProtocolMode('REPLAY_ATTACK'); resetProtocol(); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                protocolMode === 'REPLAY_ATTACK' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Replay Attack Test
            </button>
            <button
              onClick={() => { setProtocolMode('CLONED_DEVICE'); resetProtocol(); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                protocolMode === 'CLONED_DEVICE' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cloned Hardware Test
            </button>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400">
            Evaluating Target: <strong className="text-white">{node.id}</strong> &bull; Status: <span className="text-cyan-400">{node.trustStatus}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetProtocol}
              disabled={isExecuting}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40"
            >
              Reset Protocol
            </button>

            <button
              onClick={runFullProtocol}
              disabled={isExecuting}
              className="px-5 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Executing Steps...' : 'Run Authentication Protocol'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Protocol Visual Flowchart & Step Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Steps List */}
        <div className="lg:col-span-2 space-y-3">
          {steps.map(s => {
            const isPassed = currentStepIndex > s.step;
            const isCurrent = currentStepIndex === s.step;
            return (
              <div
                key={s.step}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : isPassed
                    ? 'bg-slate-900/60 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : s.step}
                    </div>

                    <div>
                      <h4 className={`text-sm font-heading font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                        {s.title}
                      </h4>
                      <span className="text-[11px] font-mono text-cyan-400/80">
                        Actor: {s.actor}
                      </span>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 animate-pulse">
                      PROCESSING...
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs font-mono text-slate-400 pl-9">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Protocol Inspector & Ledger Anchor */}
        <div className="rounded-2xl glass-panel p-5 space-y-5 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Cryptographic Session Telemetry</span>
            </span>
          </div>

          {/* Session Data Fields */}
          <div className="space-y-3">
            <div>
              <span className="text-slate-500 text-[11px]">Verifier Fresh Nonce (N_V):</span>
              <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-cyan-300 break-all">
                {sessionNonce}
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px]">Device Counter (Strict Monotonic):</span>
              <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-white font-bold">
                #{deviceCounter}
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px]">Ledger-Anchored PUF Commitment:</span>
              <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px] break-all">
                {node.pufProfile.stableKeyCommitment}
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px]">Simulated Signature:</span>
              <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400 text-[10px] break-all">
                {generatedSig || '(Awaiting protocol execution)'}
              </div>
            </div>
          </div>

          {/* Verification Verdict Box */}
          {verificationResult && (
            <div className={`p-4 rounded-xl border mt-4 space-y-2 ${
              verificationResult.overallPass 
                ? 'bg-emerald-950/60 border-emerald-500/50' 
                : 'bg-rose-950/60 border-rose-500/50'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>AUTHENTICATION VERDICT:</span>
                <span className={verificationResult.overallPass ? 'text-emerald-400' : 'text-rose-400'}>
                  {verificationResult.overallPass ? 'PERMITTED (PASS)' : 'REJECTED (FAIL)'}
                </span>
              </div>

              <div className="space-y-1 text-[11px] pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">1. Fresh Nonce Check:</span>
                  <span className={verificationResult.nonceFresh ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                    {verificationResult.nonceFresh ? 'PASS' : 'FAIL (STALE NONCE)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2. PUF Commitment Match:</span>
                  <span className={verificationResult.commitmentMatched ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                    {verificationResult.commitmentMatched ? 'PASS' : 'FAIL (COUNTERFEIT)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">3. Schnorr Signature Integrity:</span>
                  <span className={verificationResult.signatureValid ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                    {verificationResult.signatureValid ? 'PASS' : 'FAIL (FORGED)'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
