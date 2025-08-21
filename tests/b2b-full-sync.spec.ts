import { test, expect } from '../src';
import * as console from 'console';

test('Bulk create business partners with 1K employees each (concurrent, sync)', { tag: ['@B2B', '@BulkCreate'] }, async ({ TestDataService, AdminApiContext, IdProvider }) => {
    test.setTimeout(1440000000); // 16 days

    await TestDataService.setCleanUp(false);

    const TOTAL_PARTNERS = 10000;
    const EMPLOYEES_PER_PARTNER = 1000;
    const EMPLOYEE_BATCH_SIZE = 100;
    const CONCURRENCY = 10;
    const START_INDEX = 1872;
    const LOG_EVERY = 10;
    const MAX_RETRIES = 20;
    const COOLDOWN_EVERY_MS = 60_000;
    const COOLDOWN_PAUSE_MS = 1_000;

    // Helpers
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function isRetryable(err) {
        const status = err?.response?.status ?? err?.status;
        return status === 429 || (status >= 500 && status < 600) || !status;
    }

    async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
        let attempt = 0;
        while (true) {
            try {
                return await fn();
            } catch (err) {
                attempt++;
                if (!isRetryable(err) || attempt > MAX_RETRIES) {
                    console.error(`[FAIL] ${label} after ${attempt} attempts`, err?.message || err);
                    throw err;
                }
                const delay = Math.min(30_000, (250 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 250));
                console.warn(`[RETRY] ${label} attempt ${attempt} in ${delay}ms`);
                await sleep(delay);
            }
        }
    }

    // Cooldown coordination
    let lastCooldownTime = Date.now();
    let cooldownInProgress: Promise<void> | null = null;
    async function maybeCooldown() {
        const now = Date.now();
        if (now - lastCooldownTime < COOLDOWN_EVERY_MS) {
            if (cooldownInProgress) await cooldownInProgress;
            return;
        }
        if (!cooldownInProgress) {
            cooldownInProgress = (async () => {
                console.log('Cooling down 1s to prevent system overload...');
                await sleep(COOLDOWN_PAUSE_MS);
                lastCooldownTime = Date.now();
                cooldownInProgress = null;
            })();
        }
        await cooldownInProgress;
    }

    // Shared counters/state
    let produced = 0;
    let nextIndex = START_INDEX;
    const endIndex = START_INDEX + TOTAL_PARTNERS;

    // Worker function
    async function worker(wid) {
        while (true) {
            const i = nextIndex++;
            if (i >= endIndex) break;

            if ((i - START_INDEX) % LOG_EVERY === 0) {
                const elapsed = (Date.now() - startTime) / 1000;
                const rate = (produced / Math.max(elapsed, 1)).toFixed(1);
                console.log(`[${wid}] Progress: ${produced}/${TOTAL_PARTNERS} | ${rate} req/s | i=${i}`);
            }

            await maybeCooldown();

            // Generate IDs
            const customerUuid = (await IdProvider.getIdPair()).uuid;
            const partnerIdStr = String(i).padStart(5, '0');
            const addressUuid = (await IdProvider.getIdPair()).uuid;

            // 1. Create business partner (customer + b2b + features)
            const syncPayload = {
                [`customer-${partnerIdStr}`]: {
                    entity: 'customer',
                    action: 'upsert',
                    payload: [
                        {
                            id: customerUuid,
                            customerNumber: partnerIdStr,
                            firstName: `Partner-${partnerIdStr}`,
                            lastName: 'Business',
                            email: `partner${partnerIdStr}@example.com`,
                            password: 'shopware',
                            defaultPaymentMethodId: '0198887b52d9738d81a4a750eb304778', // replace with your default
                            groupId: 'cfbd5018d38d41d8adca10d94fc8bdd6', // replace with your default
                            salesChannelId: '0198887c74677161a70f4d5cb21a5e2d', // replace with your default
                            defaultBillingAddress: {
                                id: addressUuid,
                                firstName: `Partner-${partnerIdStr}`,
                                lastName: 'Business',
                                street: 'Main Street 1',
                                zipcode: '12345',
                                city: 'Sample City',
                                countryId: '0198887b41327386a747843ae46cbc9d', // replace with your countryId
                                salutationId: '0198887b410370fe87bdc00668205fc4' // replace with your salutationId
                            }
                        }
                    ]
                },
                [`b2b-business-partner-${partnerIdStr}`]: {
                    entity: 'b2b_business_partner',
                    action: 'upsert',
                    payload: [
                        {
                            customerId: customerUuid
                        }
                    ]
                },
                [`customer-specific-features-${partnerIdStr}`]: {
                    entity: 'customer_specific_features',
                    action: 'upsert',
                    payload: [
                        {
                            customerId: customerUuid,
                            features: { EMPLOYEE_MANAGEMENT: true }
                        }
                    ]
                }
            };

            try {
                await withRetry(
                    () => AdminApiContext.post('_action/sync', { data: syncPayload }),
                    `syncB2B#${i}`
                );
            } catch (err) {
                console.error(`[ERROR] Worker ${wid} failed at index ${i}:`, err?.message || err);
                console.error(`[SKIP] Skipping partner #${i} due to persistent failure`);
                continue;
            }

            // 2. Create 1,000 employees for this partner in batches
            for (let batch = 0; batch < EMPLOYEES_PER_PARTNER; batch += EMPLOYEE_BATCH_SIZE) {
                const employeePayload: any[] = [];
                for (let e = 0; e < EMPLOYEE_BATCH_SIZE && (batch + e) < EMPLOYEES_PER_PARTNER; e++) {
                    const employeeIndex = batch + e;
                    const { id: employeeId, uuid: employeeUuId } = await IdProvider.getIdPair();
                    employeePayload.push({
                        id: employeeUuId,
                        businessPartnerCustomerId: customerUuid,
                        languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b', // replace with your languageId
                        firstName: `John-${employeeId}`,
                        lastName: `Doe-${employeeId}`,
                        email: `employee${employeeIndex}_partner${partnerIdStr}@example.com`,
                        password: 'shopware',
                        status: 'active'
                    });
                }

                const employeeSyncPayload = {
                    [`employees-${partnerIdStr}-${batch}`]: {
                        entity: 'b2b_employee',
                        action: 'upsert',
                        payload: employeePayload
                    }
                };

                try {
                    await withRetry(
                        () => AdminApiContext.post('_action/sync', { data: employeeSyncPayload }),
                        `syncEmployees#${i}#${batch}`
                    );
                } catch (err) {
                    console.error(`[ERROR] Worker ${wid} failed to create employees for partner ${i} batch ${batch}:`, err?.message || err);
                    console.error(`[SKIP] Skipping employee batch for partner #${i}`);
                }
            }

            produced++;
        }
    }

    const startTime = Date.now();
    const workers = Array.from({ length: CONCURRENCY }, (_, k) => worker(k + 1));
    await Promise.all(workers);

    const totalSec = (Date.now() - startTime) / 1000;
    const rps = (produced / totalSec).toFixed(2);
    console.log(`Completed ${produced} business partners (with employees) in ${totalSec.toFixed(2)}s (${rps} req/s).`);
});
