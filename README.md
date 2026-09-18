# TIDIR — Threat Intelligence, Detection, Investigation & Response

> **Target Architecture & Research Platform**  
> A unified, open, modular reference architecture for modern security operations.  
> 
> 🌐 **Live Documentation Portal**: **[https://tidir.pages.dev](https://tidir.pages.dev)** *(Custom domain: [https://tidir.harrymclaren.co.uk](https://tidir.harrymclaren.co.uk))*

[![CI & Integrity Check](https://github.com/Haribu/TIDIR/actions/workflows/ci.yml/badge.svg)](https://github.com/Haribu/TIDIR/actions/workflows/ci.yml)
[![Deploy to Cloudflare Pages](https://github.com/Haribu/TIDIR/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Haribu/TIDIR/actions/workflows/deploy-pages.yml)
[![Live Documentation](https://img.shields.io/badge/docs-tidir.pages.dev-blue.svg)](https://tidir.pages.dev)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-green.svg)](https://github.com/Haribu/TIDIR/blob/main/LICENSE)

---

## 🎯 Mission

TIDIR brings together four traditionally siloed operational domains into a continuous, feedback-driven security architecture:

```
    ┌──────────────────────┐
    │ Threat Intelligence  │◄────────────┐
    └──────────┬───────────┘             │
               ▼                         │  Threat Feedback Loop
    ┌──────────────────────┐             │  (IOCs, TTPs, Actor Context)
    │  Detection Engine    │             │
    └──────────┬───────────┘             │
               ▼                         │
    ┌──────────────────────┐             │
    │  Investigation & Case│─────────────┤
    └──────────┬───────────┘             │
               ▼                         │
    ┌──────────────────────┐             │
    │ Response Automation  │─────────────┤
    └──────────┬───────────┘             │
               ▼                         │  Green Team Preventative Loop
    ┌──────────────────────┐             │  (IaC PRs, Posture Hardening &
    │ Green Team Prevention│─────────────┘   Defense-in-Depth)
    └──────────────────────┘
```

The objective is to establish an actionable, vendor-neutral target technology architecture that solves modern operational challenges: alert fatigue, telemetry fragmentation, delayed containment, and disparate case management. While TIDIR deliberately focuses on detection, investigation, and response (rather than inline prevention appliances), it **closes the operational loop** by recommending and triggering **Green Teams** (platform, infrastructure, and cloud security engineering) to eliminate root causes through automated Infrastructure-as-Code (IaC) hardening and posture improvements.

---

## 🏛️ Architecture Documentation

The documentation is organized logically across strategy, capability mapping, detailed component engineering, and formal decisions:

- **Target System Architecture**: [`docs/architecture/01-system-overview.md`](docs/architecture/01-system-overview.md) — Comprehensive target state component topology, dataflows, contracts, and interaction patterns.
- **Capability Model**: [`docs/architecture/02-capability-model.md`](docs/architecture/02-capability-model.md) — Core functional capabilities required across the TIDIR lifecycle.
- **Component Specifications**:
  - [01 - Threat Intelligence (CTI)](docs/architecture/components/01-threat-intelligence.md): Feed ingestion, STIX/TAXII, IOC scoring, and campaign attribution.
  - [02 - Data Fabric & Telemetry](docs/architecture/components/02-data-fabric-telemetry.md): Event ingestion, schema normalization (OCSF), message brokers, lakehouse storage.
  - [03 - Detection Engine](docs/architecture/components/03-detection-engine.md): Stream analytics, Sigma rule compilation, UEBA, and correlation.
  - [04 - Investigation & Case Management](docs/architecture/components/04-investigation-cases.md): Evidence graphs, entity timeline reconstruction, triage workflows.
  - [05 - Automated Response & Containment](docs/architecture/components/05-response-automation.md): Automated playbook orchestration, blast-radius simulation, Saga compensating rollbacks, human-in-the-loop gating, automated containment.
- **Architectural Decision Records (ADRs)**: [`docs/adr/`](docs/adr/) — Immutable records of key architectural decisions.
- **Diagrams**: [`docs/diagrams/`](docs/diagrams/) — Source `.mmd` files for system diagrams.

---

## 📐 Architecture Principles

1. **Schema Standardisation First**: Telemetry and alerts adopt standardised schemas (OCSF, STIX 2.1) early in the pipeline to prevent vendor lock-in.
2. **Streaming-First with Lakehouse Persistence**: Decouple real-time detection streams from petabyte-scale historical search and model training.
3. **Detection-as-Code (DaC)**: All rules, analytics, and correlation logic are managed in Git, version-controlled, tested, and validated in CI/CD pipelines.
4. **Bi-directional Intel & Preventative Loops**: Investigation discoveries and response artifacts automatically enrich Threat Intelligence feeds for retro-hunting, while triggering Green Team preventative engineering (IaC pull requests and cloud posture hardening) to permanently eradicate root causes and deepen defense-in-depth.
5. **Human-in-the-Loop Orchestration**: Autonomous response is scoped by blast radius; high-impact actions mandate structured analyst authorisation.

---

## 🌐 Open Security Frameworks Alignment

TIDIR synthesizes defensive strategy, analytic taxonomy, API safety, and operational controls into a unified framework alignment:

* **Adversary Tactics & Attack Patterns**: [MITRE ATT&CK](https://attack.mitre.org/) (Enterprise TTPs), [MITRE ATLAS](https://atlas.mitre.org/) (AI/ML Threats), [MITRE CAPEC](https://capec.mitre.org/) (Attack Patterns).
* **Defensive Countermeasures & Analytics**: [MITRE D3FEND](https://d3fend.mitre.org/) (Defensive Techniques), [D3FEND ACF](https://d3fend.mitre.org/) (Analytic Characterization Framework), [MITRE CAR](https://car.mitre.org/) (Cyber Analytics Repository).
* **Active Defense & Deception Operations**: [MITRE ENGAGE](https://engage.mitre.org/) (Expose, Affect, Elicit, Understand).
* **AI & API Tool Safety**: [OWASP Top 10 for LLMs](https://owasp.org/www-project-top-10-for-large-language-model-applications/) (Prompt Injection & Agency), [OWASP API Security Top 10](https://owasp.org/API-Security/) (BOLA, Broken Auth, Tool Boundaries).
* **Enterprise Assurance & Data Schemas**: [CIS Controls v8](https://www.cisecurity.org/controls/v8) (Controls 5, 6, 8, 13, 17), [OCSF](https://ocsf.io/) (Open Cybersecurity Schema Framework), [STIX 2.1 / TAXII](https://oasis-open.github.io/cti-documentation/).

---

## 🗺️ Roadmap, Research & Release Milestones

TIDIR maintains strict discipline between what is formally specified and verified in the live architecture versus active research and future exploratory ideas.

### ✅ Delivered Milestones

| Version | Milestone & Core Architecture Delivered | Key Specifications & Governing ADRs |
| :--- | :--- | :--- |
| **v1.0** | **Foundational 5-Layer Component Architecture**<br>• Core operational domains: CTI, Data Fabric, Detection, Cases, Automation.<br>• Open standards alignment (OCSF, STIX 2.1, Sigma DaC). | • [System Overview](docs/architecture/01-system-overview.md)<br>• [Capability Model](docs/architecture/02-capability-model.md)<br>• [ADR-0001: Architectural Governance](docs/adr/0001-record-architecture-decisions.md) |
| **v1.1** | **The TIDIR Architectural Constitution & Invariant Discipline**<br>• 11 non-negotiable invariants codified.<br>• Trust Doctrine: probabilistic components propose, deterministic components authorize.<br>• Security-State Monotonicity ($s_{n+1} \preceq s_n$). | • [Constitutional Invariants](docs/architecture/00-architectural-invariants.md)<br>• [ADR-0005: Saga Pattern & Break-Glass](docs/adr/0005-saga-pattern-containment-and-break-glass-protocol.md)<br>• [ADR-0015: Sandboxed Agent Execution](docs/adr/0015-sandboxed-agent-execution-otlp-convergence-and-ephemeral-identity.md) |
| **v1.2** | **Machine-Readable Graph & Threat-to-Assurance Closure**<br>• Full bi-directional assurance closure ($T_1..T_6 \to I_1..I_{11} \to \text{CAP} \to \text{ADR}$).<br>• Authoritative graph endpoints (`/architecture.json`, `/llms.txt`, `/llms-full.txt`).<br>• AI Orchestration Plane & 3-phase MVA roadmap.<br>• Automated verification suite (62 Mermaid diagrams, graph linting, MathJax audit). | • [Assurance Case Map](docs/architecture/assurance-map.md)<br>• [ADR-0012: AI Plane & MVA Roadmap](docs/adr/0012-ai-orchestration-runtime-mcp-and-mvp-roadmap.md)<br>• [ADR-0021: Graceful Degradation Plan B](docs/adr/0021-graceful-degradation-automated-fallback-and-continuity-plan-b.md)<br>• Machine Graph: [`/architecture.json`](docs/public/architecture.json) |

---

### 🎯 Active Target Roadmap

These items are actively being scoped into upcoming Architectural Decision Records:

1. **Green Team IaC Trigger Contract (`ADR-0022`)**:
   - Formally specify the trigger schema, rate-limiting envelope, and pull-request synthesis contracts that turn incident root causes into automated Infrastructure-as-Code hardening PRs.
2. **Tier 2 Secondary Authorizer Escalation Ladder (`ADR-0005` Amendment)**:
   - Codify the multi-signature authorizer failover and time-decay escalation policy when designated secondary commanders are unavailable during active crises.
3. **Evals-as-Code Grounding Fidelity Formulation (`ADR-0006` Amendment)**:
   - Define the mathematical calculation, dataset scoring methodology, and acceptance threshold ($\ge 95\%$) for LLM-as-a-judge grounding validation.

---

### 💡 Research & Ideas Backlog (Future Horizon)

Conceptual exploration and mathematical foundations for the post-v1.3 horizon:

* **TIDIR Core / Minimum Viable Architecture (MVA)**:
  - Formally specify the reference implementation for the leanest TIDIR-compliant deployment: `Telemetry Ingress ➔ OCSF Normalization ➔ Lakehouse / Hot Storage ➔ Polyglot DaC ➔ Findings ➔ Case Management ➔ Policy-Gated Actuation` (see [ADR-0012](docs/adr/0012-ai-orchestration-runtime-mcp-and-mvp-roadmap.md)).
* **Reference Workload Models ($W_1, W_2, W_3$)**:
  - Replace ungrounded latency/throughput metrics with parameterized workload models:
    $$W = \{\text{EPS}, \text{bytes/event}, \text{entities/day}, \text{cardinality}, \text{retention}, \text{hot \%}, \text{query concurrency}, \text{enrichment fanout}\}$$
  - Define benchmark profiles: $W_1$ (Mid-Market, 25k EPS), $W_2$ (Enterprise, 250k EPS), and $W_3$ (Hyperscale, 1M EPS).
* **Formal Bayesian Evidence Calibration Math**:
  - Provide concrete mathematical treatment and worked scenarios for dependency-aware evidence aggregation.
  - Contrast naive conditional independence $P(\text{Compromise} \mid E_1, E_2, E_3)$ with TIDIR DAG-governed lineage fusion.
* **Multi-Dimensional Containment Monotonicity ($R_{\text{attacker}}, A_{\text{business}}$)**:
  - Expand the Security-State Monotonicity invariant into a multi-objective state space balancing attacker reachability reduction against business operability and availability budgets.
* **SecOps Unit Economics Framework**:
  - Model telemetry economics as a first-class architectural dimension: $\Delta(\text{Marginal Defensive Value}) / \Delta(\text{Compute} + \text{Storage} + \text{Human Cost})$.
* **Reproducible Attack-to-Containment Benchmark Harness**:
  - Build an open, reproducible test harness replaying standardized attack chains (e.g. Atomic Red Team, CALDERA) over synthetic OCSF streams to benchmark MTTC and DAG reconstructability under induced failures.

---

## 🛠️ Tooling & Local Development

This repository uses [`bun`](https://bun.sh) for script execution, documentation serving, and diagram validation:

```bash
# Install dependencies
bun install

# Start local documentation server with live reload & Mermaid rendering
bun run docs:dev

# Build production static site to docs/.vitepress/dist
bun run docs:build

# Validate all Mermaid diagrams for syntax errors
bun run diagrams:validate
# Note: In isolated sandboxes, invoke directly:
# bun ./scripts/validate-diagrams.ts
```

---

## 🤝 How to Contribute

TIDIR is an open, vendor-neutral research project. We actively welcome contributions, critiques, and enhancements from security practitioners, detection engineers, data architects, and researchers.

### Ways to Contribute

1. **Open an Issue**:
   - **Propose New Capabilities**: Have an idea for a capability pattern or layer integration? Open an [Issue](https://github.com/Haribu/TIDIR/issues) with the `feature` or `rfc` label.
   - **Report Architectural Gaps or Bugs**: If you spot an unhandled attack path, schema inconsistency, broken diagram, or documentation error, please file an issue with context.
   - **Architectural Decision Records (ADRs)**: Propose a new ADR or debate an existing decision using our [ADR template](docs/adr/template.md).

2. **Submit a Pull Request (PR)**:
   - Fork the repository and create a branch from `main`:
     ```bash
     git checkout -b feat/my-architecture-proposal
     ```
   - Follow the established contribution standards:
     - **Vendor-Neutral First**: Keep architecture specifications decoupled from specific proprietary commercial platforms.
     - **Schema Alignment**: Telemetry must align with **OCSF**, CTI with **STIX 2.1**, and detection rules with declarative formats (**Sigma**).
     - **Diagram Syntax**: All diagrams must be written in Mermaid and pass validation (`bun run diagrams:validate`).
     - **ADR Required**: Any non-trivial technology recommendation or design shift must include an ADR in `docs/adr/`.
   - Open a PR against `main` explaining the rationale, threat model context, and operational impact.

3. **Direct Contact & Private Inquiries**:
   - If you prefer to discuss ideas privately, explore research collaboration, or share feedback outside of public GitHub threads, feel free to email:
     📧 **Harry McLaren** — [`info@harrymclaren.co.uk`](mailto:info@harrymclaren.co.uk)

---

## 📄 License & Attribution

This open architecture and research documentation is published under the **Apache License 2.0**. You are free to adopt, modify, and reference these patterns in your own security operations.

