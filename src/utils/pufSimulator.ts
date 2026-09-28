import { fastSyncHash } from './cryptoSim';

export interface PUFSimulationResult {
  nominalResponse: string; // 128-bit binary string
  measuredResponse: string; // 128-bit binary string with environmental bit flips
  bitFlips: number[]; // indices of flipped bits
  ber: number; // Bit Error Rate percentage (0 - 100)
  reliability: number; // percentage (100 - BER)
  hammingDistance: number;
  stableKeyCommitment: string; // SHA-256 commitment of key
  helperDataSyndrome: string; // BCH syndrome / helper data
  errorCorrectionStatus: 'CORRECTED' | 'EXCEEDED_THRESHOLD';
  reconstructedKeyCommitment: string;
}

// Pseudo-random deterministic generator based on seed
function seededRandom(seed: number) {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Generate deterministic nominal (golden standard at 25°C, 1.2V, 0 noise) PUF response
export function generateNominalPufBits(deviceId: string, challenge: string, bitLength = 128): string {
  let bits = '';
  const hashSeed = fastSyncHash(`${deviceId}_PHYSICAL_FINGERPRINT_${challenge}`);
  
  for (let i = 0; i < bitLength; i++) {
    const charCode = hashSeed.charCodeAt(i % hashSeed.length);
    const subSeed = (charCode * 31 + i * 17) & 0xffffffff;
    const bit = seededRandom(subSeed) > 0.5 ? '1' : '0';
    bits += bit;
  }
  return bits;
}

// Model environmental effects on PUF bit flips:
// Nominal: Temp = 25°C, Voltage = 1.2V, Noise = 0%
// Temperature deviation |T - 25| causes threshold voltage drift in SRAM/RO-PUF cells
// Voltage deviation |V - 1.2| causes timing jitter and skew in inverter delay chains
// Noise causes random thermal jitter
export function simulatePufResponse(
  deviceId: string,
  challenge: string,
  temperature: number, // -40 to +85 °C
  voltage: number, // 0.9 to 1.3 V
  noisePercent: number, // 0 to 15 %
  measurementIndex = 0,
  bitLength = 128
): PUFSimulationResult {
  const nominalBits = generateNominalPufBits(deviceId, challenge, bitLength);

  // Physical drift calculations:
  const deltaTemp = Math.abs(temperature - 25);
  // Temperature sensitivity: ~0.08% BER per °C deviation
  const tempBerFactor = (deltaTemp / 60) * 0.045;

  // Voltage sensitivity: nominal 1.2V, |V - 1.2|
  const deltaVoltage = Math.abs(voltage - 1.2);
  // Voltage sensitivity: ~0.12% BER per 0.1V deviation
  const voltBerFactor = (deltaVoltage / 0.3) * 0.055;

  // Thermal noise jitter
  const noiseFactor = (noisePercent / 100) * 0.04;

  const totalFlipProbability = Math.min(0.28, Math.max(0.005, tempBerFactor + voltBerFactor + noiseFactor));

  let measuredBits = '';
  const bitFlips: number[] = [];

  for (let i = 0; i < bitLength; i++) {
    const nominalBit = nominalBits[i];
    // Each cell has a specific stability margin based on device ID + bit index
    const cellStabilitySeed = fastSyncHash(`${deviceId}_CELL_STABILITY_${i}`).charCodeAt(0) / 255;
    
    // Measurement noise perturbation
    const measurementJitter = (seededRandom(measurementIndex * 997 + i * 13) - 0.5) * 0.05;
    const effectiveProbability = totalFlipProbability * (1.8 - cellStabilitySeed) + measurementJitter;

    // Flip decision
    const willFlip = seededRandom(measurementIndex * 1337 + i * 47 + Math.floor(temperature * 10) + Math.floor(voltage * 100)) < effectiveProbability;

    if (willFlip) {
      measuredBits += nominalBit === '1' ? '0' : '1';
      bitFlips.push(i);
    } else {
      measuredBits += nominalBit;
    }
  }

  const ber = parseFloat(((bitFlips.length / bitLength) * 100).toFixed(2));
  const reliability = parseFloat((100 - ber).toFixed(2));
  const hammingDistance = bitFlips.length;

  // Fuzzy Extractor Conceptual Pipeline:
  // 1. Enrollment: Nominal PUF R_nom -> BCH Syndrome W (Helper Data)
  const helperDataSyndrome = fastSyncHash(`BCH_SYNDROME_HELPER_DATA_${deviceId}_${nominalBits.substring(0, 32)}`).substring(0, 32);
  
  // 2. Stable Key derivation (conceptual device-internal key):
  const rawKeyInternal = fastSyncHash(`DEVICE_INTERNAL_SECRET_${nominalBits}`);
  // Stable Key Commitment (public hash published to ledger):
  const stableKeyCommitment = fastSyncHash(`COMMITMENT_${rawKeyInternal}`).substring(0, 64);

  // 3. Reproduction: Measured PUF R_meas + Helper Data W -> Error Correction
  // BCH(128, 64, t=14) can correct up to ~11% bit errors (14 bits in 128).
  const maxCorrectableBits = 14;
  const canCorrect = hammingDistance <= maxCorrectableBits;
  const errorCorrectionStatus = canCorrect ? 'CORRECTED' : 'EXCEEDED_THRESHOLD';

  // If corrected, reconstructed key matches stable key; otherwise corrupt key commitment
  const reconstructedKeyInternal = canCorrect 
    ? rawKeyInternal 
    : fastSyncHash(`DEVICE_INTERNAL_SECRET_${measuredBits}`);
  
  const reconstructedKeyCommitment = fastSyncHash(`COMMITMENT_${reconstructedKeyInternal}`).substring(0, 64);

  return {
    nominalResponse: nominalBits,
    measuredResponse: measuredBits,
    bitFlips,
    ber,
    reliability,
    hammingDistance,
    stableKeyCommitment,
    helperDataSyndrome,
    errorCorrectionStatus,
    reconstructedKeyCommitment,
  };
}

// Calculate inter-device uniqueness between two different devices
export function calculateInterDeviceUniqueness(deviceA: string, deviceB: string, challenge: string, bitLength = 128): number {
  const pufA = generateNominalPufBits(deviceA, challenge, bitLength);
  const pufB = generateNominalPufBits(deviceB, challenge, bitLength);
  let diff = 0;
  for (let i = 0; i < bitLength; i++) {
    if (pufA[i] !== pufB[i]) diff++;
  }
  return parseFloat(((diff / bitLength) * 100).toFixed(2));
}
