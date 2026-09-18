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

## 🗺️ Roadmap & Research Wishlist (v0.2+)

TIDIR has established a comprehensive conceptual foundation across 36 capabilities and four operational layers. To ensure the architecture remains falsifiable, grounded, and practically adoptable, the v0.2+ roadmap focuses on mathematical rigor, implementation evidence, and operational economics:

1. **TIDIR Core / Minimum Viable Architecture (MVA)**:
   - Formally specify the leanest TIDIR-compliant system: $\text{Telemetry Ingress} \to \text{OCSF Normalization} \to \text{Lakehouse / Hot Storage} \to \text{Polyglot DaC} \to \text{Findings} \to \text{Case Management} \to \text{Policy-Gated Actuation}$.
   - Structure advanced components (streaming graph correlation, autonomous agent mesh, CTI retro-hunting, honeypots/deception) as progressive capability maturity tiers (Levels 1–4).

2. **Reference Workload Models ($W_1, W_2, W_3$)**:
   - Replace ungrounded latency/throughput metrics with parameterized workload models:
     $$W = \{\text{EPS, bytes/event, entities/day, cardinality, retention, hot \%, query concurrency, enrichment fanout}\}$$
   - Define reference test profiles: $W_1$ (Mid-Market, $25\text{k}$ EPS), $W_2$ (Enterprise, $250\text{k}$ EPS), and $W_3$ (Hyperscale, $1\text{M}$ EPS).

3. **Formal Bayesian Evidence Calibration Math**:
   - Provide concrete mathematical treatment and worked scenarios for dependency-aware evidence aggregation.
   - Contrast naive conditional independence $P(\text{Compromise} \mid E_1, E_2, E_3)$ with TIDIR DAG-governed lineage fusion, formalizing prior calibration across diverse asset populations, likelihood ratios, and missing observation handling.

4. **Multi-Dimensional Containment Monotonicity ($R_{\text{attacker}}, A_{\text{business}}$)**:
   - Expand the Security-State Monotonicity invariant ($R(s_{\text{post}}) \subseteq R(s_{\text{pre}})$) into a multi-objective state space balancing attacker reachability reduction against business operability and availability budgets.
   - Define formal boundaries within which automated containment actions are permitted to execute without human intervention.

5. **Threat-to-Assurance Traceability Matrix**:
   - Connect the STRIDE-aligned platform threat model directly to verification machinery via an assurance chain:
     $$\text{STRIDE Threat} \longrightarrow \text{Constitutional Invariant} \longrightarrow \text{Architectural Control} \longrightarrow \text{Automated Test} \longrightarrow \text{Verifiable CI Artifact}$$

6. **SecOps Unit Economics Framework**:
   - Model telemetry economics as a first-class architectural dimension: $\frac{\Delta \text{Marginal Defensive Value}}{\Delta \text{Compute + Storage + Human Cost}}$.
   - Provide mathematical decision models for hot/warm retention, streaming vs batch evaluation, model routing, and selective enrichment.

7. **Reproducible Attack-to-Containment Benchmark Harness**:
   - Build an open, reproducible test harness replaying standardized attack chains (e.g. Atomic Red Team, CALDERA) over synthetic OCSF streams.
   - Benchmark end-to-end Mean Time to Contain (MTTC), Incident Decision DAG reconstructability, and fail-secure behavior under induced system failure.

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

