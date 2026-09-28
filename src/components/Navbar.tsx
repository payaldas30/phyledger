import React, { useState } from 'react';
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

  const [isSpinningReset, setIsSpinningReset] = useState(false);

  const handleResetClick = () => {
    setIsSpinningReset(true);
    resetAll();
    setTimeout(() => {
      setIsSpinningReset(false);
    }, 700);
  };

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

  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 ${
      isLight 
        ? 'border-cyan-500/30 bg-white/95 text-slate-900 shadow-sm' 
        : 'border-cyan-500/20 bg-slate-950/90 text-slate-100'
    }`}>
      {/* Top micro-bar for simulation metadata & controls */}
      <div className={`flex items-center justify-between px-4 py-1.5 text-xs border-b font-mono transition-colors ${
        isLight
          ? 'border-slate-200 bg-slate-100/90 text-slate-600'
          : 'border-cyan-900/30 bg-slate-900/60 text-slate-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-500 dark:text-cyan-400 font-semibold tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            SIMULATED ZERO-TRUST TESTBED
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline">
            Node Fleet: <strong className="text-cyan-600 dark:text-cyan-300">{displayNodes.length}</strong> active
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline">
            Isolation: <strong className={quarantinedCount > 0 ? "text-rose-500 dark:text-rose-400 font-bold" : "text-emerald-500 dark:text-emerald-400"}>{quarantinedCount} quarantined</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {recentCriticalEvents > 0 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-500 dark:text-rose-300 font-medium text-[11px] animate-pulse">
              {recentCriticalEvents} Critical Alert{recentCriticalEvents > 1 ? 's' : ''}
            </span>
          )}

          {/* INTERACTIVE DEMO TOUR BUTTON */}
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

          {/* RESET / REFRESH BUTTON */}
          <button
            onClick={handleResetClick}
            title="Reset & Refresh Simulation State"
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded font-mono transition-all border ${
              isLight
                ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSpinningReset ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            title={isLight ? "Switch to Cyber Dark Mode" : "Switch to Crisp Light Mode"}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded font-mono transition-all border ${
              isLight
                ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300'
            }`}
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
            <span className="hidden sm:inline font-bold">{isLight ? 'Dark' : 'Light'}</span>
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
            <div className={`w-full h-full rounded-[7px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
              <Cpu className="w-5 h-5 text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-heading font-black tracking-wider text-lg transition-colors ${isLight ? 'text-slate-900' : 'text-white'} group-hover:text-cyan-500`}>
                PHY<span className="text-cyan-500 dark:text-cyan-400">LEDGER</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                IoT Zero-Trust
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight hidden sm:block">
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
                    ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-bold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
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
