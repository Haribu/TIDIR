#!/usr/bin/env bash
# TIDIR Git Pre-Commit Hook
# Prevents accidental secret leaks and validates all Mermaid diagrams before committing.

set -e

echo "🛡️  Running TIDIR pre-commit security & integrity checks..."

# 1. Check staged files for common secret patterns
STAGED_DIFF=$(git diff --cached)

# Regex patterns for high-confidence credentials
SECRET_PATTERNS=(
  "ghp_[a-zA-Z0-9]{20,}"
  "github_pat_[a-zA-Z0-9_]{20,}"
  "CLOUDFLARE_API_TOKEN[[:space:]]*=[[:space:]]*['\"][a-zA-Z0-9_-]{20,}['\"]"
  "-----BEGIN[ A-Z0-9_-]*PRIVATE KEY-----"
  "password[[:space:]]*=[[:space:]]*['\"][^'\"]{8,}['\"]"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
  if echo "$STAGED_DIFF" | grep -E -q -e "$pattern"; then
    echo "❌ [SECURITY ERROR] Potential secret detected in staged commit matching pattern: $pattern"
    echo "Commit aborted. Please remove sensitive credentials before committing."
    exit 1
  fi
done

# 2. Check for staged .env files (excluding .env.example)
STAGED_ENV_FILES=$(git diff --cached --name-only | grep -E "(^|/)\.env(\.local|\.production|\.development)?$" || true)
if [ -n "$STAGED_ENV_FILES" ]; then
  echo "❌ [SECURITY ERROR] Attempting to commit environment file(s):"
  echo "$STAGED_ENV_FILES"
  echo "Environment files must never be committed. Commit aborted."
  exit 1
fi

# 3. Validate Mermaid diagrams
echo "📊 Validating Mermaid diagram syntax..."
if ! bun ./scripts/validate-diagrams.ts; then
  echo "❌ [INTEGRITY ERROR] Mermaid diagram validation failed."
  echo "Please fix syntax errors before committing. Commit aborted."
  exit 1
fi

echo "✅ All pre-commit checks passed successfully!"
exit 0
