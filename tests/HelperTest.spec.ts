import { test, uploadRandomPngMedia } from "../src";

test("uploadRandomPngMedia uploads an image on product detail", async ({ ShopAdmin, TestDataService, AdminProductDetail }) => {
    const product = await TestDataService.createBasicProduct();

    await ShopAdmin.goesTo(AdminProductDetail.url(product.id));
    await ShopAdmin.expects(AdminProductDetail.uploadMediaButton).toBeVisible();
    await ShopAdmin.expects(AdminProductDetail.productImage).toHaveCount(0);

    await uploadRandomPngMedia(AdminProductDetail, product.id);

    await ShopAdmin.expects(AdminProductDetail.coverImage).toBeVisible();
    await ShopAdmin.expects(AdminProductDetail.productImage.first()).toBeVisible();
});
