# 0001. Record Architecture Decisions with ADRs and Mermaid Diagrams

* Status: accepted
* Deciders: Architecture Team / Harry
* Date: 2026-09-15

## Context and Problem Statement

TIDIR covers complex, cross-cutting security capabilities: Threat Intelligence, Telemetry Ingestion, Detection Engineering, Case Management, and Response Orchestration. Without structured architectural governance and visual modeling standards, decisions become fragmented, undocumented, and difficult to communicate across teams.

How should we structure and maintain architectural decisions and diagrams for TIDIR?

## Decision Drivers

* High need for auditability, traceability, and version control alongside project code.
* Zero external proprietary tool lock-in (e.g. avoiding proprietary diagram files that cannot be diffed).
* Fast rendering in developer environments and markdown viewers.
* Low maintenance friction for technical contributors.

## Considered Options

1. **Markdown ADRs (MADR) + Code-based Mermaid Diagrams (Selected)**
2. Wiki / Confluence documentation + Visio / Lucidchart attachments
3. Monolithic static design document (PDF/Word)

## Decision Outcome

Chosen option: **Markdown Architectural Decision Records (MADR) with Mermaid Diagrams**, because:
- Stored as plaintext in Git alongside specifications and implementation code.
- Diagrams are rendered directly from declarative text (`.mmd` / markdown codeblocks), enabling git diffing, pull request reviews, and programmatic syntax validation.
- Standardized, consistent structure for logging problem statements, considered options, decision drivers, and consequences.

### Positive Consequences

* Every technical choice (schema standards, storage tiers, detection paradigms) is documented with explicit rationale and trade-offs.
* Architecture diagrams evolve with the code rather than becoming obsolete in third-party drawing tools.
* Diagrams can be validated in CI/CD using `@mermaid-js/mermaid-cli`.

### Negative Consequences

* Complex layout styling in Mermaid requires understanding its layout engine compared to freehand canvas drag-and-drop.
