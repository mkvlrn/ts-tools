#!/usr/bin/env bash
#MISE description="Regenerate dependency lockfiles"

set -euo pipefail

rm -f bun.lock
mise exec -- bun install

git add bun.lock

if git diff --cached --quiet -- bun.lock; then
  echo "Lockfile unchanged; nothing to commit."
  exit 0
fi

git commit -m "chore(deps): update lockfile"
