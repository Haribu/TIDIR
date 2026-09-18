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
└── scripts/                       # Maintenance & verification scripts (TypeScript)
    ├── validate-diagrams.ts       # Validates Mermaid syntax across .mmd files
    ├── lint-site-structure.ts     # Asserts navigation, ADR registry & document closure
    ├── lint-terminology.ts        # Validates controlled architectural vocabulary
    ├── build-docs.ts              # Production static site compiler
    └── setup-dns.ts               # Manages Cloudflare DNS records for custom domains
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
bun ./scripts/build-docs.ts # In sandboxes; or `bun run docs:build` in standard terminal

# Preview built static site locally
bun run docs:preview

# Validate all Mermaid diagrams for syntax errors
bun ./scripts/validate-diagrams.ts # In sandboxes; or `bun run diagrams:validate`

# Check site structure, ADR registry parity & zero orphaned docs
bun ./scripts/lint-site-structure.ts # In sandboxes; or `bun run lint:structure`

# Check architectural terminology and diagram text consistency
bun ./scripts/lint-terminology.ts # In sandboxes; or `bun run lint:terminology`

# Run full holistic verification suite
bun run verify # Or run the 4 scripts individually in sandboxes

# Deployments (Cloudflare Pages):
# Direct local deployments are strictly retired.
# Deployments occur exclusively and automatically via GitHub Actions (.github/workflows/deploy-pages.yml) upon push to `main`.
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

5. **Target Invariants vs. Empirical Guarantees (Discipline of Claims)**:
   - **Editorial Rule**: *Architectures specify mechanisms and target properties. Experiments establish outcomes.*
   - **No Absolutist Guarantees**: Never claim that the architecture "guarantees zero data loss", "guarantees 100% detection", "eliminates all hallucinations", or "provides strict immunity". Distributed networks partition, OS kernels drop packets under storm conditions, and probabilistic models hallucinate.
   - **Separate Intent from Demonstrated Properties**: Explicitly articulate what the architecture is *designed to enforce* (declarative invariants, schemas, boundaries) versus what requires empirical testing and measurement.
   - **The WHAT and WHY over the HOW**: Articulate the capabilities and invariants at the reference architecture tier. Offload runtime parameters, mathematical tuning, and distributed systems recovery mechanics into Tier 3 ADRs.

6. **First-Class Failure & Graceful Degradation**:
   - Every specification must account for component degradation. When describing a capability, address:
     1. *Failure Mode*: What happens when the underlying bus, engine, or API fails?
     2. *Observability ("How We Know")*: What active probe, canary, or metric signals degradation?
     3. *Continuity Plan B*: What deterministic fallback or manual flight deck maintains operational continuity? (See [ADR-0021](docs/adr/0021-graceful-degradation-automated-fallback-and-continuity-plan-b.md)).

7. **The TIDIR Trust Doctrine & Security-State Monotonicity**:
   - **Trust Doctrine Maxim**: *"Probabilistic components may propose. Deterministic components authorize."* Probabilistic models (LLMs, neural embeddings, clustering heuristics) operate in a strictly read-only analytical capacity. All mutations, containment state transitions, and tool calls are governed by deterministic schemas, policy validators, and human consensus gates.
   - **Prompt Injection as an Architectural Assumption**: Assume untrusted telemetry can and will influence reasoning; system safety relies entirely on deterministic external boundaries, ephemeral read-only SVIDs, and typed parameters.
   - **Security-State Monotonicity**: Every automated workflow must satisfy $R(s_{\text{post}}) \subseteq R(s_{\text{pre}})$. No automated compensation, retry, or failure recovery may expand attacker reachability beyond the current verified-safe security posture.

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
     2. Run site structure check: `bun ./scripts/lint-site-structure.ts`
     3. Run terminology check: `bun ./scripts/lint-terminology.ts`
     4. Run docs build: `bun ./scripts/build-docs.ts` (or `bun ./node_modules/.bin/vitepress build docs`)
     5. Verify working tree is clean: `git status`
   - Never commit speculative fixes piecemeal to `origin/main` to test in CI. Verify local closure first.

4. **Runtime Standard (Zero Node/NPM)**:
   - Always invoke commands using `bun` / `bunx`. Never attempt `node`, `npm`, or `npx`.

5. **Branch Protection & Production Gating**:
   - The `main` branch enforces required CI checks (`Validate Diagrams & Build Site`) and requires 1 approving review on pull requests from external contributors.
   - Force-pushes (`allow_force_pushes: false`) and branch deletions (`allow_deletions: false`) are strictly prohibited.
   - Repository administrator (`Haribu`) retains push privileges to `main` when local verification passes.

6. **Exclusive Deployment via GitHub Actions (Zero Local/Direct Deployments)**:
   - Deployments to Cloudflare Pages occur **strictly and exclusively via GitHub Actions** (`.github/workflows/deploy-pages.yml`) upon push to `main`.
   - Direct local deployments (via CLI scripts, local Wrangler, or bypassing CI/CD) are permanently retired and deliberately non-functional to eliminate configuration drift and out-of-band state mutation.
   - All code, specification, and diagram changes must pass local holistic verification (`bun run verify`) before pushing to `main`. Once pushed, GitHub Actions handles build verification, automated testing, and production deployment.

7. **LaTeX Math Escaping for VitePress / Markdown-it**:
   - When writing inline math containing relational comparisons ($<$, $>$, $\le$, $\ge$), **never use raw `<` or `>`** inside dollar delimiters (e.g. avoid `$< 5s$`). The VitePress markdown parser treats `<` as an unclosed HTML opening tag and silently swallows or drops the expression in rendered HTML.
   - Always use LaTeX macros: `\lt`, `\gt`, `\le`, and `\ge` (e.g. `$\lt 5\text{s}$`, `$\gt 15\,\text{seconds}$`, `$\text{FPR} \le 5\%$`).

