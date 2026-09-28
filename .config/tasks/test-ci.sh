#!/usr/bin/env bash
#MISE description="Run tests in ci mode"
mise exec -- bun test --bail --reporter=dots
