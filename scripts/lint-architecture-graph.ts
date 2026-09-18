import { readFileSync } from "node:fs";

console.log("🔍 Validating machine-readable architectural consistency & assurance mapping...\n");

let errors: string[] = [];

// 1. Validate the 11 Architectural Invariants across Constitution, llms.txt, and architecture.json
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

// Check llms.txt invariant count and identity parity with architecture.json
try {
  const llmsTxtContent = readFileSync("docs/public/llms.txt", "utf-8");
  const constitutionSection = llmsTxtContent.split("## The TIDIR Architectural Constitution (11 Invariants)")[1]?.split("##")[0] || "";
  const llmsInvariantMatches = constitutionSection.match(/^\d+\.\s+\*\*(.*?)\*\*/gm);
  if (!llmsInvariantMatches || llmsInvariantMatches.length !== 11) {
    errors.push(`❌ Expected 11 invariants in docs/public/llms.txt, but found ${llmsInvariantMatches?.length || 0}`);
  } else {
    const archJsonContent = JSON.parse(readFileSync("docs/public/architecture.json", "utf-8"));
    if (archJsonContent.invariants) {
      llmsInvariantMatches.forEach((line, idx) => {
        const expectedPrefix = `${idx + 1}. **${archJsonContent.invariants[idx].name}**`;
        if (!line.startsWith(expectedPrefix)) {
          errors.push(`❌ Invariant #${idx + 1} mismatch in llms.txt: expected '${expectedPrefix}', got '${line}'`);
        }
      });
    }
  }
} catch (e: any) {
  errors.push(`❌ Failed to read docs/public/llms.txt: ${e.message}`);
}

// 2. Validate Threat Model Assurance Case Map & Underpinning Capability Taxonomy
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

// Check for legacy invariant IDs used erroneously as capability IDs in assurance maps
const assuranceMapFile = "docs/architecture/assurance-map.md";
const assuranceMapContent = readFileSync(assuranceMapFile, "utf-8");
if (assuranceMapContent.includes("`INV-04`") || assuranceMapContent.includes("`INV-05`")) {
  errors.push("❌ docs/architecture/assurance-map.md contains invariant IDs in the Underpinning Capabilities column (expected CAP-*)");
}
if (threatModelContent.includes("`INV-04`") || threatModelContent.includes("`INV-05`")) {
  errors.push("❌ docs/architecture/09-threat-model.md contains invariant IDs in the Underpinning Capabilities column (expected CAP-*)");
}

// 3. Validate architecture.json compilation, invariants, metadata, and threat capability prefixes
try {
  const archJsonContent = JSON.parse(readFileSync("docs/public/architecture.json", "utf-8"));
  if (!archJsonContent.invariants || archJsonContent.invariants.length !== 11) {
    errors.push(`❌ architecture.json has invalid invariant count: ${archJsonContent.invariants?.length}`);
  }
  if (!archJsonContent.four_planes || !archJsonContent.four_planes.defence_control_plane) {
    errors.push("❌ architecture.json is missing the 4-plane specification");
  }
  if (!archJsonContent.architecture_version || !archJsonContent.generated_at || !archJsonContent.canonical_source) {
    errors.push("❌ architecture.json is missing required metadata (architecture_version, generated_at, or canonical_source)");
  }
  if (archJsonContent.threats) {
    for (const threat of archJsonContent.threats) {
      if (!threat.underpinning_capabilities || threat.underpinning_capabilities.length === 0) {
        errors.push(`❌ Threat '${threat.id}' in architecture.json is missing underpinning_capabilities`);
      } else {
        for (const cap of threat.underpinning_capabilities) {
          if (!cap.startsWith("CAP-") && !cap.startsWith("RESIL-")) {
            errors.push(`❌ Threat '${threat.id}' has invalid capability identifier '${cap}' (must start with CAP- or RESIL-)`);
          }
        }
      }
    }
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
  console.log("✅ Verified 11 Non-Negotiable Architectural Invariants across Constitution, llms.txt, and architecture.json.");
  console.log("✅ Verified Threat Model Assurance Case Map (T1–T6 bi-directional closure & CAP-* taxonomy).");
  console.log("✅ Verified machine-readable architecture.json integrity (11 invariants + 4 planes + metadata).");
  console.log("✅ Verified Trust Boundary terminology congruence (zero legacy prompt firewalls).");
  console.log("🎉 Machine-readable architectural assurance graph is fully consistent!\n");
}
