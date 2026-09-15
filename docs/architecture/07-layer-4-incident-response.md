# Layer 4: Investigation, Case Management & Automated Response

## 1. Overview & Architectural Role

**Layer 4 represents the decisive resolution plane of the TIDIR architecture.** While Layer 1 emits telemetry, Layer 2 transports and stores data, and Layer 3 synthesizes detections and risk-scored incident dossiers, Layer 4 executes the critical operational workflows: **investigating root causes, validating attack scope, containing adversary momentum, and restoring trusted operations.**

Rather than treating case management as a static ticketing queue and automation as brittle, unconstrained scripts, Layer 4 establishes a **symbiotic operating model between agentic harnesses and human operators**, governed by an immutable **Blast-Radius Risk Tiering framework**.

```mermaid
flowchart TB
  subgraph L3_Handoff ["Layer 3 Handoff"]
    DOSSIER["Elevated Incident Dossier\n• Consolidated Entity Graph\n• Chronological Attack Milestones\n• Composite Risk Score (Asset × Threat)"]
  end

  subgraph L4_Investigation ["1. Unified Investigation & Case Management Engine"]
    direction TB
    GRAPH_TRAV["Entity Graph Resolution & Traversal\n(Process trees, lateral identity hops, IP routes)"]
    TIMELINE["Multi-Source Chronological Timeline\n(Normalized OCSF audit & telemetry streams)"]
    EVIDENCE["Tamper-Evident Evidence Locker\n(Cryptographically hashed forensic payloads)"]

    GRAPH_TRAV --> TIMELINE --> EVIDENCE
  end

  subgraph L4_Operators ["2. Symbiotic Operator Model"]
    direction LR
    AGENT_HARNESS["Agentic Investigation Harness\n• Autonomous context gathering\n• Historical lakehouse queries (L2)\n• Hypothesis formulation & triage scoring"]
    HUMAN_WORKBENCH["Human Operator Workbench\n• Exploratory threat hunting\n• Multi-signal forensic judgment\n• High-impact containment authorization"]

    AGENT_HARNESS <-->|Collaborative Case State| HUMAN_WORKBENCH
  end

  subgraph L4_Response ["3. Blast-Radius Gated Response & Automation (SOAR)"]
    direction TB
    ROUTER{"Blast-Radius\nRisk Classification"}
    TIER0["Tier 0: Read-Only Enrichment\n(Autonomous Execution)"]
    TIER1["Tier 1: Targeted Low-Disruption\n(Policy-Gated Automation)"]
    TIER2["Tier 2: Potentially Disruptive\n(Mandatory Human Authorization)"]
    CONNECTOR["Perimeter, Identity & Endpoint Connectors\n(Declarative Playbook Runtimes)"]

    ROUTER -->|Read-Only| TIER0
    ROUTER -->|Low Blast Radius| TIER1
    ROUTER -->|High Blast Radius| TIER2

    TIER0 --> CONNECTOR
    TIER1 --> CONNECTOR
    TIER2 --> CONNECTOR
  end

  subgraph ClosedLoop ["4. Closed-Loop Architectural Feedback"]
    FB_CTI["CTI Feedback (L3)\n(Export validated IOCs & TTPs)"]
    FB_DAC["Detection Feedback (L3)\n(Calibrate rule thresholds & suppression)"]
    FB_L1["Telemetry Gap Feedback (L1)\n(Request missing sensor data)"]
  end

  DOSSIER ==> L4_Investigation
  L4_Investigation <==> L4_Operators
  L4_Operators ==> L4_Response
  L4_Response -.-> ClosedLoop
```

---

## 2. Investigation & Case Management Architecture

Effective incident investigation requires rapid contextualization across disparate event streams without manual pivot fatigue. Layer 4 provides three core investigative primitives:

```mermaid
flowchart LR
  subgraph Primitives ["Core Investigative Primitives"]
    direction TB
    P1["1. Entity Resolution Graph\n(Identity & Host Pivots)"]
    P2["2. Unified Chronological Timeline\n(Cross-Sensor Event Ordering)"]
    P3["3. Tamper-Evident Evidence Locker\n(Immutable Audit Records)"]
  end

  subgraph Capabilities ["Operational Capabilities"]
    direction TB
    C1["• 360° Identity Profile (MFA, roles, groups)\n• Process lineage trees (Parent ➔ Child ➔ Shell)\n• Network hop reconstruction (Ingress ➔ Egress)"]
    C2["• Interleaved endpoint, cloud, and network facts\n• Microsecond timestamp clock-skew correction\n• ATT&CK milestone annotations"]
    C3["• SHA-256 / Ed25519 cryptographic signatures\n• Strict chain-of-custody tracking\n• Read-only legal holds"]
  end

  P1 --- C1
  P2 --- C2
  P3 --- C3
```

