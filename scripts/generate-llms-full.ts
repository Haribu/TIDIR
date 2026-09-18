import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

console.log("📝 Generating docs/public/llms-full.txt for comprehensive LLM ingestion...");

const filesToInclude = [
  { title: "THE TIDIR CONSTITUTION: 10 ARCHITECTURAL INVARIANTS", path: "docs/architecture/00-architectural-invariants.md" },
  { title: "SYSTEM OVERVIEW & TOPOLOGY", path: "docs/architecture/01-system-overview.md" },
  { title: "TARGET THREAT MODEL", path: "docs/architecture/09-threat-model.md" },
  { title: "CAPABILITY MODEL & TAXONOMY", path: "docs/architecture/02-capability-model.md" },
  { title: "CROSS-CUTTING ENGINEERING DISCIPLINES", path: "docs/architecture/05-cross-cutting-engineering-disciplines.md" },
  { title: "AI & AGENT ORCHESTRATION ARCHITECTURE", path: "docs/architecture/components/06-ai-orchestration.md" },
  { title: "ARCHITECTURAL DECISION REGISTRY (ADRs)", path: "docs/adr/index.md" }
];

let fullText = `# TIDIR: Threat Intelligence, Detection, Investigation & Response
# Canonical Reference Architecture — Complete LLM Compilation
# Source: https://github.com/Haribu/TIDIR
# Production Web: https://tidir.harrymclaren.co.uk
# License: Apache 2.0
# Generated deterministically for LLM crawlers, AI agents, and retrieval engines.

================================================================================
EXECUTIVE SUMMARY
================================================================================

TIDIR (Threat Intelligence, Detection, Investigation & Response) is an open,
vendor-neutral target technology component architecture for modern autonomous
security operations (SecOps).

TIDIR synthesises continuous detection engineering, line-rate stream processing,
decoupled data fabrics (hot index vs columnar lakehouse), multi-agent AI systems,
and automated monotonic containment into a closed-loop cyber defence ecosystem.

CORE AXIOM:
"Probabilistic components propose; deterministic components authorise."
Probabilistic models (LLMs, neural embeddings, clustering heuristics) operate
in a strictly read-only analytical capacity. All mutations, containment state
transitions, and tool calls are governed by deterministic schemas, policy
validators, and human consensus gates.

================================================================================
`;

for (const item of filesToInclude) {
  try {
    const raw = readFileSync(item.path, "utf-8");
    // Strip VitePress frontmatter
    const content = raw.replace(/^---[\s\S]*?---\n/, "").trim();
    fullText += `\n\n================================================================================\n`;
    fullText += `SECTION: ${item.title}\n`;
    fullText += `Source: ${item.path}\n`;
    fullText += `================================================================================\n\n`;
    fullText += content;
  } catch (err) {
    console.error(`Warning: could not read ${item.path}:`, err);
  }
}

writeFileSync("docs/public/llms-full.txt", fullText, "utf-8");
console.log("✅ Successfully generated docs/public/llms-full.txt (" + Math.round(fullText.length / 1024) + " KB).");
