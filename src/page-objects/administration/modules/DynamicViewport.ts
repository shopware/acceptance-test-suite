import type { Page, Locator } from '@playwright/test';

// Customisable values
export interface Options {
    requestURL?: string;
    width?: number;
    scrollableElementVertical?: string | Locator;
    scrollableElementHorizontal?: string | Locator;
    additionalHeight?: number;
    waitForLocator?: string | Locator;
    contentHeight?: number;
    headerHeight?: number;
    headerElement?: string;
}
// Default values
const defaultOptions: Required<Options> = {
    requestURL: 'api/notification/message?limit=5',
    width: 1440,
    scrollableElementVertical: '.sw-card-view__content',
    scrollableElementHorizontal: '.sw-data-grid__wrapper',
    additionalHeight: 0,
    waitForLocator: '',
    contentHeight: 1080,
    headerHeight: 0,
    headerElement: '.sw-page__head-area',
};

export async function getViewportDimensions(
    page: Page,
    options: Options = {}
): Promise<{ contentWidth: number; totalHeight: number }> {
    // Merge options with defaults
    const config: Required<Options> = { ...defaultOptions, ...options };

    // Set viewport size to default values
    await page.setViewportSize({ width: config.width, height: config.contentHeight });

    // Wait for API request
    if (config.requestURL) {
        try {
            await page.waitForResponse(response => response.url().includes(config.requestURL));
        } catch {
            console.warn(`[Info] Waiting for API request: "${config.requestURL}".`);
        }
    }

    // Wait for an optional content-specific locator
    if (config.waitForLocator) {
        try {
            const locator = typeof config.waitForLocator === 'string'
                ? page.locator(config.waitForLocator)
                : config.waitForLocator;
            await locator.waitFor({ state: 'visible' });
        } catch {
            console.warn(`[Info] ${config.waitForLocator} not found or timed out.`);
        }
    }

    // Measure vertical scrollable content height
    const locator = typeof config.scrollableElementVertical === 'string'
        ? page.locator(config.scrollableElementVertical)
        : config.scrollableElementVertical;
    const scrollableElementVertical = locator;
    let contentHeight = config.contentHeight;

    try {
        if (await scrollableElementVertical.count() > 0) {
            await scrollableElementVertical.waitFor({ state: 'visible' });
            contentHeight = await scrollableElementVertical.evaluate(el => el.scrollHeight);
        }
    } catch {
        console.warn(`[Info] No scrollable element found. Applying default height: ${defaultOptions.headerHeight}.`);
    }

    // Get header height (if not inside scrollable content)
    let headerHeight = config.headerHeight;
    try {
        const header = page.locator(config.headerElement);
        if (await header.count() > 0) {
            const headerHandle = await header.elementHandle();
            const scrollableHandle = await scrollableElementVertical.elementHandle();
            if (headerHandle && scrollableHandle) {
                const isInside = await page.evaluate(
                    ([headerEl, containerEl]) => containerEl.contains(headerEl),
                    [headerHandle, scrollableHandle]
                );
                if (!isInside) {
                    headerHeight = await header.evaluate(el => el.offsetHeight);
                }
            }
        }
    } catch {
        console.warn(`[Info] No header found.`);
    }

    // Get horizontal scroll width
    let contentWidth = config.width;
    try {
        const locator = typeof config.scrollableElementHorizontal === 'string'
            ? page.locator(config.scrollableElementHorizontal)
            : config.scrollableElementHorizontal;
        const scrollableElementHorizontal = locator;
        if (await scrollableElementHorizontal.count() > 0 && await scrollableElementHorizontal.isVisible()) {
            contentWidth = await scrollableElementHorizontal.evaluate(el => el.scrollWidth);
        } else {
            contentWidth = config.width
        }
    } catch {
        console.warn(`[Info] No scrollable element found. Applying default width: ${config.width}.`);
    }

    const totalHeight = contentHeight + headerHeight + config.additionalHeight;

    console.warn(`[Viewport] Size: width=${contentWidth}, height=${totalHeight}`);
    return { contentWidth, totalHeight };
}