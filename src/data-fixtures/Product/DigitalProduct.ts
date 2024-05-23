import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';
import type { components } from '@shopware/api-client/admin-api-types';

export const DigitalProductData = base.extend<FixtureTypes>({
    DigitalProductData: async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, DefaultSalesChannel }, use) => {

        // Generate unique IDs
        const { id: productId, uuid: productUuid } = IdProvider.getIdPair();
        const productName = `Digital_Product_test_${productId}`;

        // Create product
        const productResponse = await AdminApiContext.post('./product?_response', {
            data: {
                active: true,
                stock: 10,
                taxId: SalesChannelBaseConfig.taxId,
                id: productUuid,
                name: productName,
                productNumber: 'Product-' + productId,
                price: [
                    {
                        currencyId: SalesChannelBaseConfig.eurCurrencyId,
                        gross: 10,
                        linked: false,
                        net: 8.4,
                    },
                ],
                purchasePrices: [
                    {
                        currencyId: SalesChannelBaseConfig.eurCurrencyId,
                        gross: 8,
                        linked: false,
                        net: 6.7,
                    },
                ],
                visibilities: [
                    {
                        salesChannelId: DefaultSalesChannel.salesChannel.id,
                        visibility: 30,
                    },
                ],
                categories: [
                    {
                        id: DefaultSalesChannel.salesChannel.navigationCategoryId,
                    },
                ],
            },
        });
        expect(productResponse.ok()).toBeTruthy();

        const { data: productData } = (await productResponse.json()) as { data: components['schemas']['Product'] };

        // Create new Media resource in the default folder for digital product media
        const newMediaResource = await AdminApiContext.post('./media?_response', {
            data: {
                private: false,
            },
        });

        expect(newMediaResource.ok()).toBeTruthy();
        const { data: newMediaValue } = (await newMediaResource.json()) as { data: components['schemas']['Media'] };
        const newMediaId = newMediaValue.id;

        // Create media upload (simple textfile with content "Test123")
        const filename = 'testfile_' + IdProvider.getUniqueName();
        const fileContent = 'This is a test file to test digital product download';
        const newMediaUpload = await AdminApiContext.post(`./_action/media/${newMediaId}/upload?extension=txt&fileName=${filename}&_response`, {
            headers: {
                'content-type': 'application/octet-stream',
            },
            data: fileContent,
        });
        expect(newMediaUpload.ok()).toBeTruthy();

        const productDownloadResponse = await AdminApiContext.post(`./product-download?_response`, {
            data: {
                productId: productData.id,
                mediaId: newMediaId,
            },
        });
        expect(productDownloadResponse.ok()).toBeTruthy();

        const { data: productDownload } = await productDownloadResponse.json();

        const returnData = {
            product: productData,
            fileContent,
        }

        // Use product data in the test
        await use(returnData);

        // List orders with product to delete them
        const orderSearchResponse = await AdminApiContext.post('./search/order', {
            data: {
                limit: 10,
                filter: [
                    {
                        type: 'equals',
                        field: 'lineItems.productId',
                        value: productData.id,
                    },
                ],
            },
        });
        expect(orderSearchResponse.ok()).toBeTruthy();

        const { data: ordersWithDigitalProduct } = (await orderSearchResponse.json()) as { data: components['schemas']['Order'][] };

        // Delete Orders using the digital product, to be able to delete the uploaded media file
        for (const order of ordersWithDigitalProduct) {
            const deleteOrderResponse = await AdminApiContext.delete(`./order/${order.id}`);
            expect(deleteOrderResponse.ok()).toBeTruthy();
        }

        // Unlink the media file from the product by deleting the product-download
        const unlinkMediaResponse = await AdminApiContext.delete(`./product-download/${productDownload.id}`);
        expect(unlinkMediaResponse.ok()).toBeTruthy();

        // Delete media after the test is done
        const cleanupMediaResponse = await AdminApiContext.delete(`./media/${newMediaId}`);
        expect(cleanupMediaResponse.ok()).toBeTruthy();

        // Delete product after the test is done
        const cleanupResponse = await AdminApiContext.delete(`./product/${productUuid}`);
        expect(cleanupResponse.ok()).toBeTruthy();
    },
});
