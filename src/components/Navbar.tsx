import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Layers, 
  Radio, 
  Zap, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Sun, 
  Moon, 
  PlayCircle,
  RotateCcw,
  Network
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export type TabKey = 
  | 'dashboard' 
  | 'network' 
  | 'puf_lab' 
  | 'trust_engine' 
  | 'authentication'
  | 'blockchain' 
  | 'consensus' 
  | 'attack_lab' 
  | 'energy_lab' 
  | 'analytics' 
  | 'architecture' 
  | 'research';

interface NavbarProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { 
    theme, 
    toggleTheme, 
    securityEvents, 
    startJudgingDemo, 
    isJudgingDemoActive, 
    resetAll,
    displayNodes
  } = useSimulation();

  const quarantinedCount = displayNodes.filter(n => n.isQuarantined).length;
  const recentCriticalEvents = securityEvents.filter(e => e.severity === 'CRITICAL').length;

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { key: 'network', label: 'IoT Network', icon: <Network className="w-4 h-4" /> },
    { key: 'puf_lab', label: 'PUF Lab', icon: <Cpu className="w-4 h-4" /> },
    { key: 'trust_engine', label: 'Trust Engine', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'authentication', label: 'Auth Protocol', icon: <Radio className="w-4 h-4" /> },
    { key: 'blockchain', label: 'Ledger Explorer', icon: <Layers className="w-4 h-4" /> },
    { key: 'consensus', label: 'Consensus Lab', icon: <Zap className="w-4 h-4" /> },
    { key: 'attack_lab', label: 'Attack Lab', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'energy_lab', label: 'Energy Lab', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'architecture', label: 'Architecture', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { key: 'research', label: 'Methodology', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md transition-colors dark:bg-slate-950/90 dark:border-cyan-500/20 light:bg-slate-900 light:border-slate-800">
      {/* Top micro-bar for simulation metadata & judging demo trigger */}
      <div className="flex items-center justify-between px-4 py-1 text-xs border-b border-cyan-900/30 bg-slate-900/60 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            SIMULATED ZERO-TRUST TESTBED
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Node Fleet: <strong className="text-cyan-300">{displayNodes.length}</strong> active
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Isolation: <strong className={quarantinedCount > 0 ? "text-rose-400" : "text-emerald-400"}>{quarantinedCount} quarantined</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {recentCriticalEvents > 0 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-medium text-[11px] animate-pulse">
              {recentCriticalEvents} Critical Alert{recentCriticalEvents > 1 ? 's' : ''}
            </span>
          )}

          {/* START JUDGING DEMO BUTTON */}
          <button
            onClick={startJudgingDemo}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-md ${
              isJudgingDemoActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold hover:shadow-cyan-500/25'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 fill-current" />
            <span>{isJudgingDemoActive ? 'Tour Active (Step Mode)' : 'INTERACTIVE DEMO TOUR'}</span>
          </button>

          <button
            onClick={resetAll}
            title="Reset simulation state"
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors rounded hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleTheme}
            title="Toggle Light / Dark mode"
            className="p-1 text-slate-400 hover:text-amber-300 transition-colors rounded hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand Logo */}
        <div 
          onClick={() => onTabChange('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group select-none pr-4"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black tracking-wider text-lg text-white group-hover:text-cyan-300 transition-colors">
                PHY<span className="text-cyan-400">LEDGER</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                IoT Zero-Trust
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Silicon Root-of-Trust &amp; Blockchain Sim
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map(item => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
