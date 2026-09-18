# The TIDIR Architectural Constitution: Invariants & Safety Principles

> **Tier 1: Strategic Architecture** · **Golden Path Step 2 of 5** · **Audience**: All Audiences · **Normative Status**: Normative  
> **Prerequisites**: [Step 1: What is TIDIR?](/guide/what-is-tidir) · **Next Step**: [Step 3: System Overview & 4-Plane Model](/architecture/01-system-overview)

---

Modern security operations cannot rely on monolithic assumptions of correctness. Distributed networks partition, OS kernels drop packets under storm conditions, adversary telemetry can be poisoned, and probabilistic models can hallucinate. 

**TIDIR** (Threat Intelligence, Detection, Investigation & Response) is fundamentally a **safety architecture for autonomous cyber defence**. Rather than merely presenting a collection of technology components, it defines the invariant boundaries and mathematical constraints governing the interaction between uncertain evidence, probabilistic reasoning, deterministic authority, and physical actuation.

---

## 1. The Confidence–Authority Separation Principle

The central thesis of the TIDIR architecture is the strict decoupling of analytical belief from operational action:

> [!IMPORTANT]
> **The Confidence–Authority Separation Principle**:
> *Epistemic confidence SHALL NOT implicitly confer operational authority. Authority is independently derived from policy, identity, asset criticality, blast-radius constraints, and human governance.*

A probabilistic reasoning model or Bayesian correlation engine may compute a $99.9\%$ confidence score that a database cluster is compromised. That confidence provides **zero self-granting authority** to sever network links or isolate the host. 

Conversely, interaction with a high-fidelity canary credential produces mathematically indisputable evidence, yet the response policy still constrains the blast radius to non-destructive session freezing if the entity is designated as Tier 0 critical infrastructure.

### The Hierarchy of Defence Reasoning

Every security transition in TIDIR traverses a strict unidirectional chain:

```
Untrusted Observations (Layer 1)
     │
     ▼
Detections & Parsers (Layer 2)
     │
     ▼
Evidence Lineage & Confidence Estimation (Layer 3)
     │
     ▼
Investigative Hypotheses (Layer 4 Specialist Mesh)
     │
     ▼
Independent Adversarial Challenge (Challenger Model / Symbolic Verifier)
     │
     ▼
Permissible Policy & Capability Scope (Deterministic Safety Kernel / SVIDs)
     │
     ▼
Blast-Radius & Criticality Simulation (Pre-Execution Card)
     │
     ▼
Deterministic / Consensus Authorisation Gates (Dual-Auth / Break-Glass)
     │
     ▼
Monotonic Environmental Actuation (Connectors / Forward Escalation)
     │
     ▼
Closed-Loop Feedback & Evals (Continuous Calibration)
```

---

## 2. The 11 Non-Negotiable Invariants

All architectural layers, components, and Architectural Decision Records (ADRs) must strictly preserve these eleven foundational invariants:

### I1 — Telemetry Preservation
*Absence of current detection value does not justify destruction of forensic evidence.*
- **Invariant Property**: Ingested telemetry must survive and remain queryable in an open, vendor-neutral, schema-agnostic representation. Telemetry is never dropped at the edge merely because no active detection rule currently queries it.
- **Reference Pattern**: Line-rate stream ingestion into open columnar lakehouses (`L2_STORAGE`) backed by object storage (e.g., Apache Iceberg / Parquet). Governed evidence compaction that provably preserves forensic reconstructability is permitted.

### I2 — Evidence Provenance & Traceability
*Every consequential machine assertion is traceable to underlying raw observations.*
- No detection finding, agent hypothesis, or containment recommendation may exist without explicit citation to immutable observation identifiers (`source_observation_ids`) and derivation lineage (`derivation_chain`). Uncited claims are deterministically rejected.

### I3 — Evidential Independence (Anti-Shared Ancestry)
*Common ancestry cannot be represented as independent corroboration.*
- **Invariant Property**: Correlated derivations sharing common ancestry cannot masquerade as independent evidence. Evidence aggregation across orthogonal sensor domains must discount co-derived signals to their residual information gain.
- **Reference Pattern**: Dependency-aware probabilistic risk compounding (such as Bayesian graph compounding or factor graphs) explicitly penalising shared parent nodes in the entity-finding graph.

### I4 — Authority Separation (Trust Doctrine Maxim)
*Probabilistic components propose. Deterministic components authorize.*
- Neural transformer models, large language models (LLMs), clustering heuristics, and probabilistic classifiers operate strictly in read-only analysis mode. No machine actor receives execution authority merely because another component asserts it is correct.

### I5 — Least Capability & Ephemeral Identity
*Machine identities receive only task-scoped, short-lived authority.*
- **Invariant Property**: Machine authority must be short-lived, workload-bound, and strictly task-scoped. Machine actors never hold permanent ambient API keys or credentials.
- **Reference Pattern**: Task-scoped cryptographic attestation issuing ephemeral X.509 certificates (e.g., SPIFFE/SPIRE Verifiable Identity Documents / SVIDs) valid for $\le 15\text{ minutes}$ (valid for a maximum lifetime of 15 minutes), with capability constraints enforced at the network and API layers.

