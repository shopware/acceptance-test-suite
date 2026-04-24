import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const SearchShopSettings = base.extend<{ SearchShopSettings: Task<[string]> }, FixtureTypes>({
    SearchShopSettings: async ({ ShopAdmin, AdminSettingsListing }, use) => {
        const task = (searchTerm: string) => {
            return async function SearchShopSettings() {
                await ShopAdmin.goesTo(AdminSettingsListing.url());
                await AdminSettingsListing.searchInput.fill(searchTerm);
            };
        };

        await use(task);
    },
});
