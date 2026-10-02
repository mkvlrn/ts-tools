#!/usr/bin/env bash
#MISE description="Build and publishes @mkvlrn/result to npm and jsr"

set -euo pipefail

mise exec -- bun install --frozen-lockfile --ignore-scripts

echo "Clean..."
rm -rf packages/result/dist

echo "Building @mkvlrn/result..."
mise exec -- bun build ./packages/result/src/main.ts --outdir ./packages/result/dist
mise exec -- tsc --declaration --emitDeclarationOnly --outDir packages/result/dist --module ESNext --moduleResolution Bundler packages/result/src/main.ts --ignoreConfig

echo "Publishing @mkvlrn/result to npm..."
(cd packages/result && mise exec -- npm publish --access public)

echo "Publishing @mkvlrn/result to jsr..."
(cd packages/result && mise exec -- jsr publish)
