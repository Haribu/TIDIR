# TIDIR Target System Architecture: Cyber Defence Control System

This document defines the target component architecture for **TIDIR** (Threat Intelligence, Detection, Investigation & Response). TIDIR is architected as a closed-loop **Cyber Defence Control System** that unifies:
* **Observation**: Telemetry & Data Fabric (Layer 1 & 2)
* **State Estimation**: Canonical OCSF schemas & bipartite entity-finding graphs
* **Threat Estimation**: Stateful detection & dependency-aware Bayesian risk compounding (Layer 3)
* **Reasoning**: Bounded hierarchical agent mesh with evidence grounding (Layer 4)
* **Control Policy**: Deterministic policy safety kernel & blast-radius boundary constraints
* **Actuation**: Monotonic fail-closed containment state machines
* **Feedback**: Continuous Red/Blue/Green team calibration loops
* **Resilience**: Four-tier graceful degradation & air-gapped continuity modes
* **Audit**: Cryptographic Incident Decision DAGs & tamper-evident evidence lockers

---

## 1. System Topology & Control Loop

The architecture operates across two orthogonal dimensions:
1. **The Operational Runtime Plane**: Four horizontal layers governing event ingestion, computation, detection, and mitigation.
2. **The Engineering Lifecycle Plane**: Five vertical disciplines governing schemas, intelligence curation, Detection-as-Code (DaC), systems automation, and AI harnesses.

### 1.1 Operational Runtime Pipeline

The operational pipeline processes security events in a strict directional flow from point-of-origin generation to automated mitigation, with an outer perimeter feedback channel for attributed threat intelligence and visibility calibration:

```mermaid
flowchart TB
  %% Styling Classes
  classDef layer1 fill:#0b1329,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
  classDef layer2 fill:#16193b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
  classDef layer3 fill:#24123f,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
  classDef layer4 fill:#06372b,stroke:#34d399,stroke-width:2px,color:#f8fafc;

  %% Layer 1: Data Sources & Environmental Inputs
  subgraph L1 ["LAYER 1: DATA SOURCES & CONTEXTUAL INGESTION"]
    L1_LOGS["Machine-Readable Logs & OS Events\n(Syslog RFC 5424, JSON/NDJSON, Windows EVTX, journald, cloud audit)"]:::layer1
    L1_TELEM["Runtime Operational Telemetry\n(Kernel hooks, eBPF, audit trails, network flows & identity)"]:::layer1
    L1_CTX["Enterprise Posture & Asset Context\n(CMDB hierarchy, attack surface exposure, control status)"]:::layer1
    L1_CTI["Cyber Threat Intelligence (CTI)\n(STIX 2.1 tactical feeds, CVE weaponization, threat actors)"]:::layer1
  end

  %% Layer 2: Pipeline, Storage & Query Fabric
  subgraph L2 ["LAYER 2: PIPELINE, STORAGE & QUERY FABRIC"]
    L2_INGEST["Line-Rate Ingestion & OCSF Normalization\n(Schema registry, unmapped data catch-all & DLQ)"]:::layer2
    L2_ROUTER["Value-Based Tiering & Stream Router\n(Tier A hot stream, Tier B lakehouse, Tier C filter)"]:::layer2
    L2_STORAGE["Multi-Paradigm Storage & Query Core\n(Hot index, columnar lakehouse, two-tier sketch state Δt)"]:::layer2
  end

  %% Layer 3: Threat Intelligence & Detection Engineering
  subgraph L3 ["LAYER 3: THREAT INTEL & DETECTION ENGINEERING"]
    L3_FLOW["Machine-Readable Threat Models\n(Adversary attack flows, PIRs, graph mapping)"]:::layer3
    L3_DAC["Dual-Lane DaC Engine\n(Fast-lane emergency zero-day + standard 30d lakehouse)"]:::layer3
    L3_RISK["Risk Lens & Finding Synthesis\n(Supernode-dampened graph clustering, OCSF 2001/2004)"]:::layer3
  end

  %% Layer 4: Incident Response & Automation
  subgraph L4 ["LAYER 4: INVESTIGATION, CASE MANAGEMENT & AUTOMATED RESPONSE"]
    L4_DOSSIER["Unified Investigation & Case Dossier\n(Entity 360, progressive disclosure UX, sealed timeline)"]:::layer4
    L4_TRIAGE["Hierarchical Agent Mesh & JIT Elevation\n(Lead orchestrator, host/network/cloud specialists, JIT orders)"]:::layer4
    L4_RESP["Asymmetric Fail-Secure Containment\n(Forward escalation, dual-auth gates, break-glass override)"]:::layer4
  end

  %% Closed-Loop Architectural Feedback
  subgraph FB ["CLOSED-LOOP CONTINUOUS CALIBRATION"]
    FB_INTEL["Attributed Threat Flows & IOCs\n(Re-ingested into L1 CTI & L3 Detection Backlog)"]
    FB_GAPS["Telemetry Blindspot Analysis\n(Re-tunes L1 Sensor Filters & Collection Audits)"]
    FB_JIT["JIT Telemetry Elevation Orders\n(Dynamically re-instruments L1 edge sensors for 15-30m)"]
    FB_RESP["Playbook Execution Efficacy\n(Refines L4 Blast-Radius & Forward Models)"]
    FB_GREEN["Green Team Prevention Triggers\n(IaC Pull Requests & Defense-in-Depth Hardening)"]
  end

  %% Operational Progression (Strict Top-to-Bottom DAG)
  L1 ==>|1. Transport Envelopes & Raw Ingestion| L2
  L2 ==>|2. Normalized Telemetry & Low-Latency State Δt| L3
  L3 ==>|3. Correlated Security & Detection Findings| L4
  L4 ==>|4. Incident Dossiers & Post-Mortem Outcomes| FB
```

