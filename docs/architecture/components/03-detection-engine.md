# Component Specification: Detection Engine

## 1. Overview & Objectives

The Detection Engine applies threat logic against both streaming and historical telemetry. It couples near-real-time streaming pattern recognition with scheduled analytical lakehouse queries, adopting a **Detection-as-Code (DaC)** lifecycle to ensure that detection logic is versioned, unit-tested, and maintainable.

```mermaid
flowchart TB
  subgraph DaCPipeline ["Detection-as-Code (DaC) & Continuous Purple Team"]
    GIT["Rule Repository (Declarative YAML / DSL)"]
    CI["CI Pipeline: Linting, Unit Testing & Syntax Check"]
    PURPLE["Automated Purple Team Harness\n(Atomic Adversary Emulation)"]
    BACKTEST["30-Day Historical Lakehouse Replay"]
    DEPLOY["Automated Rule Deployer"]
  end

  subgraph EngineTiers ["Detection Execution Tiers"]
    STREAM_RULES["Stateful Streaming Engine\n- Sliding time windows\n- Low latency (< 5s)\n- In-flight IOC stream lookups"]
    BATCH_RULES["Scheduled Batch Analytics Engine\n- Long-window baselining (7-90 days)\n- Complex multi-dataset joins\n- Threshold & outlier detection"]
  end

  subgraph AlertPipeline ["Correlation & Finding Synthesis"]
    DEDUP["Deduplication & Flapping Suppression"]
    CORR["Entity Correlation & Scoring Engine"]
    INCIDENT["Finding Synthesis -> OCSF 2001/2004 Queue"]
  end

  GIT --> CI
  CI --> PURPLE
  PURPLE --> BACKTEST
  BACKTEST --> DEPLOY
  DEPLOY --> STREAM_RULES
  DEPLOY --> BATCH_RULES

  STREAM_RULES --> DEDUP
  BATCH_RULES --> DEDUP
  DEDUP --> CORR
  CORR --> INCIDENT
```

---

## 2. Core Functional Requirements

1. **Dual Detection Paradigms**:
   - **Streaming Detection**:
     - Sub-second evaluation of incoming normalised OCSF events.
     - Sliding time-window correlations (e.g., 5 failed logins followed by a success within 2 minutes).
     - In-flight enrichment against the CTI in-memory IOC cache.
   - **Scheduled Lakehouse Detection**:
     - Periodic analytical queries executed against columnar lakehouse partitions.
     - Aggregations and statistical baselines (e.g., user authenticating from a new geographic ASN not observed in the past 60 days).
     - Low-frequency, high-compute analytics unsuitable for stream processing.

2. **Detection-as-Code (DaC) & Continuous Purple Teaming**:
   - Rules maintained as declarative code (vendor-neutral YAML specifications).
   - Pre-deployment CI checks:
     - Rule syntax validation against canonical OCSF schema registries.
     - Synthetic unit testing (verifying true positives trigger and benign data passes).
     - **Continuous Automated Purple Teaming**: Executes non-destructive atomic adversary emulation payloads in an isolated staging environment to verify end-to-end detection latency and telemetry capture.
     - **Historical Lakehouse Backtesting**: Replays candidate rules across 30 days of historical data in pre-prod to calculate Expected Alert Volume (EAV) and reject rules exceeding noise budgets.
   - Immutable version tagging and GitOps rollbacks.

3. **Alert Correlation & Entity Scoring**:
   - Deduplication engine suppressing identical alerts within a configurable quiet window.
   - Entity-centric graph correlation: links alerts sharing an entity ID (e.g., `user_id`, `hostname`, `ip_address`) within an active time window into a single compound finding.
   - Dynamic Risk Scoring: composite score evaluating alert severity, asset criticality, and threat actor confidence.

---

## 3. Architectural Capability Archetypes & Protocol Standards

| Sub-component | Functional Architecture Pattern | Data Model & Protocol Standards |
| :--- | :--- | :--- |
| **Stream Detection** | Distributed event-driven stream processor with sliding-window state storage and microsecond event-time watermarking. | Declarative stream predicates; in-memory state snapshots. |
| **Batch Analytics Engine** | Distributed SQL query engine supporting columnar object storage pruning and vectorized query execution. | SQL:2016 standard queries; columnar open table format manifests. |
| **Rule Specification** | Vendor-neutral declarative detection specification decoupled from physical storage schema. | YAML schema mapping directly to OCSF Class attributes. |
| **Adversary Emulation Runner** | Automated test harness executing atomic adversary techniques against staging sensors. | MITRE ATT&CK technique IDs; non-destructive atomic execution manifests. |
