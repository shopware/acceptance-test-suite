import { test, expect } from '../src';
import * as console from 'console';

test('Create 10K business partners with 1K employees each (10 workers)', { tag: ['@B2B', '@BulkCreate'] }, async ({ TestDataService, AdminApiContext, IdProvider }) => {
    test.setTimeout(1440000000); // 16 days
    await TestDataService.setCleanUp(false);

    let nextPartnerId = 1838;
    const totalPartners = 10000; // 🔹 10K BPs
    const employeesPerPartner = 1000; // 🔹 1K each
    const workers = 4;
    const batchSize = 100; // 🔹 insert 100 employees at once

    // Simple mutex for partner id distribution

    const mutex = { locked: false, queue: [] as ((value?: unknown) => void)[] };

    async function acquireLock() {
        while (mutex.locked) {
            await new Promise(resolve => mutex.queue.push(resolve));
        }
        mutex.locked = true;
    }

    function releaseLock() {
        mutex.locked = false;
        if (mutex.queue.length > 0) {
            const resolve = mutex.queue.shift();
            resolve && resolve();
        }
    }

     test.setTimeout(1440000000); // 16 days
    
        await TestDataService.setCleanUp(false);
    
        const MAX_RETRIES = 20; // Maximum retry attempts for failed requests
        const TOTAL_ORDERS = 10000; // Total number of orders to create
        const CONCURRENCY = 15; // Number of concurrent workers
        const START_INDEX = 20136; // Start index for product creation
        const COOLDOWN_EVERY_MS = 60_000; // Cooldown period to prevent system overload
        const COOLDOWN_PAUSE_MS = 1_000; // Cooldown duration
        const LOG_EVERY = 1_000;
    
        //Helpers
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
        function isRetryable(err) {
            const status = err?.response?.status ?? err?.status;
            // Retry on 429 & 5xx; you can expand this list if needed
            return status === 429 || (status >= 500 && status < 600) || !status; // network/timeouts
        }
    
        async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
            let attempt = 0;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                try {
                    return await fn();
                } catch (err) {
                    attempt++;
                    if (!isRetryable(err) || attempt > MAX_RETRIES) {
                        console.error(`[FAIL] ${label} after ${attempt} attempts`, err?.message || err);
                        throw err;
                    }
                    // Exponential backoff with jitter
                    const delay = Math.min(30_000, (250 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 250));
                    console.warn(`[RETRY] ${label} attempt ${attempt} in ${delay}ms`);
                    await sleep(delay);
                }
            }
        }

    async function getNextPartnerId() {
        await acquireLock();
        const id = nextPartnerId <= totalPartners ? nextPartnerId++ : null;
        releaseLock();
        return id;
    }

    async function worker(workerId: number) {
        const workerStart = Date.now();

        while (true) {
            const partnerId = await getNextPartnerId();
            if (!partnerId) break;

            const partnerStart = Date.now();
            const partnerIdStr = String(partnerId).padStart(5, '0');

            // 1. Create customer
            const customer = await TestDataService.createCustomer({
                firstName: `Partner-${partnerIdStr}`,
                lastName: 'Business',
            });

            // 2. Create B2B business partner
            const businessPartnerResponse = await AdminApiContext.post('b2b-business-partner?_response=detail', {
                data: { customerId: customer.id },
            });
            expect(businessPartnerResponse.ok()).toBeTruthy();

            // 3. Enable features
            const featureToggles = { EMPLOYEE_MANAGEMENT: true };
            const b2bFeatureResponse = await AdminApiContext.post('customer-specific-features?_response=detail', {
                data: { customerId: customer.id, features: featureToggles },
            });
            expect(b2bFeatureResponse.ok()).toBeTruthy();

            // 4. Create employees in batches
            for (let batch = 0; batch < employeesPerPartner / batchSize; batch++) {
                const payload: any[] = [];

                for (let i = 0; i < batchSize; i++) {
                    const globalIndex = batch * batchSize + i;
                    const { id: employeeId, uuid: employeeUuId } = await IdProvider.getIdPair();

                    payload.push({
                        id: employeeUuId,
                        businessPartnerCustomerId: customer.id,
                        languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
                        firstName: `John-${employeeId}`,
                        lastName: `Doe-${employeeId}`,
                        email: `employee${globalIndex}_partner${partnerIdStr}@example.com`,
                        password: 'shopware',
                        status: 'active',
                    });
                }

                const employeeResponse = await AdminApiContext.post('_action/sync', {
                    data: {
                        [`employees-${partnerIdStr}-${batch}`]: {
                            entity: 'b2b_employee',
                            action: 'upsert',
                            payload,
                        },
                    },
                });

                expect(employeeResponse.ok()).toBeTruthy();

                const duration = ((Date.now() - partnerStart) / 1000).toFixed(2);
                console.log(`Worker ${workerId} Partner ${partnerIdStr}: Created ${(batch + 1) * batchSize} employees (${duration}s)`);
            }

            const partnerDuration = ((Date.now() - partnerStart) / 1000).toFixed(2);
            console.log(`Worker ${workerId}: Finished Partner ${partnerIdStr} with ${employeesPerPartner} employees in ${partnerDuration}s`);
        }

        const workerDuration = ((Date.now() - workerStart) / 1000).toFixed(2);
        console.log(`Worker ${workerId}: Done in ${workerDuration}s`);
    }

    await Promise.all(Array.from({ length: workers }, (_, i) => worker.call(this, i + 1)));

    console.log('✅ Completed creating 10K partners with 1K employees each (10M employees total).');
});
