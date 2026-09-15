# 0002. Preserve Unmapped Vendor Telemetry in Canonical OCSF Normalization

* Status: accepted
* Deciders: Architecture Team / Harry
* Date: 2026-09-15

## Context and Problem Statement

When raw telemetry across diverse sensors, operating systems, cloud providers, and network appliances is coerced into the Open Cybersecurity Schema Framework (OCSF) at line rate, vendor-specific attributes often do not have a 1:1 mapped field in the standard target class.

If normalizers strictly discard unmapped attributes to maintain schema validation purity, critical forensic artifacts, novel attack indicators, and application-specific metadata are permanently lost (schema truncation). How do we enforce strict OCSF typing across canonical fields while guaranteeing zero data loss for unmapped vendor metadata?

## Decision Drivers

* High need for strict canonical schema typing to enable portable Detection-as-Code rules.
* Zero tolerance for forensic data loss during normalization.
* Deterministic, predictable storage footprint in hot indices and columnar lakehouses.
* Backward compatibility for retrospective query and forensic replay.

## Considered Options

1. **Strict OCSF Schema Validation with Drop**: Drop any field not defined in the canonical OCSF dictionary.
2. **Dynamic Schema Extension**: Dynamically alter the central schema registry to register every novel vendor attribute.
3. **Canonical OCSF with an `unmapped_data` JSON Catch-All Dictionary (Selected)**.

## Decision Outcome

Chosen option: **Canonical OCSF with an `unmapped_data` JSON Catch-All Dictionary**, because:
- Maps all standard attributes into strongly typed, indexed OCSF fields (e.g. `actor.user.name`, `device.hostname`, `process.cmd`).
- Encapsulates all non-standard, custom, or vendor-proprietary fields into an unindexed or semi-structured `unmapped_data` JSON dictionary within the event envelope.
- Prevents schema registry bloat and eliminate schema truncation risks without requiring ad-hoc database migrations.

### Positive Consequences

* Guarantee 100% forensic reversibility and non-repudiation.
* Enable downstream detection rules to target standard OCSF fields while allowing specialized hunters to query raw vendor attributes via JSON path extraction.
* Malformed records that fail foundational typing are diverted to Dead-Letter Queues (DLQ) rather than silently dropped.

### Negative Consequences

* Minor storage overhead (~10–18% additional storage volume in columnar formats for the unmapped JSON block).
* Querying unmapped attributes requires JSON path extraction rather than native columnar vectorization.