### 1.2 Engineering Lifecycle & Closed-Loop Governance Plane

The engineering plane governs the operational pipeline through version-controlled specifications, declarative policy engines, and automated validation gates:

```mermaid
flowchart LR
  %% Styling Classes
  classDef eng fill:#1e293b,stroke:#f472b6,stroke-width:2px,color:#f8fafc;
  classDef target fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;

  subgraph DISCIPLINES ["ENGINEERING DISCIPLINES"]
    E1["Data Engineering\n(Schema Evolution & Contracts)"]:::eng
    E2["Threat Intel Engineering\n(PIRs & Indicator Decay)"]:::eng
    E3["Detection Engineering (DaC)\n(Simulation, Testing & CI/CD)"]:::eng
    E4["Automation SRE\n(Playbooks-as-Code & Fail-Closed Containment)"]:::eng
    E5["AI Agent Harnesses\n(Evals-as-Code & Prompt Firewall)"]:::eng
    E6["Green Team Engineering\n(IaC Remediation & Defense-in-Depth)"]:::eng
  end

  subgraph TARGETS ["OPERATIONAL TOUCHPOINTS"]
    T_REG["Schema Registry & Ingestion DLQ\n(Layer 1 / Layer 2)"]:::target
    T_GRAPH["Threat Flow & Correlation Graphs\n(Layer 3 Intel)"]:::target
    T_ENG["Streaming & Lakehouse Engines\n(Layer 3 Detection)"]:::target
    T_RESP["Connector Ecosystem & Containment APIs\n(Layer 4 Containment)"]:::target
    T_OPS["Hierarchical Agent Mesh & Workbench\n(Layer 4 Investigation)"]:::target
    T_PREV["Enterprise Posture & Cloud IaC\n(Preventative Hardening)"]:::target
  end

  E1 -->|Enforces Schemas| T_REG
  E2 -->|Calibrates Attack Flows| T_GRAPH
  E3 -->|Deploys Tested Rules| T_ENG
  E4 -->|Deploys Gated Playbooks| T_RESP
  E5 -->|Supervises Evals & Prompts| T_OPS
  E6 -->|Submits Hardening PRs| T_PREV
```

---

## 2. The 5 Core Architectural Invariants of TIDIR

A reference architecture is defined by its target invariants—the declarative properties that must hold true across normal operation, network partitions, and adversary attacks. TIDIR enforces five fundamental invariants (promoted from [ADR-0021](../adr/0021-graceful-degradation-automated-fallback-and-continuity-plan-b.md)):

