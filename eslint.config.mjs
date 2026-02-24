import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-vars": "warn", // ne bloque plus le pipeline
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    files: ["tests/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
  },
]);