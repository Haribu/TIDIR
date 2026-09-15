# Layer 3: Threat Intelligence & Detection Engineering

## 1. Overview & Architectural Role

**Layer 3 represents the cognitive and analytical core of the TIDIR architecture.** It synthesizes raw, normalized telemetry from Layer 2 with operational adversary context to identify active attacks, policy violations, and anomalous behaviors.

Rather than treating threat intelligence as a passive repository of static indicators and detection as an unmanaged collection of ad-hoc alerts, Layer 3 formalizes an **intelligence-driven, code-first engineering lifecycle**. Threat intelligence directly produces **machine-readable attack flows** that illuminate detection opportunities, which in turn drive test-driven **Detection-as-Code (DaC)** pipelines validated through automated adversary simulation and CI/CD regression suites.

```mermaid
flowchart TB
  subgraph L3_Intel ["1. Intelligence Lifecycle & Attack Flow Engine"]
    PIR["Priority Intelligence Requirements (PIRs)"]
    INTEL_PROC["Intelligence Processing & Normalization\n(Deduplication, Entity Resolution, Decay Scoring)"]
    MRIP["Machine-Readable Intelligence Products\n(Structured Attack Flows & Relationship Graphs)"]
    PIR --> INTEL_PROC --> MRIP
  end

  subgraph L3_Prioritization ["2. Detection Opportunity Prioritization"]
    OPP_ENGINE["Detection Opportunity Backlog\n(Scoring: Threat Prevalence × Asset Criticality × Feasibility)"]
    GAP_ANALYSIS["Telemetry & Visibility Gap Analysis\n(Cross-referencing L1 Sources & ATT&CK Components)"]
    MRIP --> OPP_ENGINE
    GAP_ANALYSIS --> OPP_ENGINE
  end

  subgraph L3_DaC ["3. Detection-as-Code (DaC) Lifecycle"]
    DEV["Declarative Rule Authoring\n(Vendor-Neutral DSL / OCSF Targeted)"]
    SIM["Adversary Simulation & Test Harness\n(Controlled Execution & Telemetry Recording)"]
    TEST["Unit & Regression Testing Pipeline\n(True-Positive & False-Positive Backtests)"]
    DEPLOY["Staged Automated Deployment\n(Stream Analytics & Scheduled Lakehouse Queries)"]

    OPP_ENGINE --> DEV
    DEV --> SIM
    SIM --> TEST
    TEST --> DEPLOY
  end

  subgraph L3_AI ["4. AI & Agentic Harnesses"]
    AI_INTEL["Unstructured Report to Attack Flow Synthesis"]
    AI_DAC["Natural Language to Detection Rule Drafting"]
    AI_SYNTH["Synthetic Telemetry & Edge-Case Generator"]
    AI_JUDGE["Schema & Ambiguity LLM Judge"]
  end

  AI_INTEL -.-> MRIP
  AI_DAC -.-> DEV
  AI_SYNTH -.-> TEST
  AI_JUDGE -.-> TEST

  DEPLOY ==>|Emits Normalized Findings| L4["Layer 4: Incident Response (OCSF Classes 2001 & 2004)"]
```

---

## 2. The Intelligence Lifecycle & Machine-Readable Intel Products

Threat intelligence in Layer 3 operates as a structured, closed-loop discipline rather than a passive feed consumer.

```mermaid
flowchart LR
  DIR["1. Direction\n(PIRs & Threat Modeling)"]
  COL["2. Collection\n(L1 Telemetry & Feeds)"]
  PROC["3. Processing\n(Normalization & Decay)"]
  ANALYSIS["4. Analysis\n(Actor & Campaign Modeling)"]
  PROD["5. Production\n(Machine-Readable Flows)"]
  EVAL["6. Feedback\n(Efficacy & Tuning)"]

  DIR --> COL --> PROC --> ANALYSIS --> PROD --> EVAL
  EVAL --> DIR
```

