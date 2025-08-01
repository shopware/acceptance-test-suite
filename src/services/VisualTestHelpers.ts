import type { Page, Locator } from '@playwright/test';

/**
 * Hides the given page elements using `visibility: hidden`, so they become invisible
 * without affecting the layout (no realignment occurs).
 *
 * @param page - Playwright page object
 * @param selectors - CSS selectors for elements to hide
 */
export async function hideElements(page: Page, selectors: (string | Locator)[]) {
    if (!selectors.length) return;

    // Handle selector strings
    const stringSelectors = selectors.filter(s => typeof s === 'string') as string[];
    if (stringSelectors.length) {
        const css = stringSelectors
            .map(selector => `${selector} { visibility: hidden !important; }`)
            .join('\n');
        await page.addStyleTag({ content: css });
    }

    // Handle locators
    const locatorSelectors = selectors.filter(s => typeof s !== 'string') as Locator[];
    for (const locator of locatorSelectors) {
        const count = await locator.count();
        for (let i = 0; i < count; i++) {
            const el = locator.nth(i);
            await el.evaluate(el => {
                // @ts-expect-error no DOM types in this context
                (el as HTMLElement).style.visibility = 'hidden';
            });
        }
    }
}

/**
 * Replaces the text content of selected elements with `***`.
 *
 * @param page - Playwright page object
 * @param selectors - CSS selectors for elements whose content to replace
 */
export async function replaceElements(page: Page, selectors: (string | Locator)[]) {
    if (!selectors.length) return;

    for (const selector of selectors) {
        if (typeof selector === 'string') {
            // Handle selector strings
            await page.evaluate((sel) => {
                // @ts-expect-error no DOM types in this context
                const elements = document.querySelectorAll<HTMLElement>(sel);
                elements.forEach((el: { textContent: string; }) => {
                    el.textContent = '***';
                });
            }, selector);
        } else {
            // Handle locators
            const count = await selector.count();
            for (let i = 0; i < count; i++) {
                const el = selector.nth(i);
                await el.evaluate(el => {
                    el.textContent = '***';
                });
            }
        }
    }
}

/**
 * Calculates the ideal viewport dimensions for a Playwright test based on scrollable content,
 * header visibility, and optional configuration. Useful for dynamic screenshot sizing or
 * testing long-scrolling pages.
 *
 * This function:
 * - Optionally waits for a network request (`requestURL`) before continuing.
 * - Optionally waits for a specific locator (`waitForLocator`) to become visible.
 * - Measures scrollable content height (`scrollableElementVertical`) and header height.
 * - Measures scrollable content width (`scrollableElementHorizontal`).
 * - Falls back to defaults if elements are not found or inaccessible.
 *
 * @param {Page} page - The Playwright `Page` object representing the current browser tab.
 * @param {Options} [options] - Optional configuration to override default behavior.
 * @param {string} [options.requestURL] - A URL substring to wait for via `waitForResponse`.
 * @param {number} [options.width] - Base viewport width to use (default: 1440).
 * @param {string | Locator} [options.scrollableElementVertical] - Selector or Locator for vertical scroll container.
 * @param {string | Locator} [options.scrollableElementHorizontal] - Selector or Locator for horizontal scroll container.
 * @param {number} [options.additionalHeight] - Extra height to add (e.g., to avoid cut-off).
 * @param {string | Locator} [options.waitForSelector] - A selector or Locator to wait for visibility before measuring.
 * @param {number} [options.contentHeight] - Default vertical height fallback if measurement fails.
 * @param {number} [options.headerHeight] - Default header height fallback.
 * @param {string} [options.headerElement] - Selector for a header element whose height should be added if outside scrollable container.
 *
 * @returns {Promise<{ contentWidth: number; totalHeight: number }>} - A Promise resolving to the measured dimensions:
 *   - `contentWidth`: the horizontal scroll width or fallback.
 *   - `totalHeight`: sum of content height, header height, and any additional height.
 */
export interface Options {
    requestURL?: string;
    width?: number;
    scrollableElementVertical?: string | Locator;
    scrollableElementHorizontal?: string | Locator;
    additionalHeight?: number;
    waitForSelector?: string | Locator;
    contentHeight?: number;
    headerHeight?: number;
    headerElement?: string;
}
const defaultOptions: Required<Options> = {
    requestURL: 'api/notification/message?limit=5',
    width: 1440,
    scrollableElementVertical: '.sw-card-view__content',
    scrollableElementHorizontal: '.sw-data-grid__wrapper',
    additionalHeight: 0,
    waitForSelector: '',
    contentHeight: 1080,
    headerHeight: 0,
    headerElement: '.sw-page__head-area',
};

export async function setViewport(
    page: Page,
    options: Options = {}
): Promise<void> {

    // Merge options with defaults
    const config: Required<Options> = { ...defaultOptions, ...options };

    // Set viewport size to default values
    await page.setViewportSize({ width: config.width, height: config.contentHeight });

    // Wait for API request
    if (config.requestURL) {
        try {
            await page.waitForResponse(response => response.url().includes(config.requestURL));
        } catch {
            console.warn(`[Error] Timed out waiting for request: "${config.requestURL}".`);
        }
    }

    // Wait for an optional content-specific locator
    if (config.waitForSelector) {
        try {
            const locator = typeof config.waitForSelector === 'string'
                ? page.locator(config.waitForSelector)
                : config.waitForSelector;
            await locator.waitFor({ state: 'visible', timeout: 10000 });
        } catch {
            console.warn(`[Error] ${config.waitForSelector} not found or timed out.`);
        }
    }

    const locator = typeof config.scrollableElementVertical === 'string'
        ? page.locator(config.scrollableElementVertical)
        : config.scrollableElementVertical;
    const scrollableElementVertical = locator;
    let contentHeight = config.contentHeight;
    // Skip measurement if contentHeight is already provided
    if (options.contentHeight === undefined) {
    // Measure vertically scrollable content height
        try {
            if (await scrollableElementVertical.count() > 0 && await scrollableElementVertical.isVisible()) {
                await scrollableElementVertical.waitFor({ state: 'visible' });
                contentHeight = await scrollableElementVertical.evaluate(el => el.scrollHeight);
            }
        } catch {
            console.warn(`[Warning] Scrollable element not found. Applying default height: ${config.contentHeight}.`);
        }
    }

    let headerHeight = config.headerHeight;
    // Skip measurement if contentHeight is already provided
    if (options.contentHeight === undefined) {
    // Measure header height
        try {
            const header = page.locator(config.headerElement);
            if (await header.count() > 0 && await header.isVisible()) {
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
            console.warn(`[Info] Header not found.`);
        }
    }

    let contentWidth = config.width;
    // Skip measurement if width is already provided
    if (options.width === undefined) {
    // Measure horizontal scroll width
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
            console.warn(`[Warning] Scrollable element not found. Applying default width: ${config.width}.`);
        }
    }
    const totalHeight = contentHeight + headerHeight + config.additionalHeight;

    await page.setViewportSize({ width: contentWidth, height: totalHeight });
    console.warn(`[Success] Viewport size: width=${contentWidth}, height=${totalHeight}`);
    return;
}