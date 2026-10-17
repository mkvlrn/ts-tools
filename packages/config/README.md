# @mkvlrn/config

[![NPM Version](https://img.shields.io/npm/v/%40mkvlrn%2Fconfig?logo=npm&labelColor=red&color=white&label)](https://www.npmjs.com/package/@mkvlrn/config) [![Bun](https://badgen.net/badge/icon/it's%20better%20than%20node?icon=bun&label=bun&color=black)](https://bun.com)

Custom, opinionated configurations that can be used to extend your own typescript and vite+ configs. Or just to serve as sane, strict defaults.

Aimed at modern, type-safe, non-spaghetti codebases in most node, bun, deno, nest, and react projects without changes, just by extending these configs.

## Installation

> [!NOTE]
> This package is hosted at [npm](https://npmjs.com), and is ESM **only**.
>
> The exported configuration files are generated during publishing; editor-only schemas and repository source files are not included in the published package.

<!-- x-release-please-start-version -->

| Package manager | npm                              |
| --------------- | -------------------------------- |
| Bun             | `bun add @mkvlrn/config -D`      |
| npm             | `npm install @mkvlrn/config -D`  |
| pnpm            | `pnpm add @mkvlrn/config -D`     |
| Yarn            | `yarn add @mkvlrn/config -D`     |
| Deno            | `deno add npm:@mkvlrn/config -D` |

<!-- x-release-please-end -->

## Usage

Obs: TypeScript and Vite+ need to be installed separately and be available in the project.

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

### vite+ (vite.config.ts)

Create your configuration file:

<details>
<summary><code>vite.config.ts</code></summary>

```ts
import baseConfig from "@mkvlrn/config/vite" with { type: "json" }; // attention here, it is a json export
import { defineConfig, mergeConfig } from "vite-plus";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // custom configs here
    },
  }),
);
```

The exported configuration is in json format, perfectly usable with `mergeConfig`.

## License

MIT
