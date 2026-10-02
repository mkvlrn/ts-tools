#!/usr/bin/env bash
#MISE description="Run tests on staged files"

set -euo pipefail

mise exec -- bun test --changed --bail --reporter=dots
