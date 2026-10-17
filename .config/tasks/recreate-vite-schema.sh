#!/usr/bin/env bash
#MISE description="Create vite config json schema from vite-plus types"

set -euo pipefail

# Vite+ adds fmt/lint/check/run/staged/pack/create via `declare module 'vite'`
# in a hashed .d.ts. typescript-json-schema only sees that augmentation when
# the file is referenced explicitly, so locate it and reference it from a
# temporary root file that is removed on exit.
augmentation=$(grep -l "declare module 'vite'" ./packages/config/node_modules/vite-plus/dist/*.d.ts | head -n 1)
root_file=./packages/config/schema-root.tmp.ts
trap 'rm -f "$root_file"' EXIT

printf 'import type { UserConfig } from "vite-plus";\n/// <reference path="%s" />\nexport type ViteConfig = UserConfig;\n' "$augmentation" >"$root_file"

mise exec -- pnpm --filter @mkvlrn/config exec typescript-json-schema ./packages/config/tsconfig.schema.json ViteConfig --required --include "$augmentation" --include "$root_file" >./packages/config/vite.schema.json
