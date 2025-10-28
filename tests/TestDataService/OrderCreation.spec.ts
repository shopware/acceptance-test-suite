import { test, expect, type Order, type APIResponse } from '../../src';

test('Order creation with TestDataService', async ({
    TestDataService, AdminApiContext,
}) => {

    const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
    expect(product.description).toEqual('Test Description');
    expect(product.coverId).toBeDefined();

    const customer = await TestDataService.createCustomer({ firstName: 'Luke', lastName: 'Skywalker' })
    expect(customer.firstName).toEqual('Luke');
    expect(customer.lastName).toEqual('Skywalker');

    const promotionWithCode = await TestDataService.createPromotionWithCode({ code: 'code1234', discounts: [{ scope: 'cart', type: 'absolute', value: 10, considerAdvancedRules: false }] });
    expect(promotionWithCode.code).toEqual('code1234');
    expect(promotionWithCode.discounts[0].type).toEqual('absolute');

    const promoCode = `myCode+${TestDataService.IdProvider.getIdPair().id}`;
    const promotion = await TestDataService.createPromotionWithCode({ code: promoCode, discounts: [{ scope: 'cart', type: 'absolute', value: 10, considerAdvancedRules: false }] });
    expect(promotion.code).toEqual(promoCode);
    expect(promotion.discounts[0].type).toEqual('absolute');

    const order = await TestDataService.createOrder(
        [{ product: product, quantity: 5 }, { product: promotion, quantity: 1 }],
        customer,
        { orderNumber: '123456789' },
    );
    expect(order.orderNumber).toEqual('123456789');

    expect(order.orderCustomer.firstName).toEqual('Luke');
    expect(order.price.totalPrice).toEqual(48.99);

    const customerAddress = await TestDataService.getCustomerAddress(customer.defaultBillingAddressId);
    const deliveryStateMachine = await TestDataService.getDeliveryStateMachine();
    const deliveryState = await TestDataService.getStateMachineState(deliveryStateMachine.id);
    const shippingMethod = await TestDataService.getShippingMethod();
    const deliveryStruct = TestDataService.getBasicOrderDeliveryStruct(deliveryState, shippingMethod, customerAddress);

    const shippingCosts = 12.99;
    const totalPrice = 50 + shippingCosts;

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (deliveryStruct.shippingCosts != null) {
        deliveryStruct.shippingCosts.unitPrice = shippingCosts;
        deliveryStruct.shippingCosts.totalPrice = shippingCosts;
    }

    const customShippingCosts = {
        price: {
            totalPrice: totalPrice,
            positionPrice: totalPrice,
            rawTotal: totalPrice,
            netPrice: totalPrice,
            taxStatus: 'gross',
            calculatedTaxes: [{
                tax: 0,
                taxRate: 0,
                price: totalPrice,
            }],
            taxRules: [{
                taxRate: 0,
                percentage: 100,
            }],
        },
        deliveries: [deliveryStruct],
    };

    const orderWithCustomShippingCosts = await TestDataService.createOrder(
        [{ product, quantity: 5 }],
        customer,
        customShippingCosts,
    );
    expect(orderWithCustomShippingCosts.price.totalPrice).toEqual(62.99);

    const orderResponse = await AdminApiContext.get(`./order/${order.id}?_response=detail`);
    const { data: databaseOrder } = (await orderResponse.json()) as { data: Order };
    expect(databaseOrder.id).toBe(order.id);

    // Test data clean-up with activated cleansing process
    TestDataService.setCleanUp(true);
    const cleanUpResponse = await TestDataService.cleanUp() as APIResponse;

    expect(cleanUpResponse.ok()).toBeTruthy();
    const cleanUp = await cleanUpResponse.json();
    expect(cleanUp['deleted']['promotion']).toBeDefined();
    expect(cleanUp['deleted']['promotion_discount']).toBeDefined();
});
