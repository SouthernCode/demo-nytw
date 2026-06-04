import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit tests are fast, pure-logic tests. End-to-end browser flows live in
    // tests/e2e and are run by Playwright, not Vitest.
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    globals: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
