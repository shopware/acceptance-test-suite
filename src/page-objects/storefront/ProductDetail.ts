import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import type { Product } from '../../types/ShopwareTypes';

export class ProductDetail implements PageObject {

    public readonly addToCartButton: Locator;
    public readonly quantitySelect: Locator;
    public readonly productSingleImage: Locator;
    public readonly productSinglePrice: Locator;

    public readonly offCanvasCartTitle: Locator;
    public readonly offCanvasCart: Locator;
    public readonly offCanvasCartGoToCheckoutButton: Locator;
    public readonly offCanvasLineItemImages: Locator;
    public readonly offCanvasSummaryTotalPrice: Locator;
    public readonly offCanvas: Locator;

    constructor(public readonly page: Page) {

        this.addToCartButton = page.getByRole('button', { name: 'Add to shopping cart' });
        this.quantitySelect = page.getByLabel('Quantity', { exact: true });
        this.productSingleImage = page.locator('.gallery-slider-single-image');
        this.productSinglePrice = page.locator('.product-detail-price');

        this.offCanvas = page.locator('offcanvas-body');
        this.offCanvasCartTitle = page.getByText('Shopping cart', { exact: true });
        this.offCanvasCart = page.getByRole('dialog');
        this.offCanvasCartGoToCheckoutButton = page.getByRole('link', { name: 'Go to checkout' });
        this.offCanvasLineItemImages = page.locator('.line-item-img-link');
        this.offCanvasSummaryTotalPrice = page.locator('.offcanvas-summary').locator('dt:has-text("Subtotal") + dd');
    }

    url(productData: Product) {
        let namePath = '';
        if (productData.translated && productData.translated.name) {
            namePath = productData.translated.name.replaceAll('_', '-');
        }

       return `${namePath}/${productData.productNumber}`;
    }
}
