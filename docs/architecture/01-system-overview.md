# TIDIR Target System Architecture

This document defines the target component architecture for the unified **Threat Intelligence, Detection, Investigation & Response (TIDIR)** platform.

---

## 1. System Topology Diagram

The architecture operates across two orthogonal dimensions:
1. **The Operational Runtime Plane**: Four horizontal layers governing event ingestion, computation, detection, and mitigation.
2. **The Engineering Lifecycle Plane**: Five vertical disciplines governing schemas, intelligence curation, Detection-as-Code (DaC), systems automation, and AI harnesses.

```mermaid
flowchart TB
  %% Class Definitions for Visual Hierarchy & Styling
  classDef source fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
  classDef fabric fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
  classDef detection fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
  classDef response fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
  classDef engineering fill:#3b0764,stroke:#f472b6,stroke-width:2px,color:#f8fafc,stroke-dasharray: 4 4;
  classDef gate fill:#451a03,stroke:#fbbf24,stroke-width:2px,color:#f8fafc;

  %% Layer 1: Sources & Environmental Inputs
  subgraph L1 ["Layer 1: Data Sources & Environmental Inputs"]
    direction TB
    S_HOST["Host & Workload Telemetry\n(Process Trees, File, Memory, eBPF)"]:::source
    S_NET["Network & Perimeter Telemetry\n(Flow Summaries, DNS, TLS Handshakes)"]:::source
    S_IAM["Identity & Access Telemetry\n(Auth Sessions, Token Grants, MFA)"]:::source
    S_CLOUD["Cloud Control Plane Telemetry\n(Management APIs, IAM Mutations)"]:::source
    S_INTEL["External Threat Intelligence\n(Tactical Observables, Attack Flows)"]:::source
    S_CONTEXT["Organizational & Posture Context\n(Asset CMDB, EASM, Control Status)"]:::source
  end

  %% Layer 2: Pipeline, Storage & Query Fabric
  subgraph L2 ["Layer 2: Pipeline, Storage & Query Fabric"]
    direction TB
    P_BUS["Distributed Streaming Buffer\n(Partitioned Ingestion Log)"]:::fabric
    P_NORM["Line-Rate Normalizer & Validator\n(Schema Registry / OCSF Enforcement)"]:::fabric
    P_ROUTE{"Value-Based Router\n& Data Forking Engine"}:::gate
    
    subgraph Storage ["Tiered Storage Plane"]
      STORE_HOT["Hot Analytical Index\n(15-30 Days Sub-second Search)"]:::fabric
      STORE_LAKE["Security Data Lakehouse\n(Open Columnar Table Format)"]:::fabric
      STORE_COLD["Cold Compliance Archive\n(Long-Term Immutable Object Store)"]:::fabric
    end

    subgraph Engines ["Multi-Paradigm Query Engines"]
      ENG_STREAM["Real-Time Stream Engine\n(Sliding Windows, Latency < 5s)"]:::fabric
      ENG_BATCH["Scheduled Batch Engine\n(Historical Outlier Baselines, SQL)"]:::fabric
      ENG_FED["Federated Query Engine\n(Query-in-Place across Remote Clouds)"]:::fabric
      ENG_ML["ML & Anomaly Engine\n(Feature Store & Embedding Models)"]:::fabric
    end
  end

  %% Layer 3: Threat Intelligence & Detection Engineering
  subgraph L3 ["Layer 3: Threat Intelligence & Detection Engineering"]
    direction TB
    I_FLOW["Machine-Readable Attack Flows\n(Curated Sequential Adversary Paths)"]:::detection
    D_OPP["Detection Opportunity Engine\n(Prioritizing Backlog via ROI Scoring)"]:::detection
    D_DAC["Detection-as-Code (DaC) Engine\n(Declarative Rules targeting OCSF)"]:::detection
    D_SIM["Adversary Simulation Harness\n(Controlled Atomic Execution & Verification)"]:::detection
    D_FINDINGS["Standardized OCSF Findings\n(Class 2001 Security & Class 2004 Detection)"]:::detection
  end

  %% Layer 4: Incident Response & Automation
  subgraph L4 ["Layer 4: Incident Response (Investigation, Cases & SOAR)"]
    direction TB
    IR_QUEUE["Triage & Prioritization Queue"]:::response
    IR_GRAPH["Entity Graph & Timeline Engine\n(Process Lineage, Identity Pivots)"]:::response
    IR_CASE["Case Dossier & Evidence Locker\n(Tamper-Evident Chain of Custody)"]:::response
    IR_SOAR["Declarative SOAR Playbook Engine\n(Automated Workflow Execution)"]:::response
    IR_GATE{"Blast-Radius Policy Gate\n(Risk Tier Evaluation)"}:::gate
    IR_AUTO["Tier 1: Autonomous Containment\n(Sandbox Quarantine, Session Invalidate)"]:::response
    IR_MANUAL["Tier 2: Gated Containment\n(Production Isolation, Tenant Lockout)"]:::response
  end

  %% Cross-Cutting Engineering Plane
  subgraph L_ENG ["Cross-Cutting Engineering Lifecycle & AI Harnesses"]
    direction LR
    E_DATA["Data Engineering\n(Schema Evolution & Compaction)"]:::engineering
    E_INTEL["Intelligence Engineering\n(Decay Tuning & Graph Models)"]:::engineering
    E_DET["Detection Engineering\n(Synthetic CI/CD & Backtesting)"]:::engineering
    E_AUTO["Systems SRE\n(Playbook-as-Code & Availability)"]:::engineering
    E_AI["AI & Agentic Harnesses\n(Context Redaction, Triage Agents, Evals)"]:::engineering
  end

  %% Ingress Connections
  S_HOST --> P_BUS
  S_NET --> P_BUS
  S_IAM --> P_BUS
  S_CLOUD --> P_BUS
  S_INTEL --> P_BUS
  S_CONTEXT --> P_BUS

  %% Layer 2 Internal Wiring
  P_BUS --> P_NORM
  P_NORM --> P_ROUTE
  P_ROUTE -->|High-Fidelity Streams| ENG_STREAM
  P_ROUTE -->|Recent High-Pivot Telemetry| STORE_HOT
  P_ROUTE -->|Bulk Forensic Telemetry| STORE_LAKE
  P_ROUTE -->|Feature Vectors| ENG_ML
  STORE_LAKE --> STORE_COLD

  STORE_LAKE <--> ENG_BATCH
  STORE_HOT <--> ENG_FED
  STORE_LAKE <--> ENG_FED

  %% Layer 3 Interactions
  S_INTEL -.->|Feeds TTPs| I_FLOW
  I_FLOW --> D_OPP
  D_OPP --> D_DAC
  D_DAC --> D_SIM
  D_SIM -.->|Deploys to| ENG_STREAM
  D_SIM -.->|Deploys to| ENG_BATCH

  ENG_STREAM --> D_FINDINGS
  ENG_BATCH --> D_FINDINGS

  %% Layer 4 Interactions
  D_FINDINGS ==>|Emits OCSF Findings| IR_QUEUE
  IR_QUEUE --> IR_GRAPH
  STORE_HOT -.->|Deep Telemetry Query| IR_GRAPH
  IR_GRAPH --> IR_CASE
  IR_CASE --> IR_SOAR
  IR_SOAR --> IR_GATE
  IR_GATE -->|Low Risk Pre-Approved| IR_AUTO
  IR_GATE -->|High Impact Sign-off| IR_MANUAL

  %% Closed-Loop Feedback
  IR_CASE -.->|Discovered Indicators & Attributions| S_INTEL
  IR_CASE -.->|False-Positive Calibration Feedback| D_DAC

  %% Engineering Plane Intersections
  L_ENG -.- L1
  L_ENG -.- L2
  L_ENG -.- L3
  L_ENG -.- L4
```

