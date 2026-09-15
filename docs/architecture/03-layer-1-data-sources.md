# Layer 1: Data Sources & Environmental Inputs

## 1. Overview & Architectural Role

**Layer 1 represents the total sensory boundary of the TIDIR architecture.** It encompasses all information producers feeding into the security operations ecosystem.

A modern detection and response architecture fails when it treats security as a simple "log ingestion" problem. Effective detection and triage require evaluating **runtime operational telemetry** against **organizational reality**, **external adversary behavior**, **attack surface exposure**, and **control efficacy**.

---

## 2. The Data Lifecycle in Layer 1: Generation, Collection & Transport

Before telemetry can be normalized or queried in Layer 2, it must travel through three foundational stages within Layer 1. The transition from Layer 1 to Layer 2 occurs precisely when transported data crosses into the pipeline ingestion gateway.

```mermaid
flowchart LR
  subgraph L1 ["Layer 1: Source Domain"]
    direction TB
    subgraph Gen ["1. Generation Stage"]
      G_KERN["Kernel / System Hooks\n(eBPF, Windows ETW, auditd)"]
      G_API["Control Plane Events\n(Cloud audit APIs, SaaS webhooks)"]
      G_NET["Network Flow & Packet Taps\n(SPAN ports, mirror sessions)"]
      G_EXT["External Feeds\n(TAXII, vulnerability advisories)"]
    end

    subgraph Col ["2. Collection Stage"]
      C_AGENT["Local Edge Agents\n(In-memory ring buffer)"]
      C_PULL["API Scrapers / Pollers\n(Stateful checkpoint cursors)"]
      C_LISTEN["Network Syslog / Webhook Listeners\n(Load-balanced receivers)"]
    end

    subgraph Trans ["3. Transport & Egress Stage"]
      T_SPOOL["Local Disk Spooling & Queuing\n(Backpressure & disconnect safety)"]
      T_PROTO["Secure Transport Protocols\n(mTLS, gRPC, HTTP/2, Protobuf)"]
    end

    Gen --> Col
    Col --> Trans
  end

  subgraph L2 ["Layer 2: Pipeline Boundary"]
    P_GATE["Pipeline Ingestion Gateway\n(Distributed Streaming Bus)"]
  end

  Trans ==>|Egress across network boundary| P_GATE
```

### Stage 1: Generation (Event Emission Primitives)
Data generation occurs where software, hardware, or external actors execute actions. Telemetry must be captured as close to the point of origin as possible to guarantee forensic integrity and prevent evasion:
- **Kernel-Level Observability**: Intercepts low-level system calls, process fork/exec chains, module loads, and memory manipulations via kernel instrumentation (Linux eBPF, Windows Event Tracing / ETW, macOS Endpoint Security framework).
- **Service & Control-Plane Eventing**: Management planes record administrative transactions, identity provisioning, and API calls via immutable audit logs (cloud management trails, IdP event logs).
- **Network Interface Taps**: Hardware and virtual taps mirror wire traffic to generate connection state flows and application-layer metadata records without relying on host software.
- **External Intelligence Publishing**: Third-party providers publish adversary campaigns, vulnerability weaponization telemetry, and active indicators over authenticated feeds.

### Stage 2: Collection (Edge Gathering & Buffering)
Collection mechanisms gather emitted raw events on or near the emitter:
- **Agent-Based Collection**: Lightweight user-space daemons subscribe to local OS event rings. They must enforce strict CPU/memory throttling and handle kernel buffer overflows gracefully.
- **Pull-Based API Ingestion**: Distributed schedulers poll third-party cloud and SaaS endpoints, maintaining watermarked checkpoint cursors to guarantee at-least-once collection without duplicates.
- **Network Ingestion Listeners**: Horizontally scalable listeners accept push-based streaming formats (Syslog RFC 5424, NetFlow v9 / IPFIX, direct webhooks).

### Stage 3: Transport & Egress (The L1 ➔ L2 Handoff)
Transport is responsible for moving collected events reliably across network boundaries into Layer 2's ingestion streaming bus:
- **Local Spooling & Backpressure**: If downstream pipeline targets slow down or network partitions occur, collectors spool to bounded local disk queues to prevent data loss.
- **Dead-Letter Queue (DLQ) & Malformed Buffering**: Payloads rejected due to corruption, unparseable wire formats, or transient network timeouts are diverted to an encrypted local/staging DLQ. This guarantees zero silent event drops and enables deterministic offline replay once connectivity or parser rules are restored.
- **Raw Payload Envelope Preservation**: The transport envelope preserves an unmutated copy of the original raw event (`raw_payload`) alongside collector-attached origin metadata (collector version, ingestion timestamp, cryptographic agent hash). This ensures forensic non-repudiation before any downstream normalization begins.
- **Transport Security**: All transport mandates mutual TLS (mTLS) with cryptographically validated client and server identities.
- **Efficient Wire Formats**: Payloads are batched and compressed (Zstandard / Snappy) over HTTP/2, gRPC, or native streaming producer protocols to minimize bandwidth utilization.
- **Handoff Contract**: The boundary between Layer 1 and Layer 2 is the ingress port of Layer 2's streaming message bus (e.g. distributed streaming log or HTTP ingestion gateway). Once acknowledged by Layer 2, Layer 1 considers the event delivered.

