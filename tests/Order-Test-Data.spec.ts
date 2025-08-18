import { test, expect, CustomerAddress } from '../src';
import * as console from 'console';

test('Create 100K orders for a customer', { tag: '@Order' }, async ({ TestDataService, AdminApiContext }) => {

    test.setTimeout(1440000000); // 16 days

    await TestDataService.setCleanUp(false);

    const MAX_RETRIES = 20; // Maximum retry attempts for failed requests
    const TOTAL_ORDERS = 1000; // Total number of orders to create
    const CONCURRENCY = 15; // Number of concurrent workers
    const START_INDEX = 1; // Start index for product creation
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

    await (async () => {
        const startTime = Date.now();
        const now = new Date().toISOString();

        const firstName = 'Order';
        const lastName = 'Customer';
        const salutationId = '0198887b410370fe87bdc00668205fc4';
        const languageId = '2fbb5fe2e29a4d70aa5854ce7ce3e20b';
        const countryId = '0198887b41327386a747843ae46cbc9d';
        const salesChannelId = '0198887c74677161a70f4d5cb21a5e2d';
        const currencyId = '0198888aef35721d84a38c118a180f0f';

        const orderStateMachine = await TestDataService.getOrderStateMachine();
        const deliveryStateMachine = await TestDataService.getDeliveryStateMachine();
        const transactionStateMachine = await TestDataService.getTransactionStateMachine();

        const orderState = await TestDataService.getStateMachineState(orderStateMachine.id);
        const deliveryState = await TestDataService.getStateMachineState(deliveryStateMachine.id);
        const transactionState = await TestDataService.getStateMachineState(transactionStateMachine.id);

        const shippingMethod = await TestDataService.getShippingMethod();
        const paymentMethod = await TestDataService.getPaymentMethod();

        const customer = await TestDataService.createCustomer({
            email: `customer@order.com`,
            password: 'shopware',
            salutationId,
            languageId,
            firstName,
            lastName,
        });

        const gross = 100;
        const net = 84;
        const tax = 16;
        const taxRate = 19.0;

        const shippingGross = 0.0;
        const shippingNet = 0.0;
        const shippingTax = 0.0;
        const shippingTaxRate = (shippingTax / shippingNet) * 100;

        console.log(`Creating ${TOTAL_ORDERS} products with concurrency=${CONCURRENCY} ...`);

        // Shared counters/state
        let produced = 0;
        let nextIndex = START_INDEX; // will be incremented by workers
        const endIndex = START_INDEX + TOTAL_ORDERS; // exclusive

        // Cooldown coordination (so only one pause happens for all workers)
        let lastCooldownTime = Date.now();
        let cooldownInProgress = null; // Promise or null

        async function maybeCooldown() {
            const now = Date.now();
            if (now - lastCooldownTime < COOLDOWN_EVERY_MS) {
                // If someone else is already cooling down, briefly await it to align workers
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

        async function createBillingAddress() {
            const addressResponse = await AdminApiContext.post(`customer-address?_response=detail`, {
                data: {
                    customerId: customer.id,
                    salutationId: salutationId,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    street: 'Test Street 123',
                    zipcode: '12345',
                    city: 'Test City',
                    countryId: countryId,
                    phoneNumber: '0123456789',
                },
            });
            expect(addressResponse.ok()).toBeTruthy();
            const {data: address} = (await addressResponse.json()) as { data: CustomerAddress };
            return address;
        }
         function makePayload(i, address: CustomerAddress) {
            return {
                orderNumber: 'POP-'+(i).toString().padStart(6, '0'),
                stateId: orderState.id,
                orderDateTime: now,
                currencyId: currencyId,
                currencyFactor: 1,
                languageId: languageId,
                salesChannelId: salesChannelId,
                billingAddressId: address.id,
                addresses: [
                    {
                        id: address.id,
                        customerId: customer.id,
                        salutationId: salutationId,
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        street: address.street,
                        zipcode: address.zipcode,
                        city: address.city,
                        countryId: countryId,
                        phoneNumber: address.phoneNumber,
                    },
                ],
                itemRounding: {
                    decimals: 2,
                    interval: 0.01,
                    roundForNet: true,
                },
                totalRounding: {
                    decimals: 2,
                    interval: 0.01,
                    roundForNet: true,
                },
                price: {
                    totalPrice: gross,
                    positionPrice: gross,
                    rawTotal: gross,
                    netPrice: net,
                    taxStatus: 'gross',
                    calculatedTaxes: [
                        {
                            tax: tax,
                            taxRate: taxRate,
                            price: net,
                        },
                    ],
                    taxRules: [
                        {
                            taxRate: taxRate,
                            percentage: 100,
                        },
                    ],
                },
                orderCustomer: {
                    customerId: customer.id,
                    email: customer.email,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    salutationId: salutationId,
                },
                shippingCosts: {
                    unitPrice: shippingGross,
                    totalPrice: shippingGross,
                    quantity: 1,
                    calculatedTaxes: [
                        {
                            tax: shippingTax,
                            taxRate: shippingTaxRate,
                            price: shippingNet,
                        },
                    ],
                    taxRules: [
                        {
                            taxRate: shippingTaxRate,
                            percentage: 100,
                        },
                    ],
                },
                lineItems: [
                    {
                        productId: '5db3c047b1f64c2d9848fb2f905035f7',
                        referencedId: '5db3c047b1f64c2d9848fb2f905035f7',
                        payload: {
                            productNumber: 'Order-Product-Performance',
                        },
                        identifier: '5db3c047b1f64c2d9848fb2f905035f7',
                        type: 'product',
                        label: 'Test Product for Orders',
                        quantity: 1,
                        position: 1,
                        price: {
                            unitPrice: gross,
                            totalPrice: gross,
                            quantity: 1,
                            calculatedTaxes: [
                                {
                                    tax: tax,
                                    taxRate: taxRate,
                                    price: net,
                                },
                            ],
                            taxRules: [
                                {
                                    taxRate: taxRate,
                                    percentage: 100,
                                },
                            ],
                        },
                        priceDefinition: {
                            type: 'quantity',
                            price: gross,
                            quantity: 1,
                            taxRules: [
                                {
                                    taxRate: taxRate,
                                    percentage: 100,
                                },
                            ],
                            listPrice: gross * 1.2,
                            isCalculated: true,
                            referencePriceDefinition: null,
                        },
                    },
                ],
                deliveries: [
                    {
                        stateId: deliveryState.id,
                        shippingMethodId: shippingMethod.id,
                        shippingOrderAddress: {
                            salutationId: salutationId,
                            firstName: customer.firstName,
                            lastName: customer.lastName,
                            street: address.street,
                            zipcode: address.zipcode,
                            city: address.city,
                            countryId: countryId,
                            phoneNumber: address.phoneNumber,
                        },
                        shippingDateEarliest: now,
                        shippingDateLatest: now,
                        shippingCosts: {
                            unitPrice: shippingGross,
                            totalPrice: shippingGross,
                            quantity: 1,
                            calculatedTaxes: [
                                {
                                    tax: shippingTax,
                                    taxRate: shippingTaxRate,
                                    price: shippingNet,
                                },
                            ],
                            taxRules: [
                                {
                                    taxRate: shippingTaxRate,
                                    percentage: 100,
                                },
                            ],
                        },
                    },
                ],
                transactions: [
                    {
                        paymentMethodId: paymentMethod.id,
                        stateId: transactionState.id,
                        amount: {
                            unitPrice: gross + shippingGross,
                            totalPrice: gross + shippingGross,
                            quantity: 1,
                            calculatedTaxes: [
                                {
                                    tax: tax + shippingTax,
                                    taxRate: ((tax + shippingTax) / (net + shippingNet)) * 100,
                                    price: net + shippingNet,
                                },
                            ],
                            taxRules: [
                                {
                                    taxRate: ((tax + shippingTax) / (net + shippingNet)) * 100,
                                    percentage: 100,
                                },
                            ],
                        },
                    },
                ],
            };
        }

        async function worker(wid) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                // Grab the next index (single-threaded JS makes this safe)
                const i = nextIndex++;
                if (i >= endIndex) break;

                // Optional: progress log
                if ((i - START_INDEX) % LOG_EVERY === 0) {
                    const elapsed = (Date.now() - startTime) / 1000;
                    const rate = (produced / Math.max(elapsed, 1)).toFixed(1);
                    console.log(`[${wid}] Progress: ${produced}/${TOTAL_ORDERS} | ${rate} req/s | i=${i}`);
                }
                const address = await createBillingAddress();

                await maybeCooldown();

                try {
                    await withRetry(
                        () => AdminApiContext.post('order?_response=detail', {
                            data: makePayload(i,address),
                        }),
                        `createOrder#${i}`

                    );

                    produced++;

                }catch (err) {
                    // Log the error but continue processing
                    console.error(`[ERROR] Worker ${wid} failed at index ${i}:`, err?.message || err);
                    console.error(`[SKIP] Skipping order #${i} due to persistent failure`);
                    // continue with the next order
                }

            }
        }

        // Spin up a fixed-size pool
        const workers = Array.from({ length: CONCURRENCY }, (_, k) => worker(k + 1));
        await Promise.all(workers);

        const totalSec = (Date.now() - startTime) / 1000;
        const rps = (produced / totalSec).toFixed(2);
        console.log(`Completed ${produced} orders in ${totalSec.toFixed(2)}s (${rps} req/s).`);
    })();

});
