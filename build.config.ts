import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    entries: ["src/index"],
    declaration: true,
    externals: [/^(?:@playwright\/test|playwright|playwright-core)(?:\/.*)?$/, "@shopware/api-client", "@axe-core/playwright", "axe-html-reporter", "axe-core", "fast-png", "uuid"],
    hooks: {
        "rollup:dts:options": (_ctx, options) => {
            // The DTS bundler follows @playwright/test's re-export chain
            // (export * from 'playwright/test') and emits the resolved
            // specifier for namespace imports. Consumers don't have the
            // unscoped `playwright` package, so rewrite it back.
            const plugins = Array.isArray(options.plugins) ? options.plugins : options.plugins ? [options.plugins] : [];
            plugins.push({
                name: "rewrite-playwright-dts-imports",
                renderChunk(code: string) {
                    return code.replace(/from ['"]playwright\/test['"]/g, "from '@playwright/test'");
                },
            });
            options.plugins = plugins;
        },
    },
});
