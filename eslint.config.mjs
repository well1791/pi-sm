import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

// Non-type-checked by design. AGENTS.md documents pre-existing `tsc` errors that
// are runtime-safe under jiti; type-checked rules would block commits on those
// documented non-bugs. Keep this config to syntax/style only.
export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "dist/",
      "screenshots/",
      ".serena/",
      "*.lock",
      "*.config.mjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // The codebase intentionally uses `any` for dynamic user-supplied config.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // This is TUI code that parses ANSI escape sequences; \x1b in regex is intended.
      "no-control-regex": "off",
    },
  },
  prettierConfig,
);
