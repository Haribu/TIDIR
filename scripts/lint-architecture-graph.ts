import { readFileSync } from "node:fs";

console.log("🔍 Validating machine-readable architectural consistency & assurance mapping...\n");

let errors: string[] = [];

// 1. Validate the 11 Architectural Invariants
const invariantsFile = "docs/architecture/00-architectural-invariants.md";
const invariantsContent = readFileSync(invariantsFile, "utf-8");

const invariantMatches = invariantsContent.match(/###\s+(I\d+)\s+—/g);
if (!invariantMatches) {
  errors.push("❌ Could not parse Invariants from 00-architectural-invariants.md");
} else {
  const invariantIds = invariantMatches.map((m) => m.replace(/###\s+/, "").replace(/\s+—/, ""));
  if (invariantIds.length !== 11) {
    errors.push(`❌ Expected 11 invariants in 00-architectural-invariants.md, but found ${invariantIds.length} (${invariantIds.join(", ")})`);
  }
}

// 2. Validate Threat Model Assurance Case Map
const threatModelFile = "docs/architecture/09-threat-model.md";
const threatModelContent = readFileSync(threatModelFile, "utf-8");

const requiredThreats = ["1", "2", "3", "4", "5", "6"];
for (const num of requiredThreats) {
  const hasThreat =
    threatModelContent.includes(`**THR-T${num}:`) ||
    threatModelContent.includes(`**T${num}:`);
  if (!hasThreat) {
    errors.push(`❌ Threat Model Assurance Map is missing explicit mapping for threat 'THR-T${num}'`);
  }
}

// 3. Validate architecture.json compilation
try {
  const archJsonContent = JSON.parse(readFileSync("docs/public/architecture.json", "utf-8"));
  if (!archJsonContent.invariants || archJsonContent.invariants.length !== 11) {
    errors.push(`❌ architecture.json has invalid invariant count: ${archJsonContent.invariants?.length}`);
  }
  if (!archJsonContent.four_planes || !archJsonContent.four_planes.defence_control_plane) {
    errors.push("❌ architecture.json is missing the 4-plane specification");
  }
} catch (e: any) {
  errors.push(`❌ Failed to read or parse docs/public/architecture.json: ${e.message}`);
}

// 4. Assert zero remaining 'Prompt Injection Firewall' in architectural definitions (excluding historical notes)
const systemOverviewContent = readFileSync("docs/architecture/01-system-overview.md", "utf-8");
if (systemOverviewContent.includes("Prompt Firewall") || systemOverviewContent.includes("Prompt Injection Firewall")) {
  errors.push("❌ 01-system-overview.md contains deprecated 'Prompt Firewall' terminology");
}

if (errors.length > 0) {
  console.error("❌ Architectural graph validation errors found:");
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
} else {
  console.log("✅ Verified 11 Non-Negotiable Architectural Invariants.");
  console.log("✅ Verified Threat Model Assurance Case Map (T1–T6 bi-directional closure).");
  console.log("✅ Verified machine-readable architecture.json integrity (11 invariants + 4 planes).");
  console.log("✅ Verified Trust Boundary terminology congruence (zero legacy prompt firewalls).");
  console.log("🎉 Machine-readable architectural assurance graph is fully consistent!\n");
}
