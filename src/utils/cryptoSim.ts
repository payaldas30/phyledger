// Real SHA-256 via browser subtle crypto or fast synchronous FNV-1a/djb2 hash for instantaneous previews

export async function sha256Hex(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  return fastSyncHash(data);
}

// Synchronous pseudo-hash function for snappy UI updates
export function fastSyncHash(str: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch: number; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const p3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const p4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  return `${p1}${p2}${p3}${p4}`.repeat(2); // 64 hex characters
}

export function computeMerkleRoot(transactions: { txId: string }[]): string {
  if (transactions.length === 0) {
    return '0'.repeat(64);
  }
  let currentLevel = transactions.map(t => fastSyncHash(t.txId));
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(fastSyncHash(currentLevel[i] + currentLevel[i + 1]));
      } else {
        nextLevel.push(fastSyncHash(currentLevel[i] + currentLevel[i]));
      }
    }
    currentLevel = nextLevel;
  }
  return currentLevel[0];
}

export function generateNonceHex(length = 16): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generatePufSignature(pufCommitment: string, message: string): string {
  // Simulated deterministic Schnorr signature from PUF commitment + message
  return fastSyncHash(`SIG_${pufCommitment}_${message}`).substring(0, 48);
}

export function verifyPufSignature(signature: string, pufCommitment: string, message: string): boolean {
  const expected = fastSyncHash(`SIG_${pufCommitment}_${message}`).substring(0, 48);
  return signature === expected;
}
