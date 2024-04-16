import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const OpenSearchResultPage = base.extend<{ OpenSearchResultPage: Task }, FixtureTypes>({
    OpenSearchResultPage: async ({ StorefrontSearch }, use)=> {
        const task = (searchTerm: string) => {
            return async function OpenSearchResultPage() {
                const url = `search?search=${searchTerm}`;
                await StorefrontSearch.page.goto(url);
            }
        };
        await use(task);
    },
});
