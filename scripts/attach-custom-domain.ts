import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const tokenPath = join(process.env.HOME || "", ".local/share/lifeos-mcp/cloudflare.token");
if (!existsSync(tokenPath)) {
  console.error("❌ Token file not found");
  process.exit(1);
}

const token = readFileSync(tokenPath, "utf-8").trim();
const accountId = "9478d0cbc85889f77595d426f6ed554c";
const projectName = "tidir";
const domainName = "tidir.harrymclaren.co.uk";

// 1. List current domains for this pages project
const listRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
const listData = await listRes.json();
console.log("Current attached domains:", JSON.stringify(listData.result, null, 2));

const exists = listData.result?.some((d: any) => d.name === domainName);
if (!exists) {
  console.log(`Attaching custom domain ${domainName} to Pages project ${projectName}...`);
  const attachRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: domainName })
  });
  const attachData = await attachRes.json();
  console.log("Attach response:", JSON.stringify(attachData, null, 2));
} else {
  console.log(`Custom domain ${domainName} is already attached to Pages project ${projectName}. Checking status...`);
}
