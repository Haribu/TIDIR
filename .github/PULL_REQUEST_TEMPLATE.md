## 🎯 Overview
<!-- Brief summary of what this PR introduces, refactors, or fixes. -->

## 🔗 Related Issues / RFCs
<!-- Link to any relevant issue or RFC (e.g. Closes #12, References #5) -->

## 📐 Type of Change
- [ ] 🏛️ Architecture Specification / Conceptual Model
- [ ] 📊 Diagram Addition or Syntax Refinement
- [ ] 📝 Documentation Clarity, Typo, or Formatting Fix
- [ ] 📜 Architectural Decision Record (ADR)
- [ ] 🛠️ Tooling, Build, or CI/CD Update
- [ ] 🛡️ Security or Safety Hardening

## ✅ Quality & Verification Checklist
Before submitting, ensure all of the following pass locally:
- [ ] **Mermaid Syntax**: Ran `bun ./scripts/validate-diagrams.ts` and all diagrams passed.
- [ ] **Site Build**: Ran `bun ./node_modules/.bin/vitepress build docs` (or `bun run docs:build`) and static site built with 0 errors.
- [ ] **Zero Secrets**: Verified working tree and diffs contain no API tokens, keys, passwords, or personal credentials.
- [ ] **Vendor Neutral**: Concepts and models are framed around open capabilities, standards (OCSF, STIX 2.1, Sigma), and architectural patterns.
- [ ] **ADR Present**: If making an architectural decision, included a new record under `docs/adr/` using `docs/adr/template.md`.