### 1. Entity Graph Resolution & Traversal
- **Graph Data Structure**: Incoming findings are projected into an interconnected graph model where nodes represent resolved entities (`Actor`, `User`, `Credential`, `Process`, `Host`, `IP`, `Domain`, `Cloud Resource`) and edges represent verified actions (`AUTHENTICATED_TO`, `SPAWNED`, `CONNECTED_OUTBOUND`, `ASSUMED_ROLE`, `ENCRYPTED_FILE`).
- **Parent-Child Process Reconstruction**: Endpoint execution paths are mapped back to root processes, distinguishing benign system utilities from anomalous command interpreters (e.g. tracking an unexpected shell spawn from an unmanaged web service worker).
- **Identity Traversal**: Reconstructs complete multi-cloud identity journeys, tracking an external VPN authentication to a session token issue, role assumption, and administrative policy edit.

### 2. Unified Chronological Timeline Reconstruction
- **Multi-Source Interleaving**: Reassembles events across multiple layers—correlating Layer 1 perimeter logs, Layer 2 lakehouse historical queries, and Layer 3 alert triggers into a single continuous temporal stream.
- **Clock-Skew Normalization**: Re-indexes events using coordinated time horizons to eliminate discrepancies across distributed cloud provider regions and on-premises physical clocks.
- **Milestone Extraction**: Automatically tags key attacker actions (Initial Access, Defense Evasion, Persistence, Exfiltration) directly onto the timeline to accelerate cognitive intake for responding analysts.

### 3. Tamper-Evident Evidence Locker
- **Cryptographic Hashing**: All forensic artifacts (packet captures, memory triage excerpts, disk image snapshots, script payloads) collected during an investigation are sealed with SHA-256 content hashes.
- **Immutable Chain-of-Custody**: Every access, analysis, or export operation is immutably logged to an append-only audit register, ensuring admissible legal integrity for regulatory reporting and post-incident disclosures.

---

## 3. Symbiotic Operator Model: Agentic & Human Collaboration

Modern high-velocity security operations cannot rely exclusively on human triage (which cannot scale to enterprise alert volumes) nor unconstrained autonomous agents (which lack business context and risk tolerance). Layer 4 pairs **Agentic AI Harnesses** with **Human SecOps Operators** in a continuous collaborative loop:

```mermaid
flowchart TD
  subgraph Ingestion ["Case Elevation"]
    INCIDENT["High-Fidelity Incident Dossier (from Layer 3)"]
  end

  subgraph AgenticHarness ["Agentic Investigation Harness (Autonomous / Read-Only)"]
    direction TB
    A_QUERY["1. Historical Lakehouse Scoping\n(Query 30-day baseline for user & host)"]
    A_ENRICH["2. External & Internal Context Assembly\n(PIR alignment, CMDB asset criticality, WHOIS)"]
    A_HYPOTHESIS["3. Incident Hypothesis Formulation\n(Determines likelihood of true breach vs. test)"]
    A_REC["4. Containment Action Proposal\n(Generates blast-radius scored response plan)"]

    A_QUERY --> A_ENRICH --> A_HYPOTHESIS --> A_REC
  end

  subgraph HumanWorkbench ["Human Operator Workbench (Supervision & Authorization)"]
    direction TB
    H_REVIEW["1. Triage Briefing Review\n(Consumes structured summary & evidence graph)"]
    H_HUNT["2. Exploratory Deep-Dive\n(Directs agent to run targeted hypothesis tests)"]
    H_AUTH{"3. Decision Gate\nAuthorize Response?"}

    H_REVIEW --> H_HUNT --> H_AUTH
  end

  subgraph SOAR_Execution ["Response Execution Plane"]
    AUTO_EXEC["Execute Automated Containment Playbook"]
    ESCALATE["Escalate / Engage Incident Response Team"]
  end

  INCIDENT ==> AgenticHarness
  AgenticHarness ==>|Pre-Assembled Briefing| HumanWorkbench
  H_HUNT -.->|Dispatches new targeted queries| AgenticHarness
  H_AUTH -->|Approved| AUTO_EXEC
  H_AUTH -->|Complex Crisis| ESCALATE
```

