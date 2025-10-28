import type { Page, Locator } from '@playwright/test';
import { PromotionCreate } from './PromotionCreate';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';
import { translate } from '../../services/LanguageHelper';

export class PromotionDetail extends PromotionCreate {
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    // Tabs
    public readonly tabGeneralLink: Locator;
    public readonly tabConditionsLink: Locator;
    public readonly tabDiscountsLink: Locator;

    // General Tab
    public readonly promotionCodesCard: Locator;
    public readonly promotionCodesHeading: Locator;
    public readonly promotionCodesSelection: Locator;

    // Conditions Tab
    public readonly preConditionsCard: Locator;

    // Discounts Tab
    public readonly addDiscountButton: Locator;
    public readonly discountCards: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);

        this.page = page;
        this.instanceMeta = instanceMeta;

        // Tabs
        this.tabGeneralLink = page.getByRole('tab', { name: translate('administration:promotion:tabs.general') });
        this.tabConditionsLink = page.getByRole('tab', { name: translate('administration:promotion:tabs.conditions') });
        this.tabDiscountsLink = page.getByRole('tab', { name: translate('administration:promotion:tabs.discounts') });

        // General Tab
        this.promotionCodesCard = page.locator('.sw-promotion-v2-detail-base__card-codes');
        this.promotionCodesHeading = this.promotionCodesCard.getByRole('heading', { name: translate('administration:promotion:headings.promotionCodes') });
        this.promotionCodesSelection = this.promotionCodesCard.locator('.mt-select__selection');

        // Conditions Tab
        this.preConditionsCard = page.locator('.mt-card__wrapper', { hasText: translate('administration:promotion:cards.preConditions') });

        // Discounts Tab
        this.addDiscountButton = page.getByRole('button', { name: translate('administration:promotion:actions.addDiscount') });
        this.discountCards = page.locator('.sw-promotion-detail-discounts__discount-list');

        // Selectors specific for versions before 6.7
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.promotionCodesHeading = this.promotionCodesCard.locator('.sw-card__title');
            this.promotionCodesSelection = this.promotionCodesCard.getByRole('combobox');

            this.preConditionsCard = page.locator('.sw-card-wrapper', { hasText: translate('administration:promotion:cards.preConditions') });
        }
    }

    /**
     * Returns the url to the detail page.
     *
     * @param promotionId - Id of the promotion to show the details of.
     * @param tab - The tab to open. Defaults to 'general'. Other options are 'conditions' and 'discounts'.
     */
    url(promotionId?: string, tab: 'general' | 'conditions' | 'discounts' = 'general') {
        let tabString = 'base';
        if (tab != 'general') {
            tabString = tab;
        }
        return `#/sw/promotion/v2/detail/${promotionId}/${tabString}`;
    }
}
