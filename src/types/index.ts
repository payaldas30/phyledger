export type NodeTrustStatus = 'TRUSTED' | 'WATCHLIST' | 'SUSPICIOUS' | 'QUARANTINED';

export type DeviceType = 
  | 'Industrial Actuator' 
  | 'Smart Power Meter' 
  | 'Edge Sensor Gateway' 
  | 'Environmental Probe' 
  | 'Medical Telemetry Unit';

export interface PUFProfile {
  uniqueness: number; // e.g. 49.8% (ideal 50%)
  baseReliability: number; // e.g. 98.6%
  currentReliability: number;
  currentBER: number; // Bit Error Rate %
  temperature: number; // in Celsius (-40 to +85)
  voltage: number; // in Volts (0.9 to 1.3)
  noise: number; // % noise (0 to 15)
  responseLength: number; // e.g. 128 bits
  stableKeyCommitment: string; // SHA-256 hex of fuzzy extractor output
  helperDataSyndrome: string; // BCH syndrome / helper data
  siliconProcessVariance: number; // % process variance
}

export interface IoTNode {
  id: string; // e.g. "D047"
  mac: string;
  type: DeviceType;
  trustScore: number; // 0 - 100
  trustStatus: NodeTrustStatus;
  pufProfile: PUFProfile;
  pufStatus: 'OPTIMAL' | 'DEGRADED' | 'FAID_MISMATCH' | 'TAMPERED';
  authHealth: number; // 0 - 100
  txBehavior: number; // 0 - 100
  envHealth: number; // 0 - 100
  securityEventsCount: number;
  lastNonce: number;
  successfulAuths: number;
  failedAuths: number;
  replayAttempts: number;
  txRate: number; // tx/sec
  firmwareVersion: string;
  isValidator: boolean;
  connectedValidatorId: string;
  isQuarantined: boolean;
  revocationReason?: string;
  enrolledAt: string;
  lastSeen: string;
  position: { x: number; y: number }; // For canvas rendering
}

export interface Transaction {
  txId: string;
  senderId: string;
  recipientId: string;
  payloadType: 'TELEMETRY_LOG' | 'ACTUATOR_COMMAND' | 'AUTH_EVENT' | 'TRUST_UPDATE' | 'SECURITY_ALERT';
  dataSummary: string;
  timestamp: number;
  deviceCounter: number;
  nonce: string;
  pufCommitment: string;
  signature: string;
  isValid: boolean;
  status: 'CONFIRMED' | 'PENDING' | 'REJECTED';
  rejectionReason?: string;
}

export interface Block {
  index: number;
  timestamp: number;
  previousHash: string;
  currentHash: string;
  merkleRoot: string;
  transactions: Transaction[];
  minerId: string;
  nonce: number;
  difficulty: number;
  pufCommitment: string;
  signatureStatus: 'VERIFIED' | 'INVALID';
  consensusStatus: 'CONFIRMED' | 'REJECTED';
  consensusAlgorithm: 'CLFSR-SIMULATED' | 'SHA-256-REF';
  validationAudit?: {
    prevHashValid: boolean;
    merkleRootValid: boolean;
    signaturesValid: boolean;
    minerAuthValid: boolean;
    consensusValid: boolean;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  type: string;
  sourceNodeId: string;
  detectionMechanism: string;
  mitigationAction: string;
  ledgerTxId?: string;
  description: string;
}

export interface AttackVector {
  id: string;
  name: string;
  category: 'IDENTITY' | 'NETWORK' | 'PHYSICAL' | 'CONSENSUS';
  description: string;
  attackSteps: {
    attack: string;
    detection: string;
    response: string;
    ledgerResult: string;
  };
  targetedMetric: string;
}

export interface TrustWeights {
  pufReliability: number;
  authHealth: number;
  txBehavior: number;
  envHealth: number;
  securityEvents: number;
}

export interface TrustThresholds {
  trusted: number; // default 80
  watchlist: number; // default 50
  suspicious: number; // default 20
}

export interface ReferenceBenchmark {
  title: string;
  platform: string;
  algorithm: string;
  throughput: string;
  power: string;
  energyPerHash: string;
  fpgaLutUsage: string;
  notes: string;
  citation: string;
}
