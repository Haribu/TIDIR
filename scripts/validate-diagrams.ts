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

function validateSequentialSubgraphs(content: string): string | null {
  const sgRegex = /subgraph\s+([A-Za-z0-9_]+)\s*\["?(\d+)\.\s*([^"\]]+)"?\]/g;
  const subgraphs: { id: string; num: number; title: string }[] = [];
  let m;
  while ((m = sgRegex.exec(content)) !== null) {
    subgraphs.push({ id: m[1], num: parseInt(m[2], 10), title: m[3] });
  }

  if (subgraphs.length <= 1) return null;

  // 1. Monotonic declaration order
  for (let i = 1; i < subgraphs.length; i++) {
    if (subgraphs[i].num < subgraphs[i - 1].num) {
      return `Sequential Subgraph Order Violation: Subgraph '${subgraphs[i].id}' (#${subgraphs[i].num}) is declared after Subgraph '${subgraphs[i - 1].id}' (#${subgraphs[i - 1].num}). Subgraphs must be declared in increasing numerical sequence.`;
    }
  }

  // 2. Prevent backward cycle rank inversion
  for (const src of subgraphs) {
    for (const dst of subgraphs) {
      if (src.num > dst.num) {
        const backEdgeRegex = new RegExp(`\\b${src.id}\\s*[-=~.]+>[^\\n]*\\b${dst.id}\\b`);
        if (backEdgeRegex.test(content)) {
          return `Dagre Rank Inversion Hazard: Backward directed edge found from Subgraph '${src.id}' (#${src.num}) to Subgraph '${dst.id}' (#${dst.num}). In Mermaid flowchart TB/LR, backward edges between numbered subgraphs cause Dagre to invert topological layering, rendering later numbered stages before earlier ones. Terminate feedback flows into a downstream calibration stage (e.g. 4 ==> 5) or describe feedback in node annotations without inter-subgraph backward edges.`;
        }
      }
    }
  }

  return null;
}

// 1. Standalone .mmd files
const mmdFiles = findFiles("./docs", ".mmd");
for (const file of mmdFiles) {
  const content = readFileSync(file, "utf-8").trim();
  totalDiagrams++;
  try {
    await mermaid.parse(content);
    const orderErr = validateSequentialSubgraphs(content);
    if (orderErr) {
      throw new Error(orderErr);
    }
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
      const orderErr = validateSequentialSubgraphs(diagramCode);
      if (orderErr) {
        throw new Error(orderErr);
      }
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
