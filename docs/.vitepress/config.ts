import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "TIDIR Architecture",
    description: "Threat Intelligence, Detection, Investigation & Response Reference Architecture",
    base: "/",
    cleanUrls: true,
    ignoreDeadLinks: true,
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
            { text: "Layer 1: Data Sources & Inputs", link: "/architecture/03-layer-1-data-sources" }
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
            { text: "0001 - ADRs & Mermaid", link: "/adr/0001-record-architecture-decisions" }
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
      theme: "dark"
    }
  })
);