### The Six Operational Intelligence Phases
1. **Direction & Planning**: Establishes Priority Intelligence Requirements (PIRs) aligned with business risks, executive threat models, and crown jewel assets.
2. **Collection**: Ingests raw threat data from Layer 1 (technical observables, vulnerability advisories, community disclosures, internal case discoveries).
3. **Processing & Normalization**: Deduplicates overlapping claims, extracts technical observables into structured entities, applies mathematical decay curves, and resolves multi-source contradictions.
4. **Analysis**: Correlates technical observables with tactical adversary behaviors, campaign waves, and threat actor profiles.
5. **Production (Machine-Readable Attack Flows)**: Generates structured, consumable intelligence products designed for direct ingestion by automated detection pipelines.
6. **Feedback & Evaluation**: Measures whether produced intelligence successfully enabled detection, prevented compromise, or produced excessive noise, refining PIRs accordingly.

### Machine-Readable Intelligence Products (MRIPs)
Traditional threat intelligence produces static PDF reports that require human interpretation. Layer 3 mandates the production of **Machine-Readable Intelligence Products**:
- **Structured Attack Flow Definitions**: Codifies multi-step adversary attack paths into directed acyclic graphs (DAGs) representing sequential and concurrent attacker steps (e.g., *Phishing Attachment $\rightarrow$ Script Execution $\rightarrow$ Process Injection $\rightarrow$ LSASS Memory Dump $\rightarrow$ SMB Lateral Movement*).
- **Contextual Relationship Schemas**: Expresses explicit relationship edges: `ThreatActor` $\xrightarrow{\text{uses}}$ `Tool` $\xrightarrow{\text{implements}}$ `AttackPattern` $\xrightarrow{\text{targets}}$ `Vulnerability` $\xrightarrow{\text{generates}}$ `TelemetryObservable`.
- **Actionable Emulation Plans**: Machine-executable step sequences detailing specific command lines, APIs, and network behaviors required to simulate the adversary during detection validation.

---

## 3. Intel-Driven Detection Opportunity Prioritization

Rather than authoring rules reactively or attempting exhaustive coverage of hundreds of generic techniques, Layer 3 utilizes a deterministic **Detection Opportunity Engine** to prioritize engineering effort.

```mermaid
flowchart TD
  subgraph Inputs ["Prioritization Inputs"]
    FLOWS["Machine-Readable Attack Flows"]
    ASSETS["Asset & Crown Jewel Criticality (L1 Context)"]
    POSTURE["Control & Patch Posture (L1 Posture)"]
    TELEMETRY["Telemetry Availability (L1 Coverage)"]
  end

  subgraph OpportunityEngine ["Detection Opportunity Scoring Engine"]
    SCORE["Opportunity Score Calculation\n(Threat Likelihood × Impact × Detection Feasibility)"]
    BACKLOG["Prioritized Detection Backlog\n(Ranked by Defensibility ROI)"]
  end

  FLOWS --> SCORE
  ASSETS --> SCORE
  POSTURE --> SCORE
  TELEMETRY --> SCORE
  SCORE --> BACKLOG
```

### Detection Opportunity Scoring Algorithm
Each candidate detection opportunity is prioritized using a composite scoring model:

$$\text{Priority Score} = \frac{\text{Threat Likelihood} \times \text{Asset Exposure} \times \text{Impact Severity}}{\text{Engineering Complexity} \times \text{Noise Risk}}$$

- **Threat Likelihood**: Derived from active campaign tracking, exploit weaponization telemetry, and prevalence within targeted industry sectors.
- **Asset Exposure & Impact**: Evaluated against Layer 1 organizational context (e.g., whether vulnerable systems are public-facing or hold sensitive regulatory data).
- **Detection Feasibility & Telemetry Coverage**: Audits whether Layer 1 emits the required MITRE ATT&CK Data Components (e.g., process creation command lines, network flow summaries). If telemetry is absent, the system generates an upstream **Telemetry Engineering Request** for Layer 1.

---

## 4. Detection-as-Code (DaC) Lifecycle & Architecture

All detection logic in Layer 3 is developed, versioned, tested, and deployed according to strict software engineering principles: **Detection-as-Code (DaC)**.

