import { build } from "vitepress";

console.log("📦 Building VitePress documentation portal...");

try {
  await build("docs");
  console.log("✅ Documentation build completed successfully.");
} catch (error: any) {
  console.error("❌ Documentation build failed:", error.message || error);
  process.exit(1);
}
