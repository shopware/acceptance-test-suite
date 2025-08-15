/* eslint-disable playwright/no-conditional-expect */
import {
    test,
    expect,
    type APIResponse,
    type SystemConfig,
} from '../../src';

test('System config can be overwritten and is restored to defaults', async ({
    AdminApiContext,
    TestDataService,
    DefaultSalesChannel,
}) => {
    const fetchConfig = async (domain) => {
        const response = await AdminApiContext.get(`_action/system-config?domain=${domain}&inherit=1&salesChannelId=${DefaultSalesChannel.salesChannel.id}`);
        return (await response.json()) as { data: SystemConfig };
    };
    const defaults = await fetchConfig('core.register');
    expect(defaults['core.register.minPasswordLength']).toBeDefined();

    const overrides = {
        'test.random.foo': true,
        'core.register.minPasswordLength': 1337,
    };

    await TestDataService.setSystemConfig(overrides);

    const c2 = await fetchConfig('core.register');
    expect(c2['core.register.minPasswordLength']).toBeDefined();
    expect(c2['core.register.minPasswordLength']).toStrictEqual(overrides['core.register.minPasswordLength']);

    const c1 = await fetchConfig('test.random');
    expect(c1['test.random.foo']).toBeDefined();
    expect(c1['test.random.foo']).toStrictEqual(overrides['test.random.foo']);

    // Test data clean-up with activated cleansing process
    TestDataService.setCleanUp(true);
    const cleanUpDeleteOperationsResponse = await TestDataService.cleanUp() as APIResponse;
    expect(cleanUpDeleteOperationsResponse.ok()).toBeTruthy();

    const afterCleanUpTest = await fetchConfig('test.random');
    expect(afterCleanUpTest['test.random.foo']).not.toBeDefined();

    const afterCleanUpCore = await fetchConfig('core.register');
    expect(afterCleanUpCore['core.register.minPasswordLength']).toBeDefined();
    expect(afterCleanUpCore['core.register.minPasswordLength']).toStrictEqual(defaults['core.register.minPasswordLength']);
});
