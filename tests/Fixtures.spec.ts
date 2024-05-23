import { test, expect } from '../src/index';

test('Test all fixtures', async ({
    AdminApiContext,
    StoreApiContext,
    DefaultSalesChannel,
    AdminPage,
    StorefrontPage,
    IdProvider,

    CartWithProductData,
    PromotionWithCodeData,

    MediaData,
    // OrderData,
    DigitalProductData,
    ProductData,
    PropertiesData,
}) => {
    const { id, uuid } = IdProvider.getIdPair();

    await expect(id).toBeTruthy();
    await expect(uuid).toBeTruthy();
});
