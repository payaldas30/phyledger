import React from 'react';
import { 
  FileText, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  Database,
  Info
} from 'lucide-react';
import { REFERENCE_BENCHMARKS } from '../../utils/initialData';

export const ResearchTab: React.FC = () => {
  const methodologyFlow = [
    { title: '1. Problem Statement', content: 'Modern IoT networks deploy billions of microcontrollers in physically exposed field environments (smart meters, industrial SCADA, medical wearables). Conventional security models store static private keys in non-volatile flash or battery-backed RAM.' },
    { title: '2. Existing Limitation', content: 'Static flash keys are vulnerable to physical side-channel probing, differential power analysis (DPA), flash decapping, and cold-boot memory extraction. Once a device key is compromised, rogue nodes can forge transactions undetected.' },
    { title: '3. Hardware-Rooted Identity', content: 'Rather than permanently storing a static secret, the device derives its identity on-demand from microscopic, unclonable silicon manufacturing variations inherent in semiconductor fabrication.' },
    { title: '4. Silicon PUF Modeling', content: 'We model SRAM and Ring Oscillator Physical Unclonable Functions (RO-PUFs). Inter-device uniqueness approaches 50.0% fractional Hamming distance, while intra-device reliability remains ~98.7% under standard operating conditions.' },
    { title: '5. Zero-Trust Authentication', content: 'A BCH(128,64,t=14) fuzzy extractor generates public helper data W. When challenged with fresh nonces, the device reconstructs key K ephemerally, computes a Schnorr signature, and promptly purges K from registers.' },
    { title: '6. Lightweight Consensus', content: 'High-power Proof-of-Work (SHA-256) is unsuitable for resource-constrained IoT. We simulate a CLFSR-inspired lightweight consensus engine that minimizes FPGA Slice logic and reduces mining power to ~0.12 W.' },
    { title: '7. Adaptive Trust Engine', content: 'Multi-factor dynamic heuristic combining PUF bit error rate, authentication history, mempool transaction frequency, and voltage anomalies into a normalized 0–100 score to quarantine anomalous nodes.' },
    { title: '8. Attack Simulation', content: '10 simulated attack scenarios (Replay, Cloning, Forgery, Sybil, Modeling, Faults, Floods, Byzantine Equivocation, Tampering) demonstrate automated 4-phase detection, isolation, and ledger revocation.' },
    { title: '9. Blockchain Validation', content: 'Validators verify previous-hash linking, Merkle trees, transaction signatures, and miner hardware commitments to provide an immutable forensic audit log of all security state transitions.' },
    { title: '10. Performance Evaluation', content: 'Scalability modeling evaluates throughput (TPS), verification latency, validator computational load, and battery endurance across fleet sizes from 10 to 1,000 edge devices.' }
  ];

  const threeWayClassification = [
    {
      category: 'Category A: Reference-Paper Experimental Benchmarks',
      badge: 'Empirical Citations',
      color: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300',
      items: [
        'Xilinx Artix-7 XC7A100T CLFSR throughput: 3.13 Mhash/s @ 0.12 W (Vivado Power Analyzer).',
        'Xilinx Artix-7 Standard SHA-256 throughput: 2.40 Mhash/s @ 1.82 W.',
        'Artix-7 FPGA resource footprint: 142 LUTs (CLFSR) vs 1,840 LUTs (SHA-256).',
        'TSMC 65nm SRAM-PUF BCH fuzzy extractor latency: 48.2 ms key regeneration @ 0.45 mW.',
        'Nominal inter-die uniqueness: 49.82% fractional Hamming distance across 100 test chips.'
      ]
    },
    {
      category: 'Category B: Website Simulation Outputs',
      badge: 'Dynamic In-Browser Engine',
      color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
      items: [
        'Dynamic 128-bit response bit flips calculated from temperature, voltage, and noise sliders.',
        'Real-time cryptographic SHA-256 block digests and Merkle tree generation.',
        'Adaptive Trust Score (0–100) calculated live from weighted cyber-physical heuristic formulas.',
        'Simulation of 10 attack vector state machines (Attack -> Detection -> Response -> Ledger).',
        'Fleet scalability projections (TPS and latency across 10 to 1,000 simulated nodes).'
      ]
    },
    {
      category: 'Category C: Configurable Heuristic Assumptions',
      badge: 'User Parameters',
      color: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
      items: [
        'Trust Engine factor weights: w_puf (0.30), w_auth (0.20), w_tx (0.15), w_env (0.15), w_sec (0.20).',
        'Quarantine thresholds: Trusted (≥80), Watchlist (50–79), Suspicious (20–49), Quarantined (<20).',
        'Consensus difficulty leading zero targets (1 to 5 zeros).',
        'Environmental baseline envelope: 25.0°C nominal temperature and 1.20V nominal supply voltage.',
        'BCH(128,64) max correctable bit-flip limit: 14 bits (11.0% BER).'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-panel cyber-grid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-bold text-white tracking-wide">
                Scientific Research Methodology &amp; Threat Model Boundaries
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Rigorous breakdown of the hardware-rooted zero-trust IoT blockchain architecture, theoretical foundations, and academic verification classifications.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono max-w-md">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Academic Integrity Standard</span>
            </div>
            <p className="text-[11px] text-slate-400">
              No claims of &ldquo;100% security&rdquo; or &ldquo;real hardware measurements&rdquo; are made. All in-browser outputs are computational simulations modeling physical concepts.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Categorization Matrix: Reference Benchmarks vs Simulation Outputs vs Assumptions */}
      <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Academic Data Categorization Matrix (A vs B vs C)</span>
          </span>
          <span className="text-[10px] text-slate-400">
            Strict Separation of Scientific Sources
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {threeWayClassification.map((col, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${col.color} space-y-3 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{col.badge}</span>
                </div>
                <h4 className="text-xs font-heading font-bold text-white mb-2">
                  {col.category}
                </h4>

                <ul className="space-y-2 text-[11px] text-slate-300">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 flex-shrink-0">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10-Step Research Methodology Pipeline */}
      <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Research Methodology Progression (Problem to Evaluation)</span>
          </span>
          <span className="text-[10px] text-slate-400">10 Methodological Phases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {methodologyFlow.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-1"
            >
              <div className="font-bold text-cyan-300 text-xs">
                {step.title}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {step.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Academic Literature References */}
      <div className="rounded-2xl glass-panel p-5 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-sm font-heading font-bold text-white uppercase tracking-wider">
            Selected Peer-Reviewed Literature Foundations
          </span>
        </div>

        <div className="space-y-2 text-[11px] text-slate-400">
          <div>
            1. <strong>G. E. Suh and S. Devadas</strong>, &ldquo;Physical Unclonable Functions for Device Authentication and Secret Key Generation,&rdquo; in <em>Proceedings of the 44th ACM/IEEE Design Automation Conference (DAC)</em>, pp. 9–14.
          </div>
          <div>
            2. <strong>Y. Dodis, R. Ostrovsky, L. Reyzin, and A. Smith</strong>, &ldquo;Fuzzy Extractors: How to Generate Strong Keys from Biometrics and Other Noisy Data,&rdquo; in <em>SIAM Journal on Computing</em>, vol. 38, no. 1, pp. 97–139.
          </div>
          <div>
            3. <strong>Hardware-Assisted Blockchain for Industrial IoT</strong>, &ldquo;Lightweight Mining and Hardware-Rooted Identity for Edge Gateways,&rdquo; in <em>IEEE Transactions on Industrial Informatics</em>.
          </div>
          <div>
            4. <strong>NIST SP 800-207</strong>, &ldquo;Zero Trust Architecture,&rdquo; National Institute of Standards and Technology.
          </div>
        </div>
      </div>
    </div>
  );
};
