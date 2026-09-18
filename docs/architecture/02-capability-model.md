# TIDIR Capability Model

> **Tier 2: Capabilities & Taxonomy** · **Golden Path Step 4 of 5** · **Audience**: Detection Leads, Security Managers · **Normative Status**: Normative Capability Taxonomy  
> **Prerequisites**: [Step 3: System Overview](/architecture/01-system-overview) · **Next Step**: [Step 5: Target Threat Model & Assurance Case](/architecture/09-threat-model)

---

This document specifies the functional capability taxonomy required across the Threat Intelligence, Detection, Investigation & Response lifecycle.

---

## 1. Capability Taxonomy Matrix

The TIDIR capability model defines **twenty-nine operational capabilities** organized across five functional domains, underpinned by **seven cross-cutting AI Governance and Verification capabilities** and **five Operational Continuity & Resilience capabilities** (41 capabilities in total), spanning from raw sensory ingestion to closed-loop response automation:

```mermaid
flowchart TB
  %% Class Definitions for High Contrast & Visual Clarity
  classDef cti fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
  classDef data fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
  classDef det fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
  classDef inv fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
  classDef resp fill:#4c0519,stroke:#fb7185,stroke-width:2px,color:#f8fafc;
  classDef aigov fill:#1e293b,stroke:#f472b6,stroke-width:2px,color:#f8fafc;

  D1["<b>Domain 1: Cyber Threat Intelligence (CTI)</b><br/>• CTI-01: Feed Aggregation & STIX/TAXII Ingestion<br/>• CTI-02: Indicator Deduplication & Half-Life Decay<br/>• CTI-03: Attack Flow & Adversary TTP Mapping<br/>• CTI-04: Line-Rate IOC Dissemination to Edge<br/>• CTI-05: Retroactive Lakehouse Threat Sweeps"]:::cti

  D2["<b>Domain 2: Telemetry & Data Fabric (DATA)</b><br/>• DATA-01: Multi-Source Kernel & Cloud Ingress<br/>• DATA-02: Line-Rate OCSF Normalization & DLQ<br/>• DATA-03: Distributed Partitioned Streaming Log<br/>• DATA-04: Hot Analytical Search Index (15–30d)<br/>• DATA-05: Columnar Security Lakehouse (365d+)"]:::data

  D3["<b>Domain 3: Detection Engineering (DET)</b><br/>• DET-01: Stateful Sliding-Window Streaming<br/>• DET-02: Scheduled Batch Lakehouse SQL<br/>• DET-03: Detection-as-Code (DaC) & CI Testing<br/>• DET-04: Supernode-Dampened Graph Clustering<br/>• DET-05: Multi-Factor Composite Risk Lens<br/>• DET-06: SecOps Alert Noise Error Budgets<br/>• DET-07: Ambient Deception & Canary Fabric"]:::det

  D4["<b>Domain 4: Investigation & Case Management (INV)</b><br/>• INV-01: Unified Entity Resolution 360<br/>• INV-02: Chronological Multi-Source Timeline<br/>• INV-03: Relational Execution & Process Graph<br/>• INV-04: Sealed Evidence Locker & RFC 3161<br/>• INV-05: Hierarchical Agent Mesh & Agent Trust Boundary<br/>• INV-06: Progressive Disclosure Analyst Workbench<br/>• INV-07: Just-in-Time (JIT) Telemetry Elevation"]:::inv

  D5["<b>Domain 5: Automated Response & Containment (RESP)</b><br/>• RESP-01: Declarative Playbook Orchestration<br/>• RESP-02: Monotonic Containment & Forward Escalation<br/>• RESP-03: Autonomous Tier 1 Containment<br/>• RESP-04: Dual-Auth Consensus & Break-Glass Override<br/>• RESP-05: Closed-Loop & Green Team Triggers"]:::resp

  GOV["<b>Cross-Cutting: AI Governance & Verification (AIGOV)</b><br/>• AIGOV-01: Continuous Evals-as-Code & Grounding<br/>• AIGOV-02: Dual-Plane Data/Control Isolation<br/>• AIGOV-03: Cost & Latency Performance Budgets<br/>• AIGOV-04: Agent Fleet Lifecycle & Preemption<br/>• AIGOV-05: MCP Tool Observability & Loop Breakers<br/>• AIGOV-06: Ephemeral Attestation & SVIDs<br/>• AIGOV-07: Non-Human Identity (NHI) Profiling"]:::aigov

  D1 ==>|Operational Threat Feeds & PIR Flows| D2
  D2 ==>|Normalized Telemetry & Low-Latency State Δt| D3
  D3 ==>|Elevated Risk-Scored Incident Dossiers| D4
  D4 ==>|Validated Remediation & Containment Tasks| D5
  D5 -.->|Attributed Intel & Blindspot Calibration| D1
  GOV -.-|Enforces Evals & Agent Trust Boundary Across| D4
  GOV -.-|Enforces Blast-Radius & Attestation Across| D5
```

