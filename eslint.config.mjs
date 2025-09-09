import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default defineConfig([
    { ignores: ["**/eslint.config.*"] },

    globalIgnores([
        "test-results/",
        "lib/",
        "dist/",
        "playwright-report/",
        "**/summary.json",
        ".vscode/",
        "**/.DS_Store",
        "**/Thumbs.db",
    ]),

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            quotes: ["error", "single", { allowTemplateLiterals: true }],
            "no-console": ["error", { allow: ["warn", "error"] }],
            "comma-dangle": ["error", "always-multiline"],
        },
    },

    {
        ...playwright.configs["flat/recommended"],
        files: ["tests/**", "**/*.{spec,test}.{js,jsx,ts,tsx}"],
    },
    {
        files: ["tests/**", "**/*.{spec,test}.{js,jsx,ts,tsx}"],
        rules: {
            "playwright/expect-expect": "off",
            "playwright/no-standalone-expect": "off",
        },
    },
]);