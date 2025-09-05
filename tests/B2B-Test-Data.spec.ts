import { test, expect } from '../src';
import * as console from 'console';

test('Create 10K business partners with 100 employees each (10 workers)', { tag: ['@B2B', '@BulkCreate'] }, async ({ TestDataService, AdminApiContext, IdProvider }) => {
    test.setTimeout(1440000000); // 16 days
    await TestDataService.setCleanUp(false);

    let nextPartnerId = 4811;
    const totalPartners = 10000;
    const mutex: { locked: boolean; queue: Array<(value?: unknown) => void> } = { locked: false, queue: [] };

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
            if (resolve) {
                resolve();
            }
        }
    }

    async function getNextPartnerId() {
        await acquireLock();
        const id = nextPartnerId <= totalPartners ? nextPartnerId++ : null;
        releaseLock();
        return id;
    }

    const workers = 20;
    const employeesPerPartner = 100;

    async function worker(workerId: number) {
        const workerStart = Date.now();
        while (true) {
            const partnerId = await getNextPartnerId();
            if (!partnerId) break;
            const partnerStart = Date.now();
            const partnerIdStr = String(partnerId).padStart(5, '0');
            const customer = await TestDataService.createCustomer({
                firstName: `Partner-${partnerIdStr}`,
                lastName: 'Business',
            });

            // Create B2B business partner
            const businessPartnerResponse = await AdminApiContext.post('b2b-business-partner?_response=detail', {
                data: { customerId: customer.id },
            });
            expect(businessPartnerResponse.ok()).toBeTruthy();

            // Activate B2B features
            const b2bFeatureResponse = await AdminApiContext.post('customer-specific-features?_response=detail', {
                data: { customerId: customer.id, features: { EMPLOYEE_MANAGEMENT: true } },
            });
            expect(b2bFeatureResponse.ok()).toBeTruthy();

            for (let e = 0; e < employeesPerPartner; e++) {
                const { id: employeeId, uuid: employeeUuId } = await IdProvider.getIdPair();
                const employeeResponse = await AdminApiContext.post('b2b-employee?_response=detail', {
                    data: {
                        id: employeeUuId,
                        businessPartnerCustomerId: customer.id,
                        languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
                        firstName: `John-${employeeId}`,
                        lastName: `Doe-${employeeId}`,
                        email: `employee${e}_partner${partnerIdStr}@example.com`,
                        password: 'shopware',
                        status: 'active',
                    },
                });
                expect(employeeResponse.ok()).toBeTruthy();

                if ((e + 1) % 100 === 0) {
                    const employeeDuration = ((Date.now() - partnerStart) / 1000).toFixed(2);
                    // eslint-disable-next-line no-console
                    console.log(`Worker ${workerId} Partner ${partnerIdStr}: Created ${e + 1} employees (last 100 in ${employeeDuration} seconds)`);
                }
            }
            const partnerDuration = ((Date.now() - partnerStart) / 1000).toFixed(2);
            // eslint-disable-next-line no-console
            console.log(`Worker ${workerId}: Finished partner ${partnerIdStr} with ${employeesPerPartner} employees in ${partnerDuration} seconds.`);
        }
        const workerDuration = ((Date.now() - workerStart) / 1000).toFixed(2);
        // eslint-disable-next-line no-console
        console.log(`Worker ${workerId}: Finished in ${workerDuration} seconds.`);
    }

    await Promise.all(Array.from({ length: workers }, (_, i) => worker.call(this, i + 1)));

    // eslint-disable-next-line no-console
    console.log('Completed creating 10K business partners with 1K employees each (10 workers).');
});
