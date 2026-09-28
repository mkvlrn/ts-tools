#!/usr/bin/env bash
#MISE description="Run tests on staged files"
mise exec -- bun test --changed --bail --reporter=dots
