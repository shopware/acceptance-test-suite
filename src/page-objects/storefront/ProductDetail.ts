import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import type { components } from '@shopware/api-client/admin-api-types';

export class ProductDetail implements PageObject {
    public readonly addToCartButton: Locator;

    public readonly offCanvasCartTitle: Locator;
    public readonly offCanvasCart: Locator;
    public readonly offCanvasCartGoToCheckoutButton: Locator;
    public readonly productSingleImage: Locator;
    public readonly offCanvasLineItemImages: Locator;
    public readonly quantitySelect: Locator;
    public readonly offCanvasSummaryTotalPrice: Locator;
    public readonly offCanvas: Locator;

    constructor(
        public readonly page: Page,
        public readonly productData: components['schemas']['Product']
    ) {
        this.addToCartButton = page.getByRole('button', { name: 'Add to shopping cart' });
        this.offCanvasCartTitle = page.getByText('Shopping cart', { exact: true });
        this.offCanvasCart = page.getByRole('dialog');
        this.offCanvasCartGoToCheckoutButton = page.getByRole('link', { name: 'Go to checkout' });
        this.offCanvasLineItemImages = page.locator('.line-item-img-link');
        this.quantitySelect = page.getByLabel('Quantity', { exact: true });
        this.offCanvas = page.locator('offcanvas-body');
        this.offCanvasSummaryTotalPrice = page.locator('.offcanvas-summary').locator('dt:has-text("Subtotal") + dd');

        this.productSingleImage = page.locator('.gallery-slider-single-image');
    }

    async goTo(productData: components['schemas']['Product'] = this.productData) {
        let namePath = '';
        if (productData.translated && productData.translated.name) {
            namePath = productData.translated.name.replaceAll('_', '-');
        }

        const url = `${namePath}/${productData.productNumber}`;

        await this.page.goto(url);
    }
}
