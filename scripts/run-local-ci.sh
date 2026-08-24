#!/usr/bin/env bash
set -e

echo "🚀 Lightweight Local GitHub Actions CI/CD Tester (JS Runner)"
echo "=========================================================="

# Auto-detect active Docker socket (supports OrbStack, Docker Desktop, Colima, standard socket)
if [ -z "$DOCKER_HOST" ]; then
  ORBSTACK_SOCKET="$HOME/.orbstack/run/docker.sock"
  DOCKER_DESKTOP_SOCKET="$HOME/.docker/run/docker.sock"
  VAR_SOCKET="/var/run/docker.sock"

  if [ -S "$ORBSTACK_SOCKET" ]; then
    export DOCKER_HOST="unix://$ORBSTACK_SOCKET"
  elif [ -S "$VAR_SOCKET" ]; then
    export DOCKER_HOST="unix://$VAR_SOCKET"
  elif [ -S "$DOCKER_DESKTOP_SOCKET" ]; then
    export DOCKER_HOST="unix://$DOCKER_DESKTOP_SOCKET"
  else
    CONTEXT_ENDPOINT=$(docker context inspect --format '{{.Endpoints.docker.Host}}' 2>/dev/null || true)
    if [ -n "$CONTEXT_ENDPOINT" ]; then
      export DOCKER_HOST="$CONTEXT_ENDPOINT"
    fi
  fi
fi

if [ -n "$DOCKER_HOST" ]; then
  echo "🔌 Using Docker Host: $DOCKER_HOST"
fi

# 1. Check Docker prerequisite
if ! command -v docker &> /dev/null; then
  echo "❌ Error: Docker is not installed or not in PATH."
  echo "👉 Please install Docker Desktop or OrbStack first."
  exit 1
fi

if ! docker info &> /dev/null; then
  echo "❌ Error: Docker daemon is not running."
  echo "👉 Please start Docker / OrbStack and try again."
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

# Clean corrupt act action cache if requested
if [[ "$1" == "--clean-cache" ]]; then
  echo "🧹 Cleaning act action cache (~/.cache/act)..."
  rm -rf "$HOME/.cache/act"
  echo "✅ Cache cleaned!"
  exit 0
fi

# Dry-run option
if [[ "$1" == "--dry-run" || "$1" == "-n" ]]; then
  echo "🔍 Dry-run mode enabled (-n). Verifying workflow syntax..."
  act push -n
  echo "✅ Workflow syntax is valid!"
  exit 0
fi

echo "📦 Running CI/CD using catthehacker JS image (catthehacker/ubuntu:js-latest)..."
echo "---------------------------------------------------------------------------------"

# Use catthehacker/ubuntu:js-latest (~600MB, preloaded for Node.js JS workflows)
ACT_ARGS="-P ubuntu-latest=catthehacker/ubuntu:js-latest"

if [[ "$(uname -m)" == "arm64" ]]; then
  ACT_ARGS="$ACT_ARGS --container-architecture linux/amd64"
fi

act push $ACT_ARGS --reuse

echo ""
echo "🎉 Local CI/CD testing completed successfully!"
