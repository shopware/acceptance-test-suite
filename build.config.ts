import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: ['src/index'],
    declaration: true,
    externals: [
        '@playwright/test',
        'playwright-core',
        '@shopware/api-client',
        '@axe-core/playwright',
        'axe-html-reporter',
        'image-js',
        'uuid',
    ],
});
