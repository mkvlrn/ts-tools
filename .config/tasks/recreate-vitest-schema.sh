#!/usr/bin/env bash
#MISE description="Create vitest config json schema from vitest types"

mise exec -- bunx typescript-json-schema ./packages/config/tsconfig.schema.json UserConfig --include './packages/config/node_modules/vitest/**/*.d.ts' >./packages/config/vitest.schema.json
