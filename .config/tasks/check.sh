#!/usr/bin/env bash
#MISE description="Check files with vite+ (options: --fix, file paths)"

set -euo pipefail

fix=()
files=()

for arg in "$@"; do
  case "$arg" in
  --fix) fix=(--fix) ;;
  *) files+=("$arg") ;;
  esac
done

mise exec -- vp check --no-error-on-unmatched-pattern "${fix[@]}" "${files[@]}"
