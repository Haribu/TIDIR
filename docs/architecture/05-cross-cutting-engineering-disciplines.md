# Cross-Cutting Engineering Disciplines & AI Harnesses

## 1. Overview: The Dual-Plane Architecture

A complete security architecture must account for two orthogonal planes of reality:

1. **The Operational Runtime Plane**: The horizontal flow of data as events occur across the enterprise:
   > **Layer 1 (Data Sources)** ➔ **Layer 2 (Pipeline & Storage)** ➔ **Layer 3 (Intel & Detection)** ➔ **Layer 4 (Incident Response)**
2. **The Engineering Lifecycle Plane**: The vertical cross-cutting engineering disciplines that author, test, version, deploy, evaluate, and maintain the platform itself.

Without the Engineering Lifecycle Plane, security architectures devolve into brittle collections of static rules, unmaintained scripts, and uncalibrated models.

```mermaid
flowchart TB
  subgraph RUNTIME ["Operational Runtime Plane (Event Execution Flow)"]
    direction LR
    L1["<b>Layer 1</b><br>Data Sources"]
    L2["<b>Layer 2</b><br>Pipeline & Storage"]
    L3["<b>Layer 3</b><br>Intel & Detection"]
    L4["<b>Layer 4</b><br>Incident Response"]
    L1 --> L2 --> L3 --> L4
  end

  subgraph GOVERNANCE ["Engineering Lifecycle Plane (System Governance & AI Harnesses)"]
    direction TB
    subgraph COL1 ["Data & Threat Intelligence Disciplines"]
      direction TB
      DE["<b>1. Data Engineering</b><br>• Schema Registry & Contracts<br>• Partition & Compaction<br>• Chaos Backpressure Tests"]
      IE["<b>2. Intelligence Engineering</b><br>• Confidence Decay Tuning<br>• Knowledge Graph Models<br>• Source Reliability Audits"]
    end
    subgraph COL2 ["Detection, Response & Agentic Disciplines"]
      direction TB
      DetE["<b>3. Detection Engineering (DaC)</b><br>• Declarative Rule Authoring<br>• CI/CD Synthetic Replay<br>• SRE Noise Error Budgets"]
      AE["<b>4. Automation & Systems (SRE)</b><br>• Playbook-as-Code SDKs<br>• Blast-Radius Simulation<br>• Saga Compensating Rollbacks"]
      AIH["<b>5. AI & Agentic Harnesses</b><br>• Prompt Injection Firewall<br>• Multi-Model Consensus<br>• Assertion-First Evals-as-Code"]
    end
  end

  DE -.->|Ingestion & Schemas| L1
  DE -.->|Lakehouse Compaction| L2
  IE -.->|Threat Feeds & PIRs| L1
  IE -.->|Graph Context| L3
  DetE -.->|Lakehouse Queries| L2
  DetE -.->|Detection Rules| L3
  AE -.->|Saga Containment| L4
  AIH ==>|Supervises Entire Runtime| RUNTIME
```

### 1.1 The "Run-Watch-Adapt" Operating Paradigm

To operationalise the five engineering disciplines without organisational friction, TIDIR aligns with the modern **Run-Watch-Adapt** division of responsibilities:

* **Run (Platform SRE & Data Engineering)**: Maintains pipeline uptime, consumer group lag, Schema Registry enforcement, lakehouse compaction, and downstream API connector health across Layers 1 and 2.
* **Watch (Incident Responders & Triage Analysts)**: Monitors incoming risk-scored dossiers, supervises autonomous agent findings, executes investigative pivots, and ratifies Tier 2 containment actions in Layer 4.
* **Adapt (Detection & Intelligence Engineers)**: Translates threat intelligence into machine-readable attack flows, authors declarative DaC rules, operates continuous purple team adversary emulations, and tunes detection thresholds in Layer 3.

---

## 2. The Five Engineering Disciplines

### Discipline 1: Data Engineering
Data Engineering owns the reliability, throughput, schema validity, and cost-efficiency of data movement across Layers 1 and 2.

