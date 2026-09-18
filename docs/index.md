---
layout: home

hero:
  name: "TIDIR"
  text: "Open SecOps Architecture"
  tagline: "Threat Intelligence, Detection, Investigation & Response — an open, vendor-neutral target technology component architecture for modern autonomous security operations."
  actions:
    - theme: brand
      text: Explore System Overview
      link: /architecture/01-system-overview
    - theme: alt
      text: View Capability Model
      link: /architecture/02-capability-model
    - theme: alt
      text: GitHub Project ↗
      link: https://github.com/Haribu/TIDIR

features:
  - icon: 🛰️
    title: Threat Intelligence (CTI)
    details: Standardised ingestion across STIX/TAXII, dynamic confidence decay scoring, low-latency in-memory caching, and automated retro-hunting against cold lakehouse storage.
  - icon: 🌊
    title: Telemetry & Data Fabric
    details: Line-rate OCSF schema normalisation, distributed event streaming, and dual-tier decoupled storage balancing hot indexing with high-efficiency columnar lakehouses.
  - icon: 🎯
    title: Detection Engineering
    details: Stateful streaming pattern detection paired with lakehouse SQL analytics, governed by GitOps Detection-as-Code (DaC), continuous purple teaming, and SecOps error budgets.
  - icon: 🧠
    title: Hierarchical Agent Mesh
    details: Specialised autonomous agents with dual-plane prompt injection firewalls and Proposer/Challenger multi-model arbitration for evidence-grounded investigations with deterministic rejection of unsupported assertions.
  - icon: ⚡
    title: Automated Response & Containment
    details: Blast-radius risk-tiered state machines executing monotonic fail-closed containment with forward escalation, circuit breakers, and break-glass human-in-the-loop controls.
  - icon: 🔄
    title: Closed-Loop Feedback & Green Teams
    details: Incident discoveries feed back into CTI and DaC tuning, while triggering Green Team preventative hardening (IaC pull requests and defense-in-depth improvements).
---

<div class="vp-doc" style="max-width: 1152px; margin: 0 auto; padding: 2rem 1.5rem;">

## Architectural Mission & Scope

Modern security operations face an asymmetric challenge: attackers operate at machine velocity with automated, multi-stage attack chains, whilst defenders struggle against proprietary silos, alert fatigue, and prohibitive telemetry licensing costs. 

**TIDIR** (Threat Intelligence, Detection, Investigation & Response) provides a vendor-neutral, capability-driven target technology component architecture. It synthesises modern software reliability engineering, continuous purple teaming, and secure agentic AI into an integrated, closed-loop defence ecosystem.

---

## The 3-Tier Architecture Framework

To balance executive clarity with engineering precision, TIDIR is organised across three distinct architectural tiers:

| Tier | Focus | Key Deliverables & Documents | Target Audience |
| :--- | :--- | :--- | :--- |
| **Tier 1: Strategic Architecture** | System topology, high-level components, and the closed-loop operating paradigm. | [01. System Overview](/architecture/01-system-overview), [Cross-Cutting Disciplines](/architecture/05-cross-cutting-engineering-disciplines) | CISOs, Heads of SecOps, Lead Enterprise Architects |
| **Tier 2: Capabilities & Taxonomy** | Functional capability matrix, enterprise service catalogue, MTTx service levels, and error budgets. | [02. Capability Model](/architecture/02-capability-model), [10. Macro Capabilities & Services](/architecture/10-macro-capabilities-and-services), [User Stories](/architecture/08-user-stories) | Security Managers, Detection Engineering Leads, SOC Managers |
| **Tier 3: Technical Specifications** | Concrete data schemas, pipeline protocols, state machines, and ADRs. | [Component Deep Dives](/architecture/components/01-threat-intelligence), [ADR Registry](/adr/0001-record-architecture-decisions) | Detection Engineers, Security Automation Engineers, SecOps Architects |

---

## Core Architectural Paradigms

