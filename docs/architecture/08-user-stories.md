# Operational & Engineering User Stories

## 1. Overview & Framework

To ensure that the TIDIR architecture translates into seamless operational execution, this document defines concrete **User Stories** across the three primary actor categories:
1. **Human Operators**: Triage Analysts, Incident Commanders, and Threat Hunters who exercise ultimate operational authority and forensic judgment.
2. **Agentic AI Operators**: Autonomous software harnesses that execute high-velocity context assembly, hypothesis generation, and containment preparation.
3. **Platform & Systems Engineers**: Data Engineers, Detection Engineers (DaC), Threat Intelligence Engineers, and SecOps SREs who author, test, version, and maintain the system.

All stories adhere to the canonical structure:
$$\text{As a } [\text{Role}], \text{ I want } [\text{Capability}], \text{ so that } [\text{Outcome}].$$

---

## 2. Human Operator User Stories

### Story H1: Contextual Graph Triage without Pivot Fatigue
* **As a** Senior Triage Analyst (Layer 4),
* **I want** incoming high-priority cases to arrive with pre-correlated entity graphs, chronological timelines, and affected crown-jewel assets already resolved,
* **So that** I can assess the complete blast radius of an active intrusion in under 60 seconds without manually pivoting across multiple query terminals.

#### Acceptance Criteria
1. The Incident Dossier presents a unified Directed Acyclic Graph (DAG) connecting user identities, source IPs, hostnames, and process lineages without manual join queries.
2. Telemetry timestamps across cloud and endpoint streams are normalized to microsecond UTC accuracy with clock-skew correction.
3. Multi-event alert storms (e.g. 500 failed login attempts preceding a privilege escalation) are collapsed into a single multi-event finding cluster.
4. The analyst can issue plain-language commands to the agentic harness (e.g. *"Show all outbound network connections from this process guid in the preceding 2 hours"*) and receive structured tabular results within 5 seconds.

---

### Story H2: Authorizing Disruptive Containment with Impact Previews
* **As an** Incident Commander (Layer 4),
* **I want** the system to execute a deterministic pre-execution blast-radius simulation before I authorize high-impact containment actions (Tier 2),
* **So that** I do not inadvertently sever critical business operations, drop transactional customer connections, or trigger unexpected service outages.

#### Acceptance Criteria
1. Prior to prompting for human authorization, the SOAR engine queries Layer 1 CMDB relationships and Layer 2 network flow caches to compute live blast-radius metrics (active TCP sessions, downstream dependent microservices, database replica status).
2. The authorization modal explicitly presents the simulation summary: affected hostnames, projected service disruption, and estimated recovery time.
3. No Tier 2 containment action can be dispatched unless an automated compensation/rollback routine (e.g. reverting network isolation, reinstating API keys) is pre-compiled and verified.
4. Authorizations are cryptographically logged to the immutable audit register with the authorizing commander's digital signature and stated operational rationale.

---

### Story H3: Hypothesis-Driven Retroactive Threat Hunting
* **As a** Proactive Threat Hunter (Layers 2 & 3),
* **I want** to execute ad-hoc, multi-dataset analytical queries across multi-month lakehouse archives using vendor-neutral SQL,
* **So that** I can identify stealthy, slow-and-low adversary campaigns that evade real-time streaming detection thresholds.

#### Acceptance Criteria
1. Queries push down partition filters (`dt=YYYY-MM-DD`, `schema_class=1007`) to object storage, scanning only relevant columnar partitions.
2. Query execution over 30 days of enterprise telemetry completes within analytical response SLAs (< 3 minutes).
3. Discovered suspicious patterns can be converted into new Detection Opportunity Backlog items in Layer 3 with a single click.

---

## 3. Agentic AI Operator User Stories

### Story A1: Autonomous 30-Day Lakehouse Baseline Scoping
* **As an** Agentic Triage Harness (Layer 4),
* **I want** to autonomously formulate and execute read-only Lakehouse queries upon alert elevation,
* **So that** I can calculate normal behavioral baselines for the affected user and endpoint before the human analyst opens the case.

#### Acceptance Criteria
1. The agent triggers immediately upon receipt of an OCSF Class 2004 Detection Finding crossing the risk threshold.
2. The agent queries Layer 2 lakehouse storage for the affected `actor.user.name` and `device.hostname` spanning the preceding 30 days.
3. The agent extracts: typical operating hours, frequently accessed cloud roles, baseline data egress volumes, and rare administrative actions.
4. The agent operates strictly under **Tier 0 (Read-Only)** authorization boundaries, with zero environmental write capabilities.

---

### Story A2: Adversary Hypothesis Generation & Plan Drafting
* **As an** Agentic Investigation Harness (Layer 4),
* **I want** to evaluate clustered graph findings against MITRE ATT&CK patterns and synthesize an explanatory narrative with a prioritized containment plan,
* **So that** human responders receive a structured investigative briefing rather than disconnected telemetry fragments.

