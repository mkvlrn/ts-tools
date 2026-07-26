# @mkvlrn/config

Custom, opinionated configurations for biome and typescript (tsconfig.json).

To be used in my node projects - aimed at modern, type-safe, non-spaghetti codebases.

They'll work well in most base node, nest, and react (non next) projects without changes, just by extending these configs.

[![npm](https://img.shields.io/npm/v/@mkvlrn/config)](https://www.npmjs.com/package/@mkvlrn/config)

## Installation

```bash
pnpm add @mkvlrn/config -D
```

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
  "extends": ["@mkvlrn/config/biome"],
  "overrides": [
    // any overrides, see biome docs
  ]
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
  }
}
```

</details>

Obs: anything related to files needs to be set: rootDir, outDir, baseUrl, paths, etc - this prevents path confusion because the "original" tsconfig will be in node_modules.

## License

MIT
