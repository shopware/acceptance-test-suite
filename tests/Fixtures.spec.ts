import { test, expect } from '../src/index';

test('All fixtures', async ({
    AdminApiContext,
    StoreApiContext,
    DefaultSalesChannel,
    IdProvider,

    CartWithProductData,
    PromotionWithCodeData,

    MediaData,
    OrderData,
    DigitalProductData,
    ProductData,
    PropertiesData,
}) => {
    const { id, uuid } = IdProvider.getIdPair();

    await expect(id).toBeTruthy();
    await expect(uuid).toBeTruthy();

    await expect(AdminApiContext).toBeInstanceOf(Object);
    await expect(StoreApiContext).toBeInstanceOf(Object);
    await expect(DefaultSalesChannel).toBeInstanceOf(Object);
    await expect(CartWithProductData).toBeInstanceOf(Object);
    await expect(PromotionWithCodeData).toBeInstanceOf(Object);
    await expect(MediaData).toBeInstanceOf(Object);
    await expect(OrderData).toBeInstanceOf(Object);
    await expect(DigitalProductData).toBeInstanceOf(Object);
    await expect(ProductData).toBeInstanceOf(Object);
    await expect(PropertiesData).toBeInstanceOf(Object);
});
