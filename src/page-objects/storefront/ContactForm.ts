import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { Home } from './Home';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class ContactForm extends Home implements PageObject {
    public readonly contactCmsPage: Locator;
    /**
     * @deprecated Compatible until 6.6.x, will be removed in 6.8.x, use 'contactCmsPage' instead
     */
    public readonly contactModal: Locator;
    /**
     * @deprecated Compatible until 6.6.x, will be removed in 6.8.x, use 'contactCmsPage' instead
     */
    public readonly contactSuccessModal: Locator;
    public readonly salutationSelect: Locator;
    public readonly firstNameInput: Locator;
    public readonly lastNameInput: Locator;
    public readonly emailInput: Locator;
    public readonly phoneInput: Locator;
    public readonly subjectInput: Locator;
    public readonly commentInput: Locator;
    public readonly privacyPolicyCheckbox: Locator;
    public readonly submitButton: Locator;
    public readonly contactSuccessMessage: Locator;
    public readonly cardTitle: Locator;
    public readonly formFieldFeedback: Locator | undefined;
    public readonly formAlert: Locator | undefined;
    /**
     *  Captcha locators
     */
    public readonly basicCaptcha: Locator;
    public readonly basicCaptchaImage: Locator;
    public readonly basicCaptchaRefreshButton: Locator;
    public readonly basicCaptchaInput: Locator;
    public readonly greCaptchaV2Container: Locator;
    public readonly greCaptchaV2Input: Locator;
    public readonly greCaptchaProtectionInformation: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page);

        this.contactCmsPage = this.page.locator('.card').filter({ has: this.page.getByText('Contact') });
        this.contactModal = this.page.getByRole('dialog').filter({ has: this.page.getByText('Contact') });
        this.contactSuccessModal = this.page.getByRole('dialog').filter({ has: this.page.locator('.confirm-message') });

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.contactSuccessMessage = this.contactSuccessModal.locator('.confirm-message');
            this.salutationSelect = this.contactModal.getByLabel('Salutation');
            this.firstNameInput = this.contactModal.getByLabel('First name');
            this.lastNameInput = this.contactModal.getByLabel('Last name');
            this.emailInput = this.contactModal.getByLabel('Your email address');
            this.phoneInput = this.contactModal.getByLabel('Phone');
            this.subjectInput = this.contactModal.getByLabel('Subject');
            this.commentInput = this.contactModal.getByLabel('Comment');
            this.privacyPolicyCheckbox = this.contactModal.getByRole('checkbox', { name: 'By selecting continue you confirm that you have read and agree to our' });
            this.submitButton = this.contactModal.getByRole('button', { name: 'Submit' });
            this.cardTitle = this.contactModal.locator('.card-title');
            this.basicCaptcha = this.contactModal.locator('.basic-captcha');
            this.greCaptchaV2Container = this.contactModal.locator('.grecaptcha-v2-container');
            this.greCaptchaV2Input = this.contactModal.locator('.grecaptcha-v2-input');
            this.greCaptchaProtectionInformation = this.contactModal.locator('.grecaptcha-protection-information');
        } else {
            this.formAlert = this.page.getByRole('alert');
            this.contactSuccessMessage = this.page.locator('.confirm-message');
            this.formFieldFeedback = this.contactCmsPage.locator('.form-field-feedback');
            this.basicCaptcha = this.contactCmsPage.locator('.basic-captcha');
            this.salutationSelect = this.contactCmsPage.getByLabel('Salutation');
            this.firstNameInput = this.contactCmsPage.getByLabel('First name');
            this.lastNameInput = this.contactCmsPage.getByLabel('Last name');
            this.emailInput = this.contactCmsPage.getByLabel('Your email address');
            this.phoneInput = this.contactCmsPage.getByLabel('Phone');
            this.subjectInput = this.contactCmsPage.getByLabel('Subject');
            this.commentInput = this.contactCmsPage.getByLabel('Comment');
            this.privacyPolicyCheckbox = this.contactCmsPage.getByRole('checkbox', { name: 'By selecting continue you confirm that you have read and agree to our' });
            this.submitButton = this.contactCmsPage.getByRole('button', { name: 'Submit' });
            this.cardTitle = this.contactCmsPage.locator('.card-title');
            this.basicCaptcha = this.contactCmsPage.locator('.basic-captcha');
            this.greCaptchaV2Container = this.contactCmsPage.locator('.grecaptcha-v2-container');
            this.greCaptchaV2Input = this.contactCmsPage.locator('.grecaptcha-v2-input');
            this.greCaptchaProtectionInformation = this.contactCmsPage.locator('.grecaptcha-protection-information');
        }

        this.basicCaptchaImage = this.basicCaptcha.locator('img');
        this.basicCaptchaRefreshButton = this.basicCaptcha.locator('.basic-captcha-content-refresh-icon');
        this.basicCaptchaInput = this.basicCaptcha.locator('input[name="shopware_basic_captcha_confirm"]');
    }

    url() {
        return new Error('Function not implemented, because it is a modal page object').message;
    }
}