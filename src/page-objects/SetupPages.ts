import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

import { Install } from './setup/Install';

export interface SetupPageTypes {
    SetupInstall: Install;
}

export const SetupPageObjects = {
    Install,
}

export const test = base.extend<FixtureTypes>({
    SetupInstall: async ({ InstallPage }, use) => {
        await use(new Install(InstallPage));
    }
});
