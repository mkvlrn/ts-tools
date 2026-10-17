#!/usr/bin/env bash
#MISE description="Builds and publishes a workspace package to npm (usage: publish <app-error|config|result> [--dry-run])"

set -euo pipefail

package="${1:?usage: publish <app-error|config|result> [--dry-run]}"
dir="packages/$package"

mise exec -- pnpm install --frozen-lockfile --ignore-scripts

echo "Cleaning @mkvlrn/$package..."
rm -rf "$dir/dist"

echo "Building @mkvlrn/$package..."
case "$package" in
app-error | result)
  mise exec -- vp pack "$dir/src/main.ts" --no-config --dts --clean --out-dir "$dir/dist"
  ;;
config)
  mkdir -p "$dir/dist"
  cp "$dir/src/tsconfig.json" "$dir/dist/tsconfig.json"
  mise exec -- jq "del(.\"\$schema\")" "$dir/src/vite.config.json" >"$dir/dist/vite.config.json"
  ;;
*)
  echo "Unknown package: $package" >&2
  exit 1
  ;;
esac

if [ "${2:-}" = "--dry-run" ]; then
  echo "Dry run for @mkvlrn/$package..."
  (cd "$dir" && mise exec -- pnpm publish --dry-run --access public --no-git-checks)
else
  echo "Publishing @mkvlrn/$package to npm..."
  (cd "$dir" && mise exec -- pnpm publish --access public --no-git-checks)
fi
