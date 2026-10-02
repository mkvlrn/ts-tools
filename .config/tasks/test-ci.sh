#!/usr/bin/env bash
#MISE description="Run tests in ci mode"

set -euo pipefail

mise exec -- bun test --bail --reporter=dots
