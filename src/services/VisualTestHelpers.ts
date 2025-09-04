import type { Page, Locator } from 'playwright-core';
import { expect } from '@playwright/test';

/**
 * Applies a transformation to elements matched by CSS selectors and locators.
 *
 * @param page - Playwright page
 * @param selectors - CSS selectors or Playwright locators
 * @param stringHandler - Function to apply for string selectors (runs in page context)
 * @param locatorHandler - Function to apply for locator elements
 */
async function applyToElements(
    page: Page,
    selectors: (string | Locator)[],
    stringHandler: (page: Page, selectors: string[]) => Promise<void>,
    locatorHandler: (el: Locator) => Promise<void>
) {
    if (!selectors.length) return;

    // Handle string selectors
    const stringSelectors = selectors.filter(s => typeof s === 'string') as string[];
    if (stringSelectors.length) {
        await stringHandler(page, stringSelectors);
    }

    // Handle locators
    const locatorSelectors = selectors.filter(s => typeof s !== 'string') as Locator[];
    for (const locator of locatorSelectors) {
        const count = await locator.count();
        for (let i = 0; i < count; i++) {
            const el = locator.nth(i);
            try {
                await el.waitFor({ state: 'attached', timeout: 5000 });
                await locatorHandler(el);
            } catch (e) {
                console.warn(`[Warning] Could not apply locator handler: ${e}`);
            }
        }
    }
}

/**
 * Hides elements (via `visibility: hidden`).
 */
export async function hideElements(page: Page, selectors: (string | Locator)[]) {
    return applyToElements(
        page,
        selectors,
        // String handler → inject CSS
        async (page, selectors) => {
            const css = selectors
                .map(selector => `${selector} { visibility: hidden !important; }`)
                .join('\n');
            await page.addStyleTag({ content: css });
        },
        // Locator handler → set style directly
        async el => {
            const handle = await el.elementHandle();
            if (!handle) return;
            await handle.evaluate(node => {
                (node as HTMLElement).style.visibility = 'hidden';
            });
        }
    );
}

/**
 * Replaces text content or input values of elements with `***`.
 * - Works for inputs, textareas, contenteditables and generic elements.
 * - Ensures frameworks see the change (dispatches input/change).
 * - Also masks placeholder so empty fields show *** in screenshots.
 */
export async function replaceElements(page: Page, selectors: (string | Locator)[]) {
    if (!selectors.length) {
        console.warn(`[Error] No replaceable elements stated.`);
        return;
    }

    return applyToElements(
        page,
        selectors,
        // String handler → replace text/value via querySelectorAll
        async (page, selectors) => {
            await page.evaluate((selectors) => {
                const maskInputLike = (el: HTMLInputElement | HTMLTextAreaElement) => {
                    // Set value and keep everything in sync for snapshots/frameworks
                    el.value = '***';
                    (el as HTMLInputElement).defaultValue = '***';
                    el.setAttribute('value', '***');

                    // Mask placeholder too so empty fields show ***
                    if ('placeholder' in el) {
                        el.setAttribute('placeholder', '***');
                    }

                    // Let frameworks know something changed
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                };

                const maskGeneric = (el: HTMLElement) => {
                    if (el.isContentEditable) {
                        el.textContent = '***';
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        el.textContent = '***';
                    }
                };

                selectors.forEach(sel => {
                    const elements = document.querySelectorAll<HTMLElement>(sel as string);
                    // @ts-expect-error no DOM types in this context
                    elements.forEach((el: never) => {
                        // @ts-expect-error no DOM types in this context
                        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                            maskInputLike(el);
                        } else {
                            maskGeneric(el);
                        }
                    });
                });
            }, selectors);
        },
        // Locator handler → replace text/value directly
        async el => {
            // If it's editable, prefer fill() – it fires proper events & matches user behavior
            try {
                if (await el.isEditable()) {
                    await el.fill('***', { force: true });
                    // Also mask placeholder if present (via evaluate on the element)
                    const handle = await el.elementHandle();
                    if (handle) {
                        await handle.evaluate(node => {
                            if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
                                if ('placeholder' in node) node.setAttribute('placeholder', '***');
                            }
                        });
                    }
                    return;
                }
            } catch {
                // Fall through to evaluate-based masking below
            }

            // Fallback: evaluate on the element to set values/attributes and dispatch events
            const handle = await el.elementHandle();
            if (!handle) return;
            await handle.evaluate(node => {
                const maskInputLike = (inp: HTMLInputElement | HTMLTextAreaElement) => {
                    inp.value = '***';
                    (inp as HTMLInputElement).defaultValue = '***';
                    inp.setAttribute('value', '***');
                    if ('placeholder' in inp) {
                        inp.setAttribute('placeholder', '***');
                    }
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                };

                const maskGeneric = (el: HTMLElement) => {
                    if (el.isContentEditable) {
                        el.textContent = '***';
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        el.textContent = '***';
                    }
                };

                if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
                    maskInputLike(node);
                } else {
                    maskGeneric(node as HTMLElement);
                }
            });
        }
    );
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
                        // @ts-expect-error no DOM types in this context
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

/**
 * Takes a screenshot of the desktop content of the page or the provided locator and compares it to existing ones.
 *
 * @param page - Playwright page object
 * @param filename - Filename of the screenshot
 * @param locator - Optional Playwright locator to take a screenshot of instead of the desktop content
 */
export async function assertScreenshot(page: Page, filename: string, locator?: Locator) {
    if (locator) {
        await expect(locator).toHaveScreenshot(filename);
    } else {
        await expect(page.locator('.sw-desktop__content')).toHaveScreenshot(filename);
    }
}
