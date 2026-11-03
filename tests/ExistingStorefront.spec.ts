import { test, expect } from "@playwright/test";
import { LanguageHelper, BUNDLED_RESOURCES, test as ats, setCurrentContext } from "../src";
import { normalizeStorefrontUrl, getStorefrontCustomerCredentials, resolveExistingStorefront, validateStorefrontOptions } from "../src/services/StorefrontTarget";
import type { AdminApiContext } from "../src/services/AdminApiContext";

const channel = {
    id: "channel",
    typeId: "8a243080f92e4c719546314b577cf82b",
    active: true,
    accessKey: "access-key",
    countryId: "country",
    paymentMethodId: "payment",
    shippingMethodId: "shipping",
    customerGroupId: "group",
    navigationCategoryId: "category",
};
const domain = {
    id: "domain",
    url: "https://storefront.example.test/de/",
    salesChannelId: channel.id,
    languageId: "language",
    currencyId: "currency",
    snippetSetId: "snippets",
    salesChannel: channel,
    language: { id: "language", translationCode: { id: "locale", code: "de-DE" } },
};

function apiFor(data: unknown[], status = 200) {
    return { post: async () => ({ ok: () => status === 200, status: () => status, json: async () => ({ data }) }) } as unknown as AdminApiContext;
}

test("resolves a domain including its host, path, channel and localization", async () => {
    const result = await resolveExistingStorefront(apiFor([domain]), domain.url);
    expect(result).toEqual({ domain, salesChannel: channel, language: domain.language });
    expect(normalizeStorefrontUrl("https://storefront.example.test/de")).toBe(domain.url);
});

for (const [name, data] of [
    ["missing", []],
    ["ambiguous", [domain, domain]],
    ["inactive channel", [{ ...domain, salesChannel: { ...channel, active: false } }]],
    ["inconsistent language", [{ ...domain, languageId: "wrong-language" }]],
] as const) {
    test(`rejects ${name} storefront domains`, async () => {
        await expect(resolveExistingStorefront(apiFor([...data]), domain.url)).rejects.toThrow();
    });
}

test("domain lookup failures do not create a replacement channel", async () => {
    await expect(resolveExistingStorefront(apiFor([], 403), domain.url)).rejects.toThrow("HTTP 403");
});

test("rejects URL credentials, queries and unsupported protocols", () => {
    for (const url of ["ftp://example.test", "https://user:secret@example.test", "https://example.test?domain=other", "not-a-url"]) {
        expect(() => validateStorefrontOptions({ mode: "existing", url }, undefined)).toThrow();
    }
});

test("new customer credential names take precedence without mixing partial legacy credentials", () => {
    expect(
        getStorefrontCustomerCredentials({
            SHOPWARE_STOREFRONT_CUSTOMER_EMAIL: "new@example.test",
            SHOPWARE_STOREFRONT_CUSTOMER_PASSWORD: "new-password",
            SMOKE_CUSTOMER_EMAIL: "old@example.test",
            SMOKE_CUSTOMER_PASSWORD: "old-password",
        })
    ).toEqual({ email: "new@example.test", password: "new-password" });
    expect(() => getStorefrontCustomerCredentials({ SHOPWARE_STOREFRONT_CUSTOMER_EMAIL: "new@example.test", SMOKE_CUSTOMER_PASSWORD: "old-password" })).toThrow("Set both");
});

test("unsupported domain locales fail clearly while custom resources are accepted", async () => {
    expect(() => LanguageHelper.assertSupportedLanguage("nl-NL")).toThrow("CustomTranslationResources");
    expect(() => LanguageHelper.assertSupportedLanguage("de-DE")).not.toThrow();
    const resources = { ...BUNDLED_RESOURCES, nl: BUNDLED_RESOURCES.en };
    expect(() => LanguageHelper.assertSupportedLanguage("nl-NL", resources)).not.toThrow();
    const helper = await LanguageHelper.createInstance("nl-NL", resources);
    expect(helper.getLanguage()).toBe("nl");
});

test("tax lookup supports browsing without tax data and reports errors for test-data creation", async () => {
    const { getTaxId } = await import("../src/services/ShopwareDataHelpers");
    await expect(getTaxId(apiFor([]), { allowMissing: true })).resolves.toBeUndefined();
    await expect(getTaxId(apiFor([]))).rejects.toThrow("Override the Tax fixture");
    await expect(getTaxId(apiFor([], 403), { allowMissing: true })).rejects.toThrow("HTTP 403");
    await expect(getTaxId(apiFor([{ id: "project-tax" }]))).resolves.toBe("project-tax");
});

const translationTest = ats.extend({
    AdminApiContext: [
        async ({}, _use) => {
            throw new Error("Translate must not authenticate by itself.");
        },
        { scope: "worker" },
    ],
});
translationTest("Translate follows the active page locale without introducing Admin API setup", async ({ Translate }) => {
    const context = {};
    const helper = await LanguageHelper.createInstance("de-DE");
    LanguageHelper.setForContext(context, helper);
    setCurrentContext(context);
    try {
        expect(Translate("administration:customField:listing.addNewSet")).toBe(helper.translate("administration:customField:listing.addNewSet"));
    } finally {
        setCurrentContext(null);
    }
});
