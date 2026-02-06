import { test as base } from "@playwright/test";
import type { Task } from "../../types/Task";
import type { FixtureTypes } from "../../types/FixtureTypes";
import { satisfies } from "compare-versions";

export const ExpectNotification = base.extend<{ ExpectNotification: Task }, FixtureTypes>({
    ExpectNotification: async ({ ShopAdmin, InstanceMeta }, use) => {
        const task = (message: string, close = true) => {
            return async function ExpectNotification() {
                let notification;
                if (satisfies(InstanceMeta.version, "<6.7")) {
                    notification = ShopAdmin.page.locator(".sw-alert", { hasText: message });
                } else {
                    notification = ShopAdmin.page.locator(".sw-notification__alert", { hasText: message });
                }

                await ShopAdmin.expects(notification).toBeVisible();
                await ShopAdmin.expects(notification).toContainText(message);

                if (close) {
                    if (satisfies(InstanceMeta.version, "<6.7")) {
                        await notification.locator(".sw-alert__close").click();
                    } else {
                        await notification.locator(".mt-banner__close").click();
                    }
                }
            };
        };

        await use(task);
    },
});
