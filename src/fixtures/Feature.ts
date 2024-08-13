import { test as base } from '@playwright/test';
import { FeatureService } from '../services/FeatureService';
import { FixtureTypes } from '../types/FixtureTypes';


export interface FeatureFixtureTypes {
    FeatureService: FeatureService;
}

export const test = base.extend<FixtureTypes>({
    FeatureService: async ({ AdminApiContext }, use) => {
        const service = new FeatureService(AdminApiContext);

        await use(service);

        await service.cleanup();
    },
});