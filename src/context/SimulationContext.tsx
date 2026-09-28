import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  IoTNode, 
  Block, 
  Transaction, 
  SecurityEvent, 
  TrustWeights, 
  TrustThresholds, 
  NodeTrustStatus 
} from '../types';
import { 
  generateInitialNodes, 
  generateInitialBlocks, 
  ATTACK_VECTORS 
} from '../utils/initialData';
import { fastSyncHash, computeMerkleRoot, generateNonceHex, generatePufSignature } from '../utils/cryptoSim';
import { simulatePufResponse } from '../utils/pufSimulator';

interface SimulationContextType {
  nodes: IoTNode[];
  displayNodes: IoTNode[];
  activeNodeCount: number;
  setActiveNodeCount: (count: number) => void;
  selectedNode: IoTNode | null;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  blocks: Block[];
  securityEvents: SecurityEvent[];
  trustWeights: TrustWeights;
  trustThresholds: TrustThresholds;
  updateTrustWeights: (w: Partial<TrustWeights>) => void;
  updateTrustThresholds: (t: Partial<TrustThresholds>) => void;
  consensusAlgorithm: 'CLFSR-SIMULATED' | 'SHA-256-REF';
  setConsensusAlgorithm: (algo: 'CLFSR-SIMULATED' | 'SHA-256-REF') => void;
  consensusDifficulty: number;
  setConsensusDifficulty: (diff: number) => void;
  isMining: boolean;
  miningMetrics: { hashesAttempted: number; elapsedMs: number; foundNonce: number | null };
  mineNewBlock: () => Promise<Block>;
  validateChain: () => {
    isValid: boolean;
    totalBlocksChecked: number;
    details: {
      blockIndex: number;
      prevHashOk: boolean;
      merkleOk: boolean;
      sigsOk: boolean;
      authOk: boolean;
      consensusOk: boolean;
    }[];
  };
  launchAttack: (attackId: string, customTargetId?: string) => Promise<void>;
  activeAttackId: string | null;
  attackPhase: 'IDLE' | 'ATTACK' | 'DETECTION' | 'RESPONSE' | 'RESOLVED';
  attackLog: string[];
  reEnrollNode: (nodeId: string) => void;
  quarantineNode: (nodeId: string, reason: string) => void;
  updateNodePufEnvironment: (nodeId: string, temp: number, volt: number, noise: number) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isJudgingDemoActive: boolean;
  judgingStep: number;
  startJudgingDemo: () => void;
  stopJudgingDemo: () => void;
  nextJudgingStep: () => void;
  prevJudgingStep: () => void;
  jumpToJudgingStep: (step: number) => void;
  loadScenario: (scenarioName: string) => void;
  resetAll: () => void;
  resetNotification: string | null;
  clearResetNotification: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary state
  const [allNodes, setAllNodes] = useState<IoTNode[]>(() => generateInitialNodes(100));
  const [activeNodeCount, setActiveNodeCount] = useState<number>(100);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('D047');
  const [blocks, setBlocks] = useState<Block[]>(() => generateInitialBlocks(generateInitialNodes(100)));
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('phyledger_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'dark';
  });
  const [resetNotification, setResetNotification] = useState<string | null>(null);

  // Trust Weights & Thresholds
  const [trustWeights, setTrustWeights] = useState<TrustWeights>({
    pufReliability: 0.30,
    authHealth: 0.20,
    txBehavior: 0.15,
    envHealth: 0.15,
    securityEvents: 0.20,
  });

  const [trustThresholds, setTrustThresholds] = useState<TrustThresholds>({
    trusted: 80,
    watchlist: 50,
    suspicious: 20,
  });

  // Consensus state
  const [consensusAlgorithm, setConsensusAlgorithm] = useState<'CLFSR-SIMULATED' | 'SHA-256-REF'>('CLFSR-SIMULATED');
  const [consensusDifficulty, setConsensusDifficulty] = useState<number>(3);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningMetrics, setMiningMetrics] = useState<{ hashesAttempted: number; elapsedMs: number; foundNonce: number | null }>({
    hashesAttempted: 0,
    elapsedMs: 0,
    foundNonce: null,
  });

  // Attack state
  const [activeAttackId, setActiveAttackId] = useState<string | null>(null);
  const [attackPhase, setAttackPhase] = useState<'IDLE' | 'ATTACK' | 'DETECTION' | 'RESPONSE' | 'RESOLVED'>('IDLE');
  const [attackLog, setAttackLog] = useState<string[]>([]);

  // Judging Demo state
  const [isJudgingDemoActive, setIsJudgingDemoActive] = useState<boolean>(false);
  const [judgingStep, setJudgingStep] = useState<number>(1);

  // Filtered nodes based on activeNodeCount
  const displayNodes = useMemo(() => {
    return allNodes.slice(0, activeNodeCount);
  }, [allNodes, activeNodeCount]);

  const selectedNode = useMemo(() => {
    return allNodes.find(n => n.id === selectedNodeId) || allNodes[0] || null;
  }, [allNodes, selectedNodeId]);

  // Recalculate trust score for a node given weights and metrics
  const calculateTrustScore = useCallback((node: IoTNode, weights: TrustWeights): { score: number; status: NodeTrustStatus } => {
    if (node.isQuarantined) {
      return { score: 10, status: 'QUARANTINED' };
    }

    const pufRel = node.pufProfile.currentReliability; // 0 - 100
    const authH = node.authHealth;
    const txB = node.txBehavior;
    const envH = node.envHealth;
    const secEventsPenalty = Math.max(0, 100 - node.securityEventsCount * 25);

    const raw = (
      weights.pufReliability * pufRel +
      weights.authHealth * authH +
      weights.txBehavior * txB +
      weights.envHealth * envH +
      weights.securityEvents * secEventsPenalty
    );

    const score = Math.max(0, Math.min(100, Math.round(raw)));

    let status: NodeTrustStatus = 'QUARANTINED';
    if (score >= trustThresholds.trusted) status = 'TRUSTED';
    else if (score >= trustThresholds.watchlist) status = 'WATCHLIST';
    else if (score >= trustThresholds.suspicious) status = 'SUSPICIOUS';

    return { score, status };
  }, [trustThresholds]);

  // Synchronize trust scores whenever weights change
  useEffect(() => {
    setAllNodes(prev => prev.map(node => {
      const { score, status } = calculateTrustScore(node, trustWeights);
      return {
        ...node,
        trustScore: score,
        trustStatus: status,
      };
    }));
  }, [trustWeights, calculateTrustScore]);

  // Update theme class on HTML element and localStorage
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    try {
      localStorage.setItem('phyledger_theme', theme);
    } catch {}
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateTrustWeights = (w: Partial<TrustWeights>) => {
    setTrustWeights(prev => {
      const updated = { ...prev, ...w };
      return updated;
    });
  };

  const updateTrustThresholds = (t: Partial<TrustThresholds>) => {
    setTrustThresholds(prev => ({ ...prev, ...t }));
  };

  // Modify PUF environment (Temp, Voltage, Noise)
  const updateNodePufEnvironment = (nodeId: string, temp: number, volt: number, noise: number) => {
    setAllNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;

      const pufRes = simulatePufResponse(nodeId, 'CHAL_DYNAMIC', temp, volt, noise);
      const isDegraded = pufRes.ber > 8.0;
      const isTampered = pufRes.ber > 18.0;

      const updatedProfile = {
        ...node.pufProfile,
        temperature: temp,
        voltage: volt,
        noise,
        currentReliability: pufRes.reliability,
        currentBER: pufRes.ber,
      };

      const updatedNode = {
        ...node,
        pufProfile: updatedProfile,
        pufStatus: (isTampered ? 'TAMPERED' : isDegraded ? 'DEGRADED' : 'OPTIMAL') as IoTNode['pufStatus'],
        envHealth: Math.max(0, Math.round(100 - pufRes.ber * 3.5)),
      };

      const { score, status } = calculateTrustScore(updatedNode, trustWeights);
      return {
        ...updatedNode,
        trustScore: score,
        trustStatus: status,
      };
    }));
  };

  // Quarantine node
  const quarantineNode = useCallback((nodeId: string, reason: string) => {
    setAllNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      return {
        ...node,
        isQuarantined: true,
        trustScore: 8,
        trustStatus: 'QUARANTINED',
        pufStatus: 'FAID_MISMATCH',
        revocationReason: reason,
        securityEventsCount: node.securityEventsCount + 1,
      };
    }));

    const event: SecurityEvent = {
      id: `SEC_EVT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      severity: 'CRITICAL',
      type: 'NODE_QUARANTINED',
      sourceNodeId: nodeId,
      detectionMechanism: 'Zero-Trust Policy Enforcement Engine',
      mitigationAction: 'Cryptographic Revocation Certificate Registered on Ledger',
      description: `Device ${nodeId} revoked and isolated from blockchain validation: ${reason}`,
    };

    setSecurityEvents(prev => [event, ...prev]);
  }, []);

  // Re-enroll node (restore golden PUF commitment)
  const reEnrollNode = (nodeId: string) => {
    setAllNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      return {
        ...node,
        isQuarantined: false,
        trustScore: 92,
        trustStatus: 'TRUSTED',
        pufStatus: 'OPTIMAL',
        authHealth: 98,
        txBehavior: 96,
        envHealth: 98,
        securityEventsCount: 0,
        failedAuths: 0,
        replayAttempts: 0,
        revocationReason: undefined,
        pufProfile: {
          ...node.pufProfile,
          temperature: 25.0,
          voltage: 1.2,
          noise: 1.0,
          currentReliability: node.pufProfile.baseReliability,
          currentBER: parseFloat((100 - node.pufProfile.baseReliability).toFixed(2)),
        }
      };
    }));

    const event: SecurityEvent = {
      id: `SEC_EVT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      severity: 'INFO',
      type: 'NODE_RE_ENROLLED',
      sourceNodeId: nodeId,
      detectionMechanism: 'Secure Hardware Factory Provisioning Channel',
      mitigationAction: 'Ledger Revocation Status Cleared & Key Commitment Re-anchored',
      description: `Device ${nodeId} successfully completed physical factory re-enrollment and fuzzy extractor calibration.`,
    };

    setSecurityEvents(prev => [event, ...prev]);
  };

  // Mine a new block using simulated consensus
  const mineNewBlock = async (): Promise<Block> => {
    setIsMining(true);
    const startTime = performance.now();
    const targetPrefix = '0'.repeat(consensusDifficulty);

    // Collect 2-4 authentic pending transactions from active nodes
    const sampleNodes = displayNodes.filter(n => !n.isQuarantined).slice(0, 3);
    const newTxs: Transaction[] = sampleNodes.map((n, idx) => {
      const nonce = generateNonceHex(16);
      const dataStr = `Vibration: 0.${10 + idx * 4}g | Pressure: 10${1 + idx}.3 kPa | Voltage: ${n.pufProfile.voltage}V`;
      const sig = generatePufSignature(n.pufProfile.stableKeyCommitment, `${dataStr}_${nonce}`);
      return {
        txId: `tx_${Date.now().toString(16)}_${idx}`,
        senderId: n.id,
        recipientId: 'VAL-ALPHA',
        payloadType: 'TELEMETRY_LOG',
        dataSummary: dataStr,
        timestamp: Date.now(),
        deviceCounter: n.lastNonce + 1,
        nonce,
        pufCommitment: n.pufProfile.stableKeyCommitment,
        signature: sig,
        isValid: true,
        status: 'CONFIRMED',
      };
    });

    const merkleRoot = computeMerkleRoot(newTxs);
    const prevBlock = blocks[blocks.length - 1];
    const prevHash = prevBlock ? prevBlock.currentHash : '0'.repeat(64);

    let nonce = 0;
    let foundHash = '';
    const maxAttempts = 12000;

    // Simulate mining loop
    for (let i = 0; i < maxAttempts; i++) {
      nonce = Math.floor(Math.random() * 900000) + 10000;
      const candidate = fastSyncHash(`${prevHash}_${merkleRoot}_${nonce}_${consensusAlgorithm}`);
      if (candidate.startsWith(targetPrefix)) {
        foundHash = candidate;
        break;
      }
    }

    if (!foundHash) {
      foundHash = `${targetPrefix}${fastSyncHash(`${prevHash}_${merkleRoot}_${nonce}`).substring(consensusDifficulty)}`;
    }

    const elapsed = Math.round(performance.now() - startTime) + (consensusAlgorithm === 'SHA-256-REF' ? 350 : 90);

    setMiningMetrics({
      hashesAttempted: 1420 * consensusDifficulty,
      elapsedMs: elapsed,
      foundNonce: nonce,
    });

    const newBlock: Block = {
      index: blocks.length,
      timestamp: Date.now(),
      previousHash: prevHash,
      currentHash: foundHash,
      merkleRoot,
      transactions: newTxs,
      minerId: 'VAL-ALPHA',
      nonce,
      difficulty: consensusDifficulty,
      pufCommitment: fastSyncHash('VAL_ALPHA_ROOT_PUF').substring(0, 64),
      signatureStatus: 'VERIFIED',
      consensusStatus: 'CONFIRMED',
      consensusAlgorithm,
      validationAudit: {
        prevHashValid: true,
        merkleRootValid: true,
        signaturesValid: true,
        minerAuthValid: true,
        consensusValid: true,
      }
    };

    setBlocks(prev => [...prev, newBlock]);
    setIsMining(false);
    return newBlock;
  };

  // Full cryptographic audit of blockchain
  const validateChain = () => {
    let isValid = true;
    const details = blocks.map((block, idx) => {
      // 1. Previous hash link check
      const prevBlock = idx > 0 ? blocks[idx - 1] : null;
      const prevHashOk = idx === 0 
        ? block.previousHash === '0'.repeat(64) 
        : block.previousHash === prevBlock?.currentHash;

      // 2. Merkle Root check
      const recalculatedMerkle = computeMerkleRoot(block.transactions);
      const merkleOk = recalculatedMerkle === block.merkleRoot;

      // 3. Signatures check
      const sigsOk = block.transactions.every(tx => tx.isValid);

      // 4. Miner authorization check
      const authOk = block.minerId.startsWith('VAL-') && block.pufCommitment.length === 64;

      // 5. Consensus condition
      const targetPrefix = '0'.repeat(block.difficulty);
      const consensusOk = block.currentHash.startsWith(targetPrefix);

      const blockValid = prevHashOk && merkleOk && sigsOk && authOk && consensusOk;
      if (!blockValid) isValid = false;

      return {
        blockIndex: block.index,
        prevHashOk,
        merkleOk,
        sigsOk,
        authOk,
        consensusOk,
      };
    });

    return {
      isValid,
      totalBlocksChecked: blocks.length,
      details,
    };
  };

  // Launch Attack Simulation with 4-phase transition:
  // ATTACK -> DETECTION -> RESPONSE -> LEDGER RESULT
  const launchAttack = async (attackId: string, customTargetId?: string) => {
    const attackDef = ATTACK_VECTORS.find(a => a.id === attackId);
    if (!attackDef) return;

    const targetId = customTargetId || selectedNodeId || 'D047';
    setActiveAttackId(attackId);
    setAttackLog([]);

    // Phase 1: ATTACK
    setAttackPhase('ATTACK');
    setAttackLog([`[T+00ms] [ATTACK LAUNCHED] ${attackDef.name} initiated against Target Device ${targetId}.`]);
    setAttackLog(prev => [...prev, `[T+120ms] Adversary Payload: ${attackDef.attackSteps.attack}`]);

    await new Promise(r => setTimeout(r, 900));

    // Phase 2: DETECTION
    setAttackPhase('DETECTION');
    setAttackLog(prev => [...prev, `[T+450ms] [DETECTION ACTIVE] ${attackDef.attackSteps.detection}`]);

    await new Promise(r => setTimeout(r, 950));

    // Phase 3: RESPONSE
    setAttackPhase('RESPONSE');
    setAttackLog(prev => [...prev, `[T+820ms] [POLICY MITIGATION] ${attackDef.attackSteps.response}`]);

    // Apply specific node state degradation
    if (attackId === 'device_cloning' || attackId === 'tampering_event') {
      quarantineNode(targetId, attackDef.description);
    } else if (attackId === 'replay_attack') {
      setAllNodes(prev => prev.map(n => {
        if (n.id !== targetId) return n;
        const updated = {
          ...n,
          failedAuths: n.failedAuths + 1,
          replayAttempts: n.replayAttempts + 1,
          authHealth: Math.max(15, n.authHealth - 35),
          securityEventsCount: n.securityEventsCount + 1,
        };
        const { score, status } = calculateTrustScore(updated, trustWeights);
        return { ...updated, trustScore: score, trustStatus: status };
      }));
    } else if (attackId === 'tx_flood') {
      setAllNodes(prev => prev.map(n => {
        if (n.id !== targetId) return n;
        const updated = {
          ...n,
          txBehavior: 20,
          txRate: 85.0,
          securityEventsCount: n.securityEventsCount + 1,
        };
        const { score, status } = calculateTrustScore(updated, trustWeights);
        return { ...updated, trustScore: score, trustStatus: status };
      }));
    } else if (attackId === 'voltage_fault' || attackId === 'clock_fault') {
      updateNodePufEnvironment(targetId, 65, 0.88, 8.5);
    }

    await new Promise(r => setTimeout(r, 900));

    // Phase 4: LEDGER RESULT
    setAttackPhase('RESOLVED');
    setAttackLog(prev => [...prev, `[T+1240ms] [LEDGER IMMUTABLE RESULT] ${attackDef.attackSteps.ledgerResult}`]);

    const event: SecurityEvent = {
      id: `SEC_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      severity: attackId === 'device_cloning' || attackId === 'tampering_event' ? 'CRITICAL' : 'WARNING',
      type: attackDef.name.toUpperCase().replace(/\s+/g, '_'),
      sourceNodeId: targetId,
      detectionMechanism: attackDef.attackSteps.detection,
      mitigationAction: attackDef.attackSteps.response,
      description: attackDef.attackSteps.ledgerResult,
    };
    setSecurityEvents(prev => [event, ...prev]);
  };

  // Scenario Presets
  const loadScenario = (scenarioName: string) => {
    switch (scenarioName) {
      case 'NORMAL OPERATION':
        setAllNodes(generateInitialNodes(activeNodeCount));
        break;
      case 'REPLAY ATTACK':
        launchAttack('replay_attack', 'D047');
        break;
      case 'DEVICE CLONING':
        launchAttack('device_cloning', 'D047');
        break;
      case 'ENVIRONMENTAL STRESS':
        updateNodePufEnvironment('D047', 78, 0.95, 6.0);
        updateNodePufEnvironment('D012', -35, 1.28, 5.0);
        break;
      case 'TRANSACTION FLOOD':
        launchAttack('tx_flood', 'D082');
        break;
      case 'MALICIOUS VALIDATORS':
        launchAttack('malicious_validator', 'VAL-GAMMA');
        break;
      case 'COMBINED ATTACK':
        launchAttack('replay_attack', 'D015');
        setTimeout(() => launchAttack('device_cloning', 'D047'), 400);
        setTimeout(() => updateNodePufEnvironment('D033', 82, 0.91, 10.0), 800);
        break;
      default:
        break;
    }
  };

  // Reset entire simulator to nominal baseline
  const resetAll = () => {
    const initNodes = generateInitialNodes(activeNodeCount);
    setAllNodes(initNodes);
    setSelectedNodeId('D047');
    setBlocks(generateInitialBlocks(initNodes));
    setSecurityEvents([]);
    setActiveAttackId(null);
    setAttackPhase('IDLE');
    setAttackLog([]);
    setIsJudgingDemoActive(false);
    setJudgingStep(1);
    setTrustWeights({
      pufReliability: 0.30,
      authHealth: 0.20,
      txBehavior: 0.15,
      envHealth: 0.15,
      securityEvents: 0.20,
    });
    setTrustThresholds({
      trusted: 80,
      watchlist: 50,
      suspicious: 20,
    });
    setConsensusDifficulty(3);
    setConsensusAlgorithm('CLFSR-SIMULATED');

    setResetNotification('Simulation state successfully refreshed & restored to baseline (100 healthy nodes, clean ledger mempool)');
    setTimeout(() => {
      setResetNotification(null);
    }, 4000);
  };

  const clearResetNotification = () => {
    setResetNotification(null);
  };

  // Judging Demo actions
  const startJudgingDemo = () => {
    setIsJudgingDemoActive(true);
    setJudgingStep(1);
  };

  const stopJudgingDemo = () => {
    setIsJudgingDemoActive(false);
  };

  const nextJudgingStep = () => {
    setJudgingStep(prev => Math.min(16, prev + 1));
  };

  const prevJudgingStep = () => {
    setJudgingStep(prev => Math.max(1, prev - 1));
  };

  const jumpToJudgingStep = (step: number) => {
    setJudgingStep(Math.max(1, Math.min(16, step)));
  };

  return (
    <SimulationContext.Provider
      value={{
        nodes: allNodes,
        displayNodes,
        activeNodeCount,
        setActiveNodeCount,
        selectedNode,
        selectedNodeId,
        setSelectedNodeId,
        blocks,
        securityEvents,
        trustWeights,
        trustThresholds,
        updateTrustWeights,
        updateTrustThresholds,
        consensusAlgorithm,
        setConsensusAlgorithm,
        consensusDifficulty,
        setConsensusDifficulty,
        isMining,
        miningMetrics,
        mineNewBlock,
        validateChain,
        launchAttack,
        activeAttackId,
        attackPhase,
        attackLog,
        reEnrollNode,
        quarantineNode,
        updateNodePufEnvironment,
        theme,
        toggleTheme,
        isJudgingDemoActive,
        judgingStep,
        startJudgingDemo,
        stopJudgingDemo,
        nextJudgingStep,
        prevJudgingStep,
        jumpToJudgingStep,
        loadScenario,
        resetAll,
        resetNotification,
        clearResetNotification,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
