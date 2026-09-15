import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import DOMPurify from "dompurify";
import mermaid from "mermaid";

(DOMPurify as any).addHook = () => {};
(DOMPurify as any).sanitize = (s: string) => s;

mermaid.initialize({ startOnLoad: false });

function findFiles(dir: string, extension: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== ".vitepress") {
        findFiles(fullPath, extension, fileList);
      }
    } else if (file.endsWith(extension)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

console.log("🔍 Rigorously validating all Mermaid diagrams with mermaid.parse()...\n");

let totalDiagrams = 0;
let failedDiagrams: { file: string; block: number | string; error: string; snippet: string }[] = [];

// 1. Standalone .mmd files
const mmdFiles = findFiles("./docs", ".mmd");
for (const file of mmdFiles) {
  const content = readFileSync(file, "utf-8").trim();
  totalDiagrams++;
  try {
    await mermaid.parse(content);
    console.log(`✅ [MMD] ${file}`);
  } catch (err: any) {
    console.error(`❌ [MMD FAIL] ${file}: ${err.message}`);
    failedDiagrams.push({ file, block: "file", error: err.message, snippet: content.slice(0, 150) });
  }
}

// 2. Embedded mermaid code blocks in .md files
const mdFiles = findFiles("./docs", ".md");
const mermaidRegex = /```mermaid\s*([\s\S]*?)```/g;

for (const file of mdFiles) {
  const content = readFileSync(file, "utf-8");
  let match;
  let blockIndex = 1;
  while ((match = mermaidRegex.exec(content)) !== null) {
    totalDiagrams++;
    const diagramCode = match[1].trim();
    if (!diagramCode) {
      console.error(`❌ [EMPTY] ${file} (block #${blockIndex})`);
      failedDiagrams.push({ file, block: blockIndex, error: "Empty mermaid block", snippet: "" });
      blockIndex++;
      continue;
    }
    try {
      await mermaid.parse(diagramCode);
      console.log(`✅ [MD] ${file} (block #${blockIndex})`);
    } catch (err: any) {
      console.error(`❌ [MD FAIL] ${file} (block #${blockIndex}): ${err.message}`);
      failedDiagrams.push({ file, block: blockIndex, error: err.message, snippet: diagramCode.slice(0, 200) });
    }
    blockIndex++;
  }
}

console.log(`\n========================================`);
console.log(`Total diagrams evaluated: ${totalDiagrams}`);
console.log(`Passed: ${totalDiagrams - failedDiagrams.length}`);
console.log(`Failed: ${failedDiagrams.length}`);
console.log(`========================================\n`);

if (failedDiagrams.length > 0) {
  console.error("FAILURES:");
  for (const f of failedDiagrams) {
    console.error(`\n📄 ${f.file} [Block #${f.block}]`);
    console.error(`Error: ${f.error}`);
    console.error(`Snippet:\n${f.snippet}`);
  }
  process.exit(1);
} else {
  console.log("🎉 All diagrams successfully verified by Mermaid parser!");
}
