import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import { Promotion } from '../../../types/ShopwareTypes';
import * as console from 'node:console';

export const ApplyPromotion = base.extend<{ ApplyPromotion: Task }, FixtureTypes>({
    ApplyPromotion: async ({ ShopCustomer, StorefrontProductDetail, StorefrontOffCanvasCart }, use) => {
        const task = (promotion: Promotion, isValid: boolean) => {
            return async function ApplyPromotion() {
                if (promotion.code) {
                    await StorefrontOffCanvasCart.enterPromoInput.fill(promotion.code);
                    await StorefrontOffCanvasCart.submitDiscountButton.click();


                    if (isValid) {
                        await ShopCustomer.expects(StorefrontOffCanvasCart.promotionSuccessMessage).toBeVisible();
                        const promotionLineItemLocators = await StorefrontOffCanvasCart.getPromotionLineItemByNameAndDiscount(promotion.discounts[0].value.toString(), promotion.name);
                        await ShopCustomer.expects(promotionLineItemLocators.promotionLineItem).toBeVisible();
                        await ShopCustomer.expects(promotionLineItemLocators.promotionLineItemLabel).toHaveText(promotion.name);
                        await ShopCustomer.expects(promotionLineItemLocators.promotionIcon).toBeVisible();
                        await ShopCustomer.expects(promotionLineItemLocators.promotionRemoveButton).toBeVisible();
                        // await ShopCustomer.expects(promotionLineItemLocators.promotionLineItemDiscount).toHaveText(new RegExp(`- \\s${promotion.discounts[0].value.toString()}\\*`));
                    } else {
                        await ShopCustomer.expects(StorefrontOffCanvasCart.promotionErrorMessage).toBeVisible();
                    }
                }
            }
        };

        await use(task);
    }
});