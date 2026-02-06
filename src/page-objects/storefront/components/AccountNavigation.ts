import type { Page, Locator } from "playwright-core";
import { translate } from "../../../services/LanguageHelper";

export class AccountNavigation {
    public readonly overviewLink: Locator;
    public readonly yourProfileLink: Locator;
    public readonly addressesLink: Locator;
    public readonly ordersLink: Locator;
    public readonly logoutLink: Locator;

    constructor(private readonly page: Page) {
        this.overviewLink = page.getByRole("link", { name: translate("storefront:account:navigation.overview") });
        this.yourProfileLink = page.getByRole("link", { name: translate("storefront:account:navigation.yourProfile") });
        this.addressesLink = page.getByRole("link", { name: translate("storefront:account:navigation.addresses") });
        this.ordersLink = page.getByRole("link", { name: translate("storefront:account:navigation.orders") });
        this.logoutLink = page.getByRole("link", { name: translate("storefront:account:navigation.logout") });
    }
}
