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
├── verify                         # Executable CLI: runs full local verification suite
├── ship                           # Executable CLI: verified pre-push & deployment runner
└── scripts/                       # Maintenance & verification scripts (TypeScript)
    ├── verify.ts                  # Holistic verification suite orchestrator
    ├── validate-diagrams.ts       # Validates Mermaid syntax across .mmd and markdown files
    ├── lint-site-structure.ts     # Asserts navigation, ADR registry & document closure
    ├── lint-terminology.ts        # Validates controlled architectural vocabulary
    ├── lint-docs-math.ts          # Audits compiled HTML for MathJax rendering errors
    ├── build-docs.ts              # Production static site compiler with sitemap
    ├── generate-llms-full.ts      # Compiles single-file corpus for LLMs (llms-full.txt)
    ├── verify-live.ts             # Asserts production HTTP 200 health via native fetch
    └── ship.ts                    # Verified release automation pipeline
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
./verify # Or `bun ./scripts/verify.ts` (runs universally in sandboxes, CI, and standard shells)

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
   - **No Self-Granting Authority**: No component receives execution authority merely because another component believes it is correct.
   - **Prompt Injection as an Architectural Assumption (Agent Trust Boundary)**: Assume untrusted telemetry can and will influence reasoning; system safety relies entirely on deterministic external boundaries (the Agent Trust Boundary), ephemeral read-only SVIDs, and typed parameters. Prompt injection is assumed possible; the architecture prevents successful injection from becoming unauthorized authority.
   - **Multi-Model Critique is Advisory, Not Authoritative**: While diverse models provide useful defense-in-depth critique, foundation models sharing common training corpora cannot be assumed epistemically independent. Agreement between models is never treated as proof of safety; deterministic invariant evaluation and schema validation are the sole prerequisites for execution authority.
   - **Security-State Monotonicity ($R(s_{\text{post}}) \subseteq R(s_{\text{pre}})$)**: *Forward compensation is permitted. Security-state regression is not.* A compensating action MUST NOT increase attacker reachability beyond the last verified-safe security state without explicit human authorisation.

8. **Acronym Expansion on First Use (Readability & Narrative Quality)**:
   - Always spell out and explain acronyms on their first appearance per document (e.g. *Open Cybersecurity Schema Framework (OCSF)*, *Detection-as-Code (DaC)*, *Cyber Threat Intelligence (CTI)*, *Mean Time to Detect (MTTD)*, *Mean Time to Contain (MTTC)*, *Security Operations Center (SOC)*, *Directed Acyclic Graph (DAG)*, *Small Language Model (SLM)*, *SPIFFE Verifiable Identity Document (SVID)*, *Single Point of Failure (SPOF)*).
   - This ensures the architecture remains clear, educational, and accessible without assuming prior jargon familiarity.

9. **The TIDIR Architectural Constitution (10 Non-Negotiable Invariants)**:
   All specifications, ADRs, and implementations must strictly preserve:
   1. *Telemetry Preservation*: Raw forensic evidence is not discarded solely because no current detection consumes it. Semantic telemetry rejection (dropping events because no rule currently queries them) is strictly prohibited. Governed evidence compaction (policy-driven retention tiering, structural deduplication, or cold lakehouse compaction that provably preserves forensic reconstructability) is permitted.
   2. *Evidence Traceability*: Every consequential assertion is traceable to underlying raw observations.
   3. *Dependency-Aware Confidence*: Correlated derivations sharing common ancestry cannot masquerade as independent evidence.
   4. *No Self-Granting Authority*: Probabilistic components propose; deterministic components authorise.
   5. *Least Capability*: Every machine actor receives only task-scoped, ephemeral authority (SPIFFE SVIDs).
   6. *Fail-Secure Posture*: Component failure cannot silently increase attacker reachability ($R(s_{\text{post}}) \subseteq R(s_{\text{pre}})$).
   7. *Bounded Autonomy*: Autonomous execution has explicit temporal, financial, computational, and blast-radius limits.
   8. *Human Recoverability*: Autonomous control planes always preserve independently accessible manual flight decks (master E-stop, break-glass).
   9. *Degraded Defence*: Loss of an advanced capability reduces sophistication, never total visibility (graceful degradation).
   10. *Reconstructability*: Consequential decisions and actions can be deterministically reconstructed after the fact via the Incident Decision DAG.

10. **Normative Architecture vs. Reference Implementation (RFC 2119 Discipline)**:
    - All specifications must strictly distinguish architectural invariants from illustrative reference technologies using RFC 2119 keywords (`MUST`, `SHOULD`, `MAY`).
    - Declarative schemas (OCSF, STIX 2.1, TAXII), workload identities (SPIFFE SVIDs), state-machine contracts, and the 10 Invariants are **MUST**.
    - Specific concrete technologies (e.g. Kafka, Redpanda, ClickHouse, Apache Iceberg, Falco, DuckDB) are designated as **REFERENCE IMPLEMENTATION** or **EXAMPLE** to maintain pure vendor-neutrality.

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
     1. Run the unified verification suite: `./verify` (or `bun ./scripts/verify.ts`)
        (Executes site structure check, terminology check, Mermaid syntax validation, docs build with sitemap and llms.txt compilation, and MathJax HTML audit).
     2. Verify working tree is clean: `git status`
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
   - All code, specification, and diagram changes must pass local holistic verification (`./verify` or `bun ./scripts/verify.ts`) before pushing to `main`. Once pushed, GitHub Actions handles build verification, automated testing, and production deployment.

7. **LaTeX Math Escaping for VitePress / Markdown-it**:
   - When writing inline math containing relational comparisons ($<$, $>$, $\le$, $\ge$), **never use raw `<` or `>`** inside dollar delimiters (e.g. avoid `$< 5s$`). The VitePress markdown parser treats `<` as an unclosed HTML opening tag and silently swallows or drops the expression in rendered HTML.
   - Always use LaTeX macros: `\lt`, `\gt`, `\le`, and `\ge` (e.g. `$\lt 5\text{s}$`, `$\gt 15\,\text{seconds}$`, `$\text{FPR} \le 5\%$`).

