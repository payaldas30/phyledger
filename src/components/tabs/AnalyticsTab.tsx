import React, { useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Cpu, 
  Thermometer, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Info,
  AlertTriangle
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AnalyticsTab: React.FC = () => {
  const { displayNodes } = useSimulation();

  const [activeChartGroup, setActiveChartGroup] = useState<'PUF' | 'NETWORK' | 'SECURITY'>('PUF');

  // Synthetic simulation data for PUF curves
  // 1. BER vs Temperature (-40C to +85C)
  const berVsTempData = [
    { temp: -40, ber: 4.8 },
    { temp: -20, ber: 3.1 },
    { temp: 0, ber: 1.8 },
    { temp: 25, ber: 0.8 }, // Nominal
    { temp: 45, ber: 1.9 },
    { temp: 65, ber: 3.8 },
    { temp: 85, ber: 6.2 },
  ];

  // 2. BER vs Voltage (0.9V to 1.3V)
  const berVsVoltData = [
    { volt: 0.90, ber: 7.4 },
    { volt: 1.00, ber: 4.2 },
    { volt: 1.10, ber: 1.9 },
    { volt: 1.20, ber: 0.8 }, // Nominal
    { volt: 1.25, ber: 1.7 },
    { volt: 1.30, ber: 3.9 },
  ];

  // 3. PUF Uniqueness Histogram (mean ~49.8%, standard normal bell curve)
  const uniquenessHistogram = [
    { bin: '44-46%', count: 4 },
    { bin: '46-48%', count: 18 },
    { bin: '48-50%', count: 48 }, // Peak around 50%
    { bin: '50-52%', count: 22 },
    { bin: '52-54%', count: 8 },
  ];

  // 4. Throughput vs Node Count
  const throughputVsNodes = [
    { nodes: 10, tps: 14, latency: 38 },
    { nodes: 50, tps: 68, latency: 42 },
    { nodes: 100, tps: 135, latency: 48 },
    { nodes: 250, tps: 320, latency: 54 },
    { nodes: 500, tps: 610, latency: 62 },
    { nodes: 1000, tps: 1180, latency: 78 },
  ];

  // Fleet Trust Score Distribution
  const trustedCount = displayNodes.filter(n => n.trustStatus === 'TRUSTED').length;
  const watchlistCount = displayNodes.filter(n => n.trustStatus === 'WATCHLIST').length;
  const suspiciousCount = displayNodes.filter(n => n.trustStatus === 'SUSPICIOUS').length;
  const quarantinedCount = displayNodes.filter(n => n.trustStatus === 'QUARANTINED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Security &amp; Physical Reliability Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Synthetic simulation models characterizing silicon PUF distributions, temperature drift, latency, and fleet trust.
            </p>
          </div>

          {/* Group Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            {(['PUF', 'NETWORK', 'SECURITY'] as const).map(grp => (
              <button
                key={grp}
                onClick={() => setActiveChartGroup(grp)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeChartGroup === grp
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {grp === 'PUF' ? 'Silicon PUF Curves' : grp === 'NETWORK' ? 'Scalability & TPS' : 'Trust & Attacks'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>DATASET SPECIFICATION: Synthetic in-browser generated research telemetry</span>
          <span className="text-cyan-400">&bull; Labeled Simulation Metrics</span>
        </div>
      </div>

      {/* Main Charts Viewport */}
      {activeChartGroup === 'PUF' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: BER vs Temperature */}
          <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span>Bit Error Rate vs Temperature (-40&deg;C to +85&deg;C)</span>
              </span>
              <span className="text-[10px] text-slate-500">BCH Limit: 11%</span>
            </div>

            {/* SVG Curve */}
            <div className="h-56 w-full flex items-end justify-between px-4 pt-6 pb-2 border-b border-l border-slate-800 relative">
              {/* BCH Limit Line */}
              <div className="absolute top-6 left-0 right-0 border-t border-dashed border-rose-500/50 flex justify-end pr-2">
                <span className="text-[9px] text-rose-400">BCH Max Correctable (11.0%)</span>
              </div>

              {berVsTempData.map((d, i) => {
                const heightPercent = (d.ber / 12) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 group flex-1">
                    <span className="text-[10px] text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.ber}%
                    </span>
                    <div 
                      className={`w-8 rounded-t transition-all ${
                        d.temp === 25 ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-slate-400 mt-1">{d.temp}&deg;C</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              U-shaped thermal response curve: Minimal BER occurs at nominal 25&deg;C (0.8%). Extreme industrial cold (-40&deg;C) and heat (+85&deg;C) remain safely within BCH error correction thresholds.
            </p>
          </div>

          {/* Chart 2: BER vs Supply Voltage */}
          <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Bit Error Rate vs Supply Voltage (0.90V to 1.30V)</span>
              </span>
              <span className="text-[10px] text-slate-500">Nominal: 1.20V</span>
            </div>

            {/* SVG Curve */}
            <div className="h-56 w-full flex items-end justify-between px-4 pt-6 pb-2 border-b border-l border-slate-800 relative">
              {berVsVoltData.map((d, i) => {
                const heightPercent = (d.ber / 12) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 group flex-1">
                    <span className="text-[10px] text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.ber}%
                    </span>
                    <div 
                      className={`w-8 rounded-t transition-all ${
                        d.volt === 1.20 ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-slate-400 mt-1">{d.volt}V</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              Under-volting (0.90V) induces pronounced gate delay skew (BER 7.4%), while nominal 1.20V yields sub-1% error rates.
            </p>
          </div>

          {/* Chart 3: Inter-Device Uniqueness Histogram */}
          <div className="lg:col-span-2 rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Fleet Inter-Device Uniqueness Distribution (Ideal: 50.0% Fractional Hamming Distance)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Mean: 49.82% &bull; &sigma; = 1.4%</span>
            </div>

            <div className="grid grid-cols-5 gap-3 py-4">
              {uniquenessHistogram.map((bin, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-sm font-bold text-cyan-300 mb-1">{bin.count}%</div>
                  <div className="w-full bg-slate-950 h-32 rounded-lg border border-slate-800 flex items-end p-1">
                    <div 
                      className="w-full bg-indigo-500/80 rounded transition-all hover:bg-indigo-400"
                      style={{ height: `${(bin.count / 50) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 font-bold">{bin.bin}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Gaussian distribution centered at 49.82% confirms near-perfect spatial unpredictability across simulated silicon dice.
            </p>
          </div>
        </div>
      )}

      {activeChartGroup === 'NETWORK' && (
        <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Network Scalability: Throughput (TPS) &amp; Latency vs Node Fleet Size</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-4">FLEET SIZE</th>
                  <th className="py-3 px-4">THROUGHPUT (TPS)</th>
                  <th className="py-3 px-4">AUTH LATENCY (MS)</th>
                  <th className="py-3 px-4">BLOCK CONFIRMATION</th>
                  <th className="py-3 px-4">VALIDATOR LOAD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {throughputVsNodes.map(r => (
                  <tr key={r.nodes} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-bold text-white">{r.nodes} Nodes</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{r.tps} tx/s</td>
                    <td className="py-3 px-4 text-slate-300">{r.latency} ms</td>
                    <td className="py-3 px-4 text-emerald-400">&le; 8.0s</td>
                    <td className="py-3 px-4 text-amber-400">{Math.round((r.nodes / 1000) * 75 + 12)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeChartGroup === 'SECURITY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trust Score Distribution */}
          <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Fleet Trust Score Distribution ({displayNodes.length} Nodes)</span>
              </span>
            </div>

            <div className="space-y-3 py-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-emerald-400 font-bold">TRUSTED (&ge;80):</span>
                  <span className="text-white font-bold">{trustedCount} nodes ({Math.round((trustedCount/displayNodes.length)*100)}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-400 h-full" style={{ width: `${(trustedCount/displayNodes.length)*100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-400 font-bold">WATCHLIST (50–79):</span>
                  <span className="text-white font-bold">{watchlistCount} nodes ({Math.round((watchlistCount/displayNodes.length)*100)}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-cyan-400 h-full" style={{ width: `${(watchlistCount/displayNodes.length)*100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-amber-400 font-bold">SUSPICIOUS (20–49):</span>
                  <span className="text-white font-bold">{suspiciousCount} nodes</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-400 h-full" style={{ width: `${(suspiciousCount/displayNodes.length)*100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-rose-400 font-bold">QUARANTINED (&lt;20):</span>
                  <span className="text-rose-400 font-bold">{quarantinedCount} nodes</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full" style={{ width: `${(quarantinedCount/displayNodes.length)*100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Attack Detection & Mitigation Rates */}
          <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Simulated Attack Detection Rates</span>
              </span>
              <span className="text-emerald-400 font-bold">100% Intercepted</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Replay Incursions', rate: '100% (Nonce Check)', latency: '<1.2 ms' },
                { name: 'Counterfeit Silicon Cloning', rate: '100% (PUF Commitment)', latency: '<4.8 ms' },
                { name: 'Transaction Forgery', rate: '100% (Schnorr Sig)', latency: '<2.1 ms' },
                { name: 'Sybil Injection Flood', rate: '100% (Silicon Enrollment)', latency: '<12.4 ms' },
                { name: 'Physical Enclosure Tamper', rate: '100% (Mesh Sensor)', latency: '<0.4 ms' },
              ].map((atk, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-bold">{atk.name}</span>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold">{atk.rate}</span>
                    <span className="text-[10px] text-slate-500 block">Latency: {atk.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
