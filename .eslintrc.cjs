/* eslint-env node */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic",
        "plugin:playwright/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "quotes": ["error", "single", { allowTemplateLiterals: true }],
        "no-console": ["error", { allow: ["warn", "error"] }],
        "comma-dangle": ["error", "always-multiline"],
        "no-unused-vars": "warn",
        "playwright/expect-expect": "off",
        "playwright/no-standalone-expect": "off",
    }
};
