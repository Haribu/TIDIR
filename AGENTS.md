# Agent Instructions & Repository Guidelines — TIDIR

Welcome to the **TIDIR** (Threat Intelligence, Detection, Investigation & Response) repository. This project develops open, vendor-neutral research and target technology component architectures for modern security operations.

---

## 🧭 Repository Mission & Scope

TIDIR unifies four core security operational domains into a closed-loop architecture:
1. **Cyber Threat Intelligence (CTI)**: Ingestion, normalization, decay scoring, low-latency caching, and retro-hunting.
2. **Telemetry & Data Fabric**: Line-rate OCSF normalization, distributed streaming buses (Kafka/Redpanda), and dual-tier storage (Hot Index vs. Lakehouse).
3. **Detection Engineering**: Stateful streaming detection, lakehouse batch analytics, and GitOps Detection-as-Code (DaC).
4. **Investigation & Case Management**: Entity resolution, process/network graphs, unified timelines, and tamper-evident evidence lockers.
5. **Response & Automation**: Blast-radius risk-tiered playbook execution with strict human-in-the-loop authorization gates.

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
# Note: In isolated sandboxes (where parent directory traversal is restricted), invoke directly:
# bun ./scripts/validate-diagrams.ts

# Deploy build artifacts to Cloudflare Pages
bun run deploy
```

---

## 📐 Architecture & Contribution Rules

1. **Standardized Schemas First**:
   - Telemetry models must map to the Open Cybersecurity Schema Framework (**OCSF**).
   - Threat intelligence structures must align with **STIX 2.1** / **TAXII 2.1**.
   - Detections must be expressed in Polyglot DaC format (vendor-neutral YAML metadata envelope with target-optimized query blocks; see [ADR-0019](docs/adr/0019-polyglot-detection-as-code-and-native-engine-adaptation.md)).

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

---

## ⚠️ Operational Gotchas & Agent Guidelines (Learned Lessons)

1. **Explicit Dependency Closure**:
   - Every package imported in `docs/.vitepress/config.ts`, `docs/`, or `scripts/` (e.g., `vitepress`, `vitepress-plugin-mermaid`, `markdown-it-mathjax3`) **must** be explicitly declared in `package.json` (`devDependencies` or `dependencies`).
   - Never assume packages exist ambiently in parent directories or developer global paths.

2. **Frozen Lockfile Discipline (`bun.lock`)**:
   - Any modification to `package.json` dependencies must be immediately followed by `bun install` with network access to re-sync and save `bun.lock`.
   - CI executes `bun install --frozen-lockfile`. If `package.json` and `bun.lock` diverge by even a single character, CI will fail immediately.

3. **Pre-Push Holistic Verification**:
   - Before pushing changes to `main`:
     1. Run diagram validation: `bun ./scripts/validate-diagrams.ts`
     2. Run docs build: `bun ./node_modules/.bin/vitepress build docs` (or `bun run docs:build`)
     3. Verify working tree is clean: `git status`
   - Never commit speculative fixes piecemeal to `origin/main` to test in CI. Verify local closure first.

4. **Runtime Standard (Zero Node/NPM)**:
   - Always invoke commands using `bun` / `bunx`. Never attempt `node`, `npm`, or `npx`.

5. **Branch Protection & Production Gating**:
   - The `main` branch enforces required CI checks (`Validate Diagrams & Build Site`) and requires 1 approving review on pull requests from external contributors.
   - Force-pushes (`allow_force_pushes: false`) and branch deletions (`allow_deletions: false`) are strictly prohibited.
   - Repository administrator (`Haribu`) retains push privileges to `main` when local verification passes.

