# Component Specification: Response & Automation (SOAR)

## 1. Overview & Objectives

The Response & Automation (SOAR) component executes codified playbooks to accelerate incident triage, enrich investigations, and contain active security threats. To protect business operations while achieving high containment velocity, the architecture enforces a **Blast-Radius Risk Tiering** model that cleanly separates automated, low-risk operational steps from disruptive actions requiring human-in-the-loop authorization.

```mermaid
flowchart TD
  subgraph Triggers ["Execution Triggers"]
    T1["Correlated High-Confidence Alert"]
    T2["Analyst Workbench Action"]
    T3["Scheduled Maintenance / Sweep"]
  end

  subgraph Orchestrator ["SOAR Workflow Engine"]
    PLAYBOOK["Playbook / Workflow Runtime"]
    DECISION{"Action Blast-Radius\nEvaluation"}
  end

  subgraph ExecutionGated ["Execution Gates"]
    LOW_RISK["Tier 1: Non-Disruptive\n(Blast Radius: Low)\n- Enrich IP via VirusTotal\n- Pull Memory / Triage Dump\n- Query Active Directory User"]
    HIGH_RISK["Tier 2: Potentially Disruptive\n(Blast Radius: High)\n- Isolate Production Host\n- Revoke Okta User Tokens\n- Push Enterprise Firewall Block"]
    HUMAN_GATE{"Human-in-the-Loop\nApproval Gate"}
  end

  subgraph ActionConnectors ["Third-Party API Connectors"]
    EDR_CONN["EDR API (Host Isolation, File Quarantine)"]
    IAM_CONN["IdP API (Revoke Session, Force Password Reset)"]
    NET_CONN["Network API (Block IP / Domain at Firewall / WAF)"]
  end

  T1 --> PLAYBOOK
  T2 --> PLAYBOOK
  T3 --> PLAYBOOK

  PLAYBOOK --> DECISION
  DECISION -->|Low Risk| LOW_RISK
  DECISION -->|High Risk| HUMAN_GATE

  HUMAN_GATE -->|Analyst Approved| HIGH_RISK
  HUMAN_GATE -->|Rejected| PLAYBOOK

  LOW_RISK --> EDR_CONN
  LOW_RISK --> IAM_CONN
  HIGH_RISK --> EDR_CONN
  HIGH_RISK --> IAM_CONN
  HIGH_RISK --> NET_CONN
```

---

## 2. Core Functional Requirements

1. **Declarative Playbook Engine**:
   - Code-as-configuration playbooks (JSON/YAML or TypeScript/Python workflows).
   - Stateful execution with support for branching, error handling, retries, and compensation/rollback steps.
   - Comprehensive audit logging of every step and API payload.

2. **Blast-Radius Risk Classification**:
   - **Tier 0 (Read-Only / Enrichment)**:
     - Automated execution without approval.
     - Actions: Reverse DNS, WHOIS lookups, VirusTotal / ThreatConnect queries, querying directory attributes.
   - **Tier 1 (Targeted Low-Disruption Containment)**:
     - Automated execution for high-confidence detections on non-critical assets (or pre-approved development environments).
     - Actions: Quarantining an untrusted binary hash on a single workstation, adding an IP to a temporary rate-limiting list.
   - **Tier 2 (High-Impact / Disruptive Operations)**:
     - Enforces human-in-the-loop authorization.
     - Actions: Network isolation of a production server, tenant-wide account lockout, resetting administrator passwords, modifying perimeter BGP or global firewall rules.

3. **Interactive Human-in-the-Loop Authorization**:
   - Webhook integrations with SecOps collaboration tools (Slack, Microsoft Teams, PagerDuty, Web UI).
   - Rich interactive cards showing incident summary, targeted asset, blast-radius assessment, and "Approve" / "Reject" controls with reason entry.
   - Timeouts and escalation paths if no authorization is received within SLA.

4. **Closed-Loop Intelligence & Detection Feedback**:
   - Upon incident containment and resolution:
     - Automatically exports validated IOCs (hashes, C2 domains) to the CTI platform.
     - Flags true positive vs. false positive metrics back to the Detection-as-Code registry for threshold calibration.

---

## 3. Reference Technology Stack Options

| Sub-component | Open-Source Option | Cloud Native / Managed Option | Commercial Reference |
| :--- | :--- | :--- | :--- |
| **Playbook Engine** | Shuffle / Temporal / Node-RED | AWS Step Functions / Azure Logic Apps | Palo Alto Cortex XSOAR / Splunk SOAR |
| **Integration Bus** | Kafka / NATS / RabbitMQ | Amazon EventBridge / Google Cloud Pub/Sub | Tines / Torq |
| **Approval Gateways** | Slack Bolt SDK / Teams Webhooks | AWS SNS + API Gateway + Slack Bot | Tines Interactive Pages |
