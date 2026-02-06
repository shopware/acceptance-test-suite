import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { satisfies } from "compare-versions";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";

export class ManufacturerCreate implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly nameInput: Locator;
    public readonly websiteInput: Locator;
    public readonly descriptionInput: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.saveButton = page.getByRole("button", { name: translate("administration:manufacturer:create.save") });
        this.cancelButton = page.getByRole("button", { name: translate("administration:manufacturer:create.cancel") });
        this.nameInput = page.getByLabel(translate("administration:manufacturer:create.name"));
        this.websiteInput = page.getByLabel(translate("administration:manufacturer:create.website"));
        if (satisfies(instanceMeta.version, "<6.8")) {
            this.descriptionInput = page.locator(".sw-text-editor__content-editor");
        } else {
            this.descriptionInput = page.locator(".mt-text-editor__content-editor");
        }
    }

    url() {
        return `#/sw/manufacturer/create`;
    }
}
