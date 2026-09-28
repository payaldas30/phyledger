import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Activity, 
  Radio, 
  Cpu, 
  Zap, 
  Lock, 
  Play, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Battery
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { IoTNode } from '../../types';

interface DashboardTabProps {
  onOpenNodeModal: (node: IoTNode) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onOpenNodeModal, onNavigateTab }) => {
  const { 
    displayNodes, 
    blocks, 
    securityEvents, 
    mineNewBlock, 
    isMining, 
    loadScenario,
    consensusAlgorithm,
    selectedNodeId,
    setSelectedNodeId
  } = useSimulation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'TRUSTED' | 'QUARANTINED'>('ALL');
  const [hoveredNode, setHoveredNode] = useState<IoTNode | null>(null);

  // Compute live KPI metrics
  const totalNodes = displayNodes.length;
  const trustedNodes = displayNodes.filter(n => n.trustStatus === 'TRUSTED').length;
  const quarantinedNodes = displayNodes.filter(n => n.trustStatus === 'QUARANTINED').length;
  const watchlistNodes = displayNodes.filter(n => n.trustStatus === 'WATCHLIST' || n.trustStatus === 'SUSPICIOUS').length;
  const activeAttacksCount = securityEvents.filter(e => e.severity === 'CRITICAL' && Date.now() - e.timestamp < 120000).length;

  const avgAuthLatency = 42.4; // ms (typical BCH(128,64) evaluation on Cortex-M4)
  const networkHealth = Math.round((trustedNodes / (totalNodes || 1)) * 100);
  const consensusHealth = 99.8; // %
  const currentTPS = (displayNodes.reduce((acc, n) => acc + (n.isQuarantined ? 0 : n.txRate), 0)).toFixed(1);
  const estimatedEnergyPerSec = (consensusAlgorithm === 'CLFSR-SIMULATED' ? 0.12 : 1.82).toFixed(2);

  // Animated 2D Network Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw 3 Validators as central hub anchors
      const validators = [
        { id: 'VAL-ALPHA', x: width * 0.28, y: height * 0.5 },
        { id: 'VAL-BETA', x: width * 0.50, y: height * 0.45 },
        { id: 'VAL-GAMMA', x: width * 0.72, y: height * 0.52 },
      ];

      // Draw validator interconnection lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(validators[0].x, validators[0].y);
      ctx.lineTo(validators[1].x, validators[1].y);
      ctx.lineTo(validators[2].x, validators[2].y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw active telemetry packets traveling from nodes to validators
      const nodesToRender = displayNodes.slice(0, 100);

      nodesToRender.forEach((node, idx) => {
        // Map node position relative to canvas size
        const col = idx % 10;
        const row = Math.floor(idx / 10);
        const nx = 40 + col * ((width - 80) / 9);
        const ny = 40 + row * ((height - 80) / 9);

        // Assign to nearest validator
        const val = validators[idx % 3];

        // Draw connection beam
        const isQuarantined = node.trustStatus === 'QUARANTINED';
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNodeId === node.id;

        if (!isQuarantined) {
          ctx.strokeStyle = isSelected 
            ? 'rgba(6, 182, 212, 0.6)' 
            : 'rgba(56, 189, 248, 0.08)';
          ctx.lineWidth = isSelected ? 1.5 : 0.7;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(val.x, val.y);
          ctx.stroke();

          // Animated packet dot
          const progress = ((t * 0.8 + (idx * 0.17)) % 1);
          const px = nx + (val.x - nx) * progress;
          const py = ny + (val.y - ny) * progress;

          ctx.fillStyle = idx % 5 === 0 ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)';
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Severed connection indicator for quarantined node
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(nx + (val.x - nx) * 0.3, ny + (val.y - ny) * 0.3);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw Node point
        let nodeColor = '#10b981'; // TRUSTED
        if (node.trustStatus === 'WATCHLIST') nodeColor = '#06b6d4';
        else if (node.trustStatus === 'SUSPICIOUS') nodeColor = '#f59e0b';
        else if (node.trustStatus === 'QUARANTINED') nodeColor = '#f43f5e';

        // Outer glow on selected/hovered
        if (isSelected || isHovered) {
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(nx, ny, 7 + Math.sin(t * 3) * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(nx, ny, isSelected ? 4.5 : 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Node ID label on hover or key node D047
        if (node.id === 'D047' || isHovered || isSelected) {
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillStyle = isQuarantined ? '#f43f5e' : '#e2e8f0';
          ctx.fillText(node.id, nx - 12, ny - 8);
        }
      });

      // Draw Validators on top
      validators.forEach(v => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(v.x, v.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(v.id, v.x - 22, v.y + 24);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [displayNodes, hoveredNode, selectedNodeId, consensusAlgorithm]);

  // Click on canvas to select node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    // Find closest node within 15px
    const nodesToTest = displayNodes.slice(0, 100);
    for (let idx = 0; idx < nodesToTest.length; idx++) {
      const col = idx % 10;
      const row = Math.floor(idx / 10);
      const nx = 40 + col * ((width - 80) / 9);
      const ny = 40 + row * ((height - 80) / 9);

      const dist = Math.hypot(x - nx, y - ny);
      if (dist <= 15) {
        setSelectedNodeId(nodesToTest[idx].id);
        onOpenNodeModal(nodesToTest[idx]);
        return;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 10 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL IOT NODES</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white mt-2">
            {totalNodes}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <span>{trustedNodes}</span> trusted &bull; <span className="text-cyan-400">{watchlistNodes}</span> watchlist
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TRUSTED NODES</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-emerald-400 mt-2">
            {trustedNodes} <span className="text-xs font-mono text-slate-500">({Math.round((trustedNodes/totalNodes)*100)}%)</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Zero-Trust verified
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>QUARANTINED NODES</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className={`text-2xl font-heading font-extrabold mt-2 ${quarantinedNodes > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
            {quarantinedNodes}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Revoked &amp; isolated
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE ATTACKS</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className={`text-2xl font-heading font-extrabold mt-2 ${activeAttacksCount > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-300'}`}>
            {activeAttacksCount}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Auto-mitigated in real-time
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>BLOCKS GENERATED</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white mt-2">
            #{blocks.length.toString().padStart(6, '0')}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Immutable chain depth
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>THROUGHPUT (TPS)</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-cyan-300 mt-2">
            {currentTPS} <span className="text-xs font-mono text-slate-500">tx/s</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Telemetry &amp; actuation rate
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AVG AUTH LATENCY</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white mt-2">
            {avgAuthLatency} <span className="text-xs font-mono text-slate-500">ms</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            BCH fuzzy extractor + Schnorr
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>NETWORK HEALTH</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-emerald-400 mt-2">
            {networkHealth}%
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Composite fleet trust ratio
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CONSENSUS HEALTH</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-amber-300 mt-2">
            {consensusHealth}%
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Lightweight CLFSR Engine
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EST. POWER (W)</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-emerald-400 mt-2">
            {estimatedEnergyPerSec} <span className="text-xs font-mono text-slate-500">W</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            {consensusAlgorithm === 'CLFSR-SIMULATED' ? 'Lightweight mode' : 'SHA-256 ref mode'}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas Topology + Scenario Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Visualizer (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-base font-heading font-bold text-white tracking-wide">
                  Live IoT Mesh Topology ({displayNodes.length} Nodes &bull; 3 Validators)
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Click any node to open its hardware PUF and Zero-Trust security profile
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Legend:</span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Trusted
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Watchlist
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Quarantined
              </span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[400px] rounded-xl bg-slate-950/90 border border-cyan-500/20 overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={820}
              height={400}
              onClick={handleCanvasClick}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
              VAL-ALPHA &bull; VAL-BETA &bull; VAL-GAMMA | Interactive Zero-Trust Web
            </div>
          </div>

          {/* Quick Node D047 Focus Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Selected Target: <strong className="text-cyan-300">Node {selectedNodeId}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const node = displayNodes.find(n => n.id === selectedNodeId);
                  if (node) onOpenNodeModal(node);
                }}
                className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>Inspect Device Profile</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Scenario Mode & Mine Block */}
        <div className="space-y-6">
          {/* Preset Scenarios Card */}
          <div className="rounded-2xl glass-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Live Scenario Presets</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                1-Click Inject
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mb-3">
              Inject preset cyber-physical conditions into the live network:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: 'NORMAL OPERATION', desc: 'All 100 nodes nominal' },
                { name: 'REPLAY ATTACK', desc: 'Duplicated nonce on D047' },
                { name: 'DEVICE CLONING', desc: 'Counterfeit PUF response' },
                { name: 'ENVIRONMENTAL STRESS', desc: 'Temp spike & BER drift' },
                { name: 'TRANSACTION FLOOD', desc: 'Mempool DDoS spam' },
                { name: 'MALICIOUS VALIDATORS', desc: 'Fork equivocation' },
                { name: 'COMBINED ATTACK', desc: 'Multi-vector stress test' },
              ].map(sc => (
                <button
                  key={sc.name}
                  onClick={() => loadScenario(sc.name)}
                  className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="text-[11px] font-mono font-bold text-slate-200 group-hover:text-cyan-300">
                    {sc.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {sc.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instant Block Mining Card */}
          <div className="rounded-2xl glass-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Simulated Consensus Minting</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                {consensusAlgorithm}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mb-4">
              Aggregate pending zero-trust sensor transactions and mint the next block into the chain.
            </p>

            <button
              onClick={() => mineNewBlock()}
              disabled={isMining}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {isMining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Proof of Consensus...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Mine Next Block (#{blocks.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Blockchain Blocks & Security Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confirmed Ledger Blocks */}
        <div className="rounded-2xl glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Confirmed Blocks Stream</span>
            </h3>
            <button
              onClick={() => onNavigateTab('blockchain')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Explorer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {blocks.slice(-4).reverse().map(block => (
              <div
                key={block.index}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-cyan-300">
                    Block #{block.index.toString().padStart(6, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(block.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] truncate">
                  Hash: <span className="text-slate-300">{block.currentHash.substring(0, 24)}...</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                  <span>Miner: <strong className="text-slate-300">{block.minerId}</strong></span>
                  <span>{block.transactions.length} Transactions Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Events Audit Log */}
        <div className="rounded-2xl glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Security Event Stream</span>
            </h3>
            <button
              onClick={() => onNavigateTab('attack_lab')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Attack Lab</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {securityEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                No active threats detected. Network operating at 98.4% nominal zero-trust health.
              </div>
            ) : (
              securityEvents.slice(0, 5).map(event => (
                <div
                  key={event.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      event.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">
                    {event.description}
                  </p>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Mitigation: <span className="text-cyan-400">{event.mitigationAction}</span>
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
