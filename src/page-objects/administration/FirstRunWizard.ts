import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { satisfies } from "compare-versions";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";

export class FirstRunWizard implements PageObject {
    public readonly nextButton: Locator;
    public readonly configureLaterButton: Locator;
    public readonly skipButton: Locator;
    public readonly finishButton: Locator;
    public readonly backButton: Locator;
    public readonly smtpServerButton: Locator;
    public readonly dataImportHeader: Locator;
    public readonly installLanguagePackButton: Locator;
    public readonly installDemoDataButton: Locator;
    public readonly installMigrationAssistantButton: Locator;
    public readonly defaultValuesHeader: Locator;
    public readonly mailerConfigurationHeader: Locator;
    public readonly payPalSetupHeader: Locator;
    public readonly extensionsHeader: Locator;
    public readonly shopwareAccountHeader: Locator;
    public readonly shopwareStoreHeader: Locator;
    public readonly doneHeader: Locator;
    public readonly frwSuccessText: Locator;
    public readonly welcomeText: Locator;
    public readonly pluginCardInfo: Locator;
    public readonly dataImportCard: Locator;
    public readonly salesChannelSelectionList: Locator;
    public readonly salesChannelSelectionMultiSelect: Locator;
    public readonly smtpServerTitle: Locator;

    /**
     * @deprecated - Use `smtpServerFieldInputs` instead.
     */
    public readonly smtpServerFields: Locator;
    public readonly smtpServerFieldInputs: Locator;
    public readonly smtpServerHostInput: Locator;
    public readonly smtpServerPortInput: Locator;
    public readonly smtpServerUsernameInput: Locator;
    public readonly smtpServerPasswordInput: Locator;
    public readonly smtpServerEncryptionInput: Locator;
    public readonly smtpServerSenderAddressInput: Locator;
    public readonly smtpServerDeliveryAddressInput: Locator;
    public readonly smtpServerDisableEmailDeliveryCheckbox: Locator;

    public readonly payPalPaymethods: Locator;
    public readonly payPalInfoCard: Locator;
    public readonly emailAddressInputField: Locator;
    public readonly passwordInputField: Locator;
    public readonly forgotPasswordLink: Locator;
    public readonly extensionStoreHeading: Locator;
    public readonly documentationLink: Locator;
    public readonly forumLink: Locator;
    public readonly roadmapLink: Locator;
    public readonly germanRegionSelector: Locator;
    public readonly toolsSelector: Locator;
    public readonly recommendationHeader: Locator;
    public readonly toolsRecommendedPlugin: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        this.page = page;
        this.instanceMeta = instanceMeta;

        // Generic buttons
        this.nextButton = page.getByText(translate("administration:firstRunWizard:buttons.next"), { exact: true });
        this.configureLaterButton = page.getByText(translate("administration:firstRunWizard:buttons.configureLater"), { exact: true });
        this.skipButton = page.getByText(translate("administration:firstRunWizard:buttons.skip"), { exact: true });
        this.finishButton = page.getByText(translate("administration:firstRunWizard:buttons.finish"), { exact: true });
        this.backButton = page.getByText(translate("administration:firstRunWizard:buttons.back"), { exact: true });

        // LanguagePack part
        this.installLanguagePackButton = page.getByRole("button", { name: translate("administration:firstRunWizard:buttons.install") });
        this.welcomeText = page.locator(".headline-welcome", { hasText: translate("administration:firstRunWizard:welcome.text") });
        this.pluginCardInfo = page.locator(".sw-plugin-card__info");

        // Data import part
        this.installMigrationAssistantButton = page.getByRole("button", { name: translate("administration:firstRunWizard:buttons.installMigrationAssistant") });
        this.installDemoDataButton = page.getByRole("button", { name: translate("administration:firstRunWizard:buttons.installDemoData") });
        this.dataImportHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.dataImport") });
        this.dataImportCard = page.locator(".sw-first-run-wizard-data-import__card");