---

## 2. Functional Capability Domains

> [!NOTE]
> **[MITRE D3FEND](https://d3fend.mitre.org/) Alignment & Reference Target SLOs**:
> Each capability is formally mapped to its primary [MITRE D3FEND](https://d3fend.mitre.org/) defensive technique (e.g. `D3-SVE` Schema Validation, `D3-PSA` Process Spawn Analysis, `D3-SMS` State Machine Security, `D3-LAM` Least-Privilege Access Mechanism). Operational latencies, throughput figures, and comprehension metrics listed below are designated as **Reference Target Service Level Objectives (SLOs)** based on representative enterprise workloads (e.g. 100 TB reference lakehouse tiers).

### Domain 1: Cyber Threat Intelligence (CTI)

| Capability ID | Name | Execution Mode | MITRE D3FEND | Description | Reference Target SLO |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CTI-01** | Feed Aggregation & Ingestion | `[Deterministic Engine]` | [`D3-TIE`](https://d3fend.mitre.org/)<br>[`D3-IDA`](https://d3fend.mitre.org/) | Ingest commercial, open-source, ISAC, and internal telemetry feeds via STIX/TAXII, REST, and streaming endpoints. | Ingestion latency < 5 min from publication |
| **CTI-02** | Deduplication & Confidence Scoring | `[Deterministic Engine]` | [`D3-IDA`](https://d3fend.mitre.org/)<br>[`D3-FEH`](https://d3fend.mitre.org/) | Normalize disparate indicator types, resolve overlapping claims, and compute decay scores over time. | Automated decay curves calculated daily |
| **CTI-03** | Adversary & TTP Mapping | `[AI/Agent-Augmented]` | [`D3-TTPM`](https://d3fend.mitre.org/) | Attribute techniques, tactics, and procedures to MITRE ATT&CK enterprise matrices using LLM advisory parsing. | 100% of validated alerts tagged with ATT&CK TTPs |
| **CTI-04** | Streaming IOC Dissemination | `[Deterministic Engine]` | [`D3-NID`](https://d3fend.mitre.org/) | Publish active, high-confidence indicators to edge detection layers with minimal lookup overhead. | Indicator broadcast to detection tier < 30 sec |
| **CTI-05** | Retroactive Sweep (Retro-Hunt) | `[Deterministic Engine]` | [`D3-HA`](https://d3fend.mitre.org/)<br>[`D3-IRA`](https://d3fend.mitre.org/) | Automatically sweep historical lakehouse telemetry upon discovery of novel zero-day IOCs/TTPs. | 90-day sweep executed in < 15 min |

---

### Domain 2: Telemetry & Data Fabric

| Capability ID | Name | Execution Mode | MITRE D3FEND | Description | Reference Target SLO |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DATA-01** | Multi-Source Ingestion | `[Deterministic Engine]` | [`D3-HPA`](https://d3fend.mitre.org/)<br>[`D3-MTC`](https://d3fend.mitre.org/) | Collect telemetry from host kernel instrumentation, cloud control planes, identity token sessions (OCSF 3002), and network sensors. | Durable acknowledgement; designed for loss-intolerant ingestion with local buffer failover |
| **DATA-02** | Canonical Schema Normalization | `[Deterministic Engine]` | [`D3-SVE`](https://d3fend.mitre.org/)<br>[`D3-DLQ`](https://d3fend.mitre.org/) | Coerce raw schema structures into OCSF (Open Cybersecurity Schema Framework) objects at line rate with unmapped data catch-all. | Normalization overhead < 5ms per event |
| **DATA-03** | Distributed Stream Buffering | `[Deterministic Engine]` | [`D3-AL`](https://d3fend.mitre.org/)<br>[`D3-DRB`](https://d3fend.mitre.org/) | Decouple collectors from consumers using partitioned, distributed append-only streaming logs. | Sustained ingestion capacity ≥ 500k EPS |
| **DATA-04** | Hot Analytics Index | `[Deterministic Engine]` | [`D3-FA`](https://d3fend.mitre.org/)<br>[`D3-IRA`](https://d3fend.mitre.org/) | Provide low-latency search, aggregations, and filtering over recent telemetry (15–30 days). | P95 search latency < 2 sec |
| **DATA-05** | Historical Security Lakehouse | `[Deterministic Engine]` | [`D3-WORM`](https://d3fend.mitre.org/)<br>[`D3-FEH`](https://d3fend.mitre.org/) | Store long-term telemetry in open columnar formats with partition pruning and compaction on object storage. | 365+ day retention with sub-linear cost |

---

### Domain 3: Detection Engineering

| Capability ID | Name | Execution Mode | MITRE D3FEND | Description | Reference Target SLO |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DET-01** | Real-Time Stream Detection | `[Deterministic Engine]` | [`D3-PSA`](https://d3fend.mitre.org/)<br>[`D3-NTA`](https://d3fend.mitre.org/) | Evaluate sliding-window stateful rules, in-flight token replay, and pattern matches against streaming events. | Time-to-detect (MTTD) < 5 seconds |
| **DET-02** | Lakehouse Batch Analytics | `[Deterministic Engine]` | [`D3-UBA`](https://d3fend.mitre.org/)<br>[`D3-AAR`](https://d3fend.mitre.org/) | Execute complex, cross-table SQL analytics, behavioural baselines, and rare event heuristics. | Daily/hourly schedules (MTTD < 24h) |
| **DET-03** | DaC & Continuous Purple Team | `[AI/Agent-Augmented]` | [`D3-ATTE`](https://d3fend.mitre.org/)<br>[`D3-DTC`](https://d3fend.mitre.org/) | Manage rules as declarative code validated via continuous automated atomic adversary emulation and multi-model consensus. | 100% rule tests passing prior to production deploy |
| **DET-04** | Alert Correlation & Aggregation | `[Deterministic Engine]` | [`D3-EFA`](https://d3fend.mitre.org/)<br>[`D3-SND`](https://d3fend.mitre.org/) | Cluster related alerts across time, host, identity, and network into coherent incident candidates via entity graphs. | Reduction of alert volume to analyst by > 75% |
| **DET-05** | Bayesian Multi-Signal Risk Lens | `[Deterministic Engine]` | [`D3-BCA`](https://d3fend.mitre.org/)<br>[`D3-EIC`](https://d3fend.mitre.org/) | Mitigate the operational consequences of the Base Rate Fallacy by compounding orthogonal evidence vectors (asset, identity, network) before elevation. | Dynamic composite score (0–100); false alarms < 5% |
| **DET-06** | SecOps Error Budgets | `[Deterministic Engine]` | [`D3-ARA`](https://d3fend.mitre.org/)<br>[`D3-SRE`](https://d3fend.mitre.org/) | Enforce false-positive Noise Budgets per detection class with automated deployment freeze on budget burn. | Pre-deploy CI gate: peak FPR < 1%; Production SLO: rolling 30-day FPR <= 5% |
| **DET-07** | Deception & Canary Surface Fabric | `[Deterministic Engine]` | [`D3-DN`](https://d3fend.mitre.org/)<br>[`D3-HT`](https://d3fend.mitre.org/) | Embed lightweight honeytokens, Kerberos SPN decoys, and file lures emitting OCSF canary events for zero-noise detection. | False Positive Rate = 0.00%; MTTD < 1 second |

---

### Domain 4: Investigation & Case Management

| Capability ID | Name | Execution Mode | MITRE D3FEND | Description | Reference Target SLO |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **INV-01** | Entity Resolution | `[Deterministic Engine]` | [`D3-IDA`](https://d3fend.mitre.org/) | Disambiguate and cross-reference identities (usernames, email, Kerberos tickets, hostnames, IP addresses). | Unified entity profile generation < 1 sec |
| **INV-02** | Interactive Timeline Reconstruction | `[Deterministic Engine]` | [`D3-OTR`](https://d3fend.mitre.org/)<br>[`D3-CS`](https://d3fend.mitre.org/) | Automatically construct a chronological sequence of actor actions, child processes, and auth events. | Multi-source timeline generation < 5 sec |
| **INV-03** | Relational Graph Exploration | `[Deterministic Engine]` | [`D3-GA`](https://d3fend.mitre.org/) | Provide interactive graph visualization showing nodes (hosts, users, files, domains) and edges (relations). | Render graphs with > 10,000 nodes smoothly |
| **INV-04** | Evidence Dossier & Auditability | `[Deterministic Engine]` | [`D3-CH`](https://d3fend.mitre.org/)<br>[`D3-TSA`](https://d3fend.mitre.org/) | Maintain immutable records of investigative queries, pinned artifacts, analyst notes, and tags. | Tamper-evident audit logging of analyst actions (RFC 3161) |
| **INV-05** | Agent Mesh & Multi-Model Consensus | `[AI/Agent-Augmented]` | [`D3-MDA`](https://d3fend.mitre.org/)<br>[`D3-IT`](https://d3fend.mitre.org/) | Coordinate autonomous specialist subagents with adversarial Proposer/Challenger model arbitration behind the Agent Trust Boundary. | Time-to-investigate (MTTI) < 60s; > 80% consensus |
| **INV-06** | Progressive Disclosure Workbench | `[Human-in-the-Loop]` | [`D3-PDS`](https://d3fend.mitre.org/)<br>[`D3-SAR`](https://d3fend.mitre.org/) | Surface structured briefings in a 3-tier hierarchy (Situation Report ➔ Evidence Table ➔ On-Demand Graph Lineage). | Analyst triage comprehension < 60 sec |
| **INV-07** | Just-in-Time (JIT) Telemetry Elevation | `[AI/Agent-Augmented]` | [`D3-SCA`](https://d3fend.mitre.org/)<br>[`D3-JIT`](https://d3fend.mitre.org/) | Programmatically command edge sensors to elevate collection fidelity (eBPF, PCAP, memory) for bounded windows (TTL <= 30m). | Elevation command dispatch < 10 sec; 48h auto-eviction |

---

### Domain 5: Automated Response & Containment

| Capability ID | Name | Execution Mode | MITRE D3FEND | Description | Reference Target SLO |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RESP-01** | Declarative Playbook Orchestration | `[Deterministic Engine]` | [`D3-DPO`](https://d3fend.mitre.org/)<br>[`D3-TBO`](https://d3fend.mitre.org/) | Execute multi-step containment, enrichment, and recovery workflows across third-party APIs via monotonic state machines. | Execution step dispatch < 500ms |
| **RESP-02** | Asymmetric Containment & Forward Escalation | `[AI/Agent-Augmented]` | [`D3-SMS`](https://d3fend.mitre.org/)<br>[`D3-FE`](https://d3fend.mitre.org/) | Fail-secure execution that never rolls back containment on partial failure; executes forward perimeter escalation on error. | Fail-secure posture 100%; MTTR < 60 min |
| **RESP-03** | Autonomous Rapid Containment | `[Deterministic Engine]` | [`D3-HI`](https://d3fend.mitre.org/)<br>[`D3-CR`](https://d3fend.mitre.org/)<br>[`D3-BRC`](https://d3fend.mitre.org/) | Execute instantaneous containment for low-blast-radius actions (e.g. host isolation in sandbox, token invalidation). | Time-to-contain (MTTC) < 15 seconds |
| **RESP-04** | Dual-Auth & Break-Glass Protocols | `[Human-in-the-Loop]` | [`D3-BGO`](https://d3fend.mitre.org/)<br>[`D3-MAC`](https://d3fend.mitre.org/) | Enforce multi-signature consensus for high-impact actions with authenticated single-commander break-glass overrides. | MTTC < 5 min; break-glass audit broadcast < 5 sec |
| **RESP-05** | Closed-Loop & Green Team Triggers | `[Deterministic Engine]` | [`D3-CIR`](https://d3fend.mitre.org/)<br>[`D3-IaC`](https://d3fend.mitre.org/) | Extract confirmed indicators for CTI, calibrate DaC rules, and synthesize IaC hardening pull requests for Green Teams to improve defense-in-depth. | Closed-loop & hardening dispatch automated on case closure |

---

### Cross-Cutting Domain: AI Governance & Verification (AIGOV)

| Capability ID | Name | Execution Mode | MITRE D3FEND | Description | Reference Target SLO |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AIGOV-01** | Continuous Evals-as-Code | `[AI/Agent-Augmented]` | [`D3-EAC`](https://d3fend.mitre.org/)<br>[`D3-GJB`](https://d3fend.mitre.org/) | Automated CI/CD benchmarking of triage prompts and agent workflows against versioned golden incident datasets. | $\ge 95\%$ grounding fidelity; 100% schema tool validity |
| **AIGOV-02** | Dual-Plane Data/Control Isolation | `[Deterministic Engine]` | [`D3-IT`](https://d3fend.mitre.org/) | Enforces strict boundaries preventing unformatted raw telemetry strings from acting as agent control instructions. | Zero instruction execution from untrusted log payloads |
| **AIGOV-03** | Cost & Latency Performance Budgets | `[Deterministic Engine]` | [`D3-RCB`](https://d3fend.mitre.org/) | Deterministic per-invocation token ceilings, query timeouts, and rate budgeting across model runtimes. | P95 agent triage latency < 5 sec; strict budget compliance |
| **AIGOV-04** | Agent Fleet Lifecycle & Preemption | `[Deterministic Engine]` | [`D3-FLM`](https://d3fend.mitre.org/) | Centralized supervisor tracking agent liveness, heartbeats, zombie task reaping, and priority preemption under Sev-1 crises. | Worker zombie reap < 15 sec; preemption cascade < 1 sec |
| **AIGOV-05** | MCP Tool Observability & Loop Breakers | `[Deterministic Engine]` | [`D3-SLB`](https://d3fend.mitre.org/)<br>[`D3-TO`](https://d3fend.mitre.org/) | OTel telemetry across MCP servers, parameter schema drift audits, and semantic query oscillation circuit breakers. | Max 8 recursive tool hops; loop termination < 100ms |
| **AIGOV-06** | Ephemeral Agent Attestation & SVIDs | `[Deterministic Engine]` | [`D3-LAM`](https://d3fend.mitre.org/)<br>[`D3-SVID`](https://d3fend.mitre.org/) | Cryptographic SPIFFE/SPIRE attestation issuing task-scoped, short-lived X.509 SVIDs (TTL <= 15m) for every agent worker. | Dynamic SVID minting < 100ms; auto-revocation on task closure |
| **AIGOV-07** | Non-Human Identity (NHI) Profiling | `[Deterministic Engine]` | [`D3-NHI`](https://d3fend.mitre.org/)<br>[`D3-TRD`](https://d3fend.mitre.org/) | Line-rate behavioral profiling and anomaly detection for service accounts, API keys, and machine tokens across clouds. | 14-day baseline drift alert; token replay detection < 5 sec |

---

### Cross-Cutting Domain: Operational Continuity & Resilience (RESIL)

| Capability ID | Name | Execution Mode | MITRE D3FEND | Description | Reference Target SLO |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RESIL-01** | Decoupled Edge Spooling | `[Deterministic Engine]` | [`D3-DRB`](https://d3fend.mitre.org/)<br>[`D3-LSP`](https://d3fend.mitre.org/) | Autonomous local disk ring buffering on forwarders during streaming bus network partitions. | 24–48h lossless buffer; zero forensic drop |
| **RESIL-02** | Direct-to-Object Ingestion Bypass | `[Deterministic Engine]` | [`D3-OBP`](https://d3fend.mitre.org/) | Dynamic failover allowing forwarders to write compressed Parquet micro-batches directly to object lakehouse. | Cutover latency < 60s from bus partition trip |
| **RESIL-03** | Stream-to-Batch Detection Failover | `[Deterministic Engine]` | [`D3-GDF`](https://d3fend.mitre.org/) | Automated transfer of detection rules to scheduled 5-minute columnar SQL batch sweeps on graph engine failure. | Fallback activation < 2 min; 100% rule coverage preserved |
| **RESIL-04** | Hierarchical Model Fallback & Rule-Based Non-AI Mode | `[Deterministic Engine]` | [`D3-HMF`](https://d3fend.mitre.org/) | Deterministic shift from cloud LLMs to local SLMs, with fallback to structured tabular/graph rule-based workbenches. | Circuit breaker trip < 3 errors; zero pipeline block |
| **RESIL-05** | Master Autonomous E-Stop & OOB Containment | `[Human-in-the-Loop]` | [`D3-MES`](https://d3fend.mitre.org/)<br>[`D3-OOB`](https://d3fend.mitre.org/) | Cryptographic emergency kill-switch dropping playbooks to advisory mode, backed by air-gapped signed CLI runbooks. | E-Stop broadcast < 500ms; complete execution freeze |