---

## 2. Layer Definitions & Operational Responsibilities

### Layer 1: Data Sources & Environmental Inputs
- **Generation, Collection & Transport**: Emits raw facts at the point of origin (kernel hooks, control plane APIs, wire taps), buffers at the edge, and transports across network boundaries via secure, compressed streams.
- **Multidimensional Inputs**: Unifies runtime operational telemetry with external cyber threat intelligence (CTI), organizational context (asset CMDB, directory hierarchies), attack surface exposure (EASM), and security control posture.
- See full spec: [Layer 1 Specification](03-layer-1-data-sources.md).

### Layer 2: Pipeline, Storage & Query Fabric
- **Line-Rate Normalization**: Standardizes raw payloads into Open Cybersecurity Schema Framework (OCSF) objects via an authoritative Schema Registry.
- **Value-Based Routing**: Diverts high-value security events to hot indexing and stream engines while streaming bulk forensic telemetry into low-cost columnar lakehouse storage.
- **Multi-Paradigm Querying**: Provides four specialized engines: Real-Time Streaming (< 5s), Scheduled Batch SQL (7–90 day baselines), Federated Query-in-Place, and ML Feature Stores.
- See full spec: [Layer 2 Specification](04-layer-2-pipeline-storage-query.md).

### Layer 3: Threat Intelligence & Detection Engineering
- **Machine-Readable Attack Flows**: Codifies multi-stage adversary behaviors into structured graphs, prioritizing detection engineering backlogs via threat likelihood and asset exposure.
- **Detection-as-Code (DaC)**: All rules are authored as declarative vendor-neutral code targeting OCSF schema classes, versioned in Git.
- **Empirical Test Harness**: Validates rules through controlled adversary simulation, synthetic unit tests, and 30-day historical lakehouse backtesting.
- **Standardized Findings**: Emits OCSF Class 2001 (Security Finding) and Class 2004 (Detection Finding) objects.
- See full spec: [Layer 3 Specification](06-layer-3-threat-intel-detection.md).

### Layer 4: Incident Response (Investigation, Case Management & SOAR)
- **Entity Resolution & Interactive Graph**: Synthesizes parent-child process trees, identity pivots, and chronological event timelines from Layer 2 storage.
- **Tamper-Evident Evidence Dossier**: Records queries, annotations, and artifacts with cryptographic integrity for post-incident review (PIR).
- **Blast-Radius Gated SOAR**: Separates autonomous low-risk containment (Tier 1) from disruptive actions (Tier 2) requiring signed human-in-the-loop authorization.
- **Closed-Loop Feedback**: Directly feeds novel IOCs discovered during triage back into Layer 1/3 threat intelligence and rule calibration.
- See full spec: [Layer 4 Specification](components/05-response-automation.md).

---

## 3. Data Contracts Across the Architecture

| Boundary | Schema Contract | Purpose |
| :--- | :--- | :--- |
| **L1 ➔ L2 Ingress** | Native / Schema Registry Envelope | Bounded transport batch carrying origin metadata and raw event facts. |
| **L2 Normalization** | OCSF (Open Cybersecurity Schema Framework) | Canonical schema across system, identity, network, cloud, and application domains. |
| **L3 Detection Target** | OCSF Classes (1001, 1007, 3002, 4001, etc.) | Vendor-neutral detection logic decoupled from physical database columns. |
| **L3 ➔ L4 Handoff** | OCSF Class 2001 & Class 2004 Findings | Standardized security and detection findings carrying evidence, ATT&CK tags, and risk scores. |
| **L4 Containment** | Declarative Action Specifications | Parameterized containment payloads executed against third-party API connectors. |
