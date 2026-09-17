import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

interface TerminologyRule {
  id: string;
  description: string;
  pattern: string;
  replacement: string;
  scope: ("prose" | "diagrams")[];
  exemptFiles: string[];
}

interface TerminologyConfig {
  rules: TerminologyRule[];
}

console.log("🔍 Checking architectural terminology & diagram text congruence...\n");

const configRaw = readFileSync("config/terminology-rules.json", "utf-8");
const config: TerminologyConfig = JSON.parse(configRaw);

// Compile regexes
const compiledRules = config.rules.map((r) => ({
  ...r,
  regex: new RegExp(r.pattern, "gi")
}));

function findFiles(dir: string, extensions: string[], fileList: string[] = []): string[] {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    if (statSync(fullPath).isDirectory()) {
      if (item !== "node_modules" && item !== ".git" && item !== ".vitepress" && item !== "dist") {
        findFiles(fullPath, extensions, fileList);
      }
    } else if (extensions.some((ext) => item.endsWith(ext))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const targetFiles = findFiles("docs", [".md", ".mmd"]);
let violations: { file: string; line: number; text: string; rule: TerminologyRule }[] = [];

for (const file of targetFiles) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  let inMermaidBlock = file.endsWith(".mmd");

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    if (file.endsWith(".md") && line.trim().startsWith("```mermaid")) {
      inMermaidBlock = true;
      continue;
    }
    if (file.endsWith(".md") && inMermaidBlock && line.trim().startsWith("```")) {
      inMermaidBlock = false;
      continue;
    }

    const currentScope = inMermaidBlock ? "diagrams" : "prose";

    for (const rule of compiledRules) {
      if (rule.exemptFiles.some((exempt) => file.includes(exempt))) {
        continue;
      }
      if (!rule.scope.includes(currentScope)) {
        continue;
      }

      rule.regex.lastIndex = 0;
      const match = rule.regex.exec(line);
      if (match) {
        violations.push({
          file,
          line: lineNum,
          text: match[0],
          rule
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error("❌ Architectural terminology discrepancies detected:\n");
  for (const v of violations) {
    console.error(`  📄 ${v.file}:${v.line}`);
    console.error(`     Matched:     "${v.text}"`);
    console.error(`     Rule [${v.rule.id}]: ${v.rule.description}`);
    console.error(`     Replacement: "${v.rule.replacement}"\n`);
  }
  console.error(`Found ${violations.length} violation(s). Please align terminology.\n`);
  process.exit(1);
} else {
  console.log(`✅ Evaluated ${targetFiles.length} documentation & diagram files across ${compiledRules.length} terminology rules.`);
  console.log("🎉 All architectural prose and diagrams conform to controlled terminology standards!\n");
}
