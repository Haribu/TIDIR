# TIDIR Target System Architecture

This document defines the high-level target component architecture for the unified Threat Intelligence, Detection, Investigation & Response (TIDIR) platform.

---

## 1. System Topology Diagram

```mermaid
flowchart TB
  %% External Ingestion & Sources
  subgraph Sources ["1. Telemetry & Intelligence Sources"]
    EP["Endpoint Telemetry\n(EDR / OSQuery / Sysmon)"]
    CLD["Cloud & SaaS Logs\n(AWS CloudTrail / Azure / GCP / M365)"]
    ID["Identity & Access\n(Okta / Entra ID / IAM)"]
    NET["Network & Perimeter\n(NDR / Firewalls / DNS / Zeek)"]
    EXT_FEEDS["External CTI Feeds\n(STIX/TAXII, MISP, ISACs)"]
  end

  %% Ingestion & Normalization Layer
  subgraph DataFabric ["2. Data Fabric & Normalization Layer"]
    COLLECT["Ingestion Collector / Edge Forwarders"]
    STREAM["Distributed Event Stream\n(Kafka / Redpanda)"]
    NORM["Schema Normalizer\n(OCSF / ECS Mapping Engine)"]
    HOT_STORE["Hot Search & Analytics Index\n(OpenSearch / Quickwit)"]
    LAKE_STORE["Security Data Lakehouse\n(Parquet / Apache Iceberg / S3)"]
  end

  %% Threat Intelligence Platform
  subgraph CTI ["3. Cyber Threat Intelligence (CTI) Platform"]
    TIP["TIP Ingestion & Normalization\n(De-duplication & Scoring)"]
    IOC_STORE["Active Indicator Store\n(Low-latency Redis / Key-Value)"]
    TTP_STORE["Adversary & Campaign Graph\n(MITRE ATT&CK / Threat Actors)"]
  end

  %% Detection Engineering Layer
  subgraph Detection ["4. Detection Engine"]
    STREAM_DET["Streaming Detection Engine\n(Flink / Faust / Real-time Rules)"]
    SCHEDULED_DET["Scheduled Lakehouse Analytics\n(Trino / DuckDB / Sigma-to-SQL)"]
    CORRELATION["Multi-Signal Alert Correlation\n& Risk Scoring Engine"]
    DAC["Detection-as-Code (GitOps)\n(Versioned Rules, CI/CD, Unit Tests)"]
  end

  %% Investigation & Workbench Layer
  subgraph Investigation ["5. Investigation & Case Management"]
    ALERT_QUEUE["Triage & Deduplication Queue"]
    ENTITY_GRAPH["Entity Graph & Timeline Engine\n(Process Trees, Auth Chains, IP Pivots)"]
    CASE_MGMT["Case Management & Evidence Store"]
    ANALYST_UI["Unified SecOps Analyst Workbench"]
  end

  %% Response & Automation Layer
  subgraph Response ["6. Response & Orchestration (SOAR)"]
    SOAR["Playbook & Workflow Engine\n(BPMN / Code Workflows)"]
    GATES{"Blast Radius Gate\n& Analyst Sign-off"}
    AUTO_ACT["Automated Safe Actions\n(Quarantine File, Block IP, Step-up MFA)"]
    MANUAL_ACT["Controlled Response Actions\n(Revoke Identity, Network Isolation)"]
  end

  %% Wiring Connections
  EP --> COLLECT
  CLD --> COLLECT
  ID --> COLLECT
  NET --> COLLECT
  COLLECT --> STREAM
  STREAM --> NORM
  NORM --> STREAM_DET
  NORM --> HOT_STORE
  NORM --> LAKE_STORE

  EXT_FEEDS --> TIP
  TIP --> IOC_STORE
  TIP --> TTP_STORE

  IOC_STORE -.->|Streaming IOC Match| STREAM_DET
  TTP_STORE -.->|Context Enrichment| CORRELATION

  STREAM_DET --> CORRELATION
  SCHEDULED_DET --> CORRELATION
  LAKE_STORE --> SCHEDULED_DET
  DAC -.->|Rule Deployments| STREAM_DET
  DAC -.->|Rule Deployments| SCHEDULED_DET

  CORRELATION --> ALERT_QUEUE
  ALERT_QUEUE --> ENTITY_GRAPH
  HOT_STORE -.->|Telemetry Deep Dive| ENTITY_GRAPH
  ENTITY_GRAPH --> CASE_MGMT
  CASE_MGMT <--> ANALYST_UI

  CASE_MGMT --> SOAR
  SOAR --> GATES
  GATES -->|Automated Low Blast Radius| AUTO_ACT
  GATES -->|High Impact Required Approval| MANUAL_ACT
  ANALYST_UI -.->|Interactive Authorisation| GATES

  %% Continuous Feedback Loops
  CASE_MGMT -.->|New Observed IOCs & Indicators| TIP
  CASE_MGMT -.->|Rule False Positive / Tuning Feedback| DAC
```

