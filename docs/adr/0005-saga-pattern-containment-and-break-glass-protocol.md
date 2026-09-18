# 0005. Saga-Pattern Containment Workflows and Break-Glass Emergency Protocols

* Status: accepted
* Deciders: Architecture Team / Harry
* Date: 2026-09-15

## Context and Problem Statement

Automated security response actions interact with heterogeneous downstream APIs across host enforcement, identity providers, network firewalls, and cloud control planes. During active security incidents, these downstream control planes frequently encounter transient failures, rate limiting, or network degradation. 

If a multi-step containment workflow experiences a partial failure (for example: successfully revoking an identity session, but failing to isolate the compromised host due to an endpoint timeout), the enterprise environment is left in an inconsistent and vulnerable state.

Additionally, while human-in-the-loop consensus gates are necessary to protect business continuity from false-positive containment disruptions, high-velocity outbreaks (e.g. automated ransomware propagation or active cloud credential exfiltration) occurring during off-hours can cause devastating damage if delayed by multi-signature approval queues.

How does the architecture guarantee reliable, consistent automated containment while providing a deterministic, auditable emergency override path for high-velocity threats?

## Decision Drivers

* High availability and deterministic state consistency across distributed containment APIs.
* Absolute prevention of orphaned or half-executed containment actions.
* Minimization of dwell time during critical, catastrophic security outbreaks.
* Complete cryptographic non-repudiation and auditability for all automated and manual response actions.

## Considered Options

1. **Best-Effort Sequential Execution**: Fire API calls in sequence without compensation or state tracking; alert human operators on failure.
2. **Synchronous Two-Phase Commit (2PC)**: Attempt distributed locking across all target APIs before committing state changes.
3. **Monotonic Containment State Machine with Asymmetric Forward Escalation and Audited Break-Glass Override (Selected)**.

## Decision Outcome

Chosen option: **Saga Orchestration Pattern with Asymmetric Fail-Secure Forward Escalation and Audited Break-Glass Override**, because:
- **Asymmetric Security Containment Engine**: Containment workflows are executed as distributed Sagas, but with a critical security departure from commercial transaction processing: **Security containment operations are asymmetric and fail-secure**.
  - If any step in a forward containment sequence ($T_1 \dots T_n$) fails after exhausted idempotent retries and exponential backoff, the orchestrator **NEVER rolls back or reverses previously executed containment actions** ($C_{i-1} \dots C_1$). Reversing containment (e.g. un-quarantining a host or re-enabling a revoked session token because a firewall API timed out) actively restores adversary footholds and weaponizes transient network faults against the defense.
  - **Forward Containment Escalation**: Upon step failure, the orchestrator freezes the current containment boundary and executes forward escalation: applying broader, out-of-band perimeter network fences (e.g. boundary route shunts, upstream VPC ACL drops) and elevating the incident with high-priority paging to on-duty Incident Commanders.
  - **Idempotent Isolation Leases & Bounded TTL (Anti-Deadlock Guard)**:
    - In widespread lateral outbreaks across distributed endpoints, holding partial containment states indefinitely while awaiting operator clearance risks distributed resource deadlocks, connection exhaustion, and cascading operational paralysis.
    - All forward-recovery containment states are bound to an **Idempotent Isolation Lease** with a bounded Time-To-Live (TTL, e.g. 45 minutes).
    - If a stalled state machine is not ratified or reconciled by an operator before the lease expires, the orchestrator deterministically triggers an automated safe-fallback: promoting to an out-of-band boundary isolation or escalating to a critical supervisor alarm, ensuring containment is never held in an indeterminate deadlock.
- **Circuit Breakers and Rate-Limiting Decoupling**: API connectors maintain stateful circuit breakers. If a downstream provider exhibits elevated error rates, the connector trips into a fallback state, queueing operations for human operator evaluation rather than silently failing.
- **Break-Glass Emergency Containment Protocol**:
  - Under verified high-severity triggers (e.g. stateful detection of active cryptographic file encryption on multiple endpoints), an on-duty Incident Commander can invoke an authenticated **Break-Glass Override**.
  - Bypasses multi-signature consensus gates for pre-defined critical playbooks.
  - Automatically emits real-time cryptographic audit events across out-of-band broadcast channels (e.g. incident notification hubs, executive broadcast streams) and locks the action to an immutable audit ledger with digital non-repudiation.

### Positive Consequences

* Eliminates the catastrophic risk of automated rollbacks dismantling containment perimeters during active attacks.
* Enforces fail-secure posture across hybrid enterprise environments.
* Eliminates containment dwell time during existential, high-velocity intrusions without sacrificing authorization auditability.

### Negative Consequences

* Step failures require human operator intervention to manually evaluate and reconcile partially contained states.
* Upstream perimeter escalation may affect broader network segments if endpoint-level isolation fails.
