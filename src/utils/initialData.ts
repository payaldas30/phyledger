import { IoTNode, Block, AttackVector, ReferenceBenchmark, DeviceType } from '../types';
import { fastSyncHash, computeMerkleRoot } from './cryptoSim';
import { generateNominalPufBits } from './pufSimulator';

const DEVICE_TYPES: DeviceType[] = [
  'Industrial Actuator',
  'Smart Power Meter',
  'Edge Sensor Gateway',
  'Environmental Probe',
  'Medical Telemetry Unit',
];

export function generateInitialNodes(count = 100): IoTNode[] {
  const nodes: IoTNode[] = [];
  const validators = ['VAL-ALPHA', 'VAL-BETA', 'VAL-GAMMA'];

  for (let i = 1; i <= count; i++) {
    const id = `D${i.toString().padStart(3, '0')}`;
    const type = DEVICE_TYPES[(i * 7) % DEVICE_TYPES.length];
    const isValidator = i <= 3;
    const connectedVal = validators[i % validators.length];

    // Seeded uniqueness & reliability around 49.8% and 98.7%
    const uniqueness = parseFloat((49.2 + ((i * 13) % 17) * 0.08).toFixed(2));
    const baseReliability = parseFloat((97.8 + ((i * 19) % 21) * 0.09).toFixed(2));

    const nominalBits = generateNominalPufBits(id, 'CHAL_INIT_0xFEED');
    const stableKey = fastSyncHash(`DEVICE_INTERNAL_SECRET_${nominalBits}`);
    const stableKeyCommitment = fastSyncHash(`COMMITMENT_${stableKey}`).substring(0, 64);
    const helperDataSyndrome = fastSyncHash(`BCH_SYNDROME_HELPER_DATA_${id}_${nominalBits.substring(0, 32)}`).substring(0, 32);

    // Initial trust metrics (healthy network state)
    let trustScore = 88 + (i % 11);
    let trustStatus: IoTNode['trustStatus'] = 'TRUSTED';
    let pufStatus: IoTNode['pufStatus'] = 'OPTIMAL';
    let isQuarantined = false;

    // Special preset for D047 (the demo hero device)
    if (id === 'D047') {
      trustScore = 95;
      trustStatus = 'TRUSTED';
      pufStatus = 'OPTIMAL';
    }

    // Grid layout for 2D topology visualizer
    const row = Math.floor((i - 1) / 10);
    const col = (i - 1) % 10;
    const posX = 70 + col * 75 + ((row % 2) * 20);
    const posY = 50 + row * 45;

    nodes.push({
      id,
      mac: `00:1B:44:${(i * 3).toString(16).padStart(2, '0')}:${(i * 7).toString(16).padStart(2, '0')}:${(i * 11).toString(16).padStart(2, '0')}`.toUpperCase(),
      type,
      trustScore,
      trustStatus,
      pufProfile: {
        uniqueness,
        baseReliability,
        currentReliability: baseReliability,
        currentBER: parseFloat((100 - baseReliability).toFixed(2)),
        temperature: 25.0,
        voltage: 1.2,
        noise: 1.0,
        responseLength: 128,
        stableKeyCommitment,
        helperDataSyndrome,
        siliconProcessVariance: parseFloat((3.8 + (i % 7) * 0.4).toFixed(1)),
      },
      pufStatus,
      authHealth: 96,
      txBehavior: 95,
      envHealth: 98,
      securityEventsCount: 0,
      lastNonce: 1000 + i * 23,
      successfulAuths: 42 + (i % 15),
      failedAuths: 0,
      replayAttempts: 0,
      txRate: parseFloat((1.2 + (i % 5) * 0.4).toFixed(1)),
      firmwareVersion: `v2.4.${(i % 3) + 1}-rc`,
      isValidator,
      connectedValidatorId: connectedVal,
      isQuarantined,
      enrolledAt: '2026-09-01T08:00:00Z',
      lastSeen: 'Just now',
      position: { x: posX, y: posY },
    });
  }

  return nodes;
}

