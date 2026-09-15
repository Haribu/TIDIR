import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function findDiagramFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".git") {
        findDiagramFiles(fullPath, fileList);
      }
    } else if (file.endsWith(".mmd")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

console.log("🔍 Scanning for Mermaid diagram files (.mmd)...");
const diagramFiles = findDiagramFiles("./docs");

if (diagramFiles.length === 0) {
  console.log("No .mmd files found.");
  process.exit(0);
}

let hasError = false;

for (const file of diagramFiles) {
  const content = readFileSync(file, "utf-8").trim();
  if (!content) {
    console.error(`❌ Empty diagram file: ${file}`);
    hasError = true;
    continue;
  }
  
  // Basic sanity check for mermaid declaration
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
    "C4Component"
  ];
  
  const startsWithValid = validStarters.some((prefix) =>
    content.startsWith(prefix)
  );

  if (!startsWithValid) {
    console.warn(`⚠️ Warning: ${file} does not start with a standard Mermaid type header`);
  } else {
    console.log(`✅ Valid Mermaid structure: ${file}`);
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log(`\n🎉 Verified ${diagramFiles.length} diagram file(s).`);
}
