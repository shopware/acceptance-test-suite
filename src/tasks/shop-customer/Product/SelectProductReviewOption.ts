import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const SelectProductReviewOption = base.extend<{ SelectProductReviewOption: Task }, FixtureTypes>({
    SelectProductReviewOption: async ({ ShopCustomer, StorefrontProductDetail }, use) => {
        const task = (optionName: string) => {
            return async function SelectProductReviewOption() {
                const reviewOption = await StorefrontProductDetail.getReviewFilterRowOptionsByName(optionName);
                await ShopCustomer.expects(reviewOption.reviewFilterOptionCheckbox).toBeVisible();
                await ShopCustomer.presses(reviewOption.reviewFilterOptionCheckbox);
                await ShopCustomer.expects(StorefrontProductDetail.reviewTabLoadingIcon).toBeVisible();
                await StorefrontProductDetail.reviewTabLoadingIcon.waitFor({ state: 'hidden' });
                await ShopCustomer.expects(reviewOption.reviewFilterOptionCheckbox).toBeVisible();
            };
        };

        await use(task);
    },
});