import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "TIDIR Architecture",
    description: "Threat Intelligence, Detection, Investigation & Response Reference Architecture",
    base: "/",
    cleanUrls: true,
    ignoreDeadLinks: true,
    head: [
      [
        "script",
        {},
        "if (location.hostname === 'tidir.pages.dev') { location.replace('https://tidir.harrymclaren.co.uk' + location.pathname + location.search + location.hash); }"
      ]
    ],
    themeConfig: {
      nav: [
        { text: "Overview", link: "/architecture/01-system-overview" },
        { text: "Capabilities", link: "/architecture/02-capability-model" },
        {
          text: "Components",
          items: [
            { text: "Threat Intelligence (CTI)", link: "/architecture/components/01-threat-intelligence" },
            { text: "Telemetry & Data Fabric", link: "/architecture/components/02-data-fabric-telemetry" },
            { text: "Detection Engine", link: "/architecture/components/03-detection-engine" },
            { text: "Investigation & Cases", link: "/architecture/components/04-investigation-cases" },
            { text: "Response & Automation", link: "/architecture/components/05-response-automation" }
          ]
        },
        { text: "ADRs", link: "/adr/0001-record-architecture-decisions" }
      ],
      sidebar: [
        {
          text: "Architecture & Framework",
          items: [
            { text: "System Overview & Topology", link: "/architecture/01-system-overview" },
            { text: "Capability Model", link: "/architecture/02-capability-model" },
            { text: "Layer 1: Data Sources & Inputs", link: "/architecture/03-layer-1-data-sources" },
            { text: "Layer 2: Pipeline, Storage & Query", link: "/architecture/04-layer-2-pipeline-storage-query" },
            { text: "Layer 3: Intel & Detection Engineering", link: "/architecture/06-layer-3-threat-intel-detection" },
            { text: "Layer 4: Incident Response & Automation", link: "/architecture/07-layer-4-incident-response" },
            { text: "Cross-Cutting Engineering Disciplines", link: "/architecture/05-cross-cutting-engineering-disciplines" },
            { text: "Operational User Stories", link: "/architecture/08-user-stories" }
          ]
        },
        {
          text: "Component Deep Dives",
          items: [
            { text: "1. Cyber Threat Intelligence", link: "/architecture/components/01-threat-intelligence" },
            { text: "2. Telemetry & Data Fabric", link: "/architecture/components/02-data-fabric-telemetry" },
            { text: "3. Detection Engine", link: "/architecture/components/03-detection-engine" },
            { text: "4. Investigation & Cases", link: "/architecture/components/04-investigation-cases" },
            { text: "5. Response & Automation", link: "/architecture/components/05-response-automation" }
          ]
        },
        {
          text: "Architecture Decisions (ADR)",
          items: [
            { text: "0001 - ADRs & Mermaid", link: "/adr/0001-record-architecture-decisions" },
            { text: "0002 - Unmapped OCSF Data", link: "/adr/0002-preserve-unmapped-telemetry-in-ocsf" },
            { text: "0003 - Supernode Pruning", link: "/adr/0003-graph-supernode-pruning-and-clustering-boundaries" }
          ]
        }
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/harrymclaren/TIDIR" }
      ],
      footer: {
        message: "TIDIR Reference Architecture — Open & Modular Security Operations",
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
        fontSize: "14px"
      }
    }
  })
);
