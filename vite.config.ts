import { defineConfig, mergeConfig } from "vite-plus";
import baseConfig from "./packages/config/src/vite.config.json" with { type: "json" };

export default mergeConfig(baseConfig, defineConfig({}));