```mermaid
flowchart LR
  subgraph DE_Workflow ["Data Engineering Lifecycle"]
    CONTRACT["Schema Contract Definition\n(Declarative Schema Registry)"]
    SYNTH_LOAD["Synthetic Ingestion Load Testing\n(Validating backpressure & buffer limits)"]
    COMPACTION["Lakehouse Partition Maintenance\n(Compacting small files, pruning metadata)"]
    COST_TIER["Storage Lifecycle Automation\n(Hot Index ➔ Columnar Lakehouse ➔ Cold Archive)"]
  end

  CONTRACT --> SYNTH_LOAD
  SYNTH_LOAD --> COMPACTION
  COMPACTION --> COST_TIER
```

- **Schema Contract Management**: Governs changes to the Schema Registry. Enforces backward and forward compatibility checks to prevent upstream sensor changes or parser updates from corrupting downstream datasets.
- **Lakehouse Compaction & Partition Maintenance**: Continuously merges small streaming micro-batches into optimal columnar file sizes, rewrites partition manifests, and purges expired snapshots to maintain sub-second query performance over petabyte corpora.
- **Resilience & Chaos Engineering**: Injects synthetic event spikes, consumer lag, and network partitions into ingestion buffers to prove that edge spooling and backpressure throttling function without dropping forensic events.
- **Storage Lifecycle Orchestration**: Implements automated movement policies based on data age and access frequency (Hot Index $\rightarrow$ Columnar Lakehouse $\rightarrow$ Cold Archive).

---

### Discipline 2: Intelligence Engineering
Intelligence Engineering curates, validates, scores, and models adversary data into structured, actionable intelligence.

```mermaid
flowchart LR
  subgraph IE_Workflow ["Intelligence Engineering Lifecycle"]
    SOURCE_EVAL["Source Fidelity Auditing\n(Signal-to-noise scoring per feed)"]
    DECAY_CALIB["Decay Curve Calibration\n(Half-life formulas per indicator type)"]
    GRAPH_MODEL["Adversary Knowledge Graphing\n(Actor ➔ Campaign ➔ TTP ➔ Infrastructure)"]
    SWEEP_ORCH["Retroactive Sweep Orchestration\n(Targeted historical lakehouse queries)"]
  end

  SOURCE_EVAL --> DECAY_CALIB
  DECAY_CALIB --> GRAPH_MODEL
  GRAPH_MODEL --> SWEEP_ORCH
```

- **Indicator Scoring & Decay Modelling**: Engineers and tunes mathematical decay curves based on observable volatility:
  $$\text{Score}(t) = \text{InitialScore} \times e^{-\lambda t}$$
  Calibrates $\lambda$ so dynamic IP addresses decay within hours, while bespoke malware binary hashes remain active indefinitely.
- **Adversary Graph Modelling**: Curates relationship ontologies connecting threat actors, campaign waves, specific TTPs, and tactical infrastructure.
- **Source Fidelity & Disinformation Auditing**: Continuously measures true-positive discovery rates across external feeds, penalizing or decommissioning sources that generate false alarms or stale indicators.
- **Retroactive Sweep Orchestration**: Converts newly discovered zero-day intelligence into targeted historical queries executed automatically against lakehouse storage.

---

### Discipline 3: Detection Engineering (Detection-as-Code)
Detection Engineering treats threat logic as version-controlled, test-driven software, eliminating manual, unverified rule creation in production consoles.

```mermaid
flowchart LR
  subgraph DaC_Pipeline ["Detection-as-Code (DaC) & Purple Team Pipeline"]
    AUTHOR["Rule Authoring\n(Declarative DSL / Sigma)"]
    LINT["Schema Linting\n(OCSF Registry Check)"]
    UNIT_TEST["Synthetic Testing\n(Mock Payload Verification)"]
    PURPLE["Automated Purple Team\n(Atomic Adversary Emulation)"]
    REGRESSION["Historical Backtest\n(30d Lakehouse Replay)"]
    DEPLOY["Target Deployment\n(Stream Rules & Batch SQL)"]
  end

  AUTHOR --> LINT
  LINT --> UNIT_TEST
  UNIT_TEST --> PURPLE
  PURPLE --> REGRESSION
  REGRESSION --> DEPLOY
```

