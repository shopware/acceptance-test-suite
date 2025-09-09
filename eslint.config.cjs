const { defineConfig, globalIgnores } = require("eslint/config");
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");          // TS support (flat config)
const playwright = require("eslint-plugin-playwright"); // Playwright rules

module.exports = defineConfig([
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

    // ✅ Base recommended JS rules
    js.configs.recommended,

    // ✅ TypeScript rules (no type info; simplest)
    ...tseslint.configs.recommended,

    // 🔧 Your project rules (from your old config)
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            playwright,
        },
        rules: {
            // Prefer the TS version of this rule to avoid duplicates
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",

            quotes: ["error", "single", { allowTemplateLiterals: true }],
            "no-console": ["error", { allow: ["warn", "error"] }],
            "comma-dangle": ["error", "always-multiline"],

            // Your Playwright customizations
            "playwright/expect-expect": "off",
            "playwright/no-standalone-expect": "off",
        },
    },

    // 🎭 Limit Playwright rules to tests (recommended)
    {
        ...playwright.configs["flat/recommended"],
        files: ["tests/**", "**/*.{spec,test}.{js,jsx,ts,tsx}"],
    },
]);