1. **No Telemetry Loss Invariant**: Ephemeral network partitions, streaming bus failures, or database degradation must never result in unrecoverable forensic event loss. Forwarders must support edge ring buffering (24–48h NVMe spooling) and direct-to-object ingestion bypasses.
2. **Continuous Threat Visibility Invariant**: Failure of real-time streaming engines or AI agent planes must degrade to deterministic scheduled batch lakehouse sweeps and direct alert routing. Component failure must never blind the SOC to ongoing adversary campaigns.
3. **Deterministic Observability Invariant**: Every subsystem must provide active synthetic probes, canaries, and latency monitors to detect degradation within bounded windows ($\le 60\text{s}$) rather than relying on silent passive failure.
4. **Fail-Secure Containment Invariant (Security-State Monotonicity)**: *No automated compensation may increase attacker reachability beyond the last verified-safe security state.* Defensive barriers move in a single forward direction. If a downstream containment step times out, the system freezes the perimeter and executes forward escalation rather than rolling back established containment.
5. **Human-Accessible Manual Control Invariant**: Automation must always remain subordinate to human incident commanders. The architecture guarantees a master cryptographic E-Stop (downgrading active playbooks to advisory mode) and air-gapped, cryptographically signed manual flight decks for crisis operations.

---

## 3. The TIDIR Trust Doctrine

In modern security operations, components operate under differing security assumptions. TIDIR enforces an explicit capability-based trust model:

| Component | Assume Compromised? | Authority Level | Boundary & Safety Enforcement |
| :--- | :--- | :--- | :--- |
| **Telemetry & Sensor Streams** | **Yes** (Attacker-controlled) | Evidence Only | Schema validation, `unmapped_data` dictionary, zero instruction execution. |
| **Cyber Threat Intelligence (CTI)** | **Yes** (Potentially poisoned) | Advisory Evidence | Confidence decay scoring, human peer review on new PIRs. |
| **LLM & Agent Reasoning Mesh** | **Yes** (Vulnerable to indirect injection) | Proposal Only | Read-only permissions, deterministic AST validation, task-scoped SVIDs ($\le 15\text{m}$). |
| **Detection Rules (DaC)** | **Potentially** (Flawed/noisy logic) | Finding Generation | CI/CD 30-day lakehouse backtesting, synthetic unit fixtures, noise error budgets ($\lt 5\%$). |
| **MCP Query Tools** | **Potentially** (Tool drift / injection) | Bounded Read-Only Query | Strongly typed JSON schemas, SELECT-only enforcement, parameter sanitization. |
| **Response Orchestrator** | **Highly Trusted** | Policy-Gated Mutation | Monotonic state machines, connector circuit breakers, bounded isolation leases. |
| **Policy Safety Kernel** | **Trusted Computing Base (TCB)** | Deterministic Authorization | Pre-execution blast-radius scoring, hard invariant gating, immutable rule evaluation. |
| **Human Incident Commander** | **Privileged** | Break-Glass Override | Multi-signature consensus bypass, out-of-band cryptographic audit broadcast. |
| **Audit & Evidence Ledger** | **Trusted** | Evidence Integrity | WORM storage, append-only Merkle hash chains, RFC 3161 cryptographic timestamps. |

> ### 🛡️ The Governing Rule of TIDIR
> **"Probabilistic components may propose. Deterministic components authorize."**
> 
> No generative model, probabilistic classifier, or external threat feed possesses the authority to mutate enterprise infrastructure directly. All mutating actions must be authorized by deterministic policy kernels, bounded by blast-radius limits, and executed via monotonic state machines.

---

## 4. Layer Definitions & Operational Responsibilities

### Layer 1: Data Sources & Environmental Inputs
- **Generation, Collection & Transport**: Emits raw facts at the point of origin across standard machine-readable logs (Syslog RFC 5424, JSON/NDJSON, Windows EVTX, journald, cloud audit trails), kernel hooks (eBPF, ETW), control plane APIs, and wire taps, buffering at the edge and transporting across network boundaries via secure, compressed streams.
- **Multidimensional Inputs**: Unifies standard machine-readable logs and runtime operational telemetry with external cyber threat intelligence (CTI), organizational context (asset CMDB, directory hierarchies), attack surface exposure (EASM), and security control posture.
- See full spec: [Layer 1 Specification](03-layer-1-data-sources.md).

