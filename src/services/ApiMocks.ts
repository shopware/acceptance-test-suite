import { Page } from '@playwright/test';

export async function mockApiCalls(page: Page) {
    await page.route('**/api/notification/message*', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ notifications: [], timestamp: '2024-06-19 06:23:25.040' }),
    }));

    // the SBP calls do not work for non-sbp users (which are created by the ATS)
    await page.route('**/api/_action/store/plugin/search*', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0 }),
    }));

    await page.route('**/api/_action/store/updates*', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0 }),
    }));

    await page.route('**/api/sbp/shop-info*', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0 }),
    }));

    await page.route('**/api/sbp/shop-info*', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: process.env.SBP_SHOP_INFO_JSON ?? '{}',
    }));

    await page.route('**/api/sbp/bookableplans*', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: process.env.SBP_BOOKABLE_PLANS_JSON ?? '{}',
    }));

    await page.route('**/api/sbp/nps/active-trigger', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"prompt":false,"trigger":["gone-live"]}',
    }));
}