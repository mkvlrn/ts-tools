#!/usr/bin/env bash
#MISE description="Install Lefthook git hooks"

set -euo pipefail

mise exec -- bun install --frozen-lockfile
mise exec -- lefthook install
