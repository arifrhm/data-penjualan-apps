#!/usr/bin/env bash
set -e

echo "🚀 Lightweight Local GitHub Actions CI/CD Tester (Alpine)"
echo "========================================================="

# 1. Check Docker prerequisite
if ! command -v docker &> /dev/null; then
  echo "❌ Error: Docker is not installed or not in PATH."
  echo "👉 Please install Docker Desktop (or OrbStack) first."
  exit 1
fi

if ! docker info &> /dev/null; then
  echo "❌ Error: Docker daemon is not running."
  echo "👉 Please start Docker Desktop / Docker daemon and try again."
  exit 1
fi

# 2. Check act prerequisite
if ! command -v act &> /dev/null; then
  echo "⚠️ 'act' is not installed."
  echo "💡 Installing 'act' via Homebrew..."
  if command -v brew &> /dev/null; then
    brew install act
  else
    echo "❌ Homebrew not found. Please install act manually: https://github.com/nektos/act"
    exit 1
  fi
fi

echo "✅ Docker & act are available."
echo ""

# 3. List GitHub Actions jobs
act -l
echo ""

# Dry-run option
if [[ "$1" == "--dry-run" || "$1" == "-n" ]]; then
  echo "🔍 Dry-run mode enabled (-n). Verifying workflow syntax..."
  act push -n
  echo "✅ Workflow syntax is valid!"
  exit 0
fi

echo "📦 Running CI/CD using lightweight Alpine container (node:20-alpine)..."
echo "--------------------------------------------------------------------"

# Use lightweight node:20-alpine image to save disk space
ACT_ARGS="-P ubuntu-latest=node:20-alpine"

if [[ "$(uname -m)" == "arm64" ]]; then
  ACT_ARGS="$ACT_ARGS --container-architecture linux/amd64"
fi

act push $ACT_ARGS --reuse

echo ""
echo "🎉 Local CI/CD testing completed successfully!"