---

## 3. Schema & Framework Alignment: ATT&CK Data Components to OCSF

To ensure detection engineering (Layer 3) can express vendor-neutral logic, Layer 1 telemetry must be categorized using standardized security frameworks:
- **MITRE ATT&CK Data Sources & Data Components**: Define *what adversary activity must be observed* to detect specific techniques.
- **Open Cybersecurity Schema Framework (OCSF)**: Defines *how that activity is formally structured* into normalized categories and classes.

```mermaid
flowchart LR
  subgraph AttackTaxonomy ["MITRE ATT&CK Requirement"]
    ATT["Data Component\n(e.g., Process: Process Creation)"]
  end

  subgraph L1Pipeline ["Layer 1 Mechanics"]
    GEN_COL["Generation (ETW / eBPF)\n+\nCollection (Edge Agent)"]
  end

  subgraph OcsfTaxonomy ["OCSF Target Schema"]
    OCSF_OBJ["OCSF Category & Class\n(e.g., System Activity: Process Activity #1007)"]
  end

  ATT -->|Drives instrumentation of| GEN_COL
  GEN_COL -->|Transports raw event for mapping to| OCSF_OBJ
```

### Telemetry Mapping Matrix

| MITRE ATT&CK Data Source | MITRE ATT&CK Data Component | Target OCSF Category & Class | Primary Generation Mechanism | Collection & Transport Profile |
| :--- | :--- | :--- | :--- | :--- |
| **Process** | Process Creation | `System Activity` (1007: Process Activity) | OS Kernel Hooks / eBPF / ETW Event ID 4688 | High-volume streaming; sub-second delivery |
| **Process** | OS API Execution | `System Activity` (1007: Process Activity / API Activity) | User-space hooks / Syscall monitors / eBPF | Selective filter-streaming; high noise potential |
| **File** | File Modification / Creation | `System Activity` (1001: File System Activity) | Kernel Minifilters / fanotify / FSEvents | Streaming; rate-limited and filtered by extension/path |
| **Network Traffic** | Network Connection Creation | `Network Activity` (4001: Network Activity) | Socket monitors / eBPF sockops / NetFlow | Streaming summary flows; connection start/end pairs |
| **Network Traffic** | DNS Resolution | `Network Activity` (4003: DNS Activity) | DNS proxy / Wire packet parser / OS resolver | Streaming event pairs (Query + Answer records) |
| **User Account** | User Account Authentication | `Identity & Access` (3002: Authentication) | IdP session logs / Kerberos KDC / PAM audit | Streaming event batches; critical priority |
| **User Account** | User Account Modification | `Identity & Access` (3005: Entity Management) | Active Directory replication / SaaS Directory API | Webhook push or low-frequency scheduled poll |
| **Cloud Storage** | Storage Object Access | `Cloud / Account` (1001: Object Storage Activity) | Cloud provider control plane S3/Blob audit trail | Stream-forwarded cloud delivery (S3 notification/PubSub) |
| **Vulnerability** | Software Vulnerability State | `Findings / Discovery` (2002: Vulnerability Finding) | Host/network vulnerability scanner engine | Scheduled batch snapshot; periodic diff sync |
| **Threat Intelligence** | Indicator Observable | `Threat Intelligence` (5001: Threat Intelligence) | STIX/TAXII 2.1 repository / Threat Feed API | Polled incremental batch / Change-data-capture |

---

## 4. Source Domain Taxonomy & Functional Capabilities

Layer 1 encompasses 5 distinct input domains that must converge into the architecture:

```mermaid
mindmap
  root((Layer 1 Inputs))
    Runtime Telemetry
      Host & Workload Activity
      Network & Perimeter Flows
      Identity & Access Transmissions
      Cloud Management Plane APIs
      Application Transaction Records
    Threat Intelligence (CTI)
      Tactical Indicators & Hashes
      Adversary TTPs & Campaigns
      Exploit Weaponization Signals
    Organizational Context
      Asset & Infrastructure Inventory
      Directory Structure & Privileges
      Business Service Criticality
    Attack Surface & Exposure
      External Attack Surface (EASM)
      Public Cloud Asset Footprint
      Software Supply Chain (SBOM)
    Control Posture & Health
      Sensor & Agent Health Heartbeats
      Configuration Drift & Hardening State
      Known Vulnerability & Exposure Gaps
```

