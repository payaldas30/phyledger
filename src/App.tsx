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

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');
  const [modalNode, setModalNode] = useState<IoTNode | null>(null);

  const handleOpenNodeModal = (node: IoTNode) => {
    setModalNode(node);
  };

  const handleCloseNodeModal = () => {
    setModalNode(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Hero banner shown on all pages for competition branding & clear academic disclaimers */}
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
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-white">PHYLEDGER</span>
            <span>&bull; Hardware-Rooted Zero-Trust Blockchain Simulation Platform</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Inspired by PUF + Lightweight Permissioned IoT Architectures &bull; For Academic &amp; Research Exploration
          </div>
        </div>
      </footer>

      {/* Judging Demo Walkthrough Modal */}
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
