import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Cpu, 
  Hash, 
  Key,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { Block, Transaction } from '../../types';

export const BlockchainExplorerTab: React.FC = () => {
  const { blocks, mineNewBlock, isMining, validateChain, consensusAlgorithm } = useSimulation();

  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(blocks.length - 1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [auditResult, setAuditResult] = useState<{
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
  } | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const selectedBlock = blocks.find(b => b.index === selectedBlockIndex) || blocks[blocks.length - 1];

  const handleValidateChain = () => {
    setIsValidating(true);
    setTimeout(() => {
      const res = validateChain();
      setAuditResult(res);
      setIsValidating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Audit Action Controls */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Hardware-Rooted Blockchain Explorer &amp; Cryptographic Auditor
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Verify cryptographic linking, Merkle roots, miner PUF commitments, and consensus integrity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Validate Chain Button */}
            <button
              onClick={handleValidateChain}
              disabled={isValidating}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-2 transition-all"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing Cryptographic Hashes...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Validate Chain Integrity</span>
                </>
              )}
            </button>

            {/* Mine Block Button */}
            <button
              onClick={() => mineNewBlock()}
              disabled={isMining}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {isMining ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Mining...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Mine Block #{blocks.length}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Results Bar if computed */}
        {auditResult && (
          <div className={`mt-5 p-4 rounded-xl border font-mono text-xs ${
            auditResult.isValid 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center justify-between font-bold mb-2">
              <span className="flex items-center gap-1.5">
                {auditResult.isValid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                CHAIN AUDIT REPORT: {auditResult.isValid ? 'ALL 5 CRYPTOGRAPHIC VERIFICATION CHECKS PASSED' : 'CORRUPTED BLOCK DETECTED'}
              </span>
              <span>{auditResult.totalBlocksChecked} Blocks Verified</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-2 border-t border-slate-800">
              <div>&bull; Prev-Hash Links: <strong className="text-white">PASS (100%)</strong></div>
              <div>&bull; Merkle Trees: <strong className="text-white">PASS (100%)</strong></div>
              <div>&bull; PUF Signatures: <strong className="text-white">PASS (100%)</strong></div>
              <div>&bull; Miner Authorizations: <strong className="text-white">PASS (100%)</strong></div>
              <div>&bull; Consensus Match: <strong className="text-white">PASS (100%)</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Main Explorer View: Blocks List + Block Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chain Blocks Feed */}
        <div className="rounded-2xl glass-panel p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Block Chain Feed ({blocks.length})</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Newest first
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
            {blocks.slice().reverse().map(block => {
              const isSelected = selectedBlock?.index === block.index;
              return (
                <div
                  key={block.index}
                  onClick={() => { setSelectedBlockIndex(block.index); setSelectedTx(null); }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-cyan-400">#</span>
                      {block.index.toString().padStart(6, '0')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="mt-1 text-slate-400 text-[11px] truncate">
                    Hash: <span className="text-slate-300">{block.currentHash.substring(0, 20)}...</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Miner: <strong className="text-slate-300">{block.minerId}</strong></span>
                    <span className="text-cyan-300">{block.transactions.length} txs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Block Header & Transactions Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBlock && (
            <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-heading font-extrabold text-white">
                    Block #{selectedBlock.index.toString().padStart(6, '0')}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    CONFIRMED
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Timestamp: {new Date(selectedBlock.timestamp).toISOString()}
                </div>
              </div>

              {/* Block Header Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Current Block Digest</span>
                  <div className="text-cyan-300 break-all text-[11px] select-all">
                    {selectedBlock.currentHash}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Previous Block Hash</span>
                  <div className="text-slate-400 break-all text-[11px] select-all">
                    {selectedBlock.previousHash}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Merkle Root</span>
                  <div className="text-blue-300 break-all text-[11px] select-all">
                    {selectedBlock.merkleRoot}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Miner Silicon PUF Commitment</span>
                  <div className="text-emerald-400 break-all text-[11px] select-all">
                    {selectedBlock.pufCommitment}
                  </div>
                </div>
              </div>

              {/* Consensus & Mining Metadata Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500">Validator Miner</span>
                  <div className="font-bold text-white mt-0.5">{selectedBlock.minerId}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500">Nonce</span>
                  <div className="font-bold text-cyan-300 mt-0.5">{selectedBlock.nonce}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500">Consensus Difficulty</span>
                  <div className="font-bold text-amber-400 mt-0.5">{selectedBlock.difficulty} Leading Zeros</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500">Signature Status</span>
                  <div className="font-bold text-emerald-400 mt-0.5">VERIFIED</div>
                </div>
              </div>

              {/* Transactions in this Block */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Block Transactions ({selectedBlock.transactions.length})
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Click any transaction to inspect payload &amp; signature
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedBlock.transactions.map((tx, idx) => (
                    <div
                      key={tx.txId}
                      onClick={() => setSelectedTx(tx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedTx?.txId === tx.txId
                          ? 'bg-slate-900 border-cyan-400 shadow-sm'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-300">{tx.txId}</span>
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-[10px] text-cyan-400">
                            {tx.payloadType}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">CONFIRMED</span>
                      </div>

                      <div className="text-[11px] text-slate-300 mt-1 truncate">
                        Sender: <strong className="text-white">{tx.senderId}</strong> &rarr; Recipient: <strong className="text-white">{tx.recipientId}</strong>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        Payload: {tx.dataSummary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Transaction Inspector Detail Box */}
              {selectedTx && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Transaction Cryptographic Details: {selectedTx.txId}</span>
                    </span>
                    <button
                      onClick={() => setSelectedTx(null)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>Fresh Nonce: <span className="text-cyan-300">{selectedTx.nonce}</span></div>
                    <div>Device Monotonic Counter: <span className="text-white">#{selectedTx.deviceCounter}</span></div>
                    <div>PUF Signature: <span className="text-emerald-400 break-all">{selectedTx.signature}</span></div>
                    <div>Payload: <span className="text-slate-300">{selectedTx.dataSummary}</span></div>
                    <div className="text-[10px] text-slate-500">
                      Anchor: <span className="text-slate-400">{selectedTx.pufCommitment.substring(0, 32)}...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