#### Acceptance Criteria
1. The agent synthesizes a concise, plain-language operational hypothesis detailing: attack vector, observed lateral traversal, compromised credentials, and suspected adversary objective.
2. Every factual assertion in the hypothesis cites specific OCSF event records and cryptographic evidence hashes in the case locker.
3. The agent drafts a phased remediation plan cleanly separating Tier 0 (autonomous passive enrichment), Tier 1 (targeted low-disruption isolation), and Tier 2 (disruptive actions requiring human approval).

---

### Story A3: Closed-Loop Threat Intelligence & Detection Calibration
* **As an** Agentic Continuous Feedback Harness (Layers 3 & 4),
* **I want** to extract confirmed attacker observables and false-positive indicators upon incident closure,
* **So that** the platform automatically enriches internal CTI repositories and opens tuning pull requests in the Detection-as-Code registry.

#### Acceptance Criteria
1. When a case is resolved as True Positive, verified attacker hashes, IP infrastructure, and C2 domains are automatically structured into STIX 2.1 entities and pushed to Layer 3 CTI.
2. The agent initiates an automated retro-hunt across the Layer 2 Lakehouse for all newly cataloged indicators.
3. When a case is closed as False Positive / Benign Baseline, the agent analyzes the triggering rule logic, generates an exclusion predicate (e.g. filtering out an authorized backup daemon), validates the change against synthetic test suites, and opens a Git pull request for human detection engineer review.

---

## 4. Platform & Systems Engineer User Stories

### Story E1: Zero-Loss Line-Rate Schema Normalization
* **As a** Security Data Engineer (Layer 2),
* **I want** ingestion workers to coerce heterogenous telemetry into OCSF while preserving unmapped vendor fields in an `unmapped_data` JSON catch-all,
* **So that** the enterprise maintains strict schema contracts for detection engineering without suffering forensic data loss from schema truncation.

#### Acceptance Criteria
1. Ingestion workers normalize incoming events at line rate (> 100,000 eps per cluster node) with p99 processing latency < 250ms.
2. Any raw attribute not explicitly defined in the authoritative OCSF schema class is stored verbatim in the `unmapped_data` dictionary.
3. Payloads with unrecoverable corruption or invalid encoding are safely routed to Dead-Letter Queues (DLQ) with error tags.
4. Data engineers can replay DLQ streams through updated parser definitions without pipeline downtime.

---

### Story E2: Test-Driven Detection-as-Code (DaC) CI/CD Deployment
* **As a** Detection Engineer (Layer 3),
* **I want** to author declarative, vendor-neutral detection rules in Git and validate them against synthetic unit fixtures and recorded adversary simulations in CI/CD,
* **So that** I can deploy new detections to production stream and batch runtimes with zero false-positive regressions.

#### Acceptance Criteria
1. Detection rules are versioned as declarative text files (YAML/DSL) referencing standard OCSF attributes and MITRE ATT&CK tags.
2. The CI/CD pipeline runs unit tests asserting rule behavior against synthetic true-positive and benign edge-case payloads.
3. The pipeline verifies candidate rules against recorded adversary simulation telemetry executed in the `test` environment.
4. The pipeline replays candidate rules across a 30-day historical lakehouse sample in `pre-prod`, calculating the Expected Alert Volume (EAV) and rejecting rules that exceed noise thresholds.

---

### Story E3: Machine-Readable Attack Flow Production
* **As a** Cyber Threat Intelligence (CTI) Engineer (Layer 3),
* **I want** to model tactical threat actor behaviors as structured, machine-readable Directed Acyclic Graphs (DAGs) aligned with Priority Intelligence Requirements (PIRs),
* **So that** detection engineers can immediately build targeted, multi-stage detection logic without interpreting ambiguous free-text PDF reports.

#### Acceptance Criteria
1. Threat intelligence products are exported in structured machine-readable formats defining sequential attacker steps, prerequisite conditions, and forensic observables.
2. Each attack flow step explicitly maps to MITRE ATT&CK technique IDs and target OCSF data classes.
3. New attack flows automatically update the Detection Opportunity Backlog, scoring implementation priority by multiplying threat prevalence, crown-jewel exposure, and sensor visibility feasibility.

---

### Story E4: Blast-Radius Policy Modeling & SRE Availability Management
* **As a** SecOps Automation SRE (Layer 4),
* **I want** to define declarative playbook execution policies with verified rollback logic, rate limits, and health checks,
* **So that** automated response workflows execute with five-nines availability and zero unintended cascading failures.

#### Acceptance Criteria
1. Playbooks are defined as configuration files with explicit timeout, retry, backoff, and circuit-breaker thresholds per connector.
2. Connectors to third-party endpoints (EDR, Cloud IAM, Firewalls) run continuous synthetic health checks; degraded connectors automatically fall back to human queuing.
3. Every automated mutation records a corresponding compensation action to guarantee deterministic recovery in the event of partial playbook failure.
