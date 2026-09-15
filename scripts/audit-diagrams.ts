import puppeteer from "puppeteer";
import { join } from "node:path";

const artifactDir = "/Users/harrymclaren/.gemini/antigravity/brain/fc1ef035-d1a9-46d9-964f-fc82c07ea6a1";

const pagesToTest = [
  { name: "01-overview", path: "/architecture/01-system-overview" },
  { name: "02-capabilities", path: "/architecture/02-capability-model" },
  { name: "04-layer-2", path: "/architecture/04-layer-2-pipeline-storage-query" },
  { name: "05-cross-cutting", path: "/architecture/05-cross-cutting-engineering-disciplines" },
  { name: "06-layer-3", path: "/architecture/06-layer-3-threat-intel-detection" },
  { name: "07-layer-4", path: "/architecture/07-layer-4-incident-response" }
];

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

// Desktop audit
const page = await browser.newPage();
await page.setExtraHTTPHeaders({
  "Cache-Control": "no-cache",
  "Pragma": "no-cache"
});
await page.setViewport({ width: 1440, height: 900 });

for (const p of pagesToTest) {
  try {
    const bustUrl = `https://tidir.harrymclaren.co.uk${p.path}?t=${Date.now()}`;
    await page.goto(bustUrl, { waitUntil: "networkidle0", timeout: 15000 });
    // Wait for mermaid
    await page.waitForSelector(".mermaid svg", { timeout: 8000 }).catch(() => {});
    
    // Find first mermaid element and take an element screenshot
    const mermaidEl = await page.$(".mermaid");
    if (mermaidEl) {
      const outPath = join(artifactDir, `audit-desktop-${p.name}.png`);
      await mermaidEl.screenshot({ path: outPath });
      console.log(`✅ Captured desktop diagram: ${p.name}`);
    } else {
      console.log(`ℹ️ No mermaid element on ${p.name}`);
    }
  } catch (e) {
    console.error(`❌ Error on ${p.name}:`, e.message);
  }
}

// Mobile audit on key pages
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
for (const p of [pagesToTest[0], pagesToTest[2], pagesToTest[4]]) {
  try {
    await page.goto(`https://tidir.harrymclaren.co.uk${p.path}`, { waitUntil: "networkidle0", timeout: 15000 });
    await page.waitForSelector(".mermaid svg", { timeout: 8000 }).catch(() => {});
    const mermaidEl = await page.$(".mermaid");
    if (mermaidEl) {
      const outPath = join(artifactDir, `audit-mobile-${p.name}.png`);
      await mermaidEl.screenshot({ path: outPath });
      console.log(`✅ Captured mobile diagram: ${p.name}`);
    }
  } catch (e) {
    console.error(`❌ Error on mobile ${p.name}:`, e.message);
  }
}

await browser.close();
console.log("Audit complete!");
