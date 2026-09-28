# PHYLEDGER — Hardware-Rooted Zero-Trust Blockchain for Resource-Constrained IoT

> **"From Silicon to Ledger: A hardware-rooted chain of trust for the IoT."**  
> *PHYLEDGER combines simulated PUF-based device identity, adaptive trust, lightweight permissioned consensus, and attack-aware blockchain validation in one interactive cyber-physical security platform.*

---

## 🔬 Scientific & Academic Disclaimer

**PHYLEDGER is an educational and research-oriented simulation platform** inspired by the architecture of physical unclonable functions (PUFs) paired with lightweight permissioned blockchain frameworks.
* **No Physical Measurement Claim**: Simulated results are dynamically computed in-browser using mathematical semiconductor models and must **NOT** be claimed as physical laboratory measurements.
* **Clear Categorization**: Reference-paper experimental benchmarks (e.g., Vivado Power Analyzer results for Xilinx Artix-7 FPGA) are strictly cited and demarcated from dynamic simulation metrics.
* **Device-Local Secrets**: In the conceptual model, raw PUF secret responses remain device-local and are never persisted or broadcast across the network. Only BCH fuzzy extractor helper data syndromes and cryptographic commitments are recorded on the ledger.

---

## ⚡ Quick Start

```bash
# Clone or navigate to the project directory
cd c:\Users\HP\OneDrive\Desktop\ps-211

# Install dependencies
npm install

# Start the interactive simulation platform
npm run dev
```

Open your browser at **`http://127.0.0.1:5173/`** to access the control center.

---

## 🏆 Competition Judging Demo ("START JUDGING DEMO")

Click the prominent **"START JUDGING DEMO"** button in the top navigation bar to launch an automated 16-phase guided walkthrough designed specifically for evaluators:

1. **Fleet Baseline**: Boot 100 healthy simulated IoT nodes across industrial actuators, smart meters, and gateways.
2. **Normal Telemetry**: Generate zero-trust telemetry transactions signed with ephemeral PUF keys and fresh nonces.
3. **Consensus Minting**: Validator VAL-ALPHA mines a valid block into the immutable ledger using lightweight consensus.
4. **Node D047 Inspection**: Deep-dive into edge device D047's silicon PUF profile, nominal operating envelope (25°C, 1.20V), and trust score (95/100).
5. **Zero-Trust Authentication**: Execute the challenge-response protocol with BCH(128,64) fuzzy extractor key reconstruction.
6. **Replay Incursion**: Adversary intercepts a previously broadcast packet and attempts retransmission.
7. **Nonce Freshness Detection**: Validator checks session history; duplicate nonce detected.
8. **Packet Purge**: Forged transaction dropped from mempool; non-critical security anomaly recorded.
9. **Device Cloning Attack**: Attacker flashes firmware to a counterfeit microcontroller lacking original silicon PUF.
10. **PUF Commitment Mismatch**: Counterfeit silicon cannot match registered cryptographic anchor.
11. **Instant Node Isolation**: Automated zero-trust isolation order transitions D047 to **QUARANTINED** status.
12. **Adaptive Trust Score Decay**: Multi-factor engine penalizes D047; composite score drops from 95 to 8/100.
13. **Immutable Blockchain Event**: `NODE_QUARANTINED` certificate committed to the distributed ledger.
14. **Fleet Health Assessment**: Quantify network resilience (100% of rogue transactions neutralized).
15. **Consensus Energy Evaluation**: Compare 0.12 W lightweight consensus against 1.82 W SHA-256 baseline (93.4% energy savings).
16. **Verdict & Summary**: *"Hardware-rooted identity prevents unauthorized devices from participating in the simulated IoT ledger."*

---

## 📐 Complete Hardware-Rooted Zero-Trust Pipeline

```
Physical Silicon Die
       ↓
Simulated Silicon PUF (SRAM / Ring Oscillator)
       ↓
Fuzzy Extractor (BCH Error-Correction Code)
       ↓
Ephemeral Hardware Identity Key (Purged after use)
       ↓
Zero-Trust Challenge-Response Authentication (Fresh Nonce + Monotonic Counter)
       ↓
Transaction Validation (Schnorr Signature + Payload Bounds)
       ↓
Adaptive Trust Engine (Multi-Factor Scoring: 0–100)
       ↓
Lightweight Consensus Engine (CLFSR-Inspired Mining Simulator)
       ↓
Block Validation Cluster (Byzantine Fault-Tolerant Peers)
       ↓
Distributed Ledger & Explorer (Immutable Audit Trail)
```

