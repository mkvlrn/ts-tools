# @mkvlrn/config

[![JSR](https://jsr.io/badges/@mkvlrn/config)](https://jsr.io/@mkvlrn/config) [![Bun](https://badgen.net/badge/icon/it's%20better%20than%20node?icon=bun&label=bun&color=black)](https://bun.com)

Custom, opinionated configurations that can be used to extend your own biome and typescript configs. Or just to serve as sane, strict defaults.

Aimed at modern, type-safe, non-spaghetti codebases in most most node, bun, deno, nest, and react projects without changes, just by extending these configs.

## Installation

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

<!-- x-release-please-start-version -->

```bash
bunx jsr add -D @mkvlrn/config@^0.2.0 # bun
pnpm dlx jsr add @mkvlrn/config # pnpm
yarn dlx jsr add @mkvlrn/config # yarn
deno add -D jsr:@mkvlrn/config # deno
npx jsr add -D @mkvlrn/config # npm
```

<!-- x-release-please-end -->

## Usage

Obs: Both biome and typescript need to be installed separately and be available in the project.

### biome (biome.json / biome.jsonc)

Create your configuration file:

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

Obs: anything related to files needs to be set: rootDir, outDir, baseUrl, paths, etc - this prevents path confusion because the "original" tsconfig will be in `node_modules`.

## License

MIT
