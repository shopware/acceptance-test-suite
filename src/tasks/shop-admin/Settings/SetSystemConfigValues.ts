import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';

export const SetSystemConfigValues = base.extend<{ SetSystemConfigValues: Task }, FixtureTypes>({
    SetSystemConfigValues: async ({ TestDataService }, use) => {
        const task = (newValues: Record<string, unknown>) => {
            return async function LoginRegistration() {
                await TestDataService.setSystemConfig(newValues);
            }
        };

        await use(task);
    },
});