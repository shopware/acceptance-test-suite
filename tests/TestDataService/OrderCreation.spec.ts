import { test, expect, type Order, APIResponse } from '../../src/index';


test('Order creation with TestDataService', async ({
    TestDataService, AdminApiContext,
}) => {
    const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
    expect(product.description).toEqual('Test Description');
    expect(product.coverId).toBeDefined();

    const customer = await TestDataService.createCustomer({ firstName: 'Luke', lastName: 'Skywalker' })
    expect(customer.firstName).toEqual('Luke');
    expect(customer.lastName).toEqual('Skywalker');

    const promotion = await TestDataService.createPromotionWithCode({ code: 'myCode', discounts: [{ scope: 'cart', type: 'absolute', value: 10, considerAdvancedRules: false }] });
    expect(promotion.code).toEqual('myCode');
    expect(promotion.discounts[0].type).toEqual('absolute');

    const order = await TestDataService.createOrder(
        [{ product: product, quantity: 5 }, { product: promotion, quantity: 1 }],
        customer,
        { orderNumber: '123456789' },
    );
    expect(order.orderNumber).toEqual('123456789');

    expect(order.orderCustomer.firstName).toEqual('Luke');
    expect(order.price.totalPrice).toEqual(48.99);

    const orderResponse = await AdminApiContext.get(`./order/${order.id}?_response=detail`);
    const { data: databaseOrder } = (await orderResponse.json()) as { data: Order };
    expect(databaseOrder.id).toBe(order.id);

    // Test data clean-up with activated cleansing process
    TestDataService.setCleanUp(true);
    const cleanUpResponse = await TestDataService.cleanUp() as APIResponse;

    expect(cleanUpResponse.ok()).toBeTruthy();
    const cleanUp = await cleanUpResponse.json();
    expect(cleanUp['deleted']['customer']).toBeDefined();
    expect(cleanUp['deleted']['promotion']).toBeDefined();
    expect(cleanUp['deleted']['promotion_discount']).toBeDefined();
});

