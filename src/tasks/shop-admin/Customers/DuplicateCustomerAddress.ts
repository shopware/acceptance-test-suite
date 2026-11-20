import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

/**
 * Duplicates the first customer address whose row contains the given street.
 *
 * The customer address tab must already be open. The clone is registered for cleanup.
 * The address grid keeps the customer already in memory, so the task reloads the page and then waits for the new row.
 */
export const DuplicateCustomerAddress = base.extend<{ DuplicateCustomerAddress: Task }, FixtureTypes>({
    DuplicateCustomerAddress: async ({ ShopAdmin, AdminCustomerDetail, TestDataService }, use) => {
        const task = (street: string) => {
            return async function DuplicateCustomerAddress() {
                const page = AdminCustomerDetail.page;
                const addressRows = AdminCustomerDetail.addressRows(street);

                await AdminCustomerDetail.editButton.click();
                await ShopAdmin.expects(AdminCustomerDetail.addAddressButton).toBeEnabled();
                const addressCount = await addressRows.count();
                await AdminCustomerDetail.actionsMenuButton(street).click();

                const cloneRequest = page.waitForResponse((response) => response.url().includes("/api/_action/clone/customer-address/") && response.request().method() === "POST");
                await AdminCustomerDetail.duplicateMenuButton.click();
                const cloneResponse = await cloneRequest;

                expect(cloneResponse.ok()).toBeTruthy();

                const { id: cloneId } = (await cloneResponse.json()) as { id: string };
                TestDataService.addCreatedRecord("customer_address", cloneId);

                await page.reload();
                await page.waitForURL(/\/addresses/, { timeout: 15_000 });
                await expect(page.locator(".sw-skeleton")).toHaveCount(0, { timeout: 15_000 });
                await ShopAdmin.expects(addressRows).toHaveCount(addressCount + 1, { timeout: 15_000 });
            };
        };

        await use(task);
    },
});
