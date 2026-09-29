import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

declare const Bun: {
  // biome-ignore lint/style/useNamingConvention: Bun exposes this API as JSON5.
  JSON5: {
    parse: (source: string) => unknown;
  };
};

const packageRoot = join(import.meta.dir, "..");
const sourceDirectory = join(packageRoot, "src");
const outputDirectory = join(packageRoot, "dist");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const readBiomeConfig = async (name: string) =>
  Bun.JSON5.parse(await readFile(join(sourceDirectory, "biome", `${name}.jsonc`), "utf8"));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeValues = (currentValue: unknown, value: unknown): unknown => {
  if (isRecord(currentValue) && isRecord(value)) {
    return mergeConfigs(currentValue, value);
  }

  if (Array.isArray(currentValue) && Array.isArray(value)) {
    return [...currentValue, ...value];
  }

  return value;
};

const mergeConfigs = (...configs: unknown[]): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const config of configs) {
    if (isRecord(config)) {
      for (const [key, value] of Object.entries(config)) {
        result[key] = mergeValues(result[key], value);
      }
    }
  }

  return result;
};

const [backendBiomeConfig, reactBiomeConfig] = await Promise.all([
  readBiomeConfig("backend"),
  readBiomeConfig("react"),
]);

const backendConfig = backendBiomeConfig;
const reactConfig = mergeConfigs(backendBiomeConfig, reactBiomeConfig);

await Promise.all([
  writeFile(
    join(outputDirectory, "biome-backend.json"),
    `${JSON.stringify(backendConfig, null, 2)}\n`,
  ),
  writeFile(join(outputDirectory, "biome-react.json"), `${JSON.stringify(reactConfig, null, 2)}\n`),
  cp(join(sourceDirectory, "tsconfig.json"), join(outputDirectory, "tsconfig.json")),
]);

const sourceVitestConfig = JSON.parse(
  await readFile(join(sourceDirectory, "vitest.config.json"), "utf8"),
) as Record<string, unknown>;
const vitestConfig = Object.fromEntries(
  Object.entries(sourceVitestConfig).filter(([key]) => key !== "$schema"),
);

await writeFile(
  join(outputDirectory, "vitest.config.json"),
  `${JSON.stringify(vitestConfig, null, 2)}\n`,
);
