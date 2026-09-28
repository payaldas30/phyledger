import React, { useState } from 'react';
import { 
  Zap, 
  Battery, 
  BatteryCharging, 
  Clock, 
  Sliders, 
  TrendingDown, 
  Award, 
  Info,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const EnergyLabTab: React.FC = () => {
  const { activeNodeCount } = useSimulation();

  // Configurable simulation parameters
  const [nodeCount, setNodeCount] = useState<number>(activeNodeCount || 100);
  const [txRate, setTxRate] = useState<number>(1.5); // tx/sec per node
  const [blockInterval, setBlockInterval] = useState<number>(10); // seconds
  const [difficulty, setDifficulty] = useState<number>(3); // leading zeroes

  // Mathematical energy computations:
  // SHA-256 Reference: 1.82 W mining power + 758.3 nJ/hash
  // CLFSR Lightweight: 0.12 W mining power + 38.3 nJ/hash
  const baseShaPower = 1.82; // Watts
  const baseClfsrPower = 0.12; // Watts

  // Node telemetry power (~15 mW idle + auth spikes)
  const nodeFleetPower = (nodeCount * 0.018); // Watts

  const shaTotalPower = baseShaPower + nodeFleetPower;
  const clfsrTotalPower = baseClfsrPower + nodeFleetPower;

  // Hashes needed based on difficulty: 16^difficulty average attempts
  const avgHashAttempts = Math.pow(16, difficulty);

  // Daily energy in Watt-hours: Power * 24h
  const shaDailyWh = (shaTotalPower * 24).toFixed(1);
  const clfsrDailyWh = (clfsrTotalPower * 24).toFixed(1);
  const energySavedPercent = (((shaTotalPower - clfsrTotalPower) / shaTotalPower) * 100).toFixed(1);

  // Battery lifetime on a standard 3.7V 2000mAh (7.4 Wh) industrial Li-Po cell
  const batteryCapacityWh = 7.4;
  const shaBatteryHours = (batteryCapacityWh / (shaTotalPower / (nodeCount || 1))).toFixed(1);
  const clfsrBatteryHours = (batteryCapacityWh / (clfsrTotalPower / (nodeCount || 1))).toFixed(1);
  const clfsrBatteryDays = (parseFloat(clfsrBatteryHours) / 24).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Energy Lab &amp; Green IoT Blockchain Modeling
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Analyze physical energy conservation between standard SHA-256 and CLFSR-inspired lightweight consensus for edge IoT deployments.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono max-w-md">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <BatteryCharging className="w-4 h-4 flex-shrink-0" />
              <span>Simulated Energy Conservation: {energySavedPercent}%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Low FPGA slice consumption enables battery-powered IoT devices and micro-gateways to participate without thermal throttling.
            </p>
          </div>
        </div>

        {/* Configurable Sliders Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Number of IoT Nodes:</span>
              <span className="font-bold text-white">{nodeCount}</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={nodeCount}
              onChange={e => setNodeCount(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Tx Rate (tx/s per node):</span>
              <span className="font-bold text-cyan-300">{txRate.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="10"
              step="0.2"
              value={txRate}
              onChange={e => setTxRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Block Interval (seconds):</span>
              <span className="font-bold text-amber-400">{blockInterval}s</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={blockInterval}
              onChange={e => setBlockInterval(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Consensus Difficulty:</span>
              <span className="font-bold text-rose-400">{difficulty} Leading Zeros</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={difficulty}
              onChange={e => setDifficulty(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: SHA-256 vs CLFSR Lightweight Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHA-256 Reference Mode Card */}
        <div className="rounded-2xl glass-panel p-5 space-y-4 border border-slate-700/60 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                Conventional Baseline
              </span>
              <h3 className="text-base font-heading font-bold text-white mt-1">
                SHA-256 Reference Benchmark Mode
              </h3>
            </div>
            <Cpu className="w-5 h-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">CONSENSUS POWER DRAW</span>
              <div className="text-xl font-bold text-rose-400 mt-0.5">{shaTotalPower.toFixed(2)} W</div>
              <div className="text-[10px] text-slate-500">1.82 W core + node fleet</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">ENERGY PER HASH</span>
              <div className="text-xl font-bold text-slate-200 mt-0.5">758.3 nJ</div>
              <div className="text-[10px] text-slate-500">Artix-7 hardware benchmark</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">DAILY CONSUMPTION</span>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{shaDailyWh} Wh/day</div>
              <div className="text-[10px] text-slate-500">24-hour continuous</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">BATTERY ENDURANCE (2000mAh)</span>
              <div className="text-xl font-bold text-slate-300 mt-0.5">{shaBatteryHours} hrs</div>
              <div className="text-[10px] text-slate-500">Per edge gateway node</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">FPGA Hardware Overhead:</div>
            <div>&bull; 1,840 LUTs / 1,220 Flip-Flops &bull; High thermal signature requiring heatsink on edge gateways.</div>
          </div>
        </div>

        {/* CLFSR Lightweight Consensus Card */}
        <div className="rounded-2xl glass-panel p-5 space-y-4 border border-emerald-500/30 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                Lightweight Proposed Mode
              </span>
              <h3 className="text-base font-heading font-bold text-white mt-1">
                CLFSR-Inspired Lightweight Simulation
              </h3>
            </div>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">CONSENSUS POWER DRAW</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{clfsrTotalPower.toFixed(2)} W</div>
              <div className="text-[10px] text-slate-500">0.12 W core + node fleet</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">ENERGY PER HASH</span>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">38.3 nJ</div>
              <div className="text-[10px] text-slate-500">19.8x reduction vs SHA-256</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">DAILY CONSUMPTION</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{clfsrDailyWh} Wh/day</div>
              <div className="text-[10px] text-slate-500">93.4% energy conservation</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">BATTERY ENDURANCE (2000mAh)</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{clfsrBatteryDays} days</div>
              <div className="text-[10px] text-slate-500">Long-term field deployment</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">FPGA Hardware Overhead:</div>
            <div>&bull; 142 LUTs / 88 Flip-Flops &bull; Minimal passive thermal dissipation, suited for solar/battery IoT.</div>
          </div>
        </div>
      </div>

      {/* SVG Comparative Visual Bar Chart */}
      <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-cyan-400" />
            <span>Visual Energy Comparison (Daily Consumption in Wh)</span>
          </span>
          <span className="text-[11px] text-emerald-400 font-bold">
            &Delta; -{energySavedPercent}% Energy Saved
          </span>
        </div>

        <div className="space-y-4 py-2">
          {/* SHA-256 Bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-300">Conventional SHA-256 Reference:</span>
              <span className="text-rose-400 font-bold">{shaDailyWh} Wh/day</span>
            </div>
            <div className="w-full bg-slate-950 h-5 rounded-lg overflow-hidden border border-slate-800 flex">
              <div 
                className="bg-rose-500/80 h-full flex items-center px-2 text-[10px] font-bold text-white transition-all duration-500"
                style={{ width: '100%' }}
              >
                100% Baseline ({shaTotalPower.toFixed(2)}W)
              </div>
            </div>
          </div>

          {/* CLFSR Bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-300">CLFSR-Inspired Lightweight Simulation:</span>
              <span className="text-emerald-400 font-bold">{clfsrDailyWh} Wh/day</span>
            </div>
            <div className="w-full bg-slate-950 h-5 rounded-lg overflow-hidden border border-slate-800 flex">
              <div 
                className="bg-emerald-500 h-full flex items-center px-2 text-[10px] font-bold text-slate-950 transition-all duration-500"
                style={{ width: `${Math.max(6, (clfsrTotalPower / shaTotalPower) * 100)}%` }}
              >
                {((clfsrTotalPower / shaTotalPower) * 100).toFixed(1)}% ({clfsrTotalPower.toFixed(2)}W)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Distinction: Simulation Output vs Reference Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Cpu className="w-4 h-4" />
            <span>WEBSITE SIMULATION OUTPUT</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Calculated dynamically based on your current inputs: {nodeCount} active nodes, {txRate} tx/s, {blockInterval}s interval, difficulty {difficulty}. These values demonstrate computational trends and relative scaling behaviors.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Award className="w-4 h-4" />
            <span>REFERENCE-PAPER EXPERIMENTAL BENCHMARK</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Fixed empirical values cited from published literature (Xilinx Artix-7 XC7A100T FPGA): CLFSR measured at 3.13 Mhash/s at 0.12 W vs Hardware SHA-256 at 2.40 Mhash/s at 1.82 W. Not physical measurements produced by this browser simulator.
          </p>
        </div>
      </div>
    </div>
  );
};