### I6 — Bounded Autonomy & Blast Radius
*Autonomous execution is strictly constrained by time, cost, scope, and blast radius.*
- Automated actions enforce hard ceilings: wall-clock execution timeouts ($\le 180\text{s}$, max 180 seconds), financial inference limits ($\le \$2.50$, max $2.50), max tool-hops ($\le 8$, max 8 tool invocations), and asset criticality boundaries. Critical assets are immune to automated destructive isolation.

### I7 — Fail-Secure Containment & Reachability Monotonicity
*Partial failure cannot silently restore attacker reachability ($s_{n+1} \preceq s_n$, where post-transition reachability is a subset of pre-transition reachability).*
- **Invariant Property**: Containment workflows execute declarative state machines where forward compensation is permitted, but security barriers never roll back upon downstream API errors. Failures freeze perimeters in place and escalate forward to broader network boundaries.
- **Formal State Ordering ($\mathcal{S}_{n+1} \preceq \mathcal{S}_n$)**: Attacker reachability is not a simple scalar; a security state is defined as the tuple $\mathcal{S} = \langle \mathcal{R}_{\text{net}}, \mathcal{R}_{\text{id}}, \mathcal{E}_{\text{surface}}, \mathcal{V}_{\text{telemetry}} \rangle$. A state transition $s_n \to s_{n+1}$ is strictly monotonic (i.e. post-transition reachability remains a subset of pre-transition reachability) if and only if:
  $$\mathcal{R}_{\text{net}}(s_{n+1}) \subseteq \mathcal{R}_{\text{net}}(s_n) \quad \land \quad \mathcal{R}_{\text{id}}(s_{n+1}) \subseteq \mathcal{R}_{\text{id}}(s_n) \quad \land \quad \mathcal{E}_{\text{surface}}(s_{n+1}) \subseteq \mathcal{E}_{\text{surface}}(s_n) \quad \land \quad \mathcal{V}_{\text{telemetry}}(s_{n+1}) \supseteq \mathcal{V}_{\text{telemetry}}(s_n)$$
  Any action that would increase reachability or attack surface without explicit human authorization is deterministically rejected.

### I8 — Graceful Defensive Degradation
*Failure of an advanced capability reduces sophistication, never total visibility.*
- The architecture implements four continuous operational tiers. If streaming buses, graph stores, or cloud AI gateways experience outages, systems automatically degrade to local edge spooling, scheduled batch sweeps, and deterministic Zero-AI tabular timelines.

### I9 — Human Recoverability & Break-Glass Flight Decks
*Autonomous control planes always preserve independently accessible manual flight decks.*
- Humans retain permanent, out-of-band control. The system provides a cryptographic master E-Stop to halt automated mutations, paired with a dual-authorized break-glass protocol for machine-speed emergencies that broadcasts signed audit trails.

### I10 — Reconstructability (The Incident Decision DAG)
*Consequential decisions can be deterministically reconstructed from immutable records.*
- Every investigative finding, hypothesis, decision, and response action is committed as a cryptographically sealed edge in the **Incident Decision DAG**, capturing exact model versions, raw input hashes, authorizing keys, and environmental outcomes.

### I11 — Operational Portability & Non-Lock-In
*Vendor neutrality is an architectural invariant, not merely a design intention.*
- **Invariant Property**: No consequential security telemetry, detection logic, investigative case state, policy definition, or audit lineage SHALL be irrecoverably dependent upon a proprietary execution environment or vendor-controlled storage format.
- **Exit & Interoperability Criteria**: Conformance requires full bi-directional exportability and replayability using open representations: telemetry in OCSF / open columnar formats (Parquet/Iceberg), detections in Polyglot DaC, threat intelligence in STIX 2.1 / TAXII 2.1, and execution lineage in open JSON-LD / DAG structures.

---

## 3. Global Claims Discipline & Editorial Standards

To ensure architectural credibility and scientific rigor, TIDIR documentation adheres to strict language discipline:

| Prohibited Marketing Absolute | Mandated Architectural Formulation | Rationale |
| :--- | :--- | :--- |
| "Eliminates hallucinations" | "Reduces unsupported or erroneous recommendations via evidence grounding and adversarial verification" | Probabilistic models can always produce errors; safety comes from external bounding, not model infallibility. |
| "Absolute Data Sovereignty" | "On-Premises Data Boundary Enforcement via Sovereign Inference Clusters" | Sovereignty depends on full supply chains, physical security, and networks, not just local inference. |
| "Solves the Base Rate Fallacy" | "Mitigates the operational consequences of the Base Rate Fallacy via dependency-aware evidence aggregation" | The mathematical base rate phenomenon persists; the system manages its impact on alert volume. |
| "Guarantees zero data loss" | "Designed to prevent telemetry loss via local NVMe spooling and direct-to-object bypass" | Catastrophic physical failures can cause loss; architectures specify mechanisms, experiments verify outcomes. |
| "Zero-risk response automation" | "Blast-radius bounded response automation with pre-execution impact simulation" | Any automated operational action carries non-zero risk of disruption. |

---

## 4. ADR Governance & Invariant Matrix

Every Architectural Decision Record (ADR) in TIDIR must explicitly declare its invariant mapping in the MADR structure:
* **Preserves**: Invariants actively enforced or strengthened by the decision.
* **Potential Tensions & Boundary Conditions**: Invariants requiring explicit trade-off management or circuit breakers.
* **Empirical Validation Strategy**: Concrete tests, benchmarks, or chaos experiments proving invariant preservation under hostile or degraded conditions.