### Layer 2: Pipeline, Storage & Query Fabric
- **Line-Rate Normalization**: Standardises raw payloads into Open Cybersecurity Schema Framework (OCSF) objects via an authoritative Schema Registry.
- **Value-Based Routing**: Diverts high-value security events to hot indexing and stream engines while streaming bulk forensic telemetry into low-cost columnar lakehouse storage.
- **Multi-Paradigm Querying**: Provides four specialized engines: Real-Time Streaming ($\lt 5\text{s}$), Scheduled Batch SQL (7–90 day baselines), Federated Query-in-Place, and ML Feature Stores.
- See full spec: [Layer 2 Specification](04-layer-2-pipeline-storage-query.md).

### Layer 3: Threat Intelligence & Detection Engineering
- **Dual-Lane Detection Ingress**: Balances a probabilistic, dependency-aware Bayesian compounding lane for correlated weak signals with a deterministic fast-path that immediately elevates zero-tolerance invariants (canary tokens, BYOVD kernel tampering) without graph delay.
- **Machine-Readable Attack Flows**: Codifies multi-stage adversary behaviours into structured graphs, prioritising detection engineering backlogs via threat likelihood and asset exposure.
- **Detection-as-Code (DaC)**: All rules are authored as declarative code using a Polyglot DaC pattern (vendor-neutral YAML metadata envelopes coupled with target-optimized query blocks, see [ADR-0019](../adr/0019-polyglot-detection-as-code-and-native-engine-adaptation.md)), versioned in Git.
- **Empirical Test Harness**: Validates rules through controlled adversary simulation, synthetic unit tests, and 30-day historical lakehouse backtesting.
- **Standardised Findings**: Emits OCSF Class 2001 (Security Finding) and Class 2004 (Detection Finding) objects.
- See full spec: [Layer 3 Specification](06-layer-3-threat-intel-detection.md).

### Layer 4: Incident Response (Investigation, Case Management & Automated Containment)
- **Progressive Disclosure Workbench**: Presents a 3-tier cognitive hierarchy (Situation Summary ➔ Forensic Evidence Table ➔ On-Demand Graph Lineage) to achieve sub-60-second analyst comprehension without visual fatigue.
- **Hierarchical Agent Mesh**: Dispatches specialized autonomous subagents (host forensic, identity, network, cloud) coordinated by a Lead Triage Orchestrator behind an isolated **Prompt Injection Firewall**, governed by asymmetric consensus arbitration.
- **Tamper-Evident Evidence Dossier**: Records queries, annotations, and artifacts with cryptographic integrity (RFC 3161 timestamps) across the **Incident Decision DAG**.
- **Monotonic Fail-Closed Containment**: Executes containment as state machines governed by **Security-State Monotonicity** (see [ADR-0005](../adr/0005-saga-pattern-containment-and-break-glass-protocol.md)), separating low-risk actions (Tier 1) from disruptive actions (Tier 2) governed by dual-authorisation consensus and an audited **Break-Glass Emergency Protocol**.
- **Closed-Loop Feedback & Green Team Prevention**: While TIDIR intentionally scopes its core engine to threat intelligence, detection, investigation, and incident response (deliberately avoiding duplicating inline prevention appliances), it completes the closed loop by programmatically recommending and triggering **Green Teams** (infrastructure, platform, and cloud security engineering). Post-incident findings, exploited misconfigurations, and lateral movement paths automatically synthesize Infrastructure-as-Code (IaC) pull requests, identity boundary tightenings, and preventative control improvements to permanently eradicate root causes and deepen enterprise defense-in-depth.
- See full spec: [Layer 4 Specification](07-layer-4-incident-response.md) and [AI & Agentic Orchestration Plane](components/06-ai-orchestration.md).

---

## 5. Data Contracts Across the Architecture

