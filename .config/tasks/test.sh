#!/usr/bin/env bash
#MISE description="Run vitest (options: --ci, --staged)"

set -euo pipefail

subcommand=()
flags=(--coverage)

for arg in "$@"; do
  case "$arg" in
  --ci) flags=(--bail=1 --reporter=github-actions) ;;
  --staged)
    subcommand=(related)
    flags=(--bail=1 --reporter=github-actions)
    ;;
  *)
    echo "unknown option: $arg" >&2
    exit 1
    ;;
  esac
done

mise exec -- vp test "${subcommand[@]}" "${flags[@]}"