export function generateInitialBlocks(initialNodes: IoTNode[]): Block[] {
  const blocks: Block[] = [];

  // Genesis Block #000000
  const genesisTxs = [
    {
      txId: 'tx_genesis_0001',
      senderId: 'SYS_REGISTRY',
      recipientId: 'LEDGER_INIT',
      payloadType: 'AUTH_EVENT' as const,
      dataSummary: 'PHYLEDGER Root of Trust initialized with 100 IoT nodes and BCH(128,64) fuzzy extractor commitments.',
      timestamp: Date.now() - 3600000 * 4,
      deviceCounter: 0,
      nonce: '0000000000000000',
      pufCommitment: '0'.repeat(64),
      signature: '0'.repeat(48),
      isValid: true,
      status: 'CONFIRMED' as const,
    }
  ];

  const genesisMerkle = computeMerkleRoot(genesisTxs);
  const genesisHash = fastSyncHash(`BLOCK_0_${genesisMerkle}_GENESIS`);

  blocks.push({
    index: 0,
    timestamp: Date.now() - 3600000 * 4,
    previousHash: '0'.repeat(64),
    currentHash: genesisHash,
    merkleRoot: genesisMerkle,
    transactions: genesisTxs,
    minerId: 'VAL-ALPHA',
    nonce: 41829,
    difficulty: 3,
    pufCommitment: fastSyncHash('VAL-ALPHA_PUF_COMMITMENT').substring(0, 64),
    signatureStatus: 'VERIFIED',
    consensusStatus: 'CONFIRMED',
    consensusAlgorithm: 'CLFSR-SIMULATED',
    validationAudit: {
      prevHashValid: true,
      merkleRootValid: true,
      signaturesValid: true,
      minerAuthValid: true,
      consensusValid: true,
    }
  });

  // Pre-seed 3 confirmed blocks with authentic IoT telemetry
  let prevHash = genesisHash;
  for (let b = 1; b <= 3; b++) {
    const txs = [
      {
        txId: `tx_00${b}01`,
        senderId: initialNodes[(b * 3) % initialNodes.length].id,
        recipientId: 'VAL-ALPHA',
        payloadType: 'TELEMETRY_LOG' as const,
        dataSummary: `Vibration: 0.12g | Core Temp: 34.2C | Supply: 1.198V | Status: Normal`,
        timestamp: Date.now() - (4 - b) * 900000,
        deviceCounter: b * 10,
        nonce: fastSyncHash(`NONCE_${b}_1`).substring(0, 16),
        pufCommitment: initialNodes[(b * 3) % initialNodes.length].pufProfile.stableKeyCommitment,
        signature: fastSyncHash(`SIG_${b}_1`).substring(0, 48),
        isValid: true,
        status: 'CONFIRMED' as const,
      },
      {
        txId: `tx_00${b}02`,
        senderId: initialNodes[(b * 7) % initialNodes.length].id,
        recipientId: 'VAL-BETA',
        payloadType: 'ACTUATOR_COMMAND' as const,
        dataSummary: `Flow Valve Actuation: 45.0% angle set | Zero-Trust Auth Verified`,
        timestamp: Date.now() - (4 - b) * 900000 + 4000,
        deviceCounter: b * 12,
        nonce: fastSyncHash(`NONCE_${b}_2`).substring(0, 16),
        pufCommitment: initialNodes[(b * 7) % initialNodes.length].pufProfile.stableKeyCommitment,
        signature: fastSyncHash(`SIG_${b}_2`).substring(0, 48),
        isValid: true,
        status: 'CONFIRMED' as const,
      }
    ];

    const merkle = computeMerkleRoot(txs);
    const currHash = fastSyncHash(`BLOCK_${b}_${prevHash}_${merkle}`);

    blocks.push({
      index: b,
      timestamp: Date.now() - (4 - b) * 900000 + 12000,
      previousHash: prevHash,
      currentHash: currHash,
      merkleRoot: merkle,
      transactions: txs,
      minerId: b % 2 === 0 ? 'VAL-ALPHA' : 'VAL-BETA',
      nonce: 10482 + b * 941,
      difficulty: 3,
      pufCommitment: fastSyncHash(`VAL_MINER_${b}`).substring(0, 64),
      signatureStatus: 'VERIFIED',
      consensusStatus: 'CONFIRMED',
      consensusAlgorithm: 'CLFSR-SIMULATED',
      validationAudit: {
        prevHashValid: true,
        merkleRootValid: true,
        signaturesValid: true,
        minerAuthValid: true,
        consensusValid: true,
      }
    });

    prevHash = currHash;
  }

  return blocks;
}

