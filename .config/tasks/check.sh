#!/usr/bin/env bash
#MISE description="Check files with vite+"

set -euo pipefail

mise exec -- vp check --no-error-on-unmatched-pattern
