import { test, expect } from '../src/index';

test('Data Service', async ({
    TestDataService,
}) => {

    const category = await TestDataService.createCategory({ name: 'Custom Category' });
    expect(category.name).toEqual('Custom Category');

    const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
    expect(product.description).toEqual('Test Description');
    expect(product.coverId).toBeDefined();

    const customer = await TestDataService.createCustomer({ firstName: 'Luke', lastName: 'Skywalker' })
    expect(customer.firstName).toEqual('Luke');
    expect(customer.lastName).toEqual('Skywalker');

    const order = await TestDataService.createOrder(
        [{ product, quantity: 5 }],
        customer,
        { orderNumber: '123456789' });
    expect(order.orderNumber).toEqual('123456789');
    expect(order.orderCustomer.firstName).toEqual('Luke');
    expect(order.price.totalPrice).toEqual(58.99);
});