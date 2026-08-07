import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
  test: {
    include: ["**/*.{test,spec}.ts"],
    exclude: ["node_modules"],
    watch: false,
    reporters: ["tree"],
    coverage: {
      clean: true,
      cleanOnRerun: true,
      include: ["src"],
    },
    // biome-ignore lint/style/useNamingConvention: needed for vitest
    env: { NODE_ENV: "test" },
    environment: "node",
    passWithNoTests: true,
  },
});

/**
 * Vitest configuration for this package.
 *
 * This configuration defines the test environment and Vitest behavior
 * used when running the package test suite.
 */
export default config;
