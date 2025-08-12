import type { Page, Locator } from 'playwright-core';

/**
 * Returns the text of a tooltip.
 *
 * @param page - The Playwright page object.
 * @param tooltipArea - The element that triggers the tooltip.
 * @returns The tooltip text.
 */
export async function getTooltipText(page: Page, tooltipArea: Locator) {
    await tooltipArea.hover();
    const tooltipContent = page.locator('.sw-tooltip');
    return await tooltipContent.innerText();
}