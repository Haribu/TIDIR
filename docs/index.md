---
layout: home
title: "TIDIR — Open SecOps Reference Architecture"
titleTemplate: false
description: "Threat Intelligence, Detection, Investigation & Response (TIDIR) is an open, vendor-neutral target technology component architecture for modern autonomous security operations."
head:
  - - meta
    - name: description
      content: "Open, vendor-neutral target technology component architecture for modern autonomous security operations: CTI, OCSF telemetry fabric, Detection-as-Code, agentic investigation, and monotonic response."
  - - meta
    - name: keywords
      content: "cybersecurity, SecOps, threat intelligence, detection engineering, incident response, OCSF, STIX, TAXII, SOAR, SIEM, security architecture, agentic AI, agent trust boundary, continuous purple teaming, detection as code, autonomous SOC"

hero:
  name: "TIDIR"
  text: "Open SecOps Reference Architecture"
  tagline: "A vendor-neutral target technology component architecture and closed-loop control system for modern autonomous security operations."
  actions:
    - theme: brand
      text: "Start the 15-Min Tour ➔"
      link: /guide/golden-path
    - theme: alt
      text: Explore System Architecture
      link: /architecture/01-system-overview
    - theme: alt
      text: Assurance Case Map
      link: /architecture/assurance-map

features:
  - icon: 🛡️
    title: The Operating Maxim
    details: "«Probabilistic components propose. Deterministic components authorise.» Generative models and neural embeddings analyze; deterministic policy kernels govern execution."
  - icon: 🌊
    title: Telemetry & Data Fabric
    details: Line-rate OCSF normalisation, decoupled streaming, and dual-tier storage (hot search vs open columnar lakehouse) preserving forensic evidence independent of current detection value.
  - icon: 🎯
    title: Continuous Detection Engineering
    details: Stateful streaming rules, scheduled lakehouse SQL, and GitOps Detection-as-Code (DaC) tested continuously against atomic adversary simulations in CI/CD.
  - icon: 🧠
    title: Agent Trust Boundary
    details: Specialised autonomous triage agents operating within a dual-plane untrusted data isolator, bounded by task-scoped ephemeral SVIDs.
  - icon: ⚡
    title: Monotonic Automated Containment
    details: Fail-secure state machines where partial failure cannot silently increase attacker reachability (s_{n+1} ⪯ s_n), gated by human break-glass overrides.
  - icon: 🔄
    title: Closed-Loop Green Team Prevention
    details: Attributed threat intelligence feeds back into CTI caches and DaC rules while generating Infrastructure-as-Code (IaC) pull requests to harden defense-in-depth.
---

<div class="vp-doc" style="max-width: 1152px; margin: 0 auto; padding: 2rem 1.5rem;">

## 1. The Architecture at a Glance

TIDIR governs the operational progression from raw environmental observation to automated mitigation within a strict closed loop:

```mermaid
flowchart TB
    %% Styling Classes
    classDef plane fill:#0b1329,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;
    classDef kernel fill:#1e1b4b,stroke:#a855f7,stroke-width:2px,color:#f8fafc;
    classDef feedback fill:#064e3b,stroke:#34d399,stroke-width:1.5px,color:#f8fafc;

    subgraph DP ["1. TELEMETRY DATA PLANE (Untrusted Input Environment)"]
        direction LR
        P1_RAW["Raw Endpoint, Cloud & Network Events"] --> P1_NORM["Line-Rate OCSF Normalisation\n(Catch-All unmapped_data)"]
        P1_NORM --> P1_LAKE["Decoupled Storage Fabric\n(Hot Index + Columnar Lakehouse)"]
    end

    subgraph AP ["2. ANALYTICAL & REASONING PLANE (Advisory Proposals)"]
        direction LR
        P2_DET["Streaming & Batch DaC Engines\n(SRE Alert Noise Budgets)"] --> P2_BAYES["Dependency-Aware Risk Lens\n(Anti-Shared Ancestry Compounding)"]
        P2_BAYES --> P2_AGENT["Hierarchical Agent Mesh\n(Agent Trust Boundary / Dual-Plane)"]
    end

    subgraph DCP ["3. DEFENCE CONTROL PLANE (Trusted Computing Base)"]
        direction LR
        P3_POL["Declarative Policy Kernel\n(Immutable Invariant Checkers)"] --- P3_SIM["Pre-Execution Blast-Radius Simulator\n(Tier 0 Critical Immunity)"]
        P3_SIM --- P3_ESTOP["Cryptographic Master E-Stop\n& Audited Break-Glass Flight Deck"]
    end

    subgraph ACT ["4. ACTUATION PLANE (Task-Scoped Execution)"]
        direction LR
        P4_SAGA["Monotonic Containment State Machine\n(Forward Escalation: s_{n+1} ⪯ s_n)"] --> P4_EXEC["Infrastructure Connectors & EDR\n(Ephemeral SVIDs <= 15m)"]
    end

    subgraph FB ["5. CLOSED-LOOP CONTINUOUS CALIBRATION"]
        direction LR
        FB_FEED["Attributed CTI Re-Cache\n(Re-injected into Layer 1/2)"] --- FB_EVAL["Evals-as-Code CI/CD\n(Continuous Regression Testing)"] --- FB_GREEN["Green Team Preventative IaC PRs\n(Infrastructure Hardening)"]
    end

    DP ==>|1. Normalized Telemetry| AP
    AP ==>|2. Investigative Findings & Hypotheses| DCP
    DCP ==>|3. Authorized Execution Bounds| ACT
    ACT ==>|4. Environmental Outcomes & DAG Nodes| FB

    class DP,AP,ACT plane;
    class DCP kernel;
    class FB feedback;
```

