import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { Home } from './Home';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class ContactForm extends Home implements PageObject {
    /**
     * @deprecated Compatible until 6.6.x, will be removed in 6.8.x, use 'contactWrapper' instead
     */
    public readonly contactModal: Locator;
    /**
     * @deprecated Compatible until 6.6.x, will be removed in 6.8.x, use 'contactSuccessMessage' instead
     */
    public readonly contactSuccessModal: Locator | undefined;
    public readonly contactWrapper: Locator;
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

        this.contactModal = this.page.getByRole('dialog').filter({ has: this.page.getByText('Contact') });

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.contactWrapper = this.page.getByRole('dialog').filter({ has: this.page.getByText('Contact') });
            this.contactSuccessModal = this.page.getByRole('dialog').filter({ has: this.page.locator('.confirm-message') });
            this.contactSuccessMessage = this.contactSuccessModal.locator('.confirm-message');
        } else {
            this.contactWrapper = this.page.locator('.card').filter({ has: this.page.getByText('Contact') });
            this.formFieldFeedback = this.contactWrapper.locator('.form-field-feedback');
            this.formAlert = this.page.getByRole('alert');
            this.contactSuccessMessage = this.page.locator('.confirm-message');
        }
        this.basicCaptcha = this.contactWrapper.locator('.basic-captcha');
        this.salutationSelect = this.contactWrapper.getByLabel('Salutation');
        this.firstNameInput = this.contactWrapper.getByLabel('First name');
        this.lastNameInput = this.contactWrapper.getByLabel('Last name');
        this.emailInput = this.contactWrapper.getByLabel('Your email address');
        this.phoneInput = this.contactWrapper.getByLabel('Phone');
        this.subjectInput = this.contactWrapper.getByLabel('Subject');
        this.commentInput = this.contactWrapper.getByLabel('Comment');
        this.privacyPolicyCheckbox = this.contactWrapper.getByRole('checkbox', { name: 'By selecting continue you confirm that you have read and agree to our' });
        this.submitButton = this.contactWrapper.getByRole('button', { name: 'Submit' });
        this.cardTitle = this.contactWrapper.locator('.card-title');
        this.basicCaptcha = this.contactWrapper.locator('.basic-captcha');
        this.greCaptchaV2Container = this.contactWrapper.locator('.grecaptcha-v2-container');
        this.greCaptchaV2Input = this.contactWrapper.locator('.grecaptcha-v2-input');
        this.greCaptchaProtectionInformation = this.contactWrapper.locator('.grecaptcha-protection-information');
        this.basicCaptchaImage = this.basicCaptcha.locator('img');
        this.basicCaptchaRefreshButton = this.basicCaptcha.locator('.basic-captcha-content-refresh-icon');
        this.basicCaptchaInput = this.basicCaptcha.locator('input[name="shopware_basic_captcha_confirm"]');
    }

    url() {
        return new Error('Function not implemented, because it is a modal page object').message;
    }
}
