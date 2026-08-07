import { defineConfig } from "vitest/config";

const config = defineConfig(() => {
  return {
    test: {
      include: ["**/*.{test,spec}.ts"],
      exclude: ["node_modules"],
      watch: false,
      reporters: ["tree"],
      coverage: {
        all: true,
        clean: true,
        cleanOnRerun: true,
        include: ["src"],
        exclude: [],
      },
      // biome-ignore lint/style/useNamingConvention: needed for vitest
      env: { NODE_ENV: "test" },
      environment: "node",
      passWithNoTests: true,
      setupFiles: [],
    },
  };
});

/**
 * Vitest configuration for this package.
 *
 * This configuration defines the test environment and Vitest behavior
 * used when running the package test suite.
 */
export default config;