---

## 🌐 10 Core Interactive Modules

1. **Dashboard**: Control-center interface displaying 10 live KPIs, 2D interactive canvas topology (100 nodes + 3 validators), live packet animations, scenario presets, and confirmed block feeds.
2. **IoT Network**: Fleet scalability matrix (scale from 10 to 1,000 nodes), device search, trust status filters, and one-click security profiles.
3. **PUF Lab**: Silicon PUF simulator with 128-bit interactive bit-matrix, temperature (-40°C to +85°C), voltage (0.9V to 1.3V), and noise sliders, showing BCH(128,64,t=14) fuzzy extraction and key commitment regeneration.
4. **Trust Engine**: Adaptive multi-factor trust model with transparent formula display, configurable weights ($w_{\text{puf}}, w_{\text{auth}}, w_{\text{tx}}, w_{\text{env}}, w_{\text{sec}}$), configurable status cutoffs (Trusted, Watchlist, Suspicious, Quarantined), and a real-time stress-test sandbox.
5. **Authentication Simulator**: 6-step zero-trust challenge-response protocol with toggleable modes (Genuine, Replay Incursion, Cloned Hardware).
6. **Blockchain Explorer**: Complete block and transaction inspector with interactive **"Validate Chain Integrity"** auditor verifying hash links, Merkle roots, PUF signatures, miner authorizations, and consensus conditions.
7. **Consensus Lab**: Side-by-side comparison of **CLFSR-Inspired Lightweight Simulation** vs **SHA-256 Reference Benchmark Mode**, complete with real-time mining execution and difficulty tuning.
8. **Attack Lab**: 10 dedicated cyber-physical attack vectors featuring an automated 4-phase mitigation architecture (**ATTACK → DETECTION → RESPONSE → LEDGER RESULT**) and 7 live scenario presets.
9. **Energy Lab**: Live power and daily energy consumption modeling, battery endurance projections (2000mAh Li-Po cells), and comparative visual bar charts.
10. **Analytics**: High-fidelity charts modeling Bit Error Rate vs Temperature, BER vs Voltage, Inter-Device Uniqueness Gaussian distributions, network throughput scaling, and fleet trust distributions.
11. **Architecture & Device Lifecycle**: Interactive 11-stage architectural drilldown and 10-phase device lifecycle state machine with revocation and factory re-enrollment workflows.
12. **Research / Methodology**: Problem formulation, theoretical foundations, academic data categorization matrix (Category A vs B vs C), and peer-reviewed literature citations.

---

## 📊 Academic Benchmark vs Simulation Matrix

| Metric | Reference-Paper Benchmark (Category A) | Website Simulation Output (Category B) | Source / Note |
|---|---|---|---|
| **CLFSR Mining Power** | **0.12 W (120 mW)** | Dynamic fleet power: $0.12\text{W} + P_{\text{nodes}}$ | Vivado Power Analyzer (Artix-7 XC7A100T) |
| **SHA-256 Reference Power** | **1.82 W (1820 mW)** | Dynamic fleet power: $1.82\text{W} + P_{\text{nodes}}$ | Standard FPGA Cryptographic Core Benchmark |
| **CLFSR Hash Throughput** | **3.13 Mhash/s** | Simulated mining loop latency | Hardware Clock: 50 MHz |
| **FPGA Logic Footprint** | **142 LUTs / 88 FFs** | N/A (Model Assumption) | 0.4% slice utilization on Artix-7 |
| **PUF Inter-Die Uniqueness** | **49.82% Hamming Dist** | Dynamic calculation across nodes | Spatial randomness of process variations |
| **Fuzzy Extractor Latency**| **48.2 ms key regeneration** | 42.4 ms simulated auth latency | TSMC 65nm SRAM-PUF Testbench |

---

## 🛡️ Zero-Trust Security Tenets

* **No Static Master Keys**: Private keys do not exist in persistent flash memory where physical decapping or side-channel probes can extract them.
* **Ephemeral Generation**: Keys are derived from physical silicon characteristics only when challenged, used in transient volatile registers, and zeroized immediately.
* **Cryptographic Commitments**: Only public hashes (commitments) and error-correction helper syndromes are published on the ledger.
* **Monotonic Nonces**: Prevent transmission replays by ensuring strictly increasing device session states.
* **Automated Revocation**: Adaptive trust scoring dynamically transitions compromised nodes into quarantine without network interruption.