export const ATTACK_VECTORS: AttackVector[] = [
  {
    id: 'replay_attack',
    name: 'Replay Attack',
    category: 'NETWORK',
    description: 'Adversary captures a previously signed valid telemetry packet and attempts to retransmit it at a later time to spoof authorization.',
    attackSteps: {
      attack: 'Eavesdropper intercepts signed packet from D047 and retransmits it to Validator VAL-ALPHA.',
      detection: 'Validator inspects incoming transaction nonce and internal monotonically incrementing device counter.',
      response: 'Duplicated nonce detected! Nonce freshness constraint violated. Packet dropped immediately.',
      ledgerResult: 'Transaction REJECTED. Security event logged to ledger; D047 trust score penalized for replay exposure.'
    },
    targetedMetric: 'Authentication Health & Monotonic Counter',
  },
  {
    id: 'device_cloning',
    name: 'Device Cloning',
    category: 'IDENTITY',
    description: 'Adversary extracts firmware and copies device ID/MAC onto an unauthenticated rogue microcontroller without original silicon PUF.',
    attackSteps: {
      attack: 'Cloned rogue node boots with identical MAC and Device ID D047 and attempts to sign ledger transaction.',
      detection: 'Verifier challenges rogue hardware; rogue generates synthetic or mismatched response without physical silicon PUF.',
      response: 'Fuzzy extractor reconstructed key produces commitment mismatch with immutable ledger anchor.',
      ledgerResult: 'Authentication FAILED. Device D047 immediately QUARANTINED. Revocation broadcast to all validators.'
    },
    targetedMetric: 'PUF Silicon Commitment & Hardware Root of Trust',
  },
  {
    id: 'fake_transaction',
    name: 'Forged Transaction Signature',
    category: 'NETWORK',
    description: 'Rogue intermediary modifies transaction payload (e.g. false sensor readings) without holding device PUF key.',
    attackSteps: {
      attack: 'Man-in-the-Middle alters actuator state payload from "NORMAL" to "EMERGENCY_SHUTDOWN".',
      detection: 'Validator recalculates Schnorr signature over modified payload using registered PUF key commitment.',
      response: 'Signature verification fails: cryptographic integrity check detects altered bytes.',
      ledgerResult: 'Transaction flagged as INVALID, dropped from mempool, security alert recorded.'
    },
    targetedMetric: 'Cryptographic Signature & Payload Integrity',
  },
  {
    id: 'sybil_injection',
    name: 'Sybil Node Injection',
    category: 'IDENTITY',
    description: 'Adversary floods the network with dozens of phantom virtual identities trying to overwhelm consensus voting.',
    attackSteps: {
      attack: 'Botnet launches 50 virtual nodes claiming to be new IoT sensors requesting ledger admission.',
      detection: 'Enrollment gateway demands physical PUF challenge-response validation and enrollment commitment.',
      response: 'Virtual nodes lack physical microscopic silicon variability and fail PUF enrollment verification.',
      ledgerResult: 'All 50 Sybil requests rejected at gateway perimeter before reaching distributed ledger.'
    },
    targetedMetric: 'Zero-Trust Hardware Enrollment Barrier',
  },
  {
    id: 'puf_modeling',
    name: 'PUF Machine Learning Modeling',
    category: 'PHYSICAL',
    description: 'Attacker collects thousands of Challenge-Response Pairs (CRPs) and trains an Artificial Neural Network / SVM to predict responses.',
    attackSteps: {
      attack: 'Automated script queries target device rapidly with randomized challenges to harvest CRP dataset.',
      detection: 'Adaptive Trust Engine detects abnormal challenge query rate exceeding 20 queries/second.',
      response: 'Rate limiter engages; dynamic challenge re-salting activated; query session throttled.',
      ledgerResult: 'Device placed on WATCHLIST status. CRP harvesting neutralized before model converges.'
    },
    targetedMetric: 'Challenge Rate Throttling & Dynamic Salting',
  },
  {
    id: 'voltage_fault',
    name: 'Voltage Glitch / Fault Injection',
    category: 'PHYSICAL',
    description: 'Adversary drops the supply voltage rail (e.g., from 1.2V to 0.85V) to cause timing violations and bypass security checks.',
    attackSteps: {
      attack: 'External probe glitches target VDD rail during cryptographic signature computation.',
      detection: 'Silicon PUF Bit Error Rate (BER) spikes beyond 18%, exceeding the BCH fuzzy extractor correction limit.',
      response: 'Fuzzy extractor raises error: syndrome decode failure! Device self-halts cryptographic execution.',
      ledgerResult: 'Auth session aborted safely. Ledger records ENVIRONMENTAL_ANOMALY; trust score downgraded.'
    },
    targetedMetric: 'Silicon Delay Sensitivity & BCH Error Bounds',
  },
  {
    id: 'clock_fault',
    name: 'Clock Glitch Attack',
    category: 'PHYSICAL',
    description: 'High-frequency clock pulses injected into the oscillator line to cause instruction skipping in cryptographic core.',
    attackSteps: {
      attack: 'High-speed clock edge injected during loop counter execution.',
      detection: 'Hardware Ring Oscillator PUF monitoring circuit detects frequency anomaly outside ±5% tolerance.',
      response: 'Hardware watchdog triggers zeroize sequence for transient registers; execution halts.',
      ledgerResult: 'Device fails heartbeat; marked as SUSPICIOUS; logged as hardware fault event.'
    },
    targetedMetric: 'Hardware Timing Watchdog & Ring Oscillator Frequency',
  },
  {
    id: 'tx_flood',
    name: 'Abnormal Transaction Flood (DDoS)',
    category: 'NETWORK',
    description: 'Compromised node spams ledger mempool with 100+ tx/sec to exhaust validator storage and bandwidth.',
    attackSteps: {
      attack: 'Device D082 transmits burst of 120 rapid telemetry transactions in 2 seconds.',
      detection: 'Adaptive Trust Engine detects tx rate 10x higher than device profile baseline (1.2 tx/sec).',
      response: 'Trust Engine degrades Transaction Behavior score from 95 to 15; rate limiter drops excess packets.',
      ledgerResult: 'Excess transactions dropped; device transitioned to SUSPICIOUS status; validator load protected.'
    },
    targetedMetric: 'Transaction Rate Anomaly Heuristic',
  },
  {
    id: 'malicious_validator',
    name: 'Malicious Validator Equivocation',
    category: 'CONSENSUS',
    description: 'Corrupt validator VAL-GAMMA proposes two conflicting blocks at the same block height to split ledger.',
    attackSteps: {
      attack: 'VAL-GAMMA broadcasts Block #0004A to sub-network 1 and Block #0004B to sub-network 2.',
      detection: 'Honest peers VAL-ALPHA and VAL-BETA receive conflicting signed block headers from same validator.',
      response: 'Equivocation proof constructed by peer nodes; slashing rule applied; consensus ignores fork.',
      ledgerResult: 'VAL-GAMMA validator credentials revoked permanently on ledger; block candidate disqualified.'
    },
    targetedMetric: 'Byzantine Fault Tolerance & Equivocation Slashing',
  },
  {
    id: 'tampering_event',
    name: 'Physical Enclosure Tamper',
    category: 'PHYSICAL',
    description: 'Attacker opens physical enclosure of IoT device to probe PCB traces with microprobes.',
    attackSteps: {
      attack: 'Physical tamper mesh broken or light sensor detects enclosure breach.',
      detection: 'Anti-tamper enclosure switch trips hardware interrupt line.',
      response: 'Device purges transient RAM; PUF helper data invalidated; sends signed SOS alert to network.',
      ledgerResult: 'Ledger registers CRITICAL_TAMPER_ALERT; device status locked to QUARANTINED irrevocably.'
    },
    targetedMetric: 'Physical Mesh Sensor & Zero-Trust Revocation',
  }
];

