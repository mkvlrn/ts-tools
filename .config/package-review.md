# Package Review Guide

This document is the handoff and working agreement for reviewing the publishable packages in this repository.

## Review protocol

Review packages one at a time. For each finding:

1. Inspect the repository and verify the finding against the current code.
2. Explain the problem, its impact, and the proposed change.
3. Do not edit files until the proposed change is explicitly approved.
4. Apply only the approved change.
5. Run focused validation for that change.
6. Report the result before moving to the next item.

Do not batch unrelated fixes. If a proposed improvement is a policy decision rather than a clear bug, present the options and wait for a decision.

Preserve existing user work. Do not revert unrelated changes, create branches, or make broad refactors without approval.

## Repository conventions

- Use the existing Mise-managed tools and Bun runtime.
- Do not introduce dependencies or tools when existing repository tooling can solve the problem.
- The repository's configured Bun version is `1.4.2`.
- Prefer small, focused changes that match the existing package structure.
- Use separate conventional commits for logically separate changes.
- Do not create one large commit for a whole package review.
- Do not push or publish packages unless explicitly requested.

## Release Please and versioning

Packages intentionally remain on `0.x.x`; do not move them to `1.x.x`.

Current release behavior:

- `feat:` produces a minor pre-1.0 bump: `0.5.1` -> `0.6.0`.
- `fix:` produces a patch bump: `0.5.1` -> `0.5.2`.
- Breaking changes while pre-major remain within the `0.x` line according to the repository's Release Please configuration.
- `build:` generally does not trigger a release.
- `docs:` generally does not trigger a release, although it may appear in the changelog because documentation sections are configured.

Use package scopes where appropriate, for example:

```text
build(config): prepare generated publish artifacts
feat(config): align shared configuration defaults
docs(config): clean up package README
```

## Validation checklist

Run the narrowest relevant checks after each change. Before considering a package complete, run the applicable full set:

```sh
mise exec -- bun <package build task or script>
mise exec -- biome check --diagnostic-level=warn --no-errors-on-unmatched
mise exec -- tsc
mise exec -- bun test --coverage
npm_config_cache=/tmp/npm-cache npm pack --dry-run --json
mise exec -- jsr publish --dry-run --allow-dirty
```

For package publishing checks, verify both the file list and the contents of generated artifacts. A successful dry-run is not enough if it publishes schemas, source files, generator inputs, or unrelated repository configuration.

Environment notes:

- If `bun` is not on `PATH`, use `mise exec -- bun ...`.
- If Mise needs to install tools, its cache may require write access under `~/.cache/mise` and `~/.local/share/mise`.
- npm may need `npm_config_cache=/tmp/npm-cache` in restricted environments.
- Existing warnings from npm's `devEngines` check or the JSR wrapper should be reported separately from actual validation failures.

## Completed: `packages/config`

The config package review is complete.

### Publish architecture

- `packages/config/scripts/build.ts` generates `packages/config/dist`.
- The publish task in `.config/mise.toml` runs the build before npm and JSR publishing.
- npm publishes only `dist` through `package.json`'s `files` field.
- npm and JSR exports point to generated files in `dist`.
- The source Vitest `$schema` reference is retained for repository/editor use but removed from the published Vitest JSON.
- The Vitest and TypeScript schemas are not published.
- JSR uses an explicit `publish.include` allowlist.

### Configuration decisions

- `packages/config/src/biome.jsonc` is the authoritative Biome source.
- The build parses JSONC with Bun's built-in JSON5 parser and writes comment-free `dist/biome.json`.
- The duplicate `packages/config/src/biome.json` was removed.
- The repository root `biome.jsonc` ignores generated `dist` output and the generated Vitest schema.
- `compilerOptions.types` was removed from the shared TypeScript config; consumers choose environment types explicitly when needed.
- Vitest discovers `.ts`, `.tsx`, and `.mts` test/spec files.
- Vitest's redundant `exclude: ["node_modules"]` was removed so Vitest's own defaults apply.
- Biome config/test overrides support `.ts`, `.tsx`, and `.mts`.
- `noMagicNumbers` remains enabled; no current diagnostics justified disabling it for tests.
- Shared repository presets `src/renovate.json` and `src/mkvlrn.omp.jsonc` remain in place because other projects consume them directly.

### Metadata and documentation

- Package description mentions Biome, TypeScript, and Vitest.
- `vitest` is included in package keywords.
- Repository metadata includes `directory: "packages/config"`.
- README typo and Vitest import example were corrected.

### Validation completed

The following passed after the config changes:

- Config build through Mise/Bun.
- Biome check: 27 files checked, no errors.
- TypeScript check.
- Tests: 81 passed, 0 failed, 100% reported coverage.
- npm pack dry-run with only the intended public files.
- JSR publish dry-run with only the allowlisted public files.

### Commits

```text
f944d93 build(config): prepare generated publish artifacts
b2ad9f6 feat(config): align shared configuration defaults
d7ef555 docs(config): clean up package README
```

## Starting the next package

When continuing in a new thread, provide this instruction:

> Continue the package review using `.config/package-review.md`. Review the next package one finding at a time, verify each finding against the repository, explain the proposed change, wait for approval before editing, validate each approved change, and use separate conventional commits.
