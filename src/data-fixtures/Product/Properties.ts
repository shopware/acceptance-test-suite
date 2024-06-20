import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';

/**
 * @deprecated - Use TestDataService.createColorPropertyGroup() or TestDataService.createTextPropertyGroup() instead.
 */
export const PropertiesData = base.extend<FixtureTypes>({
    PropertiesData: async ({ AdminApiContext }, use) => {

        const propertyGroupColorResponse = await AdminApiContext.post('property-group?_response=1', {
            data: {
                name: 'Color',
                description: 'Color',
                displayType: 'color',
                sortingType: 'name',
                options: [{
                    name: 'Blue',
                    colorHexCode: '#2148d6',
                }, {
                    name: 'Red',
                    colorHexCode: '#bf0f2a',
                }, {
                    name: 'Green',
                    colorHexCode: '#12bf0f',
                }],
            },
        });

        const propertyGroupSizeResponse = await AdminApiContext.post('property-group?_response=1', {
            data: {
                name: 'Size',
                description: 'Size',
                displayType: 'text',
                sortingType: 'name',
                options: [{
                    name: 'Small',
                }, {
                    name: 'Medium',
                }, {
                    name: 'Large',
                }],
            },
        });

        expect(propertyGroupColorResponse.ok()).toBeTruthy();
        expect(propertyGroupSizeResponse.ok()).toBeTruthy();

        const { data: propertyGroupColor } = await propertyGroupColorResponse.json();
        const { data: propertyGroupSize } = await propertyGroupSizeResponse.json();

        await use({
            propertyGroupColor,
            propertyGroupSize,
        });

        const deleteGroupColor = await AdminApiContext.delete(`property-group/${propertyGroupColor.id}`);
        const deleteGroupSize = await AdminApiContext.delete(`property-group/${propertyGroupSize.id}`);

        expect(deleteGroupColor.ok()).toBeTruthy();
        expect(deleteGroupSize.ok()).toBeTruthy();
    },
});