| Boundary | Schema Contract | Purpose |
| :--- | :--- | :--- |
| **L1 ➔ L2 Ingress** | Native / Schema Registry Envelope | Bounded transport batch carrying origin metadata and raw event facts. |
| **L2 Normalization** | OCSF (Open Cybersecurity Schema Framework) | Canonical schema across system, identity, network, cloud, and application domains. |
| **L3 Detection Target** | OCSF Classes (1001, 1007, 3002, 4001, etc.) & Target Dialects | Vendor-neutral governance metadata envelope with target-optimized query blocks (KQL, SPL, SQL). |
| **L3 ➔ L4 Handoff** | OCSF Class 2001 & Class 2004 Findings | Standardised security and detection findings carrying evidence, ATT&CK tags, and risk scores. |
| **L4 Agent Tool Contract** | Model Context Protocol (MCP) & Typed JSON Schema | Parameters for read-only forensic queries; strictly isolates prompts from unformatted raw telemetry. |
| **L4 Monotonic Containment** | Asymmetric Action Specifications | Parameterized forward action ($T_i$) and forward escalation payloads; strictly fail-closed with zero containment rollback. |

---

## 6. The Executive AI & Autonomous Agentic Opportunity Matrix (The CISO Lens)

For executive cybersecurity leaders (CISOs and SecOps Directors), integrating Artificial Intelligence into security operations carries dual imperatives: **maximizing defensive velocity while enforcing deterministic safety boundaries**. 

TIDIR establishes an **AI-First Defence Architecture** that moves beyond single-prompt helpers to an orchestrated agent mesh, while anchoring execution, schema contracts, and disruptive containment behind deterministic engineering gates and evals.

| Architectural Layer | Autonomous AI / Agent Opportunity | Deterministic Safety Gate | Target Engineering Property / Benchmark |
| :--- | :--- | :--- | :--- |
| **Layer 1: Data Sources & Ingress** | **Automated Log Parser Synthesis**: Generative models analyze unmapped vendor logs and draft canonical OCSF mapping parsers. | **Schema Registry Validation**: Parsers cannot deploy without passing compiler type-checking and automated regression replay. | **Target: Accelerated Ingestion**: Reduces manual parser drafting from weeks to hours, verified by automated schema test fixtures. |
| **Layer 1: Data Sources & Ingress** | **Synthetic Telemetry Generation**: Generates high-fidelity attack telemetry for dangerous, untestable techniques (e.g. ransomware encryption loops). | **Isolated Test Sandbox**: Generated telemetry executes strictly within non-production environments. | **Target: Safe Efficacy Testing**: Validates detection sensors against catastrophic exploits without running malware on live systems. |
| **Layer 2: Pipeline & Storage Fabric** | **Natural Language Data Exploration**: Translates plain-language analyst questions into optimised SQL/streaming queries. | **Read-Only AST Validator**: Enforces strict SELECT-only query constraints and compute timeout budgets. | **Target: Sub-Minute Query Turnaround**: Enables multi-table lakehouse investigations via schema-constrained query synthesis. |
| **Layer 3: Detection Engineering** | **Threat Advisory to Attack Flow Synthesis**: Ingests unstructured CTI advisories and bulletins and extracts structured ATT&CK DAG flows. | **Human CTI Peer Review**: Analyst ratifies extracted Priority Intelligence Requirements (PIRs). | **Target: Continuous Codification**: Reduces the window between zero-day public disclosure and backlog prioritization. |
| **Layer 3: Detection Engineering** | **Continuous Evals-as-Code & DaC Quality Judge**: Multi-agent judges and CI benchmark suites audit detection rules and agent prompts against golden incident datasets. | **CI/CD Unit & Regression Suite**: Rules and agent prompts must achieve 100% pass rate on synthetic fixtures and 30-day lakehouse backtests. | **Target: Bounded Noise Ratio**: Enforces alert noise error budget ($\text{FPR} \lt 5\%$) to suppress brittle rules before production. |
| **Layer 4: Investigation & Cases** | **Hierarchical Agent Mesh (Host/Identity/Network)**: Lead orchestrator dispatches specialist subagents to scope 90-day baselines, process lineages, and lateral movement simultaneously. | **Prompt Injection Firewall & Dual-Plane Isolation**: Telemetry strings are treated as untrusted data planes; agents invoke typed tools without executing raw string commands. | **Target: Single-Dossier Hydration**: Delivers a fully hydrated case dossier containing complete process lineage and host context upon ticket open. |
| **Layer 4: Incident Response (Automated Containment)** | **Pre-Execution Blast-Radius Simulator & Containment Engine**: Evaluates active network connections, service criticality, and dependency trees; executes monotonic forward containment with forward escalation on error. | **Dual-Authorisation Consensus & Audited Break-Glass**: Tier 2 containment requires multi-signature approval; high-velocity outbreaks support single-commander break-glass with cryptographic broadcast. | **Target: Zero Outages in Production**: Verified during shadow/supervised operation to prevent false-positive recommendations from isolating critical services. |