```mermaid
flowchart LR
  subgraph GitOps ["1. Version Control (Git)"]
    REPO["Declarative Detection Repo\n• Rule Logic (OCSF Targeted)\n• Metadata & ATT&CK Tags\n• Synthetic Test Vectors\n• False-Positive Exclusions"]
  end

  subgraph CI ["2. Automated CI/CD Pipeline"]
    LINT["Schema & Syntax Linting"]
    UNIT["Synthetic Unit Testing"]
    ADVERSARY["Adversary Simulation Replay"]
    BACKTEST["Historical Volume Backtest"]
  end

  subgraph CD ["3. Staged Deployment"]
    SHADOW["Shadow Mode (Pre-Prod)\n(Evaluates live events without alerting)"]
    PROD["Production Deployment\n(Real-Time Streams & Batch Lakehouse)"]
  end

  REPO --> LINT --> UNIT --> ADVERSARY --> BACKTEST --> SHADOW --> PROD
```

### Declarative Detection Metadata Specification
Every detection rule is maintained as a structured code artifact containing five mandatory blocks:
1. **Identification & Lifecycle Metadata**: Unique UUID, rule version, author, creation/update timestamps, and operational status (`experimental`, `shadow`, `production`, `deprecated`).
2. **Threat Framework Mapping**: Mapped MITRE ATT&CK Tactics, Techniques, and Sub-techniques, along with references to triggering Attack Flow IDs.
3. **Data Requirements**: Explicit declarations of required OCSF schema classes and mandatory fields (e.g. `process.cmd_line`, `actor.user.name`).
4. **Detection Logic Expression**: Vendor-neutral declarative query expressions capable of compiling down to both streaming event filters and analytical lakehouse SQL.
5. **Operational Guidance & Triage Metadata**: Default severity, false-positive scenarios, containment playbooks, and recommended analyst triage pivots.

---

## 5. Testing Environments, Adversary Simulation & Verification

Detection rules cannot be trusted without empirical verification. Layer 3 defines an automated test harness combining synthetic validation with controlled adversary simulation.

```mermaid
flowchart TD
  subgraph TestHarness ["Automated Detection Testing Harness"]
    direction TB
    subgraph SimEngine ["1. Controlled Adversary Simulation"]
      ATOMIC["Atomic Technique Execution\n(Local endpoint & network test harnesses)"]
      RECORDER["Execution Telemetry Recorder\n(Captures exact timestamps, process IDs, and environment state)"]
      ATOMIC --> RECORDER
    end

    subgraph VerificationStages ["2. Automated Verification Stages"]
      STAGE_UNIT["Stage A: Synthetic Unit Tests\n(True-Positive Trigger Check & Benign Baseline Pass)"]
      STAGE_SIM["Stage B: Live Simulation Verification\n(Verifies that recorded simulation telemetry fires the rule)"]
      STAGE_REGRESS["Stage C: Historical Regression Backtest\n(Replays 30-day Lakehouse corpus to verify false-positive budget)"]
    end

    RECORDER --> STAGE_SIM
    STAGE_UNIT --> STAGE_SIM --> STAGE_REGRESS
  end

  STAGE_REGRESS ==>|Passes All Quality Gates| PROD_DEPLOY["Deploy to Production Runtime"]
```

### 1. Controlled Adversary Simulation
- **Atomic Execution Engines**: Automated agents execute specific, self-contained attacker techniques in isolated testing environments (`dev` and `test` tiers).
- **Strict Execution Boundaries**: Simulations run only within designated test namespaces, sandbox workloads, and non-production accounts.
- **Execution Telemetry Recording**: The test runner logs precise execution metadata: start timestamp, end timestamp, executing user context, process ID, parent process ID, and generated network connections. This serves as the ground-truth benchmark for rule verification.

### 2. Multi-Stage Testing Pipeline
- **Unit Testing (Synthetic Assertions)**: Tests the raw query logic against mock OCSF JSON fixtures. Validates that true-positive payloads trigger the rule with expected field bindings and benign edge-case payloads pass without firing.
- **Simulation Verification**: Ingests the recorded telemetry from live adversary simulations through the pipeline. Asserts that the rule successfully matches the generated telemetry within the defined SLA window (< 5 seconds for streaming rules).
- **Historical Regression Backtesting**: Replays the candidate rule against a 30-day historical lakehouse telemetry sample in the `pre-prod` environment. The pipeline calculates the **Expected Alert Volume (EAV)** and flags rules that exceed the acceptable noise threshold before deployment.

