import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "TIDIR Architecture",
    description: "Threat Intelligence, Detection, Investigation & Response Reference Architecture",
    base: "/",
    cleanUrls: true,
    ignoreDeadLinks: true,
    markdown: {
      math: true
    },
    head: [
      [
        "link",
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }
      ],
      [
        "script",
        {},
        "if (location.hostname === 'tidir.pages.dev') { location.replace('https://tidir.harrymclaren.co.uk' + location.pathname + location.search + location.hash); }"
      ],
      [
        "style",
        {},
        "mjx-assistive-mml { display: none !important; position: absolute !important; top: 0; left: 0; clip: rect(1px, 1px, 1px, 1px); user-select: none; white-space: nowrap; overflow: hidden !important; padding: 0 !important; border: 0 !important; height: 1px !important; width: 1px !important; } mjx-container[display='true'] { display: block !important; max-width: 100% !important; overflow-x: auto !important; overflow-y: hidden !important; padding: 0.75rem 0; } mjx-container:not([display='true']) { display: inline-block !important; max-width: 100%; }"
      ]
    ],
    themeConfig: {
      nav: [
        {
          text: "Architecture",
          items: [
            { text: "System Overview & Topology", link: "/architecture/01-system-overview" },
            { text: "Target Threat Model", link: "/architecture/09-threat-model" },
            { text: "Layer 1: Data Sources & Ingress", link: "/architecture/03-layer-1-data-sources" },
            { text: "Layer 2: Pipeline, Storage & Query", link: "/architecture/04-layer-2-pipeline-storage-query" },
            { text: "Layer 3: Intel & Detection Engineering", link: "/architecture/06-layer-3-threat-intel-detection" },
            { text: "Layer 4: Investigation & Automated Response", link: "/architecture/07-layer-4-incident-response" },
            { text: "Cross-Cutting Engineering Disciplines", link: "/architecture/05-cross-cutting-engineering-disciplines" }
          ]
        },
        {
          text: "Capabilities",
          items: [
            { text: "Capability Model & Taxonomy", link: "/architecture/02-capability-model" },
            { text: "Macro Capabilities & Services", link: "/architecture/10-macro-capabilities-and-services" },
            { text: "Operational User Stories", link: "/architecture/08-user-stories" }
          ]
        },
        {
          text: "Components",
          items: [
            { text: "Threat Intelligence (CTI)", link: "/architecture/components/01-threat-intelligence" },
            { text: "Telemetry & Data Fabric", link: "/architecture/components/02-data-fabric-telemetry" },
            { text: "Detection Engine", link: "/architecture/components/03-detection-engine" },
            { text: "Investigation & Cases", link: "/architecture/components/04-investigation-cases" },
            { text: "Response & Automation", link: "/architecture/components/05-response-automation" },
            { text: "AI & Agent Orchestration", link: "/architecture/components/06-ai-orchestration" }
          ]
        },
        { text: "ADRs", link: "/adr/" },
        { text: "GitHub ↗", link: "https://github.com/Haribu/TIDIR" }
      ],
      sidebar: [
        {
          text: "Tier 1: Strategic Architecture",
          items: [
            { text: "System Overview & Topology", link: "/architecture/01-system-overview" },
            { text: "Target Threat Model", link: "/architecture/09-threat-model" }
          ]
        },
        {
          text: "Tier 2: Capabilities & Taxonomy",
          items: [
            { text: "Capability Model & Taxonomy", link: "/architecture/02-capability-model" },
            { text: "Macro Capabilities & Services", link: "/architecture/10-macro-capabilities-and-services" },
            { text: "Operational User Stories", link: "/architecture/08-user-stories" }
          ]
        },
        {
          text: "Tier 3: Technical Specifications",
          items: [
            { text: "Layer 1: Data Sources & Ingress", link: "/architecture/03-layer-1-data-sources" },
            { text: "Layer 2: Pipeline, Storage & Query", link: "/architecture/04-layer-2-pipeline-storage-query" },
            { text: "Layer 3: Intel & Detection Engineering", link: "/architecture/06-layer-3-threat-intel-detection" },
            { text: "Layer 4: Investigation & Automated Response", link: "/architecture/07-layer-4-incident-response" },
            { text: "Cross-Cutting Engineering Disciplines", link: "/architecture/05-cross-cutting-engineering-disciplines" }
          ]
        },
        {
          text: "Subsystem Deep Dives",
          items: [
            { text: "1. Cyber Threat Intelligence", link: "/architecture/components/01-threat-intelligence" },
            { text: "2. Telemetry & Data Fabric", link: "/architecture/components/02-data-fabric-telemetry" },
            { text: "3. Detection Engine", link: "/architecture/components/03-detection-engine" },
            { text: "4. Investigation & Cases", link: "/architecture/components/04-investigation-cases" },
            { text: "5. Response & Automation", link: "/architecture/components/05-response-automation" },
            { text: "6. AI & Agent Orchestration", link: "/architecture/components/06-ai-orchestration" }
          ]
        },
        {
          text: "Architecture Decisions: Governance & Strategy",
          collapsed: false,
          items: [
            { text: "ADR Registry Overview", link: "/adr/" },
            { text: "0001 - Record Architecture Decisions", link: "/adr/0001-record-architecture-decisions" },
            { text: "0010 - SABSA Alignment & Attribute Profiling", link: "/adr/0010-sabsa-business-architecture-and-attribute-profiling" },
            { text: "0008 - SecOps Error Budgets & Chaos SRE", link: "/adr/0008-secops-error-budgets-and-chaos-security-engineering" }
          ]
        },
        {
          text: "Architecture Decisions: Data Fabric & Ingress",
          collapsed: false,
          items: [
            { text: "0002 - Preserve Unmapped OCSF Telemetry", link: "/adr/0002-preserve-unmapped-telemetry-in-ocsf" },
            { text: "0015 - Sandboxed Agents & OTLP Convergence", link: "/adr/0015-sandboxed-agent-execution-otlp-convergence-and-ephemeral-identity" },
            { text: "0016 - JIT Telemetry Elevation & Forensics", link: "/adr/0016-just-in-time-telemetry-elevation-and-ephemeral-forensics" }
          ]
        },
        {
          text: "Architecture Decisions: Detection & Intel",
          collapsed: false,
          items: [
            { text: "0007 - Continuous Purple Teaming & Consensus", link: "/adr/0007-continuous-automated-purple-teaming-and-multi-model-consensus" },
            { text: "0009 - Bayesian Multi-Signal Risk Scoring", link: "/adr/0009-bayesian-multi-signal-risk-scoring" },
            { text: "0011 - Bipartite Entity-Finding Graph", link: "/adr/0011-bipartite-entity-finding-graph-consolidation" },
            { text: "0013 - Ambient Deception & Canary Anchors", link: "/adr/0013-ambient-deception-fabric-and-canary-anchors" },
            { text: "0019 - Polyglot DaC & Native Engine Adaptation", link: "/adr/0019-polyglot-detection-as-code-and-native-engine-adaptation" }
          ]
        },
        {
          text: "Architecture Decisions: Investigation & Response",
          collapsed: false,
          items: [
            { text: "0003 - Supernode Pruning & Graph Clustering", link: "/adr/0003-graph-supernode-pruning-and-clustering-boundaries" },
            { text: "0005 - Asymmetric Containment & Break-Glass", link: "/adr/0005-saga-pattern-containment-and-break-glass-protocol" }
          ]
        },
        {
          text: "Architecture Decisions: AI Runtime & Observability",
          collapsed: false,
          items: [
            { text: "0004 - Defensive AI & Prompt Firewall", link: "/adr/0004-defensive-ai-runtime-and-prompt-injection-firewall" },
            { text: "0006 - Agent Evals-as-Code Harness", link: "/adr/0006-agent-evaluation-harness-evals-as-code" },
            { text: "0012 - AI Orchestration & MVP Roadmap", link: "/adr/0012-ai-orchestration-runtime-mcp-and-mvp-roadmap" },
            { text: "0014 - AI Observability & SLM Judges", link: "/adr/0014-ai-observability-self-learning-and-slm-judges" },
            { text: "0017 - Agent Fleet Control & Loop Breakers", link: "/adr/0017-agent-fleet-control-plane-and-runtime-observability" },
            { text: "0018 - NHI Lifecycle & Machine Attestation", link: "/adr/0018-non-human-identity-lifecycle-and-machine-attestation" }
          ]
        }
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/Haribu/TIDIR" }
      ],
      footer: {
        message: 'TIDIR Architecture — <a href="https://github.com/Haribu/TIDIR" target="_blank" rel="noopener">GitHub Project</a> · Apache 2.0 Licensed',
        copyright: "Copyright © 2026 Harry McLaren"
      },
      search: {
        provider: "local"
      }
    },
    mermaid: {
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "#0b0f19",
        primaryColor: "#1e293b",
        primaryTextColor: "#f8fafc",
        primaryBorderColor: "#38bdf8",
        lineColor: "#64748b",
        secondaryColor: "#1e1b4b",
        tertiaryColor: "#0f172a",
        mainBkg: "#1e293b",
        nodeBorder: "#38bdf8",
        nodeTextColor: "#f8fafc",
        clusterBkg: "#0f172a",
        clusterBorder: "#334155",
        titleColor: "#38bdf8",
        edgeLabelBackground: "#1e293b",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: "13px"
      }
    }
  })
);
