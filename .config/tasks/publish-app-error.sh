#!/usr/bin/env bash
#MISE description="Build and publishes @mkvlrn/app-error to npm and jsr"
echo "Clean..."
rm -rf packages/app-error/dist

echo "Building @mkvlrn/app-error..."
mise exec -- bun build ./packages/app-error/src/main.ts --outdir ./packages/app-error/dist
mise exec -- tsc --declaration --emitDeclarationOnly --outDir packages/app-error/dist --module ESNext --moduleResolution Bundler packages/app-error/src/main.ts --ignoreConfig

echo "Publishing @mkvlrn/app-error to npm..."
(cd packages/app-error && mise exec -- npm publish --access public)

echo "Publishing @mkvlrn/app-error to jsr..."
(cd packages/app-error && mise exec -- jsr publish)
