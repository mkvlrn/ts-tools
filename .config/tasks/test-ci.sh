#!/usr/bin/env bash
#MISE description="Run tests in ci mode with vite+"

set -euo pipefail

mise exec -- vp test --bail=1 --reporter=github-actions
