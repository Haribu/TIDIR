# Agent Instructions & Repository Guidelines — TIDIR

Welcome to the **TIDIR** (Threat Intelligence, Detection, Investigation & Response) repository. This project develops open, vendor-neutral research and target technology component architectures for modern security operations.

---

## 🧭 Repository Mission & Scope

TIDIR unifies four core security operational domains into a closed-loop architecture:
1. **Cyber Threat Intelligence (CTI)**: Ingestion, normalization, decay scoring, low-latency caching, and retro-hunting.
2. **Telemetry & Data Fabric**: Line-rate OCSF normalization, distributed streaming buses (Kafka/Redpanda), and dual-tier storage (Hot Index vs. Lakehouse).
3. **Detection Engineering**: Stateful streaming detection, lakehouse batch analytics, and GitOps Detection-as-Code (DaC).
4. **Investigation & Case Management**: Entity resolution, process/network graphs, unified timelines, and tamper-evident evidence lockers.
5. **Response & Automation (SOAR)**: Blast-radius risk-tiered playbook execution with strict human-in-the-loop authorization gates.

---

## 📁 Repository Structure

```
TIDIR/
├── README.md                      # Public project mission, overview & quickstart
├── AGENTS.md                      # Operational rules & developer guide for AI agents
├── package.json                   # Bun scripts, VitePress & tooling configuration
├── .gitignore                     # Git ignore rules
├── docs/
│   ├── index.md                   # VitePress documentation portal landing page
│   ├── architecture/
│   │   ├── 01-system-overview.md  # Target component architecture & topology
│   │   ├── 02-capability-model.md # Functional capability taxonomy matrix
│   │   └── components/            # Domain-level architecture specifications
│   │       ├── 01-threat-intelligence.md
│   │       ├── 02-data-fabric-telemetry.md
│   │       ├── 03-detection-engine.md
│   │       ├── 04-investigation-cases.md
│   │       └── 05-response-automation.md
│   ├── adr/                       # Architectural Decision Records (MADR format)
│   │   ├── template.md            # Standard ADR template
│   │   └── 0001-record-architecture-decisions.md
│   ├── diagrams/                  # Standalone Mermaid diagrams (.mmd)
│   │   └── tidir-target-architecture.mmd
│   └── .vitepress/                # VitePress theme, config & mermaid integration
│       └── config.ts
└── scripts/                       # Maintenance & deployment scripts (TypeScript)
    ├── validate-diagrams.ts       # Validates Mermaid syntax across .mmd files
    ├── setup-dns.ts               # Manages Cloudflare DNS records for custom domains
    └── deploy-cf.ts               # Automated Cloudflare Pages deployment script
```

---

## 🛠️ Tooling & Command Standards

This repository strictly uses [`bun`](https://bun.sh) for package management and script execution.

```bash
# Install dependencies
bun install

# Start local documentation server with live reload & Mermaid rendering
bun run docs:dev

# Build production static site to docs/.vitepress/dist
bun run docs:build

# Preview built static site locally
bun run docs:preview

# Validate all Mermaid diagrams for syntax errors
bun run diagrams:validate

# Deploy build artifacts to Cloudflare Pages
bun run deploy
```

---

## 📐 Architecture & Contribution Rules

1. **Standardized Schemas First**:
   - Telemetry models must map to the Open Cybersecurity Schema Framework (**OCSF**).
   - Threat intelligence structures must align with **STIX 2.1** / **TAXII 2.1**.
   - Detections must be expressed in vendor-neutral format (**Sigma** / YAML DSL).

2. **Diagram Standards**:
   - All architecture diagrams must be written in **Mermaid** and version-controlled.
   - Flow direction should standardise on `flowchart TB` or `flowchart LR`.
   - Subgraphs must group logical subsystems clearly.

3. **Architectural Decisions (ADR)**:
   - Any architectural decision, technology selection, or significant change must be accompanied by an ADR in `docs/adr/`.
   - Follow the established MADR template in `docs/adr/template.md`.

4. **Security & Secrets Non-Negotiable**:
   - **Zero credentials in Git**: Never commit API keys, tokens, or personal identifiers.
   - All external deployment tokens must be read from external local environment stores or CI secrets.