```mermaid
flowchart TB
    subgraph S1["1. INGESTION & DATA FABRIC"]
        direction TB
        RAW["Raw Telemetry"] --> NORM["Line-rate OCSF Normalisation"]
        NORM --> BUS["Distributed Event Stream"]
        BUS --> HOT["Hot Index (Tier 1)"]
        BUS --> LAKE["Columnar Lakehouse (Tier 2)"]
    end

    subgraph S2["2. CONTINUOUS DETECTION & DAC"]
        direction TB
        STREAM_DET["Stateful Stream Engine"]
        BATCH_DET["Lakehouse SQL Engine"]
        BAYES["Bayesian Compounding"]
        STREAM_DET --> BAYES
        BATCH_DET --> BAYES
    end

    subgraph S3["3. AGENTIC INVESTIGATION"]
        direction TB
        FW["Prompt Injection Firewall"]
        MESH["Hierarchical Agent Mesh"]
        ARB["Proposer/Challenger Arbiter"]
        FW --> MESH --> ARB
    end

    subgraph S4["4. MONOTONIC AUTOMATED RESPONSE"]
        direction TB
        RESP["Containment Orchestrator"]
        CIRCUIT["Circuit Breaker & Guardrails"]
        BG["Break-Glass Emergency Override"]
        RESP --> CIRCUIT --> BG
    end

    S1 ==> S2 ==> S3 ==> S4
    S4 -.->|"Closed-Loop Tuning & Evals"| S1

    classDef default fill:#1e293b,stroke:#475569,stroke-width:1px,color:#f8fafc;
    classDef highlight fill:#0f766e,stroke:#14b8a6,stroke-width:1.5px,color:#ffffff;
    class RAW,NORM,BUS,HOT,LAKE,STREAM_DET,BATCH_DET,BAYES,FW,MESH,ARB,RESP,CIRCUIT,BG default;
```

### 1. Decoupled Lakehouse vs Restrictive Ingestion
TIDIR strictly rejects artificial "output-driven" ingestion where logs are discarded at collection time if they do not match an existing detection rule. Filtering telemetry at the edge blinds security teams to zero-day discoveries and invalidates retrospective threat hunting. Instead, TIDIR establishes a **two-tier decoupled data fabric**:
* **Hot Index (Tier 1):** High-value, immediate-retrieval telemetry retained for active operational windows (15–30 days).
* **Columnar Lakehouse (Tier 2):** Cost-effective, open-format columnar storage (Parquet/metadata catalogue) for complete historical audit retention and petabyte-scale SQL analytics.

### 2. Suppressing the Base Rate Fallacy with Dependency-Aware Evidence Aggregation
When processing billions of daily events, even detections with a 99.9% accuracy rate produce thousands of false alarms because malicious actions are rare events (the *False Positive Paradox*). TIDIR solves this by treating single-point anomalies as **weak graph signals** rather than standalone alerts. Detections are only elevated to an active incident once dependency-aware Bayesian risk aggregation correlates signals across orthogonal observation domains, discounting co-derived findings that share common raw telemetry ancestry:
$$
\text{Compounded Risk} = f(\text{Adversary TTP Severity}, \text{Asset Criticality}, \text{Identity Privilege}, \text{Orthogonal Evidence Domains})
$$

### 3. Continuous Purple Teaming & SecOps Error Budgets
Borrowing from Site Reliability Engineering (SRE), detection quality is enforced through quantifiable **Alert Noise Error Budgets** (target: false positive rate $\text{FPR} \le 5\%$). Detection-as-Code (DaC) repositories execute continuous atomic attack emulation in CI/CD pipelines. If a detection rule exhausts its noise budget in production, an automated deployment freeze prevents new rule promotions until the noisy rule is tuned or deprecated.

### 4. Dual-Plane Defensive AI Runtime & Prompt Injection Firewall
Autonomous agentic workflows operate within a strictly isolated runtime:
* **Control Plane vs. Data Plane Separation:** Untrusted external telemetry (email bodies, web payloads, obfuscated command strings) is strictly compartmentalised as raw data and never injected directly into agent execution prompts.
* **Deterministic Guardrails & Multi-Model Arbitration:** High-consequence triage decisions require consensus between a *Proposer Model* (investigation specialist) and an independent *Challenger Model* (adversarial auditor) to reject unsupported assertions and validate proposed containment actions against deterministic policies.

