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
3. **Saga Orchestration Pattern with Automated Compensating Transactions and Audited Break-Glass Override (Selected)**.

## Decision Outcome

Chosen option: **Saga Orchestration Pattern with Automated Compensating Transactions and Audited Break-Glass Override**, because:
- **Saga Orchestration Engine**: All multi-step response playbooks are compiled as stateful Sagas. Every mutating forward action ($T_i$, e.g. isolate endpoint) has an explicitly defined and automated compensating action ($C_i$, e.g. re-enable endpoint network interface).
  - If any step in a forward containment sequence fails after exhausted idempotent retries and exponential backoff, the orchestrator invokes compensating transactions in reverse order ($C_{i-1}, \dots, C_1$), safely returning the infrastructure to a known baseline state.
- **Circuit Breakers and Rate-Limiting Decoupling**: API connectors maintain stateful circuit breakers. If a downstream provider exhibits elevated error rates, the connector trips into a fallback state, queueing operations for human operator evaluation rather than silently failing.
- **Break-Glass Emergency Containment Protocol**:
  - Under verified high-severity triggers (e.g. stateful detection of active cryptographic file encryption on multiple endpoints), an on-duty Incident Commander can invoke an authenticated **Break-Glass Override**.
  - Bypasses multi-signature consensus gates for pre-defined critical playbooks.
  - Automatically emits real-time cryptographic audit events across out-of-band broadcast channels (e.g. incident notification hubs, executive broadcast streams) and locks the action to an immutable audit ledger with digital non-repudiation.

### Positive Consequences

* Guarantees zero orphaned partial-containment states across hybrid enterprise environments.
* Eliminates containment dwell time during existential, high-velocity intrusions without sacrificing authorisation auditability.
* Provides deterministic rollback procedures for every containment capability.

### Negative Consequences

* Requires playbooks-as-code to author, test, and maintain bidirectional action pairs (forward action + compensating action) for every integration connector.
* Compensating actions in security are not always perfectly symmetric (e.g. re-enabling a revoked session token requires re-authentication rather than a pure state restoration).