export const REFERENCE_BENCHMARKS: ReferenceBenchmark[] = [
  {
    title: 'CLFSR-Inspired Lightweight Consensus for IoT',
    platform: 'Xilinx Artix-7 XC7A100T FPGA',
    algorithm: 'Simulated CLFSR Mining Engine',
    throughput: '3.13 Mhash/s',
    power: '0.12 W (120 mW)',
    energyPerHash: '38.3 nJ / hash',
    fpgaLutUsage: '142 LUTs / 88 Flip-Flops',
    notes: 'Reference-paper experimental benchmark. Measured on physical hardware with Vivado power analyzer.',
    citation: 'IEEE Trans. on Industrial Informatics / Hardware-Assisted Blockchain for IoT'
  },
  {
    title: 'Standard SHA-256 Mining Core Reference',
    platform: 'Xilinx Artix-7 XC7A100T FPGA',
    algorithm: 'Pipelined SHA-256 Core',
    throughput: '2.40 Mhash/s',
    power: '1.82 W (1820 mW)',
    energyPerHash: '758.3 nJ / hash',
    fpgaLutUsage: '1,840 LUTs / 1,220 Flip-Flops',
    notes: 'Standard 64-round cryptographic SHA-256 hardware implementation benchmark.',
    citation: 'IEEE Transactions on Circuits and Systems / FPGA Cryptographic Benchmarks'
  },
  {
    title: 'SRAM-PUF with BCH(128,64,t=14) Fuzzy Extractor',
    platform: 'TSMC 65nm Test Chip',
    algorithm: 'Fuzzy Extractor Key Derivation',
    throughput: '48.2 ms Key Regeneration',
    power: '0.45 mW active',
    energyPerHash: '21.7 μJ / authentication',
    fpgaLutUsage: '340 LUTs',
    notes: 'Experimental silicon benchmark over -40°C to +85°C and 0.9V to 1.3V operating envelope.',
    citation: 'IEEE Journal of Solid-State Circuits (JSSC) / Hardware Root-of-Trust Primitives'
  }
];