### 1. The Agentic Investigation Harness (The Analytical Multiplier)
- **Autonomous Scoping Queries**: The agent immediately dispatches federated queries to the Layer 2 lakehouse without human prompting—determining whether a suspicious IP has appeared elsewhere in the last 90 days, checking authentication baselines, and enumerating sibling assets.
- **Hypothesis Formulation**: Evaluates the evidence against established attack patterns and outputs a plain-language hypothesis detailing: *What happened, how access was gained, what assets are affected, and what the attacker is attempting next.*
- **Action Plan Drafting**: Proposes an exact sequence of remediation steps, complete with estimated downtime, user impact, and blast-radius scores.

### 2. The Human Operator Workbench (The Judgment Anchor)
- **Cognitive Primacy**: The human operator is never forced to start from scratch. They review a pre-triaged case dossier with full evidence citations.
- **Exploratory Steering**: Analysts can command the agentic harness using natural language or structured queries (`"Check if any other host received this PowerShell payload in the last 48 hours"`).
- **Exclusive Authority Over Disruptive Actions**: Human operators retain sole execution authority for any action classified as potentially disruptive to business operations.

---

## 4. Blast-Radius Gated Response & Automation (SOAR)

To eliminate operational risk while maximizing response velocity, automated actions are strictly compartmentalized into three **Blast-Radius Risk Tiers**:

```mermaid
flowchart LR
  subgraph Tier0 ["Tier 0: Read-Only / Passive"]
    T0_DESC["• Autonomous Execution\n• Blast Radius: None\n• Zero production impact"]
    T0_ACT["Actions:\n• Reverse DNS & WHOIS queries\n• Querying IAM directory attributes\n• Threat actor profile lookup\n• Lakehouse historical queries"]
  end

  subgraph Tier1 ["Tier 1: Targeted / Low Disruption"]
    T1_DESC["• Policy-Gated Automation\n• Blast Radius: Confined\n• Reversible operational effects"]
    T1_ACT["Actions:\n• Quarantine untrusted binary hash\n• Add IP to temporary rate-limit list\n• Terminate orphaned test container\n• Capture live memory dump"]
  end

  subgraph Tier2 ["Tier 2: Disruptive / High Impact"]
    T2_DESC["• Human Authorization Mandatory\n• Blast Radius: Substantial\n• Significant business disruption"]
    T2_ACT["Actions:\n• Network isolate production server\n• Revoke executive SSO session tokens\n• Push enterprise firewall egress block\n• Invalidate tenant API secrets"]
  end
```

### Blast-Radius Risk Tier Matrix

| Risk Tier | Authorization Policy | Permitted Actions | Automated Rollback Requirement |
| :--- | :--- | :--- | :--- |
| **Tier 0: Passive Enrichment** | Fully Autonomous | Read-only threat intel queries, directory lookups, telemetry scoping, lakehouse scans. | Not applicable (no environmental state mutation). |
| **Tier 1: Targeted Containment** | Autonomous for High-Confidence / Low-Criticality Assets | Host-level process termination, untrusted file quarantine, temporary IP rate-limiting, user session lock. | Mandatory 1-click rollback script verified in advance. |
| **Tier 2: Disruptive Containment** | Mandatory Dual-Operator or Senior SecOps Approval | Production database network isolation, global firewall rules, tenant-wide account locks, certificate revocation. | Step-by-step verified compensation and recovery procedure. |

### Pre-Execution Blast-Radius Impact Simulator (Anti-Rubber-Stamping Gate)
In high-stress security incidents, human operators suffer cognitive exhaustion. If an agentic harness presents a compelling narrative recommending host isolation or credential revocation, analysts risk default "rubber-stamping" without verifying topological ramifications.

To prevent inadvertent business disruption from false-positive agent recommendations, Layer 4 mandates a **Deterministic Pre-Execution Impact Simulator**:
- **Live Dependency Evaluation**: Before presenting an authorization modal to the human operator, the SOAR engine queries Layer 1 CMDB relationships and Layer 2 network flow records to compute active blast radius metrics:
  - *Active Connection Count*: (e.g. `1,420 client TCP sessions currently routed to this workload`).
  - *Downstream Service Dependencies*: (e.g. `Host app-worker-04 is a member of the primary payment processing pool`).
  - *Data Volume in Flight*: (e.g. `Active database read-replica synchronization in progress`).