---

## 6. AI & Agentic Harnesses in Layer 3

Artificial intelligence is integrated into Layer 3 not as an unconstrained decision-maker, but as an engineering accelerator governed by deterministic evaluation gates:

```mermaid
flowchart LR
  subgraph AI_Capabilities ["AI Acceleration in Layer 3"]
    FLOW_SYNTH["1. Attack Flow Synthesizer\n(Converts unstructured CTI PDFs into structured DAGs)"]
    DAC_GEN["2. Detection Rule Copilot\n(Drafts vendor-neutral OCSF logic from Attack Flows)"]
    SYNTH_LOGS["3. Synthetic Log Generator\n(Generates rare attack telemetry for untestable exploits)"]
    LLM_JUDGE["4. Quality & Ambiguity Judge\n(Audits rules for schema compliance and logic pitfalls)"]
  end

  FLOW_SYNTH --> DAC_GEN --> SYNTH_LOGS --> LLM_JUDGE
```

1. **Attack Flow Synthesis**: Natural language processing models ingest unstructured threat intelligence publications (threat reports, blogs, advisories) and extract structured Attack Flow definitions, mapping entity relationships and temporal sequences.
2. **Detection Logic Drafting**: Converts Attack Flow requirements into initial declarative Detection-as-Code rule drafts, pre-populating OCSF field references and MITRE ATT&CK metadata for human engineering review.
3. **Synthetic Telemetry Generation**: For high-risk attack techniques that cannot be safely simulated in live test environments (e.g., ransomware encryption routines, hypervisor escape mechanisms), generative models synthesize forensically accurate OCSF event streams to validate rule logic.
4. **Automated LLM Judge**: Evaluates proposed detection rules against strict architectural standards: checking for regex performance traps, schema field deprecations, ambiguous logic boundaries, and missing triage documentation.

---

## 7. Finding Consolidation, Graph Clustering & The Risk Lens

In modern enterprise environments, a single cyber operation triggers dozens or hundreds of disparate, low-level alerts across siloed detection engines (streaming EDR rules, cloud audit logs, WAF rate limiters, network anomaly engines, scheduled lakehouse queries). Treating each alert as an independent ticket causes catastrophic alert fatigue, fragmented investigative context, and slow containment.

Layer 3 culminates in an **Alert-to-Incident Synthesis Engine** that projects a graph correlation model and composite risk lens across all inbound findings before elevating them to Layer 4.

```mermaid
flowchart TB
  subgraph IngressFindings ["1. Heterogeneous Findings Ingress"]
    direction LR
    F_STREAM["Real-Time Streaming Alerts\n(OCSF Class 2004)"]
    F_BATCH["Lakehouse Batch Detections\n(OCSF Class 2004)"]
    F_SECURITY["Vendor / Sensor Findings\n(OCSF Class 2001)"]
    F_INTEL["CTI Retro-Match Hits\n(STIX Observables)"]
  end

  subgraph GraphClustering ["2. Temporal & Entity Graph Clustering Engine"]
    PIVOT["Entity Resolution & Pivot Extraction\n(Principal ARN, IP, Host ID, User Session)"]
    GRAPH["Dynamic Correlation Graph\n(Causal links across identity & infrastructure)"]
    WINDOW["Temporal Sliding Window (Δt)\n(Grouping related stages of an attack chain)"]
    
    PIVOT --> GRAPH
    WINDOW --> GRAPH
  end

  subgraph RiskLens ["3. The Multi-Dimensional Risk Lens"]
    direction TB
    RL_ASSET["Asset & Crown Jewel Criticality\n(Production DB vs. Dev Pod)"]
    RL_CTI["CTI Priority Alignment\n(PIR-tagged threat actor campaigns)"]
    RL_STAGE["ATT&CK Progression Compounding\n(Recon ➔ Cred Access ➔ Exfil)"]
    RL_SCORE["Composite Risk Scoring Algorithm\n(Suppression threshold vs. Promotion)"]

    RL_ASSET --> RL_SCORE
    RL_CTI --> RL_SCORE
    RL_STAGE --> RL_SCORE
  end

  subgraph PromotionDecision ["4. Case Promotion & Triage Filter"]
    NOISE["Suppressed / Deduplicated Cluster\n(Logged to Lakehouse for audit/replay)"]
    CASE_PROMOTED["Elevated Incident Dossier\n(OCSF Incident Case)"]
  end

  IngressFindings --> PIVOT
  GRAPH --> RiskLens
  RL_SCORE -->|Risk Score < Threshold| NOISE
  RL_SCORE -->|Risk Score >= Critical Threshold| CASE_PROMOTED

  CASE_PROMOTED ==>|Prioritized Dispatch| L4_ENG["Layer 4: Incident Response & Case Management\n(Agentic & Human Operator Investigation)"]
```

