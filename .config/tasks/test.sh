#!/usr/bin/env bash
#MISE description="Run tests"

set -euo pipefail

mise exec -- bun test --coverage
