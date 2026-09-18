# 0009. Bayesian Multi-Signal Risk Scoring (Overcoming the Base Rate Fallacy)

* Status: accepted
* Deciders: Architecture Team / Harry
* Date: 2026-09-15

## Context and Problem Statement

A fundamental mathematical challenge in detection engineering is the **False Positive Paradox**, caused by the **Base Rate Fallacy**. In an enterprise environment processing hundreds of millions of events daily, malicious activity represents an infinitesimally small fraction of total telemetry (< 0.0001%). 

Under Bayes' theorem:
$$P(\text{Intrusion} \mid \text{Alert}) = \frac{P(\text{Alert} \mid \text{Intrusion}) \cdot P(\text{Intrusion})}{P(\text{Alert})}$$

If the prior probability of an intrusion $P(\text{Intrusion})$ is negligible, even a detection rule or machine learning classifier with 99% specificity will generate an overwhelming majority of false-positive alarms. Elevating isolated, single-event anomalies (e.g. an unusual PowerShell flag or a new administrative IP) directly to analyst queues inevitably causes severe cognitive fatigue and missed intrusions.

How does the architecture mathematically suppress the Base Rate Fallacy and ensure that only high-probability, actionable findings reach human operators?

## Decision Drivers

* Elimination of single-event false-alarm cascades.
* Mathematical grounding of risk elevation using compounding independent evidence signals.
* Seamless integration with normalized OCSF event graphs and entity resolution.
* Strict vendor-neutrality and capability-driven definitions.

## Considered Options

1. **Threshold Tuning on Single-Event Alerts**: Increase alert thresholds on individual rules (e.g. alert only after 20 failed logins instead of 5).
2. **Machine Learning Anomaly Scores Without Context**: Use standalone unsupervised anomaly scores to flag outliers.
3. **Compound Bayesian Risk Lens over Relational Execution Graphs (Selected)**.

## Decision Outcome

Chosen option: **Compound Bayesian Risk Lens over Relational Execution Graphs**, because:

### 1. Weak Signals vs. Actionable Findings
- The architecture introduces an explicit separation between **Signals** and **Findings**:
  - **Weak Signals (Vertex Properties)**: Individual detection rules, statistical anomalies, and IOC matches are not emitted as standalone alerts. They are appended as temporal properties to entities in the in-memory execution graph (Layer 3).
  - **Elevated Findings (OCSF Class 2001/2004)**: An incident dossier is only elevated to Layer 4 when the compound Bayesian risk score crosses the elevation threshold ($S \ge 75/100$).

### 2. Multi-Factor Evidence Compounding
- The Risk Lens calculates posterior intrusion probability by multiplying independent, orthogonal evidence vectors:
  $$S = f(\text{Adversary TTP Severity}, \text{Asset Criticality}, \text{Identity Privilege}, \text{Corroborating Observables})$$
  - *Asset Criticality Multiplier*: Weights findings based on CMDB crown-jewel status (e.g. Domain Controller / Prod DB vs. Ephemeral Dev VM).
  - *Identity Privilege Multiplier*: Weights findings based on high-privilege credentials (e.g. Domain Admin or Cloud Root vs. standard user).
  - *Orthogonal Domain Corroboration*: Requires corroboration across at least two independent domains (e.g. an unusual parent-child process chain *and* an outbound connection to an unclassified ASN) before elevating risk.
- Isolated anomalies that fail to accumulate corroborating signals within a configurable time window decay naturally without operator intervention.

### 3. Deterministic Override Circuit (Preventing Single-Event False Negatives & Guarding Against Operational DoS)
- **The Threat**: Stealthy adversaries intentionally engineer single-action, low-telemetry exploits (e.g. Bring Your Own Vulnerable Driver / BYOVD kernel tampering, LSASS memory injection, or canary token detonation). Mandating multi-signal corroboration for all alerts introduces a catastrophic **False Negative bias** where a lethal intrusion is suppressed because subsequent detection stages were evaded.
- **Dual-Path Elevation Architecture**:
  - *Probabilistic Path (Weak Signals)*: Heuristics, statistical baselines, and behavioural anomalies continue through graph compounding and decay logic.
  - *Deterministic Override Circuit (Invariants & Canaries)*: Pre-certified high-consequence triggers—such as [ADR-0013](0013-ambient-deception-fabric-and-canary-anchors.md) canary honeytokens, blocklisted vulnerable kernel driver loads, or rapid cryptographic extension renaming—**bypass graph compounding entirely**.
  - When an override invariant triggers, the Risk Lens instantly assigns a critical composite score ($S = 100$) and dispatches an emergency OCSF Class 2004 finding directly to Layer 4 with zero correlation delay.
- **Dynamic Blast-Radius Rate Limiting (Anti-Operational DoS)**:
  - *Vulnerability*: Adversaries aware of deterministic trigger invariants could weaponize high-fidelity indicators (e.g. spoofing C2 beacons or planting canary hashes in shared volumes) to flood the SOC or force automated operational lockdowns.
  - *Token-Bucket Rate Limiter*: The deterministic bypass path enforces a strict token-bucket rate limiter constrained by identity context, asset class, and network subnet ($\beta_{\text{override}} \le N_{\max}/\Delta t$, e.g. max 5 override triggers per subnet/hour).
  - *Graceful Downgrade*: If the frequency of deterministic overrides exceeds the threshold for a given scope, the engine automatically downgrades subsequent triggers to high-priority Bayesian queueing ($S = 85$) with immediate notification to the lead detection engineer, preventing denial-of-service against the control plane while preserving alert visibility.

### Positive Consequences

* Mathematically neutralises the Base Rate Fallacy, dropping false-positive triage load by $> 75\%$.
* Guarantees that every elevated finding delivered to an analyst carries a multi-signal contextual narrative.
* Prevents brittle thresholding from blinding the system to slow-and-low multi-stage intrusions.
* Eliminates the risk of single-event suppression through the Deterministic Override Circuit.

### Negative Consequences

* Introduces short in-memory graph correlation windows (typically 15–30 minutes) before certain compound findings elevate.
* Highly sophisticated attacks executing an isolated single-action exploit against non-critical assets must rely on lakehouse batch sweeps (`DET-02`) if real-time corroboration is absent and no deterministic invariant rule applies.
