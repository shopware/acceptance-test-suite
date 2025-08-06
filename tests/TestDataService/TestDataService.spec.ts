/* eslint-disable playwright/no-conditional-expect */
import {
    test,
    expect,
    type Customer,
    type PaymentMethod,
    type Rule,
    type ShippingMethod,
    type Currency,
    type Country,
    type PropertyGroup,
    type Product,
    type Manufacturer,
    type Category,
    type APIResponse,
    type SalesChannelAnalytics,
    type Tax,
    type ProductCrossSelling,
    type ProductReview,
    type User,
    type AclRole,
} from '../../src';

test('Data Service', async ({
    TestDataService,
    AdminApiContext,
}) => {
    const customer = await TestDataService.createCustomer({ firstName: 'Luke', lastName: 'Skywalker' })
    expect(customer.firstName).toEqual('Luke');
    expect(customer.lastName).toEqual('Skywalker');

    const paymentMethod = await TestDataService.createBasicPaymentMethod({ name: 'Custom payment method' });
    expect(paymentMethod.name).toEqual('Custom payment method');

    const paymentMethodWithImage = await TestDataService.createPaymentMethodWithImage();
    expect(paymentMethodWithImage.media).toBeDefined();

    const rule = await TestDataService.createBasicRule({ description: 'Rule description' });
    expect(rule.description).toEqual('Rule description');

    const basicShippingMethod = await TestDataService.createBasicShippingMethod({ name: 'Custom shipping method' });
    expect(basicShippingMethod.name).toEqual('Custom shipping method');

    const shippingMethodWithImage = await TestDataService.createShippingMethodWithImage();
    expect(shippingMethodWithImage.media).toBeDefined();

    const currency = await TestDataService.createCurrency({ taxFreeFrom: 10 });
    expect(currency.taxFreeFrom).toEqual(10);

    const country = await TestDataService.createCountry();
    expect(country.name).toBeDefined();

    const customerGroup = await TestDataService.createCustomerGroup({ name: 'Custom customer group' });
    expect(customerGroup.name).toEqual('Custom customer group');

    const category = await TestDataService.createCategory({ name: 'Custom Category' });
    expect(category.name).toEqual('Custom Category');

    const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
    expect(product.description).toEqual('Test Description');
    expect(product.coverId).toBeDefined();

    const digitalProduct = await TestDataService.createDigitalProduct('Test Test', { description: 'You can download me.' });
    expect(digitalProduct.description).toEqual('You can download me.');

    const propertyGroup = await TestDataService.createColorPropertyGroup();
    expect(propertyGroup.description).toEqual('Color');

    const manufacturer = await TestDataService.createBasicManufacturer({ description: 'Test Description Manufacturer' });
    expect(manufacturer.description).toEqual('Test Description Manufacturer');

    const manufacturerWithImage = await TestDataService.createManufacturerWithImage();
    expect(manufacturerWithImage.media).toBeDefined();

    await TestDataService.assignManufacturerProduct(manufacturer.id, product.id)
    expect(product.manufacturerId).toBeDefined();

    const cmsType = 'product_detail';
    const cmsPageName = 'Custom product detail page';
    const cmsPage = await TestDataService.createBasicPageLayout(cmsType, { name: cmsPageName });
    expect(cmsPage.name).toEqual(cmsPageName);
    expect(cmsPage.type).toEqual(cmsType);

    const parentProduct = await TestDataService.createBasicProduct();
    const propertyGroupColor = await TestDataService.createColorPropertyGroup();
    const propertyGroupText = await TestDataService.createTextPropertyGroup();
    const propertyGroups: PropertyGroup[] = [];
    propertyGroups.push(propertyGroupColor);
    propertyGroups.push(propertyGroupText);
    const variantProducts = await TestDataService.createVariantProducts(parentProduct, propertyGroups, { description: 'Variant description' });
    expect(variantProducts.length).toEqual(9);
    expect(variantProducts[0].description).toEqual('Variant description');

    const salesChannelAnalytics = await TestDataService.createSalesChannelAnalytics({ active: false });
    expect(salesChannelAnalytics.active).toEqual(false);

    const taxRate21 = await TestDataService.createTaxRate({ taxRate: 21.0 });
    expect(taxRate21.taxRate).toEqual(21.0);

    const crossSellingProduct = await TestDataService.createBasicProduct();
    const productCrossSelling = await TestDataService.createProductCrossSelling(crossSellingProduct.id, { name: 'Custom cross selling' });
    expect(productCrossSelling.name).toEqual('Custom cross selling');

    const reviewedProduct = await TestDataService.createBasicProduct();
    const review = await TestDataService.createProductReview(reviewedProduct.id, { title: 'Custom review title' });
    expect(review.title).toEqual('Custom review title');
    expect(review.points).toEqual(5);

    const merchant = await TestDataService.createMerchant({ firstName: 'Han', lastName: 'Solo' });
    expect(merchant.firstName).toEqual('Han');
    expect(merchant.lastName).toEqual('Solo');

    const merchantWithBasicRole = await TestDataService.createMerchant({ firstName: 'Mi', lastName: 'How' });
    const aclRole = await TestDataService.createAclRole({ name: 'Custom role' });
    await TestDataService.assignAclRoleMerchant(aclRole.id, merchantWithBasicRole.id);
    expect(merchantWithBasicRole.firstName).toEqual('Mi');
    expect(merchantWithBasicRole.lastName).toEqual('How');
    expect(aclRole.name).toEqual('Custom role');

    // Test data clean-up with deactivated cleansing process
    TestDataService.setCleanUp(false);
    const cleanUpFalseResponse = await TestDataService.cleanUp();
    expect(cleanUpFalseResponse).toBeNull();

    const customerResponse = await AdminApiContext.get(`./customer/${customer.id}?_response=detail`);
    const { data: databaseCustomer } = (await customerResponse.json()) as { data: Customer };
    expect(databaseCustomer.id).toBe(customer.id);

    const paymentMethodResponse = await AdminApiContext.get(`./payment-method/${paymentMethod.id}?_response=detail`);
    const { data: databasePaymentMethod } = (await paymentMethodResponse.json()) as { data: PaymentMethod };
    expect(databasePaymentMethod.id).toBe(paymentMethod.id);

    const shippingMethodResponse = await AdminApiContext.get(`./shipping-method/${basicShippingMethod.id}?_response=detail`);
    const { data: databaseShippingMethod } = (await shippingMethodResponse.json()) as { data: ShippingMethod };
    expect(databaseShippingMethod.id).toBe(basicShippingMethod.id);

    const ruleResponse = await AdminApiContext.get(`./rule/${rule.id}?_response=detail`);
    const { data: databaseRule } = (await ruleResponse.json()) as { data: Rule };
    expect(databaseRule.id).toBe(rule.id);

    const currencyResponse = await AdminApiContext.get(`./currency/${currency.id}?_response=detail`);
    const { data: databaseCurrency } = (await currencyResponse.json()) as { data: Currency };
    expect(databaseCurrency.id).toBe(currency.id);

    const countryResponse = await AdminApiContext.get(`./country/${country.id}?_response=detail`);
    const { data: databaseCountry } = (await countryResponse.json()) as { data: Country };
    expect(databaseCountry.id).toBe(country.id);

    const productResponse = await AdminApiContext.get(`./product/${product.id}?_response=detail`);
    const { data: databaseProduct } = (await productResponse.json()) as { data: Product };
    expect(databaseProduct.id).toBe(product.id);

    const digitalProductResponse = await AdminApiContext.get(`./product/${digitalProduct.id}?_response=detail`);
    const { data: databaseDigitalProduct } = (await digitalProductResponse.json()) as { data: Product };
    expect(databaseDigitalProduct.id).toBe(digitalProduct.id);

    const propertyGroupResponse = await AdminApiContext.get(`./property-group/${propertyGroup.id}?_response=detail`);
    const { data: databasePropertyGroup } = (await propertyGroupResponse.json()) as { data: PropertyGroup };
    expect(databasePropertyGroup.id).toBe(propertyGroup.id);

    const manufacturerResponse = await AdminApiContext.get(`./product-manufacturer/${manufacturer.id}?_response=detail`);
    const { data: databaseManufacturer } = (await manufacturerResponse.json()) as { data: Manufacturer };
    expect(databaseManufacturer.id).toBe(manufacturer.id);

    const categoryResponse = await AdminApiContext.get(`./category/${category.id}?_response=detail`);
    const { data: databaseCategory } = (await categoryResponse.json()) as { data: Category };
    expect(databaseCategory.id).toBe(category.id);

    const salesChannelAnalyticsResponse = await AdminApiContext.get(`./sales-channel-analytics/${salesChannelAnalytics.id}?_response=detail`);
    const { data: databaseSalesChannelAnalytics } = (await salesChannelAnalyticsResponse.json()) as { data: SalesChannelAnalytics };
    expect(databaseSalesChannelAnalytics.id).toBe(salesChannelAnalytics.id);

    const taxRate21Response = await AdminApiContext.get(`./tax/${taxRate21.id}?_response=detail`);
    const { data: databaseTaxRate21 } = (await taxRate21Response.json()) as { data: Tax };
    expect(databaseTaxRate21.id).toBe(taxRate21.id);

    const crossSellingProductResponse = await AdminApiContext.get(`./product-cross-selling/${productCrossSelling.id}?_response=detail`);
    const { data: databaseCrossSellingProduct } = (await crossSellingProductResponse.json()) as { data: ProductCrossSelling };
    expect(databaseCrossSellingProduct.id).toBe(productCrossSelling.id);

    const productReviewResponse = await AdminApiContext.get(`./product-review/${review.id}?_response=detail`);
    const { data: databaseProductReview } = (await productReviewResponse.json()) as { data: ProductReview };
    expect(databaseProductReview.id).toBe(review.id);

    const merchantResponse = await AdminApiContext.get(`./user/${merchant.id}?_response=detail`);
    const { data: databaseMerchant } = (await merchantResponse.json()) as { data: User };
    expect(databaseMerchant.id).toBe(merchant.id);

    const aclRoleResponse = await AdminApiContext.get(`./acl-role/${aclRole.id}?_response=detail`);
    const { data: databaseAclRole } = (await aclRoleResponse.json()) as { data: AclRole };
    expect(databaseAclRole.id).toBe(aclRole.id);

    // Test data clean-up with activated cleansing process
    TestDataService.setCleanUp(true);
    const cleanUpDeleteOperationsResponse = await TestDataService.cleanUp() as APIResponse;

    expect(cleanUpDeleteOperationsResponse.ok()).toBeTruthy();

    const cleanUpDeleteOperations = await cleanUpDeleteOperationsResponse.json();
    expect(cleanUpDeleteOperations['notFound'].length).toBe(0);
    expect(cleanUpDeleteOperations['deleted']['media']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['payment_method']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['rule']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['currency']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['country']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['customer_group']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['category']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['property_group']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['property_group_option']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['product_manufacturer']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['cms_page']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['sales_channel_analytics']).toBeDefined();
    expect(cleanUpDeleteOperations['deleted']['tax']).toBeDefined();
});