### Domain 1: Runtime Operational Telemetry (Activity Streams)
Ephemeral, high-volume event streams generated continuously as infrastructure and users operate.

- **Host & Workload Telemetry**: Complete process lineage trees (parent/child/grandchild tracking), dynamic module loading, thread injection, file creations/overwrites, kernel driver loads, container namespaces, and cgroup anomalies.
- **Identity & Access Telemetry**: Interactive and machine-to-machine authentication transactions, MFA challenge evaluations, session token issuance/refresh/revocation, administrative role escalations, and directory object changes.
- **Network & Perimeter Telemetry**: Transport flow summaries (NetFlow/IPFIX/VPC Flow), application-layer protocol metadata (DNS queries/responses, HTTP transactions), TLS handshake attributes (cipher suites, SNI, JA3/JA4 fingerprints), and edge firewall state changes.
- **Cloud Control Plane Telemetry**: Cloud administrative console logins, CLI/API management calls, cross-account trust alterations, IAM policy definitions, and public storage access toggles.
- **Application Logic Telemetry**: Business-critical application events (e.g. wire transfer authorizations, bulk data exports, privileged policy bypasses), service mesh traces, and API gateway access records.

---

### Domain 2: Threat Intelligence Inputs (CTI)
External and internally curated adversary knowledge that gives operational telemetry meaning.

- **Tactical & Technical Observables**: Structured indicators (IP addresses, domain names, file hashes, URLs, SSL certificate serials) enriched with confidence scores, source fidelity ratings, and decay functions.
- **Operational & Adversary Context**: Threat actor profiles, operational motivations, target industry/geographic focus, and campaign waves mapped to MITRE ATT&CK matrices.
- **Vulnerability & Exploitation Intelligence**: Weaponized proof-of-concept availability, active zero-day exploitation reports, exploit broker disclosures, and dynamic EPSS (Exploit Prediction Scoring System) values.

---

### Domain 3: Organizational & Environmental Context
The authoritative operational baseline against which anomalies and threat severity are evaluated.

- **Asset Inventory & Compute Registry**: Physical machines, virtual instances, container clusters, and serverless functions; static/DHCP IP history; operating system builds; and environment tiering (Production vs. Staging vs. Dev sandbox).
- **Identity Directory & Role Hierarchy**: Authoritative corporate directory metadata (job function, reporting line, executive status, baseline location, working hours) and privileged access groupings (Domain Admins, Cloud Owners).
- **Business Process & Service Mapping**: Relational mapping connecting technical infrastructure components to revenue-generating workflows, customer data stores, and regulatory boundaries (crown jewel scoring).

---

### Domain 4: Attack Surface & External Exposure Inputs
The external perspective representing the enterprise as seen from an adversary's vantage point.

- **External Attack Surface (EASM)**: Discovered public IP blocks, authoritative DNS zones, discovered subdomains, publicly reachable ports, service banners, and SSL/TLS certificate expirations.
- **Cloud Perimeter & Shadow Infrastructure**: Dangling DNS records vulnerable to takeover, unmanaged SaaS tenants, and publicly accessible storage buckets or database endpoints.
- **Software Supply Chain & Dependencies**: Software Bill of Materials (SBOM) for internal applications, third-party library dependencies, and third-party SaaS OAuth integrations.

---

### Domain 5: Security Control Posture & Health State
Telemetry describing the status, fidelity, and coverage of defensive controls.

- **Sensor & Agent Health**: Agent deployment coverage percentages, sensor process heartbeats, signature/engine update freshness, and tamper prevention alerts (pinpointing instrumentation blind spots).
- **Configuration & Hardening Posture**: Operating system hardening benchmarks (e.g. CIS), endpoint isolation policy states, disk encryption status, and firewall rule configurations.
- **Vulnerability Posture & Patch State**: Identified CVEs across software installations, exposure reachability metrics, and patch remediation timelines.

---

## 5. Architectural Contracts for the L1 ➔ L2 Boundary

To preserve loose coupling between source emitters and the processing platform, Layer 1 adheres to four boundary contracts:

1. **Producer Neutrality**: Data sources emit facts about what occurred, not security judgments. Normalization and enrichment belong exclusively to Layer 2 and Layer 3.
2. **Authoritative Timestamping**: Every emitted payload must include an RFC 3339 UTC origin timestamp captured at generation, distinct from collection or ingestion timestamps.
3. **Identity & Origin Provenance**: Events must carry immutable source provenance tags (tenant ID, host identifier, sensor ID, collector version) to ensure traceability and tamper detection.
4. **Transport Resilience Guarantee**: Transport clients must guarantee at-least-once delivery into Layer 2 through bounded local spooling and acknowledgement handshakes.
