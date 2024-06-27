import { test, expect } from '../src/index';

test('Data Service', async ({
    TestDataService,
}) => {

    const category = await TestDataService.createCategory({ name: 'Custom Category' });
    expect(category.name).toEqual('Custom Category');

    const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
    expect(product.description).toEqual('Test Description');
    expect(product.coverId).toBeDefined();

    const digitalProduct = await TestDataService.createDigitalProduct('Test Test', { description: 'You can download me.' });
    expect(digitalProduct.description).toEqual('You can download me.');

    const propertyGroup = await TestDataService.createColorPropertyGroup();
    expect(propertyGroup.description).toEqual('Color');

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

    // Data Clean-Up
    const cleanUpResponse = await TestDataService.cleanUp();
    expect(cleanUpResponse.ok()).toBeTruthy();

    const cleanUp = await cleanUpResponse.json();
    expect(cleanUp['notFound'].length).toBe(0);
    expect(cleanUp['deleted']['category']).toBeDefined();
    expect(cleanUp['deleted']['media']).toBeDefined();
    expect(cleanUp['deleted']['property_group']).toBeDefined();
    expect(cleanUp['deleted']['customer']).toBeDefined();
});