# TIDIR Target System Architecture

This document defines the target component architecture for the unified **Threat Intelligence, Detection, Investigation & Response (TIDIR)** platform.

---

## 1. System Topology Diagram

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
    L1_TELEM["Runtime Operational Telemetry\n(Kernel hooks, eBPF, audit trails, network flows & identity)"]:::layer1
    L1_CTX["Enterprise Posture & Asset Context\n(CMDB hierarchy, attack surface exposure, control status)"]:::layer1
    L1_CTI["Cyber Threat Intelligence (CTI)\n(STIX 2.1 tactical feeds, CVE weaponization, threat actors)"]:::layer1
  end

  %% Layer 2: Pipeline, Storage & Query Fabric
  subgraph L2 ["LAYER 2: PIPELINE, STORAGE & QUERY FABRIC"]
    L2_INGEST["Line-Rate Ingestion & OCSF Normalization\n(Schema registry, unmapped data catch-all & DLQ)"]:::layer2
    L2_ROUTER["Value-Based Tiering & Stream Router\n(Tier A hot stream, Tier B lakehouse, Tier C filter)"]:::layer2
    L2_STORAGE["Multi-Paradigm Storage & Query Core\n(Hot index, columnar lakehouse, hybrid state store Δt)"]:::layer2
  end

  %% Layer 3: Threat Intelligence & Detection Engineering
  subgraph L3 ["LAYER 3: THREAT INTEL & DETECTION ENGINEERING"]
    L3_FLOW["Machine-Readable Threat Models\n(Adversary attack flows, PIRs, graph mapping)"]:::layer3
    L3_DAC["Detection-as-Code (DaC) Engine\n(Stateful streaming rules, lakehouse scheduled SQL)"]:::layer3
    L3_RISK["Risk Lens & Finding Synthesis\n(Supernode-dampened graph clustering, OCSF 2001/2004)"]:::layer3
  end

  %% Layer 4: Incident Response & Automation
  subgraph L4 ["LAYER 4: INVESTIGATION, CASE MANAGEMENT & SOAR"]
    L4_DOSSIER["Unified Investigation & Case Dossier\n(Entity 360, process trees, cryptographically sealed timeline)"]:::layer4
    L4_TRIAGE["Symbiotic Operator Workbench\n(Autonomous agentic scoping, human triage console)"]:::layer4
    L4_SOAR["Blast-Radius Gated SOAR Engine\n(Pre-execution simulation, Tier 0-2 playbooks, rollback)"]:::layer4
  end

  %% Closed-Loop Architectural Feedback
  subgraph FB ["CLOSED-LOOP CONTINUOUS CALIBRATION"]
    FB_INTEL["Attributed Threat Flows & IOCs\n(Re-ingested into L1 CTI & L3 Detection Backlog)"]
    FB_GAPS["Telemetry Blindspot Telemetry\n(Re-tunes L1 Sensor Filters & Collection Audits)"]
    FB_SOAR["Playbook Execution Efficacy\n(Refines L4 Blast-Radius & Simulation Models)"]
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
    E4["Automation SRE\n(Playbooks-as-Code & Rollback)"]:::eng
    E5["AI Agent Harnesses\n(Grounding Context & LLM Judges)"]:::eng
  end

  subgraph TARGETS ["OPERATIONAL TOUCHPOINTS"]
    T_REG["Schema Registry & Ingestion DLQ\n(Layer 1 / Layer 2)"]:::target
    T_GRAPH["Threat Flow & Correlation Graphs\n(Layer 3 Intel)"]:::target
    T_ENG["Streaming & Lakehouse Engines\n(Layer 3 Detection)"]:::target
    T_SOAR["Connector Ecosystem & Safe APIs\n(Layer 4 Containment)"]:::target
    T_OPS["Symbiotic Operator Model\n(Layer 4 Investigation)"]:::target
  end

  E1 -->|Enforces Schemas| T_REG
  E2 -->|Calibrates Attack Flows| T_GRAPH
  E3 -->|Deploys Tested Rules| T_ENG
  E4 -->|Deploys Gated Playbooks| T_SOAR
  E5 -->|Supervises Triage Prompts| T_OPS
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
