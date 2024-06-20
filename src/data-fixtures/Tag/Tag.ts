import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';
import type { components } from '@shopware/api-client/admin-api-types';

/**
 * @deprecated - Use TestDataService.createTag() instead.
 */
export const TagData = base.extend<FixtureTypes>({
    TagData: async ({ IdProvider, AdminApiContext }, use) => {

        // Generate tag
        const tagUUID = IdProvider.getIdPair().uuid;
        const tagId = IdProvider.getIdPair().id
        const tagName = `Test-${tagId}`;

        // Create tag
        const tagResponse = await AdminApiContext.post('./tag?_response=detail', {
            data: {
                id: tagUUID,
                name: tagName,
            },
        });

        expect(tagResponse.ok()).toBeTruthy();
        const { data: tag } = (await tagResponse.json()) as { data: components['schemas']['Tag'] };

        // Use tag data in the test
        await use(tag);

        // Delete tag after the test is done
        const cleanupResponse = await AdminApiContext.delete(`./tag/${tag.id}`);
        expect(cleanupResponse.ok()).toBeTruthy();
    },
});
