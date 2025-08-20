import { test, expect } from '../src';
import * as console from 'console';

test('Create 10K business partners with 1K employees each (10 workers)', { tag: ['@B2B', '@BulkCreate'] }, async ({ TestDataService, AdminApiContext, IdProvider }) => {
    test.setTimeout(1440000000); // 16 days
    await TestDataService.setCleanUp(false);

    let nextPartnerId = 1232;
    const totalPartners = 10000; // 🔹 10K BPs
    const employeesPerPartner = 1000; // 🔹 1K each
    const workers = 5;
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
