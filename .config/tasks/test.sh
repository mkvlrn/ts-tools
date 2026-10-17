#!/usr/bin/env bash
#MISE description="Run tests with vite+"

set -euo pipefail

mise exec -- vp test --coverage
