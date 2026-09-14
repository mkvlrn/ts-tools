// biome-ignore lint/correctness/noNodejsModules: Bun supports these Node-compatible filesystem APIs.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
// biome-ignore lint/correctness/noNodejsModules: Bun supports this Node-compatible path API.
import { join } from "node:path";

declare const Bun: {
  JSON5: {
    parse(source: string): unknown;
  };
};

const packageRoot = join(import.meta.dir, "..");
const sourceDirectory = join(packageRoot, "src");
const outputDirectory = join(packageRoot, "dist");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const biomeConfig = Bun.JSON5.parse(await readFile(join(sourceDirectory, "biome.jsonc"), "utf8"));

await Promise.all([
  writeFile(join(outputDirectory, "biome.json"), `${JSON.stringify(biomeConfig, null, 2)}\n`),
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
