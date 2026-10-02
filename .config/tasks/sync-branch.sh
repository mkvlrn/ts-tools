#!/usr/bin/env bash
#MISE description="Sync package manager deps"

set -euo pipefail

mise install
mise prune -y
mise exec -- bun install --frozen-lockfile
