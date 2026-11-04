import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

/**
 * Duplicates the first customer address whose row contains the given street.
 *
 * The customer address tab must already be open. The clone is registered for cleanup.
 */
export const DuplicateCustomerAddress = base.extend<{ DuplicateCustomerAddress: Task }, FixtureTypes>({
    DuplicateCustomerAddress: async ({ ShopAdmin, AdminCustomerDetail, TestDataService }, use) => {
        const task = (street: string) => {
            return async function DuplicateCustomerAddress() {
                const page = AdminCustomerDetail.page;

                await AdminCustomerDetail.editButton.click();
                await ShopAdmin.expects(AdminCustomerDetail.addAddressButton).toBeEnabled();
                await AdminCustomerDetail.actionsMenuButton(street).click();

                const cloneRequest = page.waitForResponse((response) => response.url().includes("/api/_action/clone/customer-address/") && response.request().method() === "POST");
                await AdminCustomerDetail.duplicateMenuButton.click();
                const cloneResponse = await cloneRequest;

                expect(cloneResponse.ok()).toBeTruthy();

                const { id: cloneId } = (await cloneResponse.json()) as { id: string };
                TestDataService.addCreatedRecord("customer_address", cloneId);
            };
        };

        await use(task);
    },
});
