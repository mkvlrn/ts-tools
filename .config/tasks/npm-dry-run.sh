#!/usr/bin/env bash
#MISE description="NPM publish dry run"

for dir in packages/*; do
  if [ -d "$dir" ]; then
    echo "Checking $dir"
    case "$dir" in
    packages/app-error)
      mise exec -- bun build ./packages/app-error/src/main.ts --outdir ./packages/app-error/dist
      mise exec -- tsc --declaration --emitDeclarationOnly --outDir packages/app-error/dist --module ESNext --moduleResolution Bundler packages/app-error/src/main.ts --ignoreConfig
      ;;
    packages/config)
      (cd "$dir" && mise exec -- bun scripts/build.ts)
      ;;
    packages/result)
      mise exec -- bun build ./packages/result/src/main.ts --outdir ./packages/result/dist
      mise exec -- tsc --declaration --emitDeclarationOnly --outDir packages/result/dist --module ESNext --moduleResolution Bundler packages/result/src/main.ts --ignoreConfig
      ;;
    esac
    (cd "$dir" && mise exec -- bun publish --dry-run --access public --quiet)
  fi
done
