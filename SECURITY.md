# Security Policy — TIDIR

The **TIDIR** (Threat Intelligence, Detection, Investigation & Response) project takes the security, reliability, and integrity of our architectural research, documentation portal, and software artifacts seriously.

This document outlines our security commitments, vulnerability reporting mechanisms, supported versions, and Safe Harbor policy.

---

## 🛡️ Supported Versions

Because TIDIR publishes evolving vendor-neutral architectures, reference implementations, and documentation, security fixes are prioritized for the latest active release branch.

| Version / Branch | Supported          | Status                               |
| ---------------- | ------------------ | ------------------------------------ |
| `main`           | :white_check_mark: | Actively supported (Latest release)  |
| `< 0.1.0`        | :x:                | Legacy / Archived drafts unsupported |

---

## 🔒 Reporting a Vulnerability

We request that you **do not report security vulnerabilities through public GitHub issues, discussions, or social channels**.

Please report vulnerabilities through either of the following private channels:

### 1. GitHub Private Vulnerability Reporting (Preferred)
You can report a vulnerability privately directly within the GitHub repository:
- Navigate to the [Haribu/TIDIR Security Advisories tab](https://github.com/Haribu/TIDIR/security/advisories).
- Click **"Report a vulnerability"** to open an encrypted private draft advisory.
- This creates an isolated channel where you can collaborate with the maintainer directly.

### 2. Direct Encrypted / Private Email
If you do not have a GitHub account or prefer direct communication:
- **Contact**: Harry McLaren (`info@harrymclaren.co.uk`)
- **Subject**: `[SECURITY] TIDIR Vulnerability Report — <Brief Description>`
- Please include:
  1. A description of the issue, vulnerability classification, or architectural flaw.
  2. Steps to reproduce or proof-of-concept (PoC) payload/configuration.
  3. Affected component(s) (e.g., VitePress documentation portal, Cloudflare Pages deployment script, CI pipeline, reference schema).
  4. Any proposed mitigations or remediations.

---

## ⏱️ Response & Disclosure Timeline

We adhere to a standard **Coordinated Vulnerability Disclosure (CVD)** process:

- **Initial Acknowledgment**: Within **48 hours** of receiving the report.
- **Triage & Assessment**: Within **5 business days**, confirming severity and reproducing the issue.
- **Remediation & Patch**: Target resolution within **30 days** depending on complexity.
- **Public Disclosure**: Coordinated after the fix is published and validated on `main`. If a researcher requests attribution, credit will be given in the release advisory.

---

## 🤝 Safe Harbor Policy

Any activities conducted in a manner consistent with this policy will be considered **authorized conduct**:

- **Good Faith Research**: We will not pursue civil or criminal action against security researchers for accidental or good-faith security research.
- **Privacy & Integrity**: Researchers must make every effort to avoid privacy violations, destruction of data, and interruption or degradation of services.
- **Responsible Handling**: Do not access, modify, or exfiltrate any data beyond the minimum necessary to demonstrate the vulnerability.
- **No Extortion**: We do not offer bug bounties for architectural theoretical critiques, but we deeply appreciate and publicly credit responsible disclosures.

---

## 🔐 Automated Security Hygiene

To maintain the highest security baseline, the TIDIR repository enforces:
- **Secret Scanning & Push Protection**: Automated detection of committed credentials, API tokens, and private keys.
- **Dependabot Security Alerts & Updates**: Automated scanning and PR generation for vulnerable dependencies across npm/bun packages and GitHub Actions.
- **Tamper-Evident CI**: Deterministic static site builds and diagram validation prior to deployment.
