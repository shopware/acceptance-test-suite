import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { Home } from './Home';

export class ContactForm extends Home implements PageObject {
    public readonly contactModal: Locator;
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

    constructor(public readonly page: Page) {
        super(page);
        this.contactModal = this.page.getByRole('dialog').filter({ has: this.page.getByLabel('Contact', { exact: true }) });
        this.salutationSelect = this.contactModal.getByLabel('Salutation*');
        this.firstNameInput = this.contactModal.getByLabel('First name*');
        this.lastNameInput = this.contactModal.getByLabel('Last name*');
        this.emailInput = this.contactModal.getByLabel('Your email address*');
        this.phoneInput = this.contactModal.getByLabel('Phone*');
        this.subjectInput = this.contactModal.getByLabel('Subject*');
        this.commentInput = this.contactModal.getByLabel('Comment*');
        this.privacyPolicyCheckbox = this.contactModal.getByRole('checkbox', { name: 'By selecting continue you confirm that you have read and agree to our' });
        this.submitButton = this.contactModal.getByRole('button', { name: 'Submit' });
        this.contactSuccessModal = this.page.getByRole('dialog').filter({ has: this.page.locator('.confirm-message') });
        this.contactSuccessMessage = this.contactSuccessModal.locator('.confirm-message');
        this.cardTitle = this.contactModal.locator('.card-title');
        this.basicCaptcha = this.contactModal.locator('.basic-captcha');
        this.basicCaptchaImage = this.basicCaptcha.locator('img');
        this.basicCaptchaRefreshButton = this.basicCaptcha.locator('.basic-captcha-content-refresh-icon');
        this.basicCaptchaInput = this.basicCaptcha.locator('input[name="shopware_basic_captcha_confirm"]');
        this.greCaptchaV2Container = this.contactModal.locator('.grecaptcha-v2-container');
        this.greCaptchaV2Input = this.contactModal.locator('.grecaptcha-v2-input');
        this.greCaptchaProtectionInformation = this.contactModal.locator('.grecaptcha-protection-information');
}

    url() {
        return new Error('Function not implemented, because it is a modal page object').message;
    }
}
