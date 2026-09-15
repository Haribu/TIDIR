import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

// 1. Desktop 01-system-overview
const deskPage = await browser.newPage();
await deskPage.setViewport({ width: 1440, height: 900 });
await deskPage.goto("https://tidir.harrymclaren.co.uk/architecture/01-system-overview", { waitUntil: "networkidle0" });
await deskPage.screenshot({ path: "/Users/harrymclaren/.gemini/antigravity/brain/fc1ef035-d1a9-46d9-964f-fc82c07ea6a1/desktop-overview.png" });

// 2. Mobile 01-system-overview scrolled down to the diagram
const mobPage = await browser.newPage();
await mobPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await mobPage.goto("https://tidir.harrymclaren.co.uk/architecture/01-system-overview", { waitUntil: "networkidle0" });
await mobPage.evaluate(() => {
  const el = document.querySelector(".mermaid");
  if (el) el.scrollIntoView();
});
await new Promise(r => setTimeout(r, 1000));
await mobPage.screenshot({ path: "/Users/harrymclaren/.gemini/antigravity/brain/fc1ef035-d1a9-46d9-964f-fc82c07ea6a1/mobile-diagram-inline.png" });

await browser.close();
console.log("Screenshots captured!");
