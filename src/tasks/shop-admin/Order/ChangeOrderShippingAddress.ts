import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import { waitForOrderAddressUpdate, waitForOrderVersionMerge } from "../../../helpers/OrderRequests";

/**
 * Selects another customer address as the order shipping address and saves the order draft.
 *
 * The order details tab must already be open. Register the address response before this task
 * when the test needs to assert the version header on that request.
 */
export const ChangeOrderShippingAddress = base.extend<{ ChangeOrderShippingAddress: Task }, FixtureTypes>({
    ChangeOrderShippingAddress: async ({ ShopAdmin, AdminOrderDetail }, use) => {
        const task = (orderId: string, street: string) => {
            return async function ChangeOrderShippingAddress() {
                const page = AdminOrderDetail.page;

                await AdminOrderDetail.shippingAddressSelection.click();
                await ShopAdmin.expects(AdminOrderDetail.addNewAddressOption).toBeVisible();
                await AdminOrderDetail.shippingAddressInput.fill(street);
                await AdminOrderDetail.shippingAddressOption(street).click();
                await ShopAdmin.expects(AdminOrderDetail.shippingAddressSelectionText).toContainText(street);

                const addressUpdate = waitForOrderAddressUpdate(page, orderId);
                const versionMerge = waitForOrderVersionMerge(page);
                await AdminOrderDetail.saveButton.click();

                expect((await addressUpdate).ok()).toBeTruthy();
                expect((await versionMerge).ok()).toBeTruthy();
            };
        };

        await use(task);
    },
});
