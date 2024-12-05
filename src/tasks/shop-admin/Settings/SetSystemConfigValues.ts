import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SetSystemConfigValues = base.extend<{ SetSystemConfigValues: Task }, FixtureTypes>({
    SetSystemConfigValues: async ({ AdminApiContext, DefaultSalesChannel }, use) => {
        let defaultSettings;
        const task = (newValues: object, defaultValues: object) => {
            return async function LoginRegistration() {
                defaultSettings = defaultValues;
                const newSettings = await AdminApiContext.post('./_action/system-config/batch', {
                    data: {
                        null:
                        newValues,
                        [DefaultSalesChannel.salesChannel.id]: {},
                    },
                });
                expect(newSettings.ok()).toBeTruthy();
            }
        };

        await use(task);

        const revertSettings = await AdminApiContext.post(`./_action/system-config/batch`, {
            data: {
                null: defaultSettings,
                [DefaultSalesChannel.salesChannel.id]: {},
            },
        });
        expect(revertSettings.ok()).toBeTruthy();
    },
});