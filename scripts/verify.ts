import { spawnSync } from "node:child_process";

console.log("🚀 Starting holistic TIDIR verification suite...\n");

const steps = [
  { name: "Site Structure & Navigation", script: "./scripts/lint-site-structure.ts" },
  { name: "Controlled Architectural Terminology", script: "./scripts/lint-terminology.ts" },
  { name: "Mermaid Diagram Syntax Validation", script: "./scripts/validate-diagrams.ts" },
  { name: "VitePress Documentation Build & Sitemap", script: "./scripts/build-docs.ts" },
  { name: "MathJax & Parameter Integrity Audit", script: "./scripts/lint-docs-math.ts" }
];

let allPassed = true;

for (const step of steps) {
  console.log(`\n▶️ Running: ${step.name} (${step.script})...`);
  const result = spawnSync("bun", [step.script], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`❌ Step '${step.name}' failed with exit code ${result.status}`);
    allPassed = false;
    process.exit(result.status ?? 1);
  }
}

console.log("\n========================================");
console.log("🎉 ALL HOLISTIC VERIFICATION CHECKS PASSED!");
console.log("========================================\n");