*The closed loop is completed as operational outcomes and incident graph nodes from Actuation (4) enter Continuous Calibration (5), which continuously re-keys threat caches, tunes detection noise budgets, and issues automated hardening pull requests back into the Telemetry Data Plane (1).*

---

## 2. Why TIDIR Exists: The Asymmetric Deficit in SecOps

Modern security operations are constrained by three structural failure modes:
1. **The Ingestion Dilemma**: Traditional SIEMs force teams to discard security telemetry at the collection boundary due to volume-based licensing penalties, blinding organizations during zero-day retrospectives.
2. **The Base Rate Fallacy**: In an enterprise generating $10^9$ daily events, even detections with $99.9\%$ accuracy generate thousands of false alarms, causing catastrophic analyst burnout.
3. **The Unchecked Automation Hazard**: SOAR playbooks that rely on fragile rollback scripts risk reopening compromised perimeters upon partial network failure, while unchecked LLM agents risk prompt injection attacks escalating into unauthorized infrastructure mutations.

**TIDIR solves this by decoupling the architecture into four distinct planes**—enveloping an expansive, untrusted analytical ecosystem within an ultra-lean, deterministic defence control plane.

---

## 3. The Core Architectural Thesis

TIDIR is founded upon seven non-negotiable architectural ideas:

| Architectural Principle | What It Means | Why It Matters |
| :--- | :--- | :--- |
| **Confidence $\neq$ Authority** | Epistemic likelihood ($99.9\%$ confidence) confers **zero** operational authority to isolate hosts or sever connections. | Eliminates self-granting authority; all mutations require independent policy validation. |
| **Evidence Provenance** | Every consequential finding and hypothesis must cite immutable raw observation IDs (`source_observation_ids`). | Prevents floating or ungrounded machine hallucinations from driving incident triage. |
| **Evidential Independence** | Correlated detections sharing common upstream ancestry cannot masquerade as independent corroboration. | Mathematically discounts co-derived signals to resolve the Base Rate Fallacy. |
| **Bounded Probabilistic Reasoning** | Autonomous agents operate strictly in read-only mode behind the **Agent Trust Boundary**. | Assumes prompt injection is permanent; prevents adversarial telemetry from becoming execution authority. |
| **Security-State Monotonicity** | Partial containment failure cannot increase attacker reachability ($s_{n+1} \preceq s_n$). | Replaces fragile transaction rollbacks with forward perimeter escalation. |
| **Graceful Degradation** | Failure of an advanced capability reduces sophistication, never total visibility. | Automatically falls back to edge spooling, scheduled batch lakehouse sweeps, and Zero-AI timelines. |
| **Human Recoverability** | Control planes always preserve out-of-band manual flight decks. | Retains permanent human command via cryptographic master kill-switches. |

---

## 4. The 3-Tier Architectural Model

To serve executive leaders, enterprise architects, and engineering practitioners simultaneously, TIDIR organizes its specifications across three increasing levels of technical specificity:

```mermaid
flowchart LR
    T1["<b>Tier 1: Strategic Architecture</b><br>11 Invariants, 4-Plane Model, Threat Model, Assurance Map"] --> T2["<b>Tier 2: Capabilities & Services</b><br>36 Capabilities, 10 Services, User Stories, Reference SLOs"]
    T2 --> T3["<b>Tier 3: Technical Specifications</b><br>Schemas (OCSF), Protocols (STIX/SPIFFE), State Machines, 21 ADRs"]

    classDef tierStyle fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;
    class T1,T2,T3 tierStyle;
```

