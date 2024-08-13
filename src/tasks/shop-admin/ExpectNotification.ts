import { test as base } from '@playwright/test';
import type { Task } from '../../types/Task';
import type { FixtureTypes } from '../../types/FixtureTypes';

export const ExpectNotification = base.extend<{ ExpectNotification: Task }, FixtureTypes>({
    ExpectNotification: async ({ ShopAdmin }, use ) => {
        const task = (message: string, close = true) => {
            return async function ExpectNotification() {
                const notification = ShopAdmin.page.locator('.sw-alert', { hasText: message });
                await ShopAdmin.expects(notification).toBeVisible();
                await ShopAdmin.expects(notification).toContainText(message);

                if (close) {
                    await notification.locator('.sw-alert__close').click();
                }
            }
        }

        await use(task);
    },
});