- **Explicit Impact Card Rendering**: Authorization interfaces present the simulation summary alongside the agentic recommendation:
  > **⚠️ Pre-Execution Blast-Radius Preview:**
  > Authorizing isolation on `srv-payment-api-01` will immediately sever **42 active microservice communication channels** and degrade **Checkout Gateway Availability**. Estimated operational recovery time: **12 minutes**.

### Dual-Authorization Consensus Engine (Two-Person Rule)
For Tier 2 actions whose blast-radius score exceeds an enterprise criticality threshold $\theta_{\text{critical}}$ (e.g. actions affecting Domain Controllers, core transactional databases, or executive access keys), a single analyst signature is architecturally insufficient:
1. **Multi-Signature Handshake**: The SOAR orchestrator holds the containment transaction in an unexecuted staged queue and dispatches an out-of-band cryptographic challenge to a secondary designated authorizer (Incident Commander, SecOps Lead, or System Owner).
2. **Time-To-Live Expiration**: If the secondary signature is not cryptographically ratified within the configured TTL (e.g. 15 minutes), the staged action safely expires, preventing stale authorizations from executing against an altered operational topology.
3. **Emergency Break-Glass Override**: For active ransomware encryption in flight, a single authenticated commander can trigger a break-glass override. This executes containment immediately while generating an immutable, priority-1 audit event forwarded to executive stakeholders.

### Compensating Rollback Transactions (Atomic Containment)
Containment playbooks often involve multi-step API execution chains (e.g. 1. Terminate user web session $\to$ 2. Revoke OAuth tokens $\to$ 3. Push firewall drop rule $\to$ 4. Isolate host network interface). If Step 4 fails due to a network timeout or third-party API outage, the system enters an inconsistent, half-contained state.

Layer 4 mandates **Saga-Pattern Compensating Transactions**:
- Every forward containment action $A_i$ must define an exact inverse compensating action $A_i^{-1}$.
- If any step in a containment pipeline fails, the execution engine halts forward progress and executes the compensating rollback sequence ($A_{k-1}^{-1}, \dots, A_1^{-1}$) in reverse order to restore known-good environmental state, while raising an immediate critical operator alarm.
- Rollback scripts are verified during CI/CD playbook build time, ensuring zero unrecoverable operational mutations.


---

## 5. Closed-Loop Architectural Feedback

A healthy security architecture is an adaptive, learning feedback loop. Every incident investigated and closed in Layer 4 generates continuous improvements across the entire platform:

```mermaid
flowchart RL
  L4["Layer 4: Incident Resolution & Post-Mortem"]

  L3_CTI["Layer 3 CTI:\n• New confirmed threat actor attribution\n• Export validated hashes, IPs & attack flows\n• Update decay curves & confidence scores"]

  L3_DAC["Layer 3 Detection Engineering (DaC):\n• Calibrate false-positive suppression rules\n• Adjust detection opportunity priorities\n• Add true-positive replay test fixtures"]

  L1_SENSORS["Layer 1 Telemetry Sources:\n• Identify unmonitored execution paths\n• Request additional audit log components\n• Re-tune endpoint agent collection filters"]

  L4 ==>|Feed Attributed Intelligence| L3_CTI
  L4 ==>|Feed Rule Tuning & Test Fixtures| L3_DAC
  L4 ==>|Identify Visibility Gaps| L1_SENSORS
```

1. **Feedback to Layer 3 Cyber Threat Intelligence (CTI)**: Confirmed attack indicators, C2 infrastructure, and campaign identifiers uncovered during forensics are automatically packaged into STIX 2.1 entities, enriching the internal CTI repository and initiating automated retro-hunts across Layer 2.
2. **Feedback to Layer 3 Detection Engineering (DaC)**: Benign activities that triggered false alarms produce automated exclusion pull requests in the Detection-as-Code repository, while true attacks generate new synthetic regression test cases to prevent future detection drift.
3. **Feedback to Layer 1 Data Sources**: If an investigation identifies forensic blindspots (e.g., missing command-line arguments, unlogged cloud API actions, unmonitored DNS requests), Layer 4 logs a **Telemetry Visibility Gap** to prompt configuration updates in Layer 1 collection agents.