### 5. Security-State Monotonicity & Fail-Closed Containment
Automated containment workflows execute declarative state machines governed by **Security-State Monotonicity**: *no automated compensation may increase attacker reachability beyond the last verified-safe security state*. While forward compensation may safely restore benign services, rolling back security barriers upon downstream timeout is strictly prohibited as an anti-defence vulnerability. Workflows enforce fail-closed boundary freezes and forward escalation to broader network perimeters, with high-impact mutations gated by authenticated Break-Glass Human-in-the-Loop consensus ($\text{MTTC} \lt 5\,\text{min}$).

---

## Document Navigation Matrix

Explore the complete architecture and engineering specifications across the platform:

| Section | Description | Direct Links |
| :--- | :--- | :--- |
| **System Overview** | High-level topology, interaction flows, and operating principles. | [System Architecture](/architecture/01-system-overview) · [Target Threat Model](/architecture/09-threat-model) |
| **Capability Model** | 35+ atomic capabilities, 4 macro capabilities & 10 enterprise operational services. | [Capability Matrix](/architecture/02-capability-model) · [Macro Capabilities & Services](/architecture/10-macro-capabilities-and-services) |
| **Layer Specifications** | Detailed layer-by-layer architectural contracts and data pipelines. | [L1: Data Sources](/architecture/03-layer-1-data-sources) · [L2: Pipeline & Storage](/architecture/04-layer-2-pipeline-storage-query) · [L3: Threat Intel & Detection](/architecture/06-layer-3-threat-intel-detection) · [L4: Incident Response](/architecture/07-layer-4-incident-response) |
| **Component Deep Dives** | Deep technical specifications for each functional subsystem. | [Threat Intelligence](/architecture/components/01-threat-intelligence) · [Data Fabric](/architecture/components/02-data-fabric-telemetry) · [Detection Engine](/architecture/components/03-detection-engine) · [Investigation & Cases](/architecture/components/04-investigation-cases) · [Response & Automation](/architecture/components/05-response-automation) · [AI & Agent Orchestration](/architecture/components/06-ai-orchestration) |
| **Engineering Disciplines** | Cross-cutting disciplines: SRE budgets, Purple Teaming, DaC & Evals. | [Engineering Disciplines](/architecture/05-cross-cutting-engineering-disciplines) |
| **Operational Scenarios** | End-to-end user stories and automated response workflows. | [User Stories & Scenarios](/architecture/08-user-stories) |
| **Architectural Decisions** | Formal Architectural Decision Records (ADRs 0001–0021) in MADR format. | [ADR Registry](/adr/) · [ADR-0004 (Prompt Firewall)](/adr/0004-defensive-ai-runtime-and-prompt-injection-firewall) · [ADR-0005 (Saga Containment)](/adr/0005-saga-pattern-containment-and-break-glass-protocol) · [ADR-0009 (Bayesian Scoring)](/adr/0009-bayesian-multi-signal-risk-scoring) · [ADR-0015 (OTLP Convergence)](/adr/0015-sandboxed-agent-execution-otlp-convergence-and-ephemeral-identity) · [ADR-0020 (Skill Retention)](/adr/0020-operator-skill-retention-and-incident-replay-simulators) · [ADR-0021 (Continuity Plan B)](/adr/0021-graceful-degradation-automated-fallback-and-continuity-plan-b) |

---

## 🌐 Open Source & Community

TIDIR is hosted as an open-source research initiative under the **Apache 2.0 License**:

- 💻 **GitHub Project**: [github.com/Haribu/TIDIR](https://github.com/Haribu/TIDIR)
- 🤝 **Contribute**: Check out the [Contribution Guide](https://github.com/Haribu/TIDIR/blob/main/CONTRIBUTING.md) to propose RFCs or component additions.
- 🐛 **Issues & Feedback**: Report broken diagrams, links, or architectural proposals on [GitHub Issues](https://github.com/Haribu/TIDIR/issues).
- 🛡️ **Security Advisories**: Report vulnerabilities privately via [GitHub Security Advisories](https://github.com/Haribu/TIDIR/security/advisories) or directly to `info@harrymclaren.co.uk`.

</div>
