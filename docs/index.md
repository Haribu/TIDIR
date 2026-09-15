---
layout: home

hero:
  name: "TIDIR"
  text: "Architecture & Research Platform"
  tagline: "Threat Intelligence, Detection, Investigation & Response — unified reference architecture for modern SecOps."
  actions:
    - theme: brand
      text: Explore System Overview
      link: /architecture/01-system-overview
    - theme: alt
      text: View Capability Model
      link: /architecture/02-capability-model

features:
  - icon: 🛰️
    title: Threat Intelligence (CTI)
    details: Ingestion across STIX/TAXII, dynamic confidence decay scoring, low-latency Redis caching, and automated retro-hunting.
  - icon: 🌊
    title: Telemetry & Data Fabric
    details: High-throughput streaming bus, line-rate OCSF schema normalization, and dual-tier Hot Index vs. Iceberg Lakehouse.
  - icon: 🎯
    title: Detection Engineering
    details: Stateful stream pattern detection paired with lakehouse SQL analytics under a GitOps Detection-as-Code pipeline.
  - icon: 🔍
    title: Investigation & Cases
    details: Entity 360 resolution, parent-child process trees, network/identity graphs, unified timeline reconstruction, and evidence lockers.
  - icon: ⚡
    title: Response & Automation
    details: Blast-radius risk-tiered SOAR playbooks separating low-risk automated containment from human-gated disruptive actions.
  - icon: 🔄
    title: Closed-Loop Feedback
    details: Incident discoveries and tuning feedback automatically enrich CTI repositories and calibrate detection rules.
---
