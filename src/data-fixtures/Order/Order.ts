import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';
import type { Order } from '../../types/ShopwareTypes';
import {
    getCurrency,
    getSalutationId,
    getStateMachineId,
    getStateMachineStateId,
} from '../../services/ShopwareDataHelpers';

export const OrderData = base.extend<FixtureTypes>({
    OrderData: async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, DefaultSalesChannel, ProductData }, use) => {

        //Create Requests
        const requests = {
            currencyEUR: getCurrency('EUR', AdminApiContext),
            mrSalutationId: getSalutationId('mr', AdminApiContext),
            orderStateId: getStateMachineId('order.state', AdminApiContext),
            orderTransactionStateId: getStateMachineId('order_transaction.state', AdminApiContext),
            orderDeliveryStateId: getStateMachineId('order_delivery.state', AdminApiContext),
        };
        await Promise.all(Object.values(requests));

        // Generate unique IDs
        const { id: orderId } = IdProvider.getIdPair();
        const addressId = IdProvider.getIdPair().uuid;
        const mrSalutationId = await requests.mrSalutationId;
        const orderStateId = await requests.orderStateId;
        const currencyEUR = await requests.currencyEUR;
        const orderTransactionStateId = await requests.orderTransactionStateId;
        const orderDeliveryStateId = await requests.orderDeliveryStateId;
        const orderStateStateMachineStateId = await getStateMachineStateId(orderStateId, AdminApiContext);
        const orderTransactionStateIdMachineStateId = await getStateMachineStateId(orderTransactionStateId, AdminApiContext);
        const orderDeliveryStateIdMachineStateId = await getStateMachineStateId(orderDeliveryStateId, AdminApiContext);

        // Create order
        const orderResponse = await AdminApiContext.post('./order?_response=detail', {
            data: {
                billingAddressId: addressId,
                currencyId: SalesChannelBaseConfig.eurCurrencyId,
                languageId: SalesChannelBaseConfig.enGBLanguageId,
                salesChannelId: DefaultSalesChannel.salesChannel.id,
                stateId: orderStateStateMachineStateId,
                orderDateTime: '2024-02-01 07:00:00',
                orderNumber: orderId,
                currencyFactor: currencyEUR.factor,
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
                orderCustomer: {
                    customerId: `${DefaultSalesChannel.customer.id}`,
                    email: `${DefaultSalesChannel.customer.email}`,
                    firstName: `${DefaultSalesChannel.customer.firstName}`,
                    lastName: `${DefaultSalesChannel.customer.lastName}`,
                    salutationId: `${DefaultSalesChannel.customer.salutationId}`,
                },
                addresses: [
                    {
                        id: addressId,
                        salutationId: `${DefaultSalesChannel.customer.salutationId}`,
                        firstName: `${DefaultSalesChannel.customer.firstName}`,
                        lastName: `${DefaultSalesChannel.customer.lastName}`,
                        street: `${orderId} street`,
                        zipcode: `${orderId} zipcode`,
                        city: `${orderId} city`,
                        countryId: SalesChannelBaseConfig.deCountryId,
                        company: `${orderId} company`,
                        vatId: null,
                        phoneNumber: `${orderId}`,
                    },
                ],
                price: {
                    totalPrice: 13.98,
                    positionPrice: 13.98,
                    rawTotal: 13.98,
                    netPrice: 13.98,
                    taxStatus: 'gross',
                    calculatedTaxes: [
                        {
                            tax: 0,
                            taxRate: 0,
                            price: 13.98,
                        },
                    ],
                    taxRules: [
                        {
                            taxRate: 0,
                            percentage: 100,
                        },
                    ],
                },
                shippingCosts: {
                    unitPrice: 2.99,
                    totalPrice: 2.99,
                    quantity: 1,
                    calculatedTaxes: [
                        {
                            tax: 0,
                            taxRate: 0,
                            price: 2.99,
                        },
                    ],
                    taxRules: [
                        {
                            taxRate: 0,
                            percentage: 100,
                        },
                    ],
                },
                lineItems: [
                    {
                        productId: ProductData.id,
                        referencedId: ProductData.id,
                        payload: {
                            productNumber: ProductData.productNumber,
                        },
                        identifier: ProductData.id,
                        type: 'product',
                        label: 'Shopware Blue T-shirt',
                        quantity: 1,
                        position: 1,
                        price: {
                            unitPrice: 10.99,
                            totalPrice: 10.99,
                            quantity: 1,
                            calculatedTaxes: [
                                {
                                    tax: 0,
                                    taxRate: 0,
                                    price: 10.99,
                                },
                            ],
                            taxRules: [
                                {
                                    taxRate: 0,
                                    percentage: 100,
                                },
                            ],
                        },
                        priceDefinition: {
                            type: 'quantity',
                            price: 10.99,
                            quantity: 1,
                            taxRules: [
                                {
                                    taxRate: 0,
                                    percentage: 100,
                                },
                            ],
                            listPrice: 8.00,
                            isCalculated: true,
                            referencePriceDefinition: null,
                        },
                    },
                ],
                deliveries: [
                    {
                        stateId: orderDeliveryStateIdMachineStateId,
                        shippingMethodId: SalesChannelBaseConfig.defaultShippingMethod,
                        shippingOrderAddress: {
                            id: IdProvider.getIdPair().uuid,
                            salutationId: mrSalutationId,
                            firstName: 'John',
                            lastName: 'Doe',
                            street: 'Shortstreet 5',
                            zipcode: '12345',
                            city: 'Doe City',
                            countryId: SalesChannelBaseConfig.deCountryId,
                            phoneNumber: '123 456 789',
                        },
                        shippingDateEarliest: '2024-03-01 07:00:00',
                        shippingDateLatest: '2024-03-03 07:00:00',
                        shippingCosts: {
                            unitPrice: 8.99,
                            totalPrice: 8.99,
                            quantity: 1,
                            calculatedTaxes: [
                                {
                                    tax: 0,
                                    taxRate: 0,
                                    price: 8.99,
                                },
                            ],
                            taxRules: [
                                {
                                    taxRate: 0,
                                    percentage: 100,
                                },
                            ],
                        },
                    },
                ],
                transactions: [
                    {
                        paymentMethodId: SalesChannelBaseConfig.invoicePaymentMethodId,
                        amount: {
                            unitPrice: 13.98,
                            totalPrice: 13.98,
                            quantity: 1,
                            calculatedTaxes: [
                                {
                                    tax: 0,
                                    taxRate: 0,
                                    price: 0,
                                },
                            ],
                            taxRules: [
                                {
                                    taxRate: 0,
                                    percentage: 100,
                                },
                            ],
                        },
                        stateId: orderTransactionStateIdMachineStateId,
                    },
                ],
            },
        });

        expect(orderResponse.ok()).toBeTruthy();

        const { data: order } = (await orderResponse.json()) as { data: Order };

        // Use order data in the test
        await use(order);

        // Delete order after the test is done
        const cleanupResponse = await AdminApiContext.delete(`./order/${order.id}`);
        expect(cleanupResponse.status()).toBeLessThan(500);
    },
});
