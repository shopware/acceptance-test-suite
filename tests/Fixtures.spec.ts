import { test, expect } from '../src/index';
import { satisfies } from 'compare-versions';

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

    InstanceMeta,
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

    expect(InstanceMeta).toBeInstanceOf(Object);
    if (satisfies(InstanceMeta.version, '>=6.6.1.0')) {
        expect(InstanceMeta.features['V6_6_0_0']).toBeDefined();
        expect(InstanceMeta.features['V6_6_0_0']).toBeTruthy();
    }
});