* **[Tier 1: Strategic Architecture](/architecture/00-architectural-invariants)**: System topology, the 11 constitutional invariants, and the formal threat model. Target audience: CISOs, Heads of SecOps, Lead Enterprise Architects.
* **[Tier 2: Capabilities & Taxonomy](/architecture/02-capability-model)**: Functional capability taxonomy, enterprise service catalogue, and operational user stories. Target audience: Security Managers, Detection Leads, SecOps SREs.
* **[Tier 3: Technical Specifications](/architecture/components/01-threat-intelligence)**: Concrete data schemas (OCSF), workload identity contracts (SPIFFE), monotonic state machines, and the [ADR Registry](/adr/). Target audience: Detection Engineers, Automation Engineers, SecOps Architects.

---

## 5. Explore by Role & Architectural Intent

Select an entry point tailored to your focus:

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 1.5rem;">

<div style="border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; background: #0b0f19;">
<h3 style="margin-top: 0; color: #38bdf8;">👔 Security Leaders (CISO / SecOps Heads)</h3>
<p style="font-size: 0.95rem; color: #94a3b8;">Understand the strategic business defensibility, operational cost reduction, and executive risk governance of TIDIR.</p>
<ul style="padding-left: 1.25rem; font-size: 0.9rem;">
  <li><a href="/guide/what-is-tidir">What is TIDIR? (Executive Summary)</a></li>
  <li><a href="/architecture/10-macro-capabilities-and-services">Enterprise Service Delivery Model</a></li>
  <li><a href="/architecture/00-architectural-invariants">The Architectural Constitution</a></li>
</ul>
</div>

<div style="border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; background: #0b0f19;">
<h3 style="margin-top: 0; color: #a855f7;">📐 Enterprise Security Architects</h3>
<p style="font-size: 0.95rem; color: #94a3b8;">Examine the 4-plane control model, trusted computing base boundaries, and vendor-neutral open standards.</p>
<ul style="padding-left: 1.25rem; font-size: 0.9rem;">
  <li><a href="/architecture/01-system-overview">System Overview & 4-Plane Model</a></li>
  <li><a href="/architecture/assurance-map">The Assurance Case Map</a></li>
  <li><a href="/architecture/09-threat-model">Target Architecture Threat Model</a></li>
</ul>
</div>

<div style="border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; background: #0b0f19;">
<h3 style="margin-top: 0; color: #34d399;">⚡ Detection & SecOps Engineers</h3>
<p style="font-size: 0.95rem; color: #94a3b8;">Dive into Polyglot Detection-as-Code, SRE noise budgeting, OCSF schema normalisation, and incident playbooks.</p>
<ul style="padding-left: 1.25rem; font-size: 0.9rem;">
  <li><a href="/architecture/02-capability-model">The 36-Capability Taxonomy</a></li>
  <li><a href="/architecture/components/03-detection-engine">Detection Engine Architecture</a></li>
  <li><a href="/adr/0019-polyglot-detection-as-code-and-native-engine-adaptation">ADR-0019: Polyglot Detection-as-Code</a></li>
</ul>
</div>

<div style="border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; background: #0b0f19;">
<h3 style="margin-top: 0; color: #f59e0b;">🤖 AI & Automation Researchers</h3>
<p style="font-size: 0.95rem; color: #94a3b8;">Interrogate the Agent Trust Boundary, ephemeral SPIFFE SVIDs, SLM judges, and continuous Evals-as-Code.</p>
<ul style="padding-left: 1.25rem; font-size: 0.9rem;">
  <li><a href="/architecture/components/06-ai-orchestration">AI & Agent Orchestration Plane</a></li>
  <li><a href="/adr/0004-defensive-ai-runtime-and-prompt-injection-firewall">ADR-0004: Agent Trust Boundary</a></li>
  <li><a href="/adr/0015-sandboxed-agent-execution-otlp-convergence-and-ephemeral-identity">ADR-0015: Sandboxed Agent Execution</a></li>
</ul>
</div>

</div>

---

## 6. Open Source & Machine Access

TIDIR is published as an open-source reference standard under the **Apache 2.0 License**:

* 💻 **GitHub Repository**: [github.com/Haribu/TIDIR](https://github.com/Haribu/TIDIR)
* 📡 **Machine-Readable Graph**: [`/architecture.json`](/architecture.json)
* 🤖 **AI / LLM Ingestion Summary**: [`/llms.txt`](/llms.txt)
* 📚 **Complete Single-File Corpus**: [`/llms-full.txt`](/llms-full.txt)
* 🗺️ **Sitemap**: [`/sitemap.xml`](/sitemap.xml)

</div>
