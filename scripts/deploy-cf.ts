import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const realHome = "/Users/harrymclaren";
const tokenPath = join(realHome, ".local/share/lifeos-mcp/cloudflare.token");

if (!existsSync(tokenPath)) {
  console.error("❌ Cloudflare token file not found at:", tokenPath);
  process.exit(1);
}

const token = readFileSync(tokenPath, "utf-8").trim();
const accountId = "9478d0cbc85889f77595d426f6ed554c";
const projectName = "tidir";
const distDir = "docs/.vitepress/dist";

const wranglerHome = join("/Users/harrymclaren/Projects/TIDIR/.wrangler_home");
mkdirSync(wranglerHome, { recursive: true });

console.log(`🚀 Initiating Cloudflare Pages deployment for project: ${projectName}...`);

const env = {
  ...process.env,
  HOME: wranglerHome,
  CLOUDFLARE_API_TOKEN: token,
  CLOUDFLARE_ACCOUNT_ID: accountId
};

const args = [
  "./node_modules/wrangler/bin/wrangler.js",
  "pages",
  "deploy",
  distDir,
  `--project-name=${projectName}`,
  "--branch=main",
  "--commit-dirty=true"
];

console.log(`Executing wrangler pages deploy...`);

const proc = spawn("bun", args, { env });

proc.stdout.on("data", (data) => {
  process.stdout.write(data);
});

proc.stderr.on("data", (data) => {
  process.stderr.write(data);
});

proc.on("close", (code) => {
  console.log(`\nDeployment process exited with code: ${code}`);
  process.exit(code ?? 0);
});
