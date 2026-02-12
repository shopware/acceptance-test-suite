import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class DocumentDetail implements PageObject {
    /** @deprecated - Use 'displayDocumentInMyAccountSwitch' instead. */
    public readonly showInAccountSwitch: Locator;
    public readonly displayDocumentInMyAccountSwitch: Locator;
    public readonly saveButton: Locator;
    public readonly documentTypeSelect: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.showInAccountSwitch = page.getByRole("checkbox", { name: translate("administration:document:detail.displayDocumentInMyAccount") });
        this.displayDocumentInMyAccountSwitch = page.getByRole("checkbox", { name: translate("administration:document:detail.displayDocumentInMyAccountSwitch") });
        this.saveButton = page.getByRole("button", { name: translate("administration:document:detail.save") });
        this.documentTypeSelect = page.locator(".sw-settings-document-detail__select-type");
    }

    url(documentId: string) {
        return `#/sw/settings/document/detail/${documentId}`;
    }
}
