#!/usr/bin/env bash
#MISE description="Run tests related to staged files with vite+"

set -euo pipefail

mise exec -- vp test related --bail=1 --reporter=github-actions
