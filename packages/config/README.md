# @mkvlrn/config

[![NPM Version](https://img.shields.io/npm/v/%40mkvlrn%2Fconfig?logo=npm&labelColor=red&color=white&label)](https://www.npmjs.com/package/@mkvlrn/config) [![JSR](https://jsr.io/badges/@mkvlrn/config)](https://jsr.io/@mkvlrn/config) [![Bun](https://badgen.net/badge/icon/it's%20better%20than%20node?icon=bun&label=bun&color=black)](https://bun.com)

Custom, opinionated configurations that can be used to extend your own biome, typescript, and vitest configs. Or just to serve as sane, strict defaults.

Aimed at modern, type-safe, non-spaghetti codebases in most most node, bun, deno, nest, and react projects without changes, just by extending these configs.

## Installation

> [!NOTE]
> This package is hosted both at [npm](https://npmjs.com) and [jsr](https://jsr.io), and is ESM **only**.

<!-- x-release-please-start-version -->

| Package manager | npm                           | JSR                                     |
| --------------- | ----------------------------- | --------------------------------------- |
| Bun             | `bun add @mkvlrn/config`      | `bunx jsr add @mkvlrn/config@0.4.3`     |
| npm             | `npm install @mkvlrn/config`  | `npx jsr add @mkvlrn/config@0.4.3`      |
| pnpm            | `pnpm add @mkvlrn/config`     | `pnpm dlx jsr add @mkvlrn/config@0.4.3` |
| Yarn            | `yarn add @mkvlrn/config`     | `yarn dlx jsr add @mkvlrn/config@0.4.3` |
| Deno            | `deno add npm:@mkvlrn/config` | `deno add jsr:@mkvlrn/config@0.4.3`     |

<!-- x-release-please-end -->

## Usage

Obs: Biome, TypeScript, and Vitest need to be installed separately and be available in the project.

### biome (biome.json / biome.jsonc)

Create your configuration file:

<details>
<summary><code>biome.jsonc</code></summary>

```jsonc
{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "root": true, // if this is the root of your project, false otherwise
  "extends": ["@mkvlrn/config/biome"],
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
  "extends": "@mkvlrn/config/tsconfig",
  "compilerOptions": {
    // add your custom rules here
  },
}
```

</details>

Obs: anything related to files needs to be set: rootDir, outDir, baseUrl, paths, etc - this prevents path confusion because the "original" tsconfig will be in `node_modules`.

### vitest (vitest.config.ts)

Create your configuration file:

<details>
<summary><code>vitest.config.ts</code></summary>

```ts
import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "@mkvlrn/config/vitest";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // custom configs here
    },
  }),
);
```

## License

MIT
