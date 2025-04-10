import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';

export const SearchForTerm = base.extend<{ SearchForTerm: Task }, FixtureTypes>({
    SearchForTerm: async ({ StorefrontSearchSuggest }, use) => {
        const task = (searchTerm: string) => {
            return async function SearchForTerm() {
                await StorefrontSearchSuggest.searchInput.fill(searchTerm);
                searchTerm = searchTerm.replaceAll(' ', '%20');
                await StorefrontSearchSuggest.page.waitForResponse((response) => response.url().includes(`suggest?search=${searchTerm}`) && response.ok());
            };
        };

        await use(task);
    },
});
