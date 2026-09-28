import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Sliders, 
  TrendingUp, 
  ExternalLink,
  Layers,
  BatteryCharging
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { IoTNode, NodeTrustStatus } from '../../types';

interface NetworkTabProps {
  onOpenNodeModal: (node: IoTNode) => void;
}

export const NetworkTab: React.FC<NetworkTabProps> = ({ onOpenNodeModal }) => {
  const { 
    displayNodes, 
    activeNodeCount, 
    setActiveNodeCount, 
    setSelectedNodeId,
    consensusAlgorithm 
  } = useSimulation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | NodeTrustStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const scalabilityPresets = [10, 50, 100, 250, 500, 750, 1000];

  // Dynamic scalability impact simulation formulas
  const simulatedTPS = Math.round(activeNodeCount * 1.35);
  const simulatedLatency = (35 + Math.log2(activeNodeCount) * 4.2).toFixed(1);
  const simulatedBlockInterval = Math.max(2, Math.round(15 - Math.log10(activeNodeCount) * 3));
  const validatorLoad = Math.min(96, Math.round(8 + (activeNodeCount / 1000) * 72));
  const estimatedPower = (consensusAlgorithm === 'CLFSR-SIMULATED' ? 0.12 * (activeNodeCount / 100) : 1.82 * (activeNodeCount / 100)).toFixed(2);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return displayNodes.filter(node => {
      const matchSearch = node.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.mac.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || node.trustStatus === statusFilter;
      const matchType = typeFilter === 'ALL' || node.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [displayNodes, searchQuery, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Header & Scalability Controls */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                IoT Fleet Scalability &amp; Topology Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Dynamically scale network node density from 10 to 1,000 devices and observe zero-trust consensus load.
            </p>
          </div>

          {/* Node Count Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400 mr-1">Scale Fleet:</span>
            {scalabilityPresets.map(count => (
              <button
                key={count}
                onClick={() => setActiveNodeCount(count)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  activeNodeCount === count
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                {count} Nodes
              </button>
            ))}
          </div>
        </div>

        {/* Scalability Impact Telemetry Readout */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500">Fleet Throughput:</span>
            <div className="text-base font-bold text-cyan-300 mt-0.5">{simulatedTPS} tx/s</div>
            <div className="text-[10px] text-slate-500">Simulated load</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500">Auth Latency:</span>
            <div className="text-base font-bold text-white mt-0.5">{simulatedLatency} ms</div>
            <div className="text-[10px] text-slate-500">Round-trip verification</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500">Target Block Time:</span>
            <div className="text-base font-bold text-white mt-0.5">{simulatedBlockInterval} s</div>
            <div className="text-[10px] text-slate-500">Adaptive interval</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500">Validator Core Load:</span>
            <div className="text-base font-bold text-amber-400 mt-0.5">{validatorLoad}%</div>
            <div className="text-[10px] text-slate-500">3-peer cluster</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500">Fleet Power Draw:</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{estimatedPower} W</div>
            <div className="text-[10px] text-slate-500">{consensusAlgorithm}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Device ID (e.g. D047) or MAC..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {(['ALL', 'TRUSTED', 'WATCHLIST', 'SUSPICIOUS', 'QUARANTINED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === st 
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Node Fleet Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-cyan-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 px-4">DEVICE ID</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">TRUST STATUS</th>
                <th className="py-3 px-4">PUF STABILITY</th>
                <th className="py-3 px-4">ENV (TEMP/VOLT)</th>
                <th className="py-3 px-4">TX RATE</th>
                <th className="py-3 px-4">VALIDATOR PEER</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredNodes.slice(0, 50).map(node => (
                <tr 
                  key={node.id} 
                  className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    onOpenNodeModal(node);
                  }}
                >
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      node.isQuarantined ? 'bg-rose-500' : node.trustScore >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <span className="group-hover:text-cyan-300 transition-colors">{node.id}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{node.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      node.trustStatus === 'TRUSTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      node.trustStatus === 'WATCHLIST' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                      node.trustStatus === 'SUSPICIOUS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {node.trustStatus} ({node.trustScore})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white">{node.pufProfile.currentReliability}%</span>
                      <span className="text-[10px] text-slate-500">(BER {node.pufProfile.currentBER}%)</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {node.pufProfile.temperature}&deg;C / {node.pufProfile.voltage}V
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {node.isQuarantined ? '0.0 tx/s (revoked)' : `${node.txRate} tx/s`}
                  </td>
                  <td className="py-3 px-4 text-cyan-400">{node.connectedValidatorId}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                        onOpenNodeModal(node);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNodes.length > 50 && (
          <div className="p-3 text-center text-xs font-mono text-slate-500 bg-slate-950/60 border-t border-slate-800">
            Showing first 50 nodes of {filteredNodes.length}. Use search to query specific devices.
          </div>
        )}
      </div>
    </div>
  );
};
