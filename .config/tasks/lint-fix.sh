#!/usr/bin/env bash
#MISE description="Fix files with biome"

set -euo pipefail

mise exec -- biome check --no-errors-on-unmatched --write
