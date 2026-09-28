#!/usr/bin/env bash
#MISE description="JSR publish dry run"

for dir in packages/*; do
  if [ -d "$dir" ]; then
    echo "Checking $dir"
    if [ "$dir" = "packages/config" ]; then
      (cd "$dir" && mise exec -- bun scripts/build.ts)
    fi
    (cd "$dir" && mise exec -- jsr publish --dry-run --quiet --allow-dirty)
  fi
done
