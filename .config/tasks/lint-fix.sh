#!/usr/bin/env bash
#MISE description="Fix files with biome"
mise exec -- biome check --no-errors-on-unmatched --write
