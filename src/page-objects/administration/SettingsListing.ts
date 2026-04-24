import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class SettingsListing implements PageObject {
    public readonly contentView: Locator;
    public readonly header: Locator;
    public readonly page: Page;
    public readonly searchInput: Locator;

    public readonly basicInformationLink: Locator;
    public readonly cartSettingsLink: Locator;
    public readonly languagesLink: Locator;
    public readonly measurementSystemLink: Locator;
    public readonly numberRangesLink: Locator;
    public readonly productUnitsLink: Locator;
    public readonly searchLink: Locator;
    public readonly statusManagementLink: Locator;

    public readonly customerGroupsLink: Locator;
    public readonly loginAndSignUpLink: Locator;
    public readonly salutationsLink: Locator;

    public readonly flowBuilderLink: Locator;
    public readonly importExportLink: Locator;
    public readonly ruleBuilderLink: Locator;

    public readonly countriesLink: Locator;
    public readonly currenciesLink: Locator;
    public readonly snippetsLink: Locator;
    public readonly taxLink: Locator;

    public readonly customFieldsLink: Locator;
    public readonly emailTemplatesLink: Locator;
    public readonly mediaLink: Locator;
    public readonly newsletterLink: Locator;
    public readonly seoLink: Locator;
    public readonly sitemapLink: Locator;
    public readonly tagsLink: Locator;

    public readonly deliveryTimesLink: Locator;
    public readonly documentsLink: Locator;
    public readonly essentialCharacteristicsLink: Locator;
    public readonly paymentMethodsLink: Locator;
    public readonly productsLink: Locator;
    public readonly shippingLink: Locator;

    public readonly cachesAndIndexesLink: Locator;
    public readonly eventLogsLink: Locator;
    public readonly firstRunWizardLink: Locator;
    public readonly integrationsLink: Locator;
    public readonly mailerLink: Locator;
    public readonly messageQueueStatisticsLink: Locator;
    public readonly privacyLink: Locator;
    public readonly shopwareAccountLink: Locator;
    public readonly shopwareServicesLink: Locator;
    public readonly shopwareUpdatesLink: Locator;
    public readonly storefrontLink: Locator;
    public readonly usersAndPermissionsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator(".sw-settings__content-header");
        this.contentView = page.locator(".sw-desktop__content");
        this.searchInput = page.locator(".sw-settings__content-header-search").getByRole("searchbox");
        this.shopwareServicesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:shopwareServices:links.shopwareServices") });
        this.privacyLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.privacy") });

        this.basicInformationLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.basicInformation") });
        this.cartSettingsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.cartSettings") });
        this.languagesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.languages") });
        this.measurementSystemLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.measurementSystem") });
        this.numberRangesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.numberRanges") });
        this.productUnitsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.productUnits") });
        this.searchLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.search") });
        this.statusManagementLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.statusManagement") });

        this.customerGroupsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.customerGroups") });
        this.loginAndSignUpLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.loginAndSignUp") });
        this.salutationsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.salutations") });

        this.flowBuilderLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.flowBuilder") });
        this.importExportLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.importExport") });
        this.ruleBuilderLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.ruleBuilder") });

        this.countriesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.countries") });
        this.currenciesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.currencies") });
        this.snippetsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.snippets") });
        this.taxLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.tax") });

        this.customFieldsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.customFields") });
        this.emailTemplatesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.emailTemplates") });
        this.mediaLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.media") });
        this.newsletterLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.newsletter") });
        this.seoLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.seo") });
        this.sitemapLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.sitemap") });
        this.tagsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.tags") });

        this.deliveryTimesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.deliveryTimes") });
        this.documentsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.documents") });
        this.essentialCharacteristicsLink = page
            .locator(".sw-settings__content-grid")
            .getByRole("link", { name: translate("administration:settings:links.essentialCharacteristics") });
        this.paymentMethodsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.paymentMethods") });
        this.productsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.products") });
        this.shippingLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.shipping") });

        this.cachesAndIndexesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.cachesAndIndexes") });
        this.eventLogsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.eventLogs") });
        this.firstRunWizardLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.firstRunWizard") });
        this.integrationsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.integrations") });
        this.mailerLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.mailer") });
        this.messageQueueStatisticsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.messageQueueStatistics") });
        this.privacyLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.privacy") });
        this.shopwareAccountLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.shopwareAccount") });
        this.shopwareServicesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.shopwareServices") });
        this.shopwareUpdatesLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.shopwareUpdates") });
        this.storefrontLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.storefront") });
        this.usersAndPermissionsLink = page.locator(".sw-settings__content-grid").getByRole("link", { name: translate("administration:settings:links.usersAndPermissions") });
    }

    getGroupTitleForLink(link: Locator): Locator {
        return link
            .locator("xpath=ancestor::div[contains(concat(' ', normalize-space(@class), ' '), ' sw-settings__content-group ')]")
            .locator(".sw-settings__content-group-title");
    }

    url() {
        return "#/sw/settings/index/shop";
    }
}
