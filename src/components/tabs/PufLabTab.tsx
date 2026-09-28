import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Zap, 
  Sliders, 
  RotateCcw, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  Info,
  CheckCircle2,
  XCircle,
  Hash
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { simulatePufResponse, calculateInterDeviceUniqueness } from '../../utils/pufSimulator';

export const PufLabTab: React.FC = () => {
  const { selectedNodeId, setSelectedNodeId, displayNodes } = useSimulation();

  // Interactive PUF parameters
  const [challenge, setChallenge] = useState<string>('0x7F4A8B9C01DE23FE');
  const [temperature, setTemperature] = useState<number>(25.0); // °C
  const [voltage, setVoltage] = useState<number>(1.20); // V
  const [noise, setNoise] = useState<number>(1.5); // %
  const [measurementCount, setMeasurementCount] = useState<number>(8);
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState<number>(0);

  // Compare device for uniqueness metric
  const [comparisonDeviceId, setComparisonDeviceId] = useState<string>('D012');

  // Compute PUF simulation
  const pufResult = useMemo(() => {
    return simulatePufResponse(
      selectedNodeId || 'D047',
      challenge,
      temperature,
      voltage,
      noise,
      activeMeasurementIndex,
      128
    );
  }, [selectedNodeId, challenge, temperature, voltage, noise, activeMeasurementIndex]);

  // Compute inter-device uniqueness
  const uniquenessScore = useMemo(() => {
    return calculateInterDeviceUniqueness(selectedNodeId || 'D047', comparisonDeviceId, challenge, 128);
  }, [selectedNodeId, comparisonDeviceId, challenge]);

  // Reset to nominal standard conditions
  const resetToNominal = () => {
    setTemperature(25.0);
    setVoltage(1.20);
    setNoise(1.0);
    setChallenge('0x7F4A8B9C01DE23FE');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Required Academic Notice */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-heading font-bold text-white tracking-wide">
              Interactive Silicon PUF &amp; Fuzzy Extractor Laboratory
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Deterministic physical unclonable function simulation based on microscopic silicon gate-delay &amp; threshold variance.
          </p>
        </div>

        {/* Required Academic Banner */}
        <div className="px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>“Raw PUF response remains device-local in the conceptual model.”</span>
        </div>
      </div>

      {/* Main Grid: Controls + Interactive Bit Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Environmental & Operating Controls */}
        <div className="rounded-2xl glass-panel p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Silicon Operating Envelope</span>
            </span>
            <button
              onClick={resetToNominal}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Nominal (25&deg;C, 1.2V)</span>
            </button>
          </div>

          {/* Target Device Selector */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              Evaluated Device Instance:
            </label>
            <select
              value={selectedNodeId}
              onChange={e => setSelectedNodeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              {displayNodes.slice(0, 30).map(n => (
                <option key={n.id} value={n.id}>
                  {n.id} — {n.type} ({n.trustStatus})
                </option>
              ))}
            </select>
          </div>

          {/* Challenge String Input */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              Input Challenge Vector (Hex C):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={challenge}
                onChange={e => setChallenge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => setChallenge(`0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`)}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
                title="Randomize challenge"
              >
                Rand
              </button>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Temperature (T):
              </span>
              <span className={`font-bold ${temperature > 60 || temperature < 0 ? 'text-amber-400' : 'text-white'}`}>
                {temperature.toFixed(1)} &deg;C
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="85"
              step="0.5"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>-40&deg;C (Cold)</span>
              <span>25&deg;C (Nominal)</span>
              <span>+85&deg;C (Industrial Hot)</span>
            </div>
          </div>

          {/* Voltage Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Supply Voltage (VDD):
              </span>
              <span className={`font-bold ${voltage < 1.05 || voltage > 1.25 ? 'text-amber-400' : 'text-white'}`}>
                {voltage.toFixed(2)} V
              </span>
            </div>
            <input
              type="range"
              min="0.90"
              max="1.30"
              step="0.01"
              value={voltage}
              onChange={e => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>0.90V (Under-volt)</span>
              <span>1.20V (Nominal)</span>
              <span>1.30V (Over-volt)</span>
            </div>
          </div>

          {/* Noise Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Environmental Thermal Noise:</span>
              <span className="font-bold text-white">{noise.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={noise}
              onChange={e => setNoise(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Repeated Measurement Runs */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">Repeated Measurement Runs:</span>
              <span className="text-cyan-400 font-bold">Sample #{activeMeasurementIndex + 1} of {measurementCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(8, measurementCount) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMeasurementIndex(i)}
                  className={`flex-1 py-1 rounded text-xs font-mono border ${
                    activeMeasurementIndex === i
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  #{i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Bit-Grid & Error Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
              <span className="text-[11px] text-slate-400 uppercase">Reliability</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {pufResult.reliability}%
              </div>
              <div className="text-[10px] text-slate-500">Ideal: 100.0%</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
              <span className="text-[11px] text-slate-400 uppercase">Bit Error Rate (BER)</span>
              <div className={`text-2xl font-bold mt-1 ${pufResult.ber > 11 ? 'text-rose-400' : 'text-cyan-300'}`}>
                {pufResult.ber}%
              </div>
              <div className="text-[10px] text-slate-500">{pufResult.hammingDistance} / 128 bits flipped</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
              <span className="text-[11px] text-slate-400 uppercase">Inter-Device Uniqueness</span>
              <div className="text-2xl font-bold text-indigo-400 mt-1">
                {uniquenessScore}%
              </div>
              <div className="text-[10px] text-slate-500">vs {comparisonDeviceId} (Ideal: 50%)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
              <span className="text-[11px] text-slate-400 uppercase">BCH(128,64) ECC</span>
              <div className={`text-sm font-bold mt-2 flex items-center justify-center gap-1 ${
                pufResult.errorCorrectionStatus === 'CORRECTED' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {pufResult.errorCorrectionStatus === 'CORRECTED' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CORRECTED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>EXCEEDED</span>
                  </>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Threshold: &le;14 bits</div>
            </div>
          </div>

          {/* Interactive 128-Bit PUF Response Visual Matrix */}
          <div className="rounded-2xl glass-panel p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  <span>128-Bit Silicon Response Matrix (Nominal vs Perturbed)</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Red bits indicate environmental bit-flips caused by thermal/voltage drift relative to nominal golden baseline.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/80" /> Stable Bit (1)
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800" /> Stable Bit (0)
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 animate-pulse" /> Bit Flip
                </span>
              </div>
            </div>

            {/* Matrix Cells */}
            <div className="grid grid-cols-16 gap-1 p-3 rounded-xl bg-slate-950/90 border border-slate-800/80">
              {pufResult.measuredResponse.split('').map((bit, idx) => {
                const isFlipped = pufResult.bitFlips.includes(idx);
                return (
                  <div
                    key={idx}
                    title={`Bit #${idx} | Nominal: ${pufResult.nominalResponse[idx]} | Measured: ${bit} ${isFlipped ? '(FLIPPED)' : '(STABLE)'}`}
                    className={`h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold transition-all cursor-default ${
                      isFlipped 
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/50 scale-105 ring-1 ring-rose-400' 
                        : bit === '1' 
                        ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {bit}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 text-right text-[11px] font-mono text-slate-500">
              Hamming Distance: <strong className="text-white">{pufResult.hammingDistance}</strong> / 128 &bull; Bit Flip Rate: <strong className="text-cyan-400">{pufResult.ber}%</strong>
            </div>
          </div>

          {/* Conceptual Fuzzy Extractor Pipeline Card */}
          <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Conceptual Fuzzy Extractor Pipeline</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                BCH(128, 64, t=14)
              </span>
            </div>

            {/* Visual Step Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">1. Silicon Input</div>
                <div className="font-bold text-white mt-1">Raw PUF Response</div>
                <div className="text-[10px] text-slate-400 mt-1">128-bit noisy stream</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">2. Error Correction</div>
                <div className="font-bold text-cyan-300 mt-1">BCH Decoder (Syndrome W)</div>
                <div className="text-[10px] text-slate-400 mt-1">Corrects up to 14 errors</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">3. Volatile Key</div>
                <div className="font-bold text-amber-300 mt-1">Stable Key K</div>
                <div className="text-[10px] text-slate-400 mt-1">Never stored in flash/RAM</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">4. Ledger Output</div>
                <div className="font-bold text-emerald-400 mt-1">Key Commitment</div>
                <div className="text-[10px] text-slate-400 mt-1">Public SHA-256 anchor</div>
              </div>
            </div>

            {/* Reconstructed Commitment Verification */}
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Ledger-Registered Commitment:</span>
                <span className="text-slate-300 font-mono text-[10px] select-all">
                  {pufResult.stableKeyCommitment.substring(0, 32)}...
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Reconstructed Response Commitment:</span>
                <span className={`font-mono text-[10px] select-all ${
                  pufResult.reconstructedKeyCommitment === pufResult.stableKeyCommitment 
                    ? 'text-emerald-400 font-bold' 
                    : 'text-rose-400 font-bold'
                }`}>
                  {pufResult.reconstructedKeyCommitment.substring(0, 32)}...
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Zero-Trust Match:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  pufResult.reconstructedKeyCommitment === pufResult.stableKeyCommitment
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {pufResult.reconstructedKeyCommitment === pufResult.stableKeyCommitment
                    ? 'VERIFIED MATCH — AUTHENTICATION PERMITTED'
                    : 'MISMATCH EXCEEDED — REJECTED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
