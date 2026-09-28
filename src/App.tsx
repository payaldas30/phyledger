import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Navbar, TabKey } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { JudgingDemoModal } from './components/JudgingDemoModal';
import { NodeSecurityModal } from './components/NodeSecurityModal';
import { DashboardTab } from './components/tabs/DashboardTab';
import { NetworkTab } from './components/tabs/NetworkTab';
import { PufLabTab } from './components/tabs/PufLabTab';
import { TrustEngineTab } from './components/tabs/TrustEngineTab';
import { AuthenticationTab } from './components/tabs/AuthenticationTab';
import { BlockchainExplorerTab } from './components/tabs/BlockchainExplorerTab';
import { ConsensusTab } from './components/tabs/ConsensusTab';
import { AttackLabTab } from './components/tabs/AttackLabTab';
import { EnergyLabTab } from './components/tabs/EnergyLabTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { ArchitectureTab } from './components/tabs/ArchitectureTab';
import { ResearchTab } from './components/tabs/ResearchTab';
import { IoTNode } from './types';
import { CheckCircle2, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { theme, resetNotification, clearResetNotification } = useSimulation();
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');
  const [modalNode, setModalNode] = useState<IoTNode | null>(null);

  const handleOpenNodeModal = (node: IoTNode) => {
    setModalNode(node);
  };

  const handleCloseNodeModal = () => {
    setModalNode(null);
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isLight 
        ? 'bg-slate-100 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900' 
        : 'bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
    }`}>
      {/* Simulation Reset & Refresh Notification Toast */}
      {resetNotification && (
        <div className="fixed top-16 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200 max-w-md p-3.5 rounded-xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 shadow-2xl shadow-cyan-950/80 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{resetNotification}</span>
          </div>
          <button
            onClick={clearResetNotification}
            className="text-cyan-400 hover:text-white font-bold p-1 rounded hover:bg-cyan-900/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Hero banner shown on all pages for branding & clear academic disclaimers */}
        <HeroBanner onNavigateToArchitecture={() => setCurrentTab('architecture')} />

        {/* Tab Content Router */}
        {currentTab === 'dashboard' && (
          <DashboardTab 
            onOpenNodeModal={handleOpenNodeModal} 
            onNavigateTab={setCurrentTab} 
          />
        )}
        {currentTab === 'network' && (
          <NetworkTab onOpenNodeModal={handleOpenNodeModal} />
        )}
        {currentTab === 'puf_lab' && (
          <PufLabTab />
        )}
        {currentTab === 'trust_engine' && (
          <TrustEngineTab />
        )}
        {currentTab === 'authentication' && (
          <AuthenticationTab />
        )}
        {currentTab === 'blockchain' && (
          <BlockchainExplorerTab />
        )}
        {currentTab === 'consensus' && (
          <ConsensusTab />
        )}
        {currentTab === 'attack_lab' && (
          <AttackLabTab />
        )}
        {currentTab === 'energy_lab' && (
          <EnergyLabTab />
        )}
        {currentTab === 'analytics' && (
          <AnalyticsTab />
        )}
        {currentTab === 'architecture' && (
          <ArchitectureTab />
        )}
        {currentTab === 'research' && (
          <ResearchTab />
        )}
      </main>

      {/* Footer */}
      <footer className={`w-full border-t py-6 px-4 text-center font-mono text-xs transition-colors ${
        isLight
          ? 'bg-slate-200/80 border-slate-300 text-slate-600'
          : 'bg-slate-950/80 border-slate-900 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`font-heading font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>PHYLEDGER</span>
            <span>&bull; Hardware-Rooted Zero-Trust Blockchain Simulation Platform</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Inspired by PUF + Lightweight Permissioned IoT Architectures &bull; For Academic &amp; Research Exploration
          </div>
        </div>
      </footer>

      {/* Interactive System Demo Tour Modal */}
      <JudgingDemoModal />

      {/* Node Detailed Security Profile Modal */}
      <NodeSecurityModal node={modalNode} onClose={handleCloseNodeModal} />
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <MainLayout />
    </SimulationProvider>
  );
}
