import { test } from '../src/index';

test('SaaS instance setup.', async ({
    SaaSInstanceSetup,
}) => {
    await SaaSInstanceSetup()
});
