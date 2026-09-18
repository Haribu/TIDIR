import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const commitMessage = process.argv.slice(2).join(" ").trim();
if (!commitMessage) {
  console.error('❌ Please provide a commit message: ./ship "feat: your message"');
  process.exit(1);
}

console.log("🚢 Starting automated TIDIR verified release pipeline...\n");

// 1. Determine release bump type from conventional commit message
const pkgRaw = readFileSync("package.json", "utf-8");
const pkg = JSON.parse(pkgRaw);
const currentVersion = pkg.version || "1.0.0";
const [major, minor, patch] = currentVersion.split(".").map((n: string) => parseInt(n, 10));

let nextVersion: string;
const lowerMsg = commitMessage.toLowerCase();
if (lowerMsg.includes("breaking:") || lowerMsg.includes("break:") || lowerMsg.startsWith("feat!:") || lowerMsg.startsWith("refactor!:")) {
  nextVersion = `${major + 1}.0.0`;
} else if (lowerMsg.startsWith("feat:") || lowerMsg.startsWith("feat(") || lowerMsg.startsWith("architecture:")) {
  nextVersion = `${major}.${minor + 1}.0`;
} else {
  // fix, docs, chore, style, refactor, perf, test
  nextVersion = `${major}.${minor}.${patch + 1}`;
}

console.log(`🏷️ Bumping version: v${currentVersion} ➔ v${nextVersion} (based on "${commitMessage}")...`);
pkg.version = nextVersion;
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n", "utf-8");

// Re-sync bun.lock so frozen lockfile remains deterministic
spawnSync("bun", ["install"], { stdio: "inherit" });

// 2. Run local holistic verification
console.log("\n▶️ [1/4] Running holistic pre-commit verification (./verify)...");
const verifyRes = spawnSync("./verify", { stdio: "inherit" });
if (verifyRes.status !== 0) {
  console.error("❌ Verification failed. Release aborted. Restoring version...");
  pkg.version = currentVersion;
  writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  spawnSync("bun", ["install"], { stdio: "inherit" });
  process.exit(verifyRes.status ?? 1);
}

// 3. Stage all changes (including version bump and locked dependencies)
console.log("\n▶️ [2/4] Staging changes (git add -A)...");
const addRes = spawnSync("git", ["add", "-A"], { stdio: "inherit" });
if (addRes.status !== 0) {
  console.error("❌ git add failed. Release aborted.");
  process.exit(addRes.status ?? 1);
}

// 4. Commit (appending version tag)
const fullCommitMessage = `${commitMessage} (v${nextVersion})`;
console.log(`\n▶️ [3/4] Creating commit: "${fullCommitMessage}"...`);
const commitRes = spawnSync("git", ["commit", "-m", fullCommitMessage], { stdio: "inherit" });
if (commitRes.status !== 0) {
  console.error("❌ git commit failed (working tree may be clean).");
  process.exit(commitRes.status ?? 1);
}

// 5. Push to origin/main
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
