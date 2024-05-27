import { test, expect } from '../src/index';

test('All data fixtures', async ({
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
    CategoryData,
    PropertiesData,
}) => {
    const { id, uuid } = IdProvider.getIdPair();

    expect(id).toBeTruthy();
    expect(uuid).toBeTruthy();

    expect(AdminApiContext).toBeInstanceOf(Object);
    expect(StoreApiContext).toBeInstanceOf(Object);
    expect(DefaultSalesChannel).toBeInstanceOf(Object);
    expect(CartWithProductData).toBeInstanceOf(Object);
    expect(PromotionWithCodeData).toBeInstanceOf(Object);
    expect(MediaData).toBeInstanceOf(Object);
    expect(OrderData).toBeInstanceOf(Object);
    expect(DigitalProductData).toBeInstanceOf(Object);
    expect(ProductData).toBeInstanceOf(Object);
    expect(CategoryData).toBeInstanceOf(Object);
    expect(PropertiesData).toBeInstanceOf(Object);
});
