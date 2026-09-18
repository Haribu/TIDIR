import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

console.log("🔍 Running TIDIR Editorial & Information-Quality Audit...\n");

let warnings: string[] = [];
let errors: string[] = [];

// 1. Prohibited Marketing Absolutes & Claims Discipline (Hard Errors)
const claimsRules = [
  {
    regex: /\b(eliminates?|eliminating)\s+hallucinations?\b/gi,
    message: "Claims absolute elimination of hallucinations (prefer: 'reduces unsupported recommendations via evidence grounding')"
  },
  {
    regex: /\b(absolute|complete)\s+data\s+sovereignty\b/gi,
    message: "Claims absolute data sovereignty (prefer: 'on-premises data boundary enforcement via sovereign clusters')"
  },
  {
    regex: /\b(solves?|solving)\s+the\s+base\s+rate\s+fallacy\b/gi,
    message: "Claims solving the base rate fallacy (prefer: 'mitigates operational consequences of the base rate fallacy')"
  },
  {
    regex: /\bguarantees?\s+zero\s+data\s+loss\b/gi,
    message: "Claims guaranteed zero data loss (prefer: 'designed to prevent telemetry loss via local NVMe spooling')"
  },
  {
    regex: /\bzero-risk\s+response\s+automation\b/gi,
    message: "Claims zero-risk response automation (prefer: 'blast-radius bounded response automation')"
  },
  {
    regex: /\b(guarantees?|guaranteeing)\s+100%\s+detection\b/gi,
    message: "Claims 100% detection guarantee"
  },
  {
    regex: /\bmathematically\s+indisputable\b/gi,
    message: "Rhetorical claim 'mathematically indisputable' (prefer: 'high-confidence, directly attributable' or 'cryptographically verifiable')"
  },
  {
    regex: /\bzero\s+censorship\b/gi,
    message: "Provocative/rhetorical phrasing 'zero censorship' (prefer: 'provider-independent defensive analysis')"
  },
  {
    regex: /\bguarantee\s+operational\s+continuity\b/gi,
    message: "Overstrong claim 'guarantee operational continuity' (prefer: 'preserve analytical capability' or 'improve operational continuity')"
  },
  {
    regex: /\bmathematical\s+non-repudiation\b/gi,
    message: "Overstrong claim 'mathematical non-repudiation' (prefer: 'cryptographic tamper evidence' or 'integrity & reconstructability')"
  }
];

// Lexical Warnings (Informational Review)
const lexicalWarningRules = [
  { regex: /\benterprise-grade\b/gi, message: "Vague corporate adjective 'enterprise-grade'" },
  { regex: /\bworld-class\b/gi, message: "Marketing fluff 'world-class'" },
  { regex: /\brevolutionary\b/gi, message: "Marketing fluff 'revolutionary'" }
];

// 2. High-density hyphenated noun stacks (4+ words linked with hyphens)
const hyphenStackRegex = /\b[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+(-[a-zA-Z]+)*\b/g;

// Helper to crawl docs
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

const targetFiles = findFiles("docs", [".md"]);

for (const file of targetFiles) {
  // Skip ADR index, historical ADRs if explicitly discussing historical claims, or glossary quoting prohibited terms
  if (file.includes("00-architectural-invariants.md")) {
    // 00-architectural-invariants.md contains the table of prohibited marketing absolutes for documentation purposes
    continue;
  }

  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    // Check claims discipline
    for (const rule of claimsRules) {
      if (rule.regex.test(line)) {
        errors.push(`❌ [Claims] ${file}:${lineNum} — ${rule.message}`);
      }
    }

    // Check lexical warnings (informational)
    for (const rule of lexicalWarningRules) {
      if (rule.regex.test(line)) {
        warnings.push(`⚠️ [Lexical Review] ${file}:${lineNum} — ${rule.message}`);
      }
    }

    // Check hyphen stacks (excluding markdown URLs, link anchors, or code blocks)
    if (!line.includes("http") && !line.includes("(/") && !line.trim().startsWith("```") && !line.includes("classDef")) {
      const matches = line.match(hyphenStackRegex);
      if (matches) {
        // filter out known benign code tokens or URLs
        for (const m of matches) {
          if (!m.includes("state-of-record") && !m.includes("zero-data-egress")) {
            warnings.push(`⚠️ [Hyphen Stack] ${file}:${lineNum} — High hyphen stack '${m}'`);
          }
        }
      }
    }
  }
}

// 3. Glossary integrity check
try {
  const glossaryRaw = readFileSync("config/glossary.json", "utf-8");
  const glossary = JSON.parse(glossaryRaw);
  if (!glossary.terms || glossary.terms.length < 5) {
    errors.push("❌ config/glossary.json has insufficient term count (< 5)");
  }
  for (const t of glossary.terms) {
    if (!t.id || !t.term || !t.classification || !t.plain_english || !t.technical_definition) {
      errors.push(`❌ Glossary term '${t.id || "unknown"}' is missing required fields`);
    }
  }
} catch (e: any) {
  errors.push(`❌ Failed to read or parse config/glossary.json: ${e.message}`);
}

console.log(`Audited ${targetFiles.length} documentation files.\n`);

if (warnings.length > 0) {
  console.warn("⚠️ Editorial Warnings:");
  warnings.forEach((w) => console.warn(`  ${w}`));
  console.log("");
}

if (errors.length > 0) {
  console.error("❌ Editorial Quality Errors detected:");
  errors.forEach((e) => console.error(`  ${e}`));
  console.log("");
  process.exit(1);
} else {
  console.log("🎉 Zero claims discipline or glossary structural violations found!");
}