- **Declarative Rule Authoring**: Rules are written in standardised, vendor-neutral formats against normalized OCSF classes rather than proprietary log fields.
- **Continuous Automated Purple Teaming**: Beyond static unit tests, candidate rules are evaluated against an active adversary emulation harness in pre-production:
  - *Atomic Adversary Emulation*: The CI/CD runner automatically executes non-destructive adversary techniques (e.g. simulated token theft or DLL search order hijacking).
  - *End-to-End Latency Verification*: Asserts that sensor hooks emit the event (Layer 1), normalization preserves required attributes (Layer 2), stream detection triggers within SLA (Layer 3), and autonomous agent scoping activates (Layer 4).
- **Automated CI/CD Validation & Historical Replay**:
  - *Schema Linting*: Verifies that field names and types conform to the authoritative schema registry.
  - *Historical Volume Simulation*: Queries a 30-day historical lakehouse sample in pre-prod to calculate the Expected Alert Volume (EAV) and reject rules that exceed noise error budgets.
- **Coverage & Blind-Spot Analysis**: Continuously maps active detection rules against MITRE ATT&CK data components and adversary techniques to expose coverage gaps across specific environments.

---

### Discipline 4: Automation & Systems Engineering
Automation and Systems Engineering maintains the reliability, execution guarantees, and safety policies of the platform's active workflows.

```mermaid
flowchart LR
  subgraph AE_Workflow ["Automation & SRE Lifecycle"]
    PLAYBOOK["Playbook-as-Code Authoring\n(Bidirectional Sagas with compensating actions)"]
    BLAST_GATE["Blast-Radius & Break-Glass Policy\n(Automated vs. gated vs. emergency overrides)"]
    CONNECTOR["Connector SDK & Circuit Breakers\n(Token lifecycles, exponential backoff, rate limits)"]
    PLATFORM_SRE["Platform SRE & Telemetry Health\n(SLO tracking, compensation parity, failure reconciliation)"]
  end

  PLAYBOOK --> BLAST_GATE
  BLAST_GATE --> CONNECTOR
  CONNECTOR --> PLATFORM_SRE
```

- **Saga-Pattern Playbook Orchestration**: Response and investigation workflows are authored as distributed Sagas. Every mutating action ($T_i$) specifies a deterministic compensating transaction ($C_i$). If a multi-step containment fails midway due to API timeouts or rate limits, compensating actions execute in reverse order to eliminate half-contained states.
- **Blast-Radius Modelling & Break-Glass Overrides**: Defines the boundary between autonomous containment (Tier 1: low-risk actions like workstation file quarantine) and gated containment (Tier 2: high-disruption actions like domain controller network isolation requiring multi-signature sign-off). High-velocity catastrophic threats (e.g. ransomware propagation) provide an audited **Break-Glass Emergency Protocol** permitting single-commander authorisation with out-of-band cryptographic audit broadcast.
- **Connector Circuit Breakers & API Health**: Standardises downstream integration connectors with automated circuit breakers, decoupling rate limits and preventing cascading failures across security infrastructure.
- **Platform SRE & Telemetry Health**: Monitors ingestion lag, pipeline consumer offsets, query P95 latencies, compensation parity, and end-to-end time-to-detect (TTD) metrics.

---

### Discipline 5: AI & Agentic Harnesses
AI and Agentic Harnesses introduce autonomous reasoning and acceleration across the platform, governed by strict evaluation, cognitive isolation, and execution guardrails.

