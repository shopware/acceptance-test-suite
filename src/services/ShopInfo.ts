import { Page, Request } from 'playwright-core';
import { type AdminApiContext } from './AdminApiContext';

export const isSaaSInstance = async (adminApiContext: AdminApiContext): Promise<boolean> => {
    const instanceFeatures = await adminApiContext.get('./instance/features');
    return instanceFeatures.ok();
};

export const isThemeCompiled = async (page: Page): Promise<boolean> => {
    let allCSSFound = false;

    const listener = (request: Request) => {
        if (request.url().includes('all.css')) {
            allCSSFound = true;
        }
    };

    /**
     * We request the storefront index and see if a all.css is loaded. 
     * If that does not happen, the theme is not assigned/compiled
     */
    page.on('request', listener);
    await page.goto('./', { waitUntil: 'load' });
    page.off('request', listener);

    return allCSSFound;
};