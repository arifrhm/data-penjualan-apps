#!/usr/bin/env bash
set -e

echo "🔍 Running Blast Radius Regression Check on changed files..."

# Check if directory is inside a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "⚠️ Not a git repository. Running full test suite..."
  pnpm test
  exit 0
fi

# Check if HEAD exists (if initial commit exists)
if git rev-parse --verify HEAD > /dev/null 2>&1; then
  CHANGED_FILES=$(git diff --name-only HEAD | grep -E '\.(ts|tsx|js|jsx)$' || true)
else
  # No commits yet, check working directory status
  CHANGED_FILES=$(git status --porcelain | grep -E '\.(ts|tsx|js|jsx)$' || true)
fi

if [ -z "$CHANGED_FILES" ]; then
  echo "✅ No relevant source code changes detected. Running full test suite as sanity check..."
  pnpm test
  exit 0
fi

echo "Files changed/affected:"
echo "$CHANGED_FILES"
echo ""
echo "🚀 Executing automated regression tests..."
pnpm test

echo "✅ Blast radius regression check passed cleanly!"
