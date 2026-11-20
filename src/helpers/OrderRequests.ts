import type { Page, Response } from "playwright-core";

/**
 * Waits for the administration to open a new order version.
 * Register this before navigating to the order.
 */
export function waitForOrderVersion(page: Page, orderId: string): Promise<Response> {
    return page.waitForResponse((response) => response.url().includes(`/_action/version/order/${orderId}`) && response.request().method() === "POST");
}

/**
 * Waits for the order address update on the current order version.
 * Register this before saving the order.
 */
export function waitForOrderAddressUpdate(page: Page, orderId: string): Promise<Response> {
    return page.waitForResponse((response) => response.url().includes(`/_action/order/${orderId}/order-address`) && response.request().method() === "POST");
}

/**
 * Waits for the order draft to be merged back into the live order.
 * The merge URL carries the draft version id. Register this before saving the order.
 */
export function waitForOrderVersionMerge(page: Page, versionId: string): Promise<Response> {
    return page.waitForResponse((response) => response.url().includes(`/_action/version/merge/order/${versionId}`) && response.request().method() === "POST");
}
