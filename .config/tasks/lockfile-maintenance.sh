#!/usr/bin/env bash
#MISE description="Regenerate dependency lockfiles"

rm -f bun.lock
mise exec -- bun install

git add bun.lock
git commit -m "chore(deps): update lockfile"
