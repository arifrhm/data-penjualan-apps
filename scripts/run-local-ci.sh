#!/usr/bin/env bash
set -e

echo "🚀 Lightweight Local GitHub Actions CI/CD Tester (using nektos/act)"
echo "===================================================================="

# 1. Check Docker prerequisite
if ! command -v docker &> /dev/null; then
  echo "❌ Error: Docker is not installed or not in PATH."
  echo "👉 Please install Docker Desktop (or OrbStack) first to run local CI/CD with act."
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

echo "✅ Prerequisites checked (Docker & act are available)."
echo ""

# 3. List GitHub Actions jobs defined in .github/workflows/ci.yml
echo "📋 Defined Workflows / Jobs in .github/workflows/ci.yml:"
act -l

echo ""
# Allow dry-run option (-n)
if [[ "$1" == "--dry-run" || "$1" == "-n" ]]; then
  echo "🔍 Dry-run mode enabled (-n). Verifying workflow syntax without pulling images..."
  act push -n
  echo "✅ Workflow syntax is valid!"
  exit 0
fi

# Use lightweight / micro image (node:20-alpine or catthehacker/ubuntu:act-slim) to save disk space
LIGHTWEIGHT_IMAGE="${2:-node:20-alpine}"

echo "📦 Using lightweight image for local runner to save disk space: $LIGHTWEIGHT_IMAGE"
echo "▶️ Running local CI/CD push event trigger..."
echo "--------------------------------------------------------------------"

ACT_ARGS="-P ubuntu-latest=$LIGHTWEIGHT_IMAGE"

# Detect Apple Silicon (arm64)
if [[ "$(uname -m)" == "arm64" ]]; then
  echo "🍏 Detected Apple Silicon (arm64). Applying container architecture flags..."
  ACT_ARGS="$ACT_ARGS --container-architecture linux/amd64"
fi

# Execute act with lightweight container
act push $ACT_ARGS --reuse

echo ""
echo "🎉 Local CI/CD testing completed successfully!"