---

## 2. Architecture Layers & Responsibilities

### Layer 1: Telemetry & Intelligence Sources
- **Telemetry Variety**: Collects heterogeneous telemetry across host execution (process creation, file operations, registry/daemon updates), network interactions (DNS, NetFlow, TLS handshakes), identity sessions (authentication, token generation, role assignment), and cloud management plane operations.
- **External CTI Ingestion**: Ingests structured threat data from commercial feeds, open-source intelligence (OSINT), ISACs, and government disclosures via STIX/TAXII standards.

### Layer 2: Data Fabric & Normalization
- **Distributed Streaming Bus**: Buffers high-volume events using partitioned, append-only distributed logs (e.g. Apache Kafka or Redpanda) to guarantee decoupled, backpressure-tolerant processing.
- **OCSF Normalization**: All incoming telemetry is parsed and coerced into the Open Cybersecurity Schema Framework (OCSF) to decouple downstream detection logic from proprietary log formats.
- **Dual-Tier Storage Strategy**:
  - **Hot Tier**: Fast, indexed storage (15–30 days) for sub-second analytical query response during active investigations and triage.
  - **Lakehouse Tier**: Parquet/Apache Iceberg columnar storage on object storage for cost-effective multi-year retention, large-scale retroactive hunting, and baseline statistical modelling.

### Layer 3: Cyber Threat Intelligence (CTI) Platform
- **Threat Indicator Lifecycle**: Ingests, normalizes, deduplicates, and scores IOCs (IPs, hashes, domains, URIs).
- **Adversary Context**: Maps indicators and attack techniques to MITRE ATT&CK matrices, threat actor profiles, and campaign identifiers.
- **Indicator Cache**: Exposes ultra-low-latency in-memory lookups for streaming detection rules while maintaining a graph representation for analyst exploration.

### Layer 4: Detection Engine
- **Streaming Real-Time Analytics**: Stateful stream processing engines continuously evaluate rules against normalized events in flight with sub-second latency.
- **Lakehouse Batch Analytics**: Scheduled batch evaluations execute complex statistical aggregation, cross-telemetry joins, and baseline anomaly detection against historical lakehouse data.
- **Multi-Signal Correlation**: Converts individual signal alerts into correlated incidents based on common entities (users, devices, network endpoints, attack chains).
- **Detection-as-Code (DaC)**: Rules are written in declarative formats (e.g. Sigma, OCSF-native queries), tracked in Git, and deployed via automated CI/CD pipelines with regression test suites.

### Layer 5: Investigation & Case Management
- **Entity Resolution & Graph Visualization**: Links alerts, users, IP addresses, processes, and domains into an interactive relational graph to uncover the full scope of adversary activity.
- **Chronological Timeline Reconstruction**: Automatically stitches disparate events into an interactive master forensic timeline.
- **Case Dossier & Evidence Chain of Custody**: Persists case notes, evidence artifacts, analyst hypotheses, and findings with tamper-evident auditing.

### Layer 6: Response & Orchestration (SOAR)
- **Declarative Playbooks**: Codified workflows automate containment, enrichment, and remediation steps.
- **Blast-Radius Gating**: Classifies actions by impact risk. Non-disruptive actions (e.g., pulling memory snapshots, querying DNS, isolating test assets) execute autonomously; disruptive actions (e.g., revoking executive credentials, enterprise firewall bans) enforce mandatory analyst approval gates.
- **Continuous Feedback**: Artifacts discovered during triage and investigation feed back directly into the CTI platform (generating new internal indicators) and the Detection-as-Code repository (tuning thresholds or closing detection blind spots).

---

## 3. Data Contracts & Standard Protocols

| Boundary / Interface | Protocol / Standard | Purpose |
| :--- | :--- | :--- |
| Telemetry Ingestion | OCSF (Open Cybersecurity Schema Framework) | Common event structure across endpoint, cloud, network, and identity |
| Threat Intelligence | STIX 2.1 / TAXII 2.1 | Machine-readable threat actor profiles, TTPs, and indicator feeds |
| Detection Logic | Sigma / YAML DSL | Vendor-agnostic detection rules convertible to streaming or SQL engines |
| Automation & Events | CloudEvents / OpenAPI | Standardized event payloads for triggering SOAR workflows and actions |
| Lakehouse Schema | Apache Iceberg / Apache Parquet | High-performance, open columnar format for historical retention |

---

## 4. Next Steps & Detailed Specs
- Read the [Capability Model](02-capability-model.md) for functional breakdown.
- Consult the component specifications in `docs/architecture/components/` for domain-level engineering blueprints.
