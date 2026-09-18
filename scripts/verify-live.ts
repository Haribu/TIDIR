const baseUrl = "https://tidir.harrymclaren.co.uk";
const endpoints = [
  "/",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
  "/sitemap.xml",
  "/architecture/00-architectural-invariants",
  "/architecture/01-system-overview"
];

console.log(`🌐 Auditing live deployment at ${baseUrl}...\n`);

let allOk = true;

for (const ep of endpoints) {
  const url = `${baseUrl}${ep}`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    const status = res.status;
    const ok = status === 200;
    if (!ok) allOk = false;
    const symbol = ok ? "✅" : "❌";
    console.log(`${symbol} [${status}] ${ep} (${res.headers.get("content-type") || "unknown"})`);
  } catch (err: any) {
    allOk = false;
    console.error(`❌ [ERROR] ${ep}: ${err.message || err}`);
  }
}

if (!allOk) {
  console.error("\n❌ Some live endpoints failed verification.");
  process.exit(1);
} else {
  console.log("\n🎉 All live endpoints responded with HTTP 200!");
}
