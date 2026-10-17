#!/usr/bin/env bash
#MISE description="Build and publishes @mkvlrn/config to npm"

set -euo pipefail

mise exec -- bun install --frozen-lockfile --ignore-scripts

echo "Building @mkvlrn/config..."
mise exec -- bun packages/config/scripts/build.ts

echo "Publishing @mkvlrn/config to npm..."
(cd packages/config && mise exec -- npm publish --access public)
