#!/usr/bin/env bash
#MISE description="NPM publish dry run"

set -euo pipefail

for dir in packages/*; do
  if [ -d "$dir" ]; then
    mise run publish "$(basename "$dir")" --dry-run
  fi
done
