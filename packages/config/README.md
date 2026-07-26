# @mkvlrn/config

Custom, opinionated configurations for biome and typescript (tsconfig.json).

To be used in my node projects - aimed at modern, type-safe, non-spaghetti codebases.

They'll work well in most base node, nest, and react (non next) projects without changes, just by extending these configs.

[![JSR Version](https://img.shields.io/jsr/v/%40mkvlrn/config)](https://jsr.io/@mkvlrn/config)

## Installation

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

<!-- x-release-please-start-version -->

```bash
bunx jsr add -D @mkvlrn/config@^0.0.3 # bun
pnpm add -D jsr:@mkvlrn/config # pnpm
yarn add -D jsr:@mkvlrn/config # yarn
deno add -D jsr:@mkvlrn/config # deno
npx jsr add -D @mkvlrn/config # npm
```

<!-- x-release-please-end -->

## Usage

Obs: Both biome and typescript need to be installed separately and be available in the project.

### biome

Create your configuration file (`biome.json` or `biome.jsonc`):

<details>
<summary><code>biome.jsonc</code></summary>

```jsonc
{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "root": true, // if this is the root of your project, false otherwise
  "extends": ["@mkvlrn/config/biome.json"],
  "overrides": [
    // any overrides, see biome docs
  ],
}
```

</details>

### typescript (tsconfig.json)

Create your configuration file:

<details>
<summary><code>tsconfig.json</code></summary>

```jsonc
{
  "extends": "@mkvlrn/config/tsconfig.json",
  "compilerOptions": {
    // add your custom rules here
  },
}
```

</details>

Obs: anything related to files needs to be set: rootDir, outDir, baseUrl, paths, etc - this prevents path confusion because the "original" tsconfig will be in node_modules.

## License

MIT