        // Default values part
        this.defaultValuesHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.defaultValues") });
        this.salesChannelSelectionMultiSelect = page.getByPlaceholder(translate("administration:firstRunWizard:placeholders.selectSalesChannels"));
        this.salesChannelSelectionList = page.locator(".sw-select-result-list__content").getByRole("listitem");

        // Mailer configuration part
        this.mailerConfigurationHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.mailerConfiguration") });
        this.smtpServerButton = page.getByText(translate("administration:firstRunWizard:buttons.configureOwnSmtpServer"), { exact: true });
        this.smtpServerTitle = page.getByText(translate("administration:firstRunWizard:text.smtpServer"), { exact: true });
        this.smtpServerFields = page.locator(".sw-field");
        this.smtpServerHostInput = page.getByLabel(translate("administration:firstRunWizard:fields.host"));
        this.smtpServerPortInput = page.getByLabel(translate("administration:firstRunWizard:fields.port"));
        this.smtpServerUsernameInput = page.getByLabel(translate("administration:firstRunWizard:fields.username"));
        this.smtpServerPasswordInput = page.getByLabel(translate("administration:firstRunWizard:fields.password"), { exact: true });
        this.smtpServerEncryptionInput = page.locator(".sw-single-select__selection-input");
        this.smtpServerSenderAddressInput = page.getByLabel(translate("administration:firstRunWizard:fields.senderAddress"));
        this.smtpServerDeliveryAddressInput = page.getByLabel(translate("administration:firstRunWizard:fields.deliveryAddress"));
        this.smtpServerDisableEmailDeliveryCheckbox = page.getByLabel(translate("administration:firstRunWizard:fields.disableEmailDelivery"));

        if (satisfies(instanceMeta.version, "<6.7")) {
            this.smtpServerFieldInputs = page.locator(".sw-field");
        } else {
            this.smtpServerFieldInputs = page.locator(".mt-field");
        }

        // PayPal part
        this.payPalSetupHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.payPalSetup") });
        this.payPalPaymethods = page.locator(".paymethod");
        this.payPalInfoCard = page.locator(".sw-first-run-wizard-paypal-info");

        // Extensions part
        this.extensionsHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.extensions") });
        this.germanRegionSelector = page.getByText(translate("administration:firstRunWizard:regions.germanRegion"));
        this.toolsSelector = page.getByText(translate("administration:firstRunWizard:regions.tools"));
        this.recommendationHeader = page.getByText(translate("administration:firstRunWizard:text.globalRecommendations"), { exact: true });
        this.toolsRecommendedPlugin = page.locator(".sw-plugin-card__info").locator(".sw-plugin-card__label");

        // Shopware account part
        this.shopwareAccountHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.shopwareAccount") });
        this.emailAddressInputField = page.getByPlaceholder(translate("administration:firstRunWizard:placeholders.enterEmailAddress"), { exact: true });
        this.passwordInputField = page.getByPlaceholder(translate("administration:firstRunWizard:placeholders.enterPassword"), { exact: true });
        this.forgotPasswordLink = page.getByText(translate("administration:firstRunWizard:text.forgotPassword"), { exact: true });

        // Shopware store part
        this.shopwareStoreHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.shopwareStore") });
        this.doneHeader = page.locator(".sw-modal__title", { hasText: translate("administration:firstRunWizard:headers.done") });
        this.extensionStoreHeading = page.locator(".sw-first-run-wizard-store__heading");
        this.frwSuccessText = page.getByText(translate("administration:firstRunWizard:text.allDone"), { exact: true });
        this.documentationLink = page.locator('[href*="https://docs.shopware.com/en"]');
        this.forumLink = page.locator('[href*="https://forum.shopware.com/"]');
        this.roadmapLink = page.locator('[href*="https://www.shopware.com/en/roadmap/"]');
    }

    url() {
        return "#/sw/first/run/wizard/index/";
    }
}
