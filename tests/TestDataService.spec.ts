import { test, expect, type Product, Category, PropertyGroup, Customer, Order } from '../src/index';

test('Data Service', async ({
    TestDataService,
    AdminApiContext,
}) => {

    // Test test-data generation
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

    // Test data clean-up with deactivated cleansing process
    TestDataService.setCleanUp(false);
    const cleanUpFalseResponse = await TestDataService.cleanUp();
    expect(cleanUpFalseResponse).toBeNull();

    const categoryResponse = await AdminApiContext.get(`./category/${category.id}?_response=detail`);
    const { data: databaseCategory } = (await categoryResponse.json()) as { data: Category };
    expect(databaseCategory.id).toBe(category.id);

    const productResponse = await AdminApiContext.get(`./product/${product.id}?_response=detail`);
    const { data: databaseProduct } = (await productResponse.json()) as { data: Product };
    expect(databaseProduct.id).toBe(product.id);

    const digitalProductResponse = await AdminApiContext.get(`./product/${digitalProduct.id}?_response=detail`);
    const { data: databaseDigitalProduct } = (await digitalProductResponse.json()) as { data: Product };
    expect(databaseDigitalProduct.id).toBe(digitalProduct.id);

    const propertyGroupResponse = await AdminApiContext.get(`./property-group/${propertyGroup.id}?_response=detail`);
    const { data: databasePropertyGroup } = (await propertyGroupResponse.json()) as { data: PropertyGroup };
    expect(databasePropertyGroup.id).toBe(propertyGroup.id);

    const customerResponse = await AdminApiContext.get(`./customer/${customer.id}?_response=detail`);
    const { data: databaseCustomer } = (await customerResponse.json()) as { data: Customer };
    expect(databaseCustomer.id).toBe(customer.id);

    const orderResponse = await AdminApiContext.get(`./order/${order.id}?_response=detail`);
    const { data: databaseOrder } = (await orderResponse.json()) as { data: Order };
    expect(databaseOrder.id).toBe(order.id);

    // Test data clean-up with activated cleansing process
    TestDataService.setCleanUp(true);
    const cleanUpResponse = await TestDataService.cleanUp();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(cleanUpResponse.ok()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cleanUp = await cleanUpResponse.json();
    expect(cleanUp['notFound'].length).toBe(0);
    expect(cleanUp['deleted']['category']).toBeDefined();
    expect(cleanUp['deleted']['media']).toBeDefined();
    expect(cleanUp['deleted']['property_group']).toBeDefined();
    expect(cleanUp['deleted']['customer']).toBeDefined();
});