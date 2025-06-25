/* eslint-env node */

module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic",
        "plugin:playwright/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "n"],
    root: true,
    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "quotes": ["error", "single", { allowTemplateLiterals: true }],
        "no-console": ["error", { allow: ["warn", "error"] }],
        "comma-dangle": ["error", "always-multiline"],
        "no-unused-vars": "warn",
        "playwright/expect-expect": "off",
        "playwright/no-standalone-expect": "off",
        "n/no-process-env": ["error", {
            "allowedVariables": ["NODE_ENV"],
        }],
        "n/no-unsupported-features/es-syntax": "off"
    },
    overrides: [
        {
            files: ["src/ConfigOptions.ts", "playwright.config.ts"],
            rules: {
                // ConfigOptions.ts is the central place for environment configuration
                "n/no-process-env": "off"
            }
        },
    ]
};
