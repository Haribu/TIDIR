import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

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

const validStarters = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "requirementDiagram",
  "gitGraph",
  "C4Context",
  "C4Container",
  "C4Component",
  "mindmap"
];

console.log("🔍 Scanning for all Mermaid diagrams (.mmd and markdown codeblocks)...");

// 1. Validate standalone .mmd files
const mmdFiles = findFiles("./docs", ".mmd");
let totalDiagrams = 0;
let hasError = false;

for (const file of mmdFiles) {
  const content = readFileSync(file, "utf-8").trim();
  totalDiagrams++;
  const firstLine = content.split("\n")[0].trim();
  const isValid = validStarters.some((prefix) => content.startsWith(prefix));
  if (!isValid) {
    console.warn(`⚠️ Warning: ${file} starts with unknown type: ${firstLine}`);
  } else {
    console.log(`✅ [MMD] ${file}`);
  }
}

// 2. Validate embedded mermaid blocks in .md files
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
      console.error(`❌ Empty mermaid block in ${file} (block #${blockIndex})`);
      hasError = true;
      continue;
    }
    const isValid = validStarters.some((prefix) => diagramCode.startsWith(prefix));
    if (!isValid) {
      const firstLine = diagramCode.split("\n")[0].trim();
      console.warn(`⚠️ Warning in ${file} (block #${blockIndex}): unknown type '${firstLine}'`);
    } else {
      console.log(`✅ [MD] ${file} (block #${blockIndex}: ${diagramCode.split("\n")[0].trim()})`);
    }
    blockIndex++;
  }
}

if (hasError) {
  console.error("\n❌ Some diagrams failed validation.");
  process.exit(1);
} else {
  console.log(`\n🎉 Successfully validated all ${totalDiagrams} Mermaid diagrams across repository.`);
}
