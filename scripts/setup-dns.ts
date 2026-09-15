import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const tokenPath = join(process.env.HOME || "", ".local/share/lifeos-mcp/cloudflare.token");

if (!existsSync(tokenPath)) {
  console.error("❌ Token file not found at:", tokenPath);
  process.exit(1);
}

const token = readFileSync(tokenPath, "utf-8").trim();
const zoneId = "eae1d538a9ff72c2391afe8ffa3caadb"; // harrymclaren.co.uk
const recordName = "tidir.harrymclaren.co.uk";
const target = "tidir.pages.dev";

console.log(`📡 Setting up Cloudflare DNS CNAME record for ${recordName} -> ${target}...`);

// Check if record already exists
const listUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=CNAME&name=${encodeURIComponent(recordName)}`;
const listRes = await fetch(listUrl, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
const listData = await listRes.json();

if (listData.result && listData.result.length > 0) {
  const existing = listData.result[0];
  console.log(`ℹ️ Record already exists (ID: ${existing.id}, content: ${existing.content}, proxied: ${existing.proxied}).`);
  if (existing.content !== target || !existing.proxied) {
    console.log(`Updating existing record to target: ${target}, proxied: true...`);
    const updateRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${existing.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "CNAME",
        name: "tidir",
        content: target,
        ttl: 1,
        proxied: true
      })
    });
    const updateData = await updateRes.json();
    console.log("Update result:", updateData.success ? "✅ Success" : updateData.errors);
  } else {
    console.log("✅ Existing CNAME is already properly configured.");
  }
} else {
  console.log(`Creating new CNAME record 'tidir' -> '${target}' (proxied: true)...`);
  const createRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "CNAME",
      name: "tidir",
      content: target,
      ttl: 1,
      proxied: true
    })
  });
  const createData = await createRes.json();
  if (createData.success) {
    console.log("🎉 CNAME record created successfully!");
  } else {
    console.error("❌ Failed to create CNAME record:", JSON.stringify(createData.errors, null, 2));
    process.exit(1);
  }
}