```mermaid
flowchart TB
  subgraph AI_Harness ["AI & Agentic Harness Architecture"]
    direction TB
    subgraph ContextEngine ["1. defensive Ingestion & Context Assembly"]
      FIREWALL["Prompt Injection Firewall\n(Dual-plane data vs. control separation)"]
      GATHER["Entity Aggregator\n(Pulls CMDB, auth history, active alerts)"]
      REDACT["Deterministic Privacy Redaction\n(Masks PII, keys, customer data)"]
    end

    subgraph AgentRuntime ["2. Hierarchical Agent Mesh Runtime"]
      ORCH["Lead Triage Orchestrator\n(Synthesizes findings, manages hypotheses)"]
      SUB_HOST["Host Forensic Subagent"]
      SUB_ID["Identity & Auth Subagent"]
      SUB_NET["Network & Cloud Subagent"]
      TOOLS["Strict Typed Tool Contracts\n(Read-only telemetry queries)"]
    end

    subgraph EvalHarness ["3. Evals-as-Code CI/CD Harness"]
      BENCH["Golden Incident Benchmark Dataset\n(Known ground-truth attacks & benign baselines)"]
      JUDGE["Assertion-First & LLM Judges\n(Grounding fidelity >= 95%, tool schema validity 100%)"]
    end

    ContextEngine --> AgentRuntime
    AgentRuntime --> EvalHarness
    ORCH --> SUB_HOST
    ORCH --> SUB_ID
    ORCH --> SUB_NET
    SUB_HOST --> TOOLS
    SUB_ID --> TOOLS
    SUB_NET --> TOOLS
  end
```

- **defensive AI Runtime & Prompt Injection Firewall**:
  - Implements **Dual-Plane Isolation**: untrusted telemetry payloads (command lines, file contents, raw logs, external CTI text) remain strictly within the data plane as typed JSON structures.
  - Controls, instructions, and tools operate exclusively in the privileged control plane. Prompts never execute instructions contained inside data fields.
  - Dynamically retrieves necessary entity state, historical alert patterns, and relevant threat actor context with deterministic privacy redaction.
- **Hierarchical Agent Mesh Runtime**:
  - Replaces monolithic point-prompts with an orchestrated agent hierarchy: a Lead Triage Orchestrator coordinates specialized subagents (Host Forensic, Identity & Auth, Network & Cloud) to investigate multi-vector threats concurrently.
  - Enforces typed, deterministic tool interfaces (e.g. `query_telemetry`, `lookup_ioc`, `reconstruct_process_tree`). Autonomous agents operate strictly in read-only analysis mode (Tier 0).
- **Continuous Evals-as-Code Framework**:
  - Prompts, agent guidelines, and tool schemas are maintained in version-controlled repositories tested on every Git pull request.
  - Evaluates candidate agent configurations against versioned "golden incident datasets" using deterministic assertions and structured evaluation judges, ensuring $\ge 95\%$ grounding fidelity and strict latency and token budget adherence.

---

## 3. Environmental Tiering & Safe Simulation

To support continuous engineering across all disciplines, the architecture mandates four distinct operational environments:

| Environment Tier | Operational Purpose | Ingestion & Telemetry Scope | Storage & Alert Isolation |
| :--- | :--- | :--- | :--- |
| **Development (`dev`)** | Authoring new parsers, detection rules, and connector scripts. | Synthetic telemetry generators; test event replays. | Ephemeral local containers; isolated mock queues. |
| **Test / Simulation (`test`)** | Automated CI/CD regression testing, unit testing, and parser fuzzing. | Curated test corpora representing both benign activity and multi-stage attack scenarios. | Dedicated test lakehouse prefix; zero production alerts emitted. |
| **Pre-Production (`pre-prod`)** | Full-scale simulation and backtesting against sanitized production data. | Mirror of production telemetry streams; sanitized PII. | Parallel lakehouse tables; shadow detection execution to measure alert volume before deployment. |
| **Production (`prod`)** | Active 24/7 security monitoring, threat detection, and incident response. | Live enterprise-wide telemetry, authoritative context, and external threat feeds. | Production Hot Index, Lakehouse, and Case Management queues. |

### The Historical Replay Sandbox
A key capability enabled by the Lakehouse tier (Layer 2) is the ability for Detection Engineers to **replay historical telemetry through candidate rules in Pre-Production**. By feeding 30 days of actual production events through a new rule in an isolated test harness, engineers measure exact true-positive vs. false-positive ratios before the rule ever touches production alert queues.
