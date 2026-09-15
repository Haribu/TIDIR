import { readFileSync } from "node:fs";
import { join } from "node:path";

const tokenPath = join(process.env.HOME || "", ".local/share/lifeos-mcp/cloudflare.token");
const token = readFileSync(tokenPath, "utf-8").trim();
const zoneId = "eae1d538a9ff72c2391afe8ffa3caadb"; // harrymclaren.co.uk

const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await res.json();
console.log("Records:", data.result.map((r: any) => ({ name: r.name, type: r.type, content: r.content, proxied: r.proxied })));