### 1. Entity-Centric Graph Clustering
Rather than analyzing alerts in isolation, the graph correlation engine continuously extracts identity and infrastructure pivots from every normalized OCSF finding:
- **Identity Pivots**: `actor.user.name`, `actor.user.uid`, `src_endpoint.ip`, `cloud.account.uid`, `iam.role_arn`.
- **Infrastructure Pivots**: `device.hostname`, `device.uid`, `process.file.hash`, `process.parent_process.guid`, `container.id`.
- **Temporal Windows**: Events occurring within sliding correlation windows ($\Delta t = 15\text{m} \dots 2\text{h}$) referencing overlapping pivots are dynamically stitched into a unified Directed Acyclic Graph (DAG). This reconstructs the adversary's lateral traversal across network boundaries and identity roles.

### 2. The Composite Risk Lens
Static alert severities (e.g., standard "Medium" or "High" labels) are fundamentally inadequate for prioritization. Layer 3 evaluates each clustered graph through a composite mathematical risk function:

$$\text{Cluster Risk} = \left( \sum_{i \in \text{Findings}} \text{Confidence}_i \times \text{ATT\&CK Weight}_i \right) \times \text{Asset Multiplier} \times \text{PIR Priority}$$

- **ATT&CK Progression Multiplier**: A standalone brute-force event yields a low progression weight. However, when the cluster links **Initial Access (T1078)** $\rightarrow$ **Privilege Escalation (T1068)** $\rightarrow$ **Defense Evasion (T1562)** within 20 minutes, the progression factor compounds exponentially.
- **Asset Criticality Weighting (Layer 1 Context)**: Findings occurring on internet-facing core transactional databases or tier-0 identity infrastructure (Domain Controllers / Cloud IdP admins) carry a maximal risk multiplier, while findings on isolated testing nodes are scored lower.
- **PIR Priority Alignment (CTI Context)**: If observables in the cluster match an active Priority Intelligence Requirement (e.g., a known ransomware syndicate targeting the organization's specific sector), the cluster is prioritized above baseline threshold scores.

### 3. Noise Suppression & Intelligent De-duplication
- **Volumetric Consolidation**: Hundreds of individual endpoint or network flow events triggered during a port sweep, password spray, or port scan are collapsed into a single multi-event finding cluster.
- **Benign Baseline Suppression**: Graph clusters whose total risk score falls below the operational activation threshold are suppressed from real-time alert queues, preventing analyst burnout while preserving the complete graph record in the Layer 2 lakehouse for retrospective auditing.

### 4. Handoff to Layer 4: The Elevated Incident Dossier
When a cluster crosses the critical composite risk threshold, Layer 3 does not forward a raw list of alert notifications. It compiles a rich **Incident Dossier**:
- **Consolidated Entity Graph**: Pre-mapped relationships between users, assets, processes, and remote IPs.
- **Chronological Attack Timeline**: Formatted sequence of observed attacker milestones tagged with MITRE ATT&CK techniques.
- **Automated Triage Summary**: Pre-computed blast-radius assessment and recommended response playbooks.
- **Actionable Assignment**: Dispatched directly to Layer 4 investigation workbenches for coordinated **human and agentic operator execution**.
