import { spawnSync } from "node:child_process";

const commitMessage = process.argv.slice(2).join(" ").trim();
if (!commitMessage) {
  console.error('❌ Please provide a commit message: ./ship "feat: your message"');
  process.exit(1);
}

console.log("🚢 Starting automated TIDIR verified release pipeline...\n");

// 1. Run local holistic verification
console.log("▶️ [1/4] Running holistic pre-commit verification (./verify)...");
const verifyRes = spawnSync("./verify", { stdio: "inherit" });
if (verifyRes.status !== 0) {
  console.error("❌ Verification failed. Release aborted.");
  process.exit(verifyRes.status ?? 1);
}

// 2. Stage all changes
console.log("\n▶️ [2/4] Staging changes (git add -A)...");
const addRes = spawnSync("git", ["add", "-A"], { stdio: "inherit" });
if (addRes.status !== 0) {
  console.error("❌ git add failed. Release aborted.");
  process.exit(addRes.status ?? 1);
}

// 3. Commit
console.log(`\n▶️ [3/4] Creating commit: "${commitMessage}"...`);
const commitRes = spawnSync("git", ["commit", "-m", commitMessage], { stdio: "inherit" });
if (commitRes.status !== 0) {
  console.error("❌ git commit failed (working tree may be clean).");
  process.exit(commitRes.status ?? 1);
}

// 4. Push to origin/main
console.log("\n▶️ [4/4] Pushing to origin/main...");
const pushRes = spawnSync("git", ["push", "origin", "main"], { stdio: "inherit" });
if (pushRes.status !== 0) {
  console.error("❌ git push failed.");
  process.exit(pushRes.status ?? 1);
}

console.log("\n========================================");
console.log("🎉 Successfully pushed to main!");
console.log("Cloudflare Pages deployment triggered via GitHub Actions.");
console.log("Run 'bun ./scripts/verify-live.ts' to verify live production endpoints.");
console.log("========================================\n");
