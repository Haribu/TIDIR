# TIDIR — Threat Intelligence, Detection, Investigation & Response

> **Target Architecture & Research Platform**  
> A unified, open, modular reference architecture for modern security operations.

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
    │ Response Automation  │─────────────┘
    └──────────────────────┘
```

The objective is to establish an actionable, vendor-neutral target technology architecture that solves modern operational challenges: alert fatigue, telemetry fragmentation, delayed containment, and disparate case management.

---

## 🏛️ Architecture Documentation

The documentation is organized logically across strategy, capability mapping, detailed component engineering, and formal decisions:

- **Target System Architecture**: [`docs/architecture/01-system-overview.md`](docs/architecture/01-system-overview.md) — Comprehensive target state component topology, dataflows, contracts, and interaction patterns.
- **Capability Model**: [`docs/architecture/02-capability-model.md`](docs/architecture/02-capability-model.md) — Core functional capabilities required across the TIDIR lifecycle.
- **Component Specifications**:
  - [01 - Threat Intelligence Platform (CTI)](docs/architecture/components/01-threat-intelligence.md): Feed ingestion, STIX/TAXII, IOC scoring, and campaign attribution.
  - [02 - Data Fabric & Telemetry](docs/architecture/components/02-data-fabric-telemetry.md): Event ingestion, schema normalization (OCSF), message brokers, lakehouse storage.
  - [03 - Detection Engine](docs/architecture/components/03-detection-engine.md): Stream analytics, Sigma rule compilation, UEBA, and correlation.
  - [04 - Investigation & Case Management](docs/architecture/components/04-investigation-cases.md): Evidence graphs, entity timeline reconstruction, triage workflows.
  - [05 - Response & Automation](docs/architecture/components/05-response-automation.md): SOAR workflows, playbook execution, human-in-the-loop gating, automated containment.
- **Architectural Decision Records (ADRs)**: [`docs/adr/`](docs/adr/) — Immutable records of key architectural decisions.
- **Diagrams**: [`docs/diagrams/`](docs/diagrams/) — Source `.mmd` files for system diagrams.

---

## 📐 Architecture Principles

1. **Schema Standardization First**: Telemetry and alerts adopt standardized schemas (OCSF, STIX 2.1) early in the pipeline to prevent vendor lock-in.
2. **Streaming-First with Lakehouse Persistence**: Decouple real-time detection streams from petabyte-scale historical search and model training.
3. **Detection-as-Code (DaC)**: All rules, analytics, and correlation logic are managed in Git, version-controlled, tested, and validated in CI/CD pipelines.
4. **Bi-directional Intel Loops**: Investigation discoveries and response artifacts automatically enrich Threat Intelligence feeds for retroactive retro-hunts and detection tuning.
5. **Human-in-the-Loop Orchestration**: Autonomous response is scoped by blast radius; high-impact actions mandate structured analyst authorization.

---

## 🛠️ Tooling & Scripts

This repository uses [`bun`](https://bun.sh) for lightweight scripts and tooling:

```bash
# Install dependencies
bun install

# Validate Mermaid diagrams
bun run diagrams:validate

# Lint markdown files
bun run lint:md
```
