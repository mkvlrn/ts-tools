#!/usr/bin/env bash
#MISE description="Create vite config json schema from vite-plus types"

set -euo pipefail

# Vitest augments UserConfig with `test`, which shadows the full Vite type,
# so generate from a temporary alias that points at vite-plus' UserConfig.
root_file=./packages/config/schema-root.tmp.ts
trap 'rm -f "$root_file"' EXIT

printf 'import type { UserConfig } from "vite-plus";\nexport type ViteConfig = UserConfig;\n' >"$root_file"

mise exec -- bunx typescript-json-schema ./packages/config/tsconfig.schema.json ViteConfig --required --include './packages/config/node_modules/vite-plus/dist/**/*.d.ts' --include "$root_file" >./packages/config/vite.schema.json