---

## 7. The Detection Engineer's Operational Walkthrough (The Practitioner Lens)

To understand how the TIDIR architecture functions in day-to-day cyber defence, consider how a **Detection Engineer** navigates the lifecycle from a novel threat advisory to a hardened, deployed detection rule:

```mermaid
flowchart LR
  %% Practitioner Steps
  classDef step fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
  classDef gate fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
  classDef prod fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;

  S1["1. Threat Advisory\n(Novel Attack Technique)"]:::step
  S2["2. Machine-Readable Flow\n(Layer 3 ATT&CK DAG)"]:::step
  S3["3. DaC Rule Authoring\n(Targets OCSF Class 1007)"]:::step
  S4["4. CI/CD Simulation Gate\n(Synthetic unit & 30d backtest)"]:::gate
  S5["5. Production Deployment\n(Streaming sub-5s & Lakehouse SQL)"]:::prod
  S6["6. Correlated Dossier\n(Risk Lens clusters findings)"]:::prod

  S1 --> S2 --> S3 --> S4 --> S5 --> S6
```

### Step-by-Step Practitioner Journey

1. **Adversary Technique Published**: A threat intelligence alert details a novel DLL Search Order Hijacking technique (*MITRE ATT&CK T1574.002*).
2. **Attack Flow Ingestion**: In **Layer 3**, the intelligence engine parses the advisory into a machine-readable attack flow detailing the prerequisite process execution events, file creations, and command-line arguments.
3. **Telemetry Verification (Layer 1)**: The Detection Engineer confirms that enterprise endpoints emit the required telemetry—verifying that Windows Event Log Channel `Microsoft-Windows-Sysmon/Operational` (Event ID 7: Image Load) and Linux eBPF module loads are actively ingested and mapped to **OCSF Class 1007 (Process Activity)**. Any non-standard fields are verified in `unmapped_data`.
4. **Declarative Rule Authoring (DaC)**: In the Detection-as-Code repository, the engineer authors a Polyglot DaC rule: defining the vendor-neutral metadata envelope targeting OCSF Class 1007 attributes, paired with target-optimized query blocks (e.g., KQL, SPL, and Lakehouse SQL) for production execution.
5. **Automated CI/CD Validation**: Upon opening a Git Pull Request:
   - *Synthetic Unit Tests*: Run mock OCSF payloads through the rule parser to verify true-positive trigger conditions and benign edge-case pass-through.
   - *30-Day Historical Backtest*: The CI pipeline queries a 30-day lakehouse sample in `pre-prod` to calculate the **Expected Alert Volume (EAV)** and ensure the false-positive rate falls within error budgets.
   - *LLM Quality Judge*: An automated harness audits the rule for schema field deprecations and ensures triage guidance is complete.
6. **Deployment & Execution (Layer 2 & 3)**: Once merged to `main`, GitOps automations deploy the rule to the **Streaming Engine** (for sub-5-second alerting on interactive sessions) and the **Lakehouse Batch Engine** (for 24-hour baseline sweeps).
7. **Risk-Lens Correlation & Incident Elevation (Layer 3 ➔ Layer 4)**: If the rule fires in production, the alert is not thrown into an unmanaged ticket queue. Layer 3's graph correlation engine links the event with network connections and user authentication events, computes the composite risk score, and elevates a structured **Incident Dossier** directly to the Tier-1 operator workbench.

