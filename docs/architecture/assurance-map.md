# The TIDIR Assurance Case Map & Architecture Graph

> **Tier 1: Strategic Architecture** · **Audience**: Security Architects, Regulators, Researchers · **Normative Status**: Normative Reference  
> **Purpose**: Provides full bi-directional traceability from adversarial threats to constitutional invariants, capabilities, and empirical validation evidence.

---

## Architecture as a Connected Graph

In modern security architecture, declaring principles is insufficient without demonstrating how those principles resist active adversary subversion. The **TIDIR Assurance Case** establishes an explicit, machine-traceable relationship between identified threats against the defence system itself and the deterministic controls that preserve system integrity:

$$\text{Adversarial Threat} \longrightarrow \text{Invariant} \longrightarrow \text{Capability} \longrightarrow \text{Architectural Control} \longrightarrow \text{ADR} \longrightarrow \text{Validation Evidence}$$

```mermaid
flowchart LR
    T["Adversarial Threat\n(T1 - T6)"] --> I["Constitutional Invariant\n(I1 - I11)"]
    I --> C["Architectural Capability\n(DATA, DET, INV, RESP)"]
    C --> CTRL["Architectural Control\n(Boundary & Kernel)"]
    CTRL --> ADR["Governing ADR\n(Decision Record)"]
    ADR --> V["Empirical Evidence\n(Chaos & Benchmark)"]

    classDef nodeStyle fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#f8fafc;
    class T,I,C,CTRL,ADR,V nodeStyle;
```

---

## Bi-Directional Assurance Matrix

The table below maps each adversarial threat to its governing invariant, underpinning capabilities, deterministic control mechanism, and concrete empirical verification test:

| Threat ID & Name | Governing Invariant | Underpinning Capabilities | Architectural Control Mechanism | Governing ADR | Concrete Validation Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[THR-T1](/architecture/09-threat-model#threat-vectors)**: Sensor Evasion / Log Blinding | **[INV-01](/architecture/00-architectural-invariants#i1--telemetry-preservation)** (Telemetry Preservation)<br>**[INV-08](/architecture/00-architectural-invariants#i8--graceful-defensive-degradation)** (Degraded Defence) | `DATA-01`<br>`RESIL-01`<br>`RESIL-02` | Local NVMe ring buffering (24–48h), direct-to-object lakehouse bypass, out-of-band audit heartbeats. | [ADR-0021](/adr/0021-graceful-degradation-automated-fallback-and-continuity-plan-b) | Bus partition chaos test: zero dropped records during 24h simulated network isolation. |
| **[THR-T2](/architecture/09-threat-model#threat-vectors)**: Schema Poisoning / DoS Inundation | **[INV-01](/architecture/00-architectural-invariants#i1--telemetry-preservation)** (Telemetry Preservation)<br>**[INV-11](/architecture/00-architectural-invariants#i11--operational-portability--non-lock-in)** (Operational Portability) | `DATA-02`<br>`DATA-03` | Line-rate OCSF compiler validation, structured `unmapped_data` catch-all, isolated DLQ quarantine. | [ADR-0002](/adr/0002-preserve-unmapped-telemetry-in-ocsf) | Synthetic fuzzing suite: malformed JSON and corrupted payloads diverted to DLQ with zero parser crashes. |
| **[THR-T3](/architecture/09-threat-model#threat-vectors)**: Evidence Tampering / Audit Destruction | **[INV-02](/architecture/00-architectural-invariants#i2--evidence-provenance--traceability)** (Evidence Traceability)<br>**[INV-10](/architecture/00-architectural-invariants#i10--reconstructability-the-incident-decision-dag)** (Reconstructability) | `INV-04`<br>`RESIL-05` | Immutable WORM object storage, RFC 3161 cryptographic timestamps, append-only Incident Decision DAG. | [ADR-0001](/adr/0001-record-architecture-decisions)<br>[ADR-0010](/adr/0010-sabsa-business-architecture-and-attribute-profiling) | Cryptographic verification audit: mathematical non-repudiation and Merkle root verification over sealed dossiers. |
| **[THR-T4](/architecture/09-threat-model#threat-vectors)**: Indirect Prompt Injection / Cognitive Hijack | **[INV-04](/architecture/00-architectural-invariants#i4--authority-separation-trust-doctrine-maxim)** (Authority Separation)<br>**[INV-05](/architecture/00-architectural-invariants#i5--least-capability--ephemeral-identity)** (Least Capability) | `INV-05`<br>`AIGOV-02`<br>`AIGOV-06` | Agent Trust Boundary (dual-plane data/control isolator), read-only tools, ephemeral SPIFFE SVIDs ($\le 15\text{m}$). | [ADR-0004](/adr/0004-defensive-ai-runtime-and-prompt-injection-firewall)<br>[ADR-0015](/adr/0015-sandboxed-agent-execution-otlp-convergence-and-ephemeral-identity) | Continuous Evals-as-Code: prompt injection benchmark achieving zero unauthorised tool invocations across test corpus. |
| **[THR-T5](/architecture/09-threat-model#threat-vectors)**: Alert Storm DoS / Analyst Desensitisation | **[INV-03](/architecture/00-architectural-invariants#i3--evidential-independence-anti-shared-ancestry)** (Evidential Independence)<br>**[INV-06](/architecture/00-architectural-invariants#i6--bounded-autonomy--blast-radius)** (Bounded Autonomy) | `DET-04`<br>`DET-05`<br>`DET-06` | Dependency-aware risk compounding, supernode graph dampening, monthly SRE Alert Noise Error Budgets. | [ADR-0003](/adr/0003-graph-supernode-pruning-and-clustering-boundaries)<br>[ADR-0008](/adr/0008-secops-error-budgets-and-chaos-security-engineering)<br>[ADR-0009](/adr/0009-bayesian-multi-signal-risk-scoring) | Historical lakehouse backtesting: $\ge 75\%$ reduction in alert volume with noise budget false-positive rate $\le 5\%$. |
| **[THR-T6](/architecture/09-threat-model#threat-vectors)**: Automated Response Sabotage / Outage Trigger | **[INV-07](/architecture/00-architectural-invariants#i7--fail-secure-containment--reachability-monotonicity)** (Reachability Monotonicity)<br>**[INV-09](/architecture/00-architectural-invariants#i9--human-recoverability--break-glass-flight-decks)** (Human Recoverability) | `RESP-01`<br>`RESP-02`<br>`RESP-04` | Monotonic state machine ($s_{n+1} \preceq s_n$), pre-execution blast-radius scoring, master cryptographic E-Stop. | [ADR-0005](/adr/0005-saga-pattern-containment-and-break-glass-protocol) | Containment failure fault injection: verified forward perimeter escalation with zero security-state rollback. |

---

## Machine-Readable Model Access

The complete relationship graph is compiled deterministically during documentation build and exposed as standard JSON for automated agent retrieval and CI conformance testing:

* 📡 **Machine-Readable Graph Endpoint**: [`/architecture.json`](/architecture.json)
* 📄 **Complete LLM Corpus**: [`/llms-full.txt`](/llms-full.txt)
* 📋 **Curated LLM Summary**: [`/llms.txt`](/llms.txt)
