import { test } from '../src';
import * as console from 'console';

test('Create 10K business partners with 1K employees each (4 workers)', { tag: ['@B2B', '@BulkCreate'] }, async ({ TestDataService, AdminApiContext, IdProvider }) => {
    test.setTimeout(1440000000); // 16 days
    await TestDataService.setCleanUp(false);

    let nextPartnerId = 2550;
    const totalPartners = 10000;
    const employeesPerPartner = 1000;
    const workers = 4;
    const batchSize = 100;

    // Mutex for partner id distribution
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
    async function getNextPartnerId() {
        await acquireLock();
        const id = nextPartnerId <= totalPartners ? nextPartnerId++ : null;
        releaseLock();
        return id;
    }

    // Helpers
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const MAX_RETRIES = 20;
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
            await withRetry(
                () => AdminApiContext.post('b2b-business-partner?_response=detail', {
                    data: { customerId: customer.id },
                }),
                `b2b-business-partner#${partnerIdStr}`
            );

            // 3. Enable features
            await withRetry(
                () => AdminApiContext.post('customer-specific-features?_response=detail', {
                    data: { customerId: customer.id, features: { EMPLOYEE_MANAGEMENT: true } },
                }),
                `customer-specific-features#${partnerIdStr}`
            );

           // 4. Create employees in batches
            let createdEmployees = 0;
            for (let batch = 0; createdEmployees < employeesPerPartner; batch++) {
                const currentBatchSize = Math.min(batchSize, employeesPerPartner - createdEmployees);
                const payload: any[] = [];
                for (let i = 0; i < currentBatchSize; i++) {
                    const globalIndex = createdEmployees + i;
                    const { uuid: employeeUuId } = await IdProvider.getIdPair();
                    payload.push({
                        id: employeeUuId,
                        businessPartnerCustomerId: customer.id,
                        languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
                        firstName: `John-${globalIndex}`,
                        lastName: `Doe-${globalIndex}`,
                        email: `employee${globalIndex}_partner${partnerIdStr}@example.com`,
                        password: 'shopware',
                        status: 'active',
                    });
                }
                await withRetry(
                    () => AdminApiContext.post('_action/sync', {
                        data: {
                            [`employees-${partnerIdStr}-${batch}`]: {
                                entity: 'b2b_employee',
                                action: 'upsert',
                                payload,
                            },
                        },
                    }),
                    `b2b_employee#${partnerIdStr}#${batch}`
                );
                createdEmployees += currentBatchSize;

                // Log after each 100 employees
                if (createdEmployees % 100 === 0 || createdEmployees === employeesPerPartner) {
                    const duration = ((Date.now() - partnerStart) / 1000).toFixed(2);
                    console.log(
                        `Worker ${workerId} Partner ${partnerIdStr}: Created ${createdEmployees} employees (${duration}s)`
                    );
                }
            }

    await Promise.all(Array.from({ length: workers }, (_, i) => worker(i + 1)));

    console.log('✅ Completed creating 10K partners with 1K employees each (10M employees total).');
});