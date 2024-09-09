import {
    test,
    expect,
    type Product,
    Category,
    PropertyGroup,
    Customer,
    Order,
    Manufacturer,
    PaymentMethod,
    Rule,
    ShippingMethod
} from '../src/index';

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

    const customerAddress = await TestDataService.getCustomerAddress(customer.defaultBillingAddressId);
    const deliveryStateMachine = await TestDataService.getDeliveryStateMachine();
    const deliveryState = await TestDataService.getStateMachineState(deliveryStateMachine.id);
    const shippingMethod = await TestDataService.getShippingMethod();
    const deliveryStruct = TestDataService.getBasicOrderDeliveryStruct(deliveryState, shippingMethod, customerAddress);

    const shippingCosts = 12.99;
    const totalPrice = 50 + shippingCosts;

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

    const paymentMethod = await TestDataService.createBasicPaymentMethod( {name: 'Custom payment method'} );
    expect(paymentMethod.name).toEqual('Custom payment method');

    const paymentMethodWithImage = await TestDataService.createPaymentMethodWithImage();
    expect(paymentMethodWithImage.media).toBeDefined();

    const manufacturer = await TestDataService.createBasicManufacturer({ description: 'Test Description Manufacturer' });
    expect(manufacturer.description).toEqual('Test Description Manufacturer');

    const manufacturerWithImage = await TestDataService.createManufacturerWithImage();
    expect(manufacturerWithImage.media).toBeDefined();

    await TestDataService.assignManufacturerProduct(manufacturer.id, product.id)
    expect(product.manufacturerId).toBeDefined();

    const rule = await TestDataService.createBasicRule({ description: 'Rule description' });
    expect(rule.description).toEqual('Rule description');

    const parentProduct = await TestDataService.createBasicProduct();
    const propertyGroups: PropertyGroup[] = [];
    const propertyGroupColor = await TestDataService.createColorPropertyGroup();
    const propertyGroupText = await TestDataService.createTextPropertyGroup();
    propertyGroups.push(propertyGroupColor);
    propertyGroups.push(propertyGroupText);

    const variantProducts = await TestDataService.createVariantProducts(parentProduct, propertyGroups, { description: 'Variant description'});
    expect(variantProducts.length).toEqual(9);
    expect(variantProducts[0].description).toEqual('Variant description');

    const basicShippingMethod = await TestDataService.createBasicShippingMethod( {name: 'Custom shipping method'} );
    expect(basicShippingMethod.name).toEqual('Custom shipping method');

    const shippingMethodWithImage = await TestDataService.createShippingMethodWithImage();
    expect(shippingMethodWithImage.media).toBeDefined();

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

    const manufacturerResponse = await AdminApiContext.get(`./product-manufacturer/${manufacturer.id}?_response=detail`);
    const { data: databaseManufacturer } = (await manufacturerResponse.json()) as { data: Manufacturer };
    expect(databaseManufacturer.id).toBe(manufacturer.id);

    const paymentMethodResponse = await AdminApiContext.get(`./payment-method/${paymentMethod.id}?_response=detail`);
    const { data: databasePaymentMethod } = (await paymentMethodResponse.json()) as { data: PaymentMethod };
    expect(databasePaymentMethod.id).toBe(paymentMethod.id);

    const shippingMethodResponse = await AdminApiContext.get(`./shipping-method/${basicShippingMethod.id}?_response=detail`);
    const { data: databaseShippingMethod } = (await shippingMethodResponse.json()) as { data: ShippingMethod };
    expect(databaseShippingMethod.id).toBe(basicShippingMethod.id);

    const ruleResponse = await AdminApiContext.get(`./rule/${rule.id}?_response=detail`);
    const { data: databaseRule } = (await ruleResponse.json()) as { data: Rule };
    expect(databaseRule.id).toBe(rule.id);

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
    expect(cleanUp['deleted']['property_group_option']).toBeDefined();
    expect(cleanUp['deleted']['customer']).toBeDefined();
    expect(cleanUp['deleted']['product_manufacturer']).toBeDefined();
    expect(cleanUp['deleted']['payment_method']).toBeDefined();
    expect(cleanUp['deleted']['shipping_method']).toBeDefined();
    expect(cleanUp['deleted']['promotion']).toBeDefined();
    expect(cleanUp['deleted']['promotion_discount']).toBeDefined();
    expect(cleanUp['deleted']['rule']).toBeDefined();
});