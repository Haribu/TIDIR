import { build } from "vitepress";
import { spawnSync } from "node:child_process";

console.log("📦 Building VitePress documentation portal...");

// Deterministically compile LLM full context and machine-readable architecture graph
spawnSync("bun", ["./scripts/generate-llms-full.ts"], { stdio: "inherit" });
spawnSync("bun", ["./scripts/generate-architecture-graph.ts"], { stdio: "inherit" });

try {
  await build("docs");
  console.log("✅ Documentation build completed successfully.");
} catch (error: any) {
  console.error("❌ Documentation build failed:", error.message || error);
  process.exit(1);
}
