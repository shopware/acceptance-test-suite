import { AsyncLocalStorage } from "async_hooks";
import { createInstance } from "i18next";
import type { TranslationKey, I18nextInstance } from "../types/TranslationTypes";
import { BUNDLED_RESOURCES } from "../locales";
import { getLocale } from "./ShopwareDataHelpers";

// Map a raw input (e.g. "en-GB,fr;q=0.8") to a folder like "en" / "de"
function normalizeLanguage(input?: string) {
    if (!input) return "en";
    const first = input
        .split(",")[0]
        .split(";")[0]
        .trim()
        .replace(/\.(?:UTF-8|utf-8|utf8)$/i, "")
        .replace(/_/g, "-");
    const [lang] = first.split("-");
    return (lang || "en").toLowerCase();
}

function listNamespaces(locale: string, customResources?: typeof BUNDLED_RESOURCES): string[] {
    const resources = customResources?.[locale as keyof typeof customResources] || BUNDLED_RESOURCES[locale as keyof typeof BUNDLED_RESOURCES];
    if (!resources) return [];
    return Object.keys(resources);
}

const TRANSLATOR_SYMBOL = Symbol("__sw_translator__");

export class LanguageHelper {
    private readonly i18nInstance: I18nextInstance | null;
    private currentLng: string;
    private readonly fallbackLng = "en";
    private readonly resources: typeof BUNDLED_RESOURCES;

    private constructor(i18nInstance: I18nextInstance | null, language: string, resources: typeof BUNDLED_RESOURCES) {
        this.i18nInstance = i18nInstance;
        this.currentLng = language;
        this.resources = resources;
    }

    getLanguage(): string {
        return this.currentLng;
    }

    async setLanguage(rawLanguage: string) {
        const lng = normalizeLanguage(rawLanguage);
        const activeNs = listNamespaces(lng, this.resources);
        const fallbackNs = lng === this.fallbackLng ? [] : listNamespaces(this.fallbackLng, this.resources);
        const ns = Array.from(new Set([...activeNs, ...fallbackNs]));

        this.currentLng = lng;
        if (this.i18nInstance && typeof this.i18nInstance.changeLanguage === "function") {
            await this.i18nInstance.changeLanguage(lng);
            if (ns.length && typeof this.i18nInstance.reloadResources === "function") {
                await this.i18nInstance.reloadResources([lng, this.fallbackLng], ns);
            }
        }
    }

    translate(key: TranslationKey, options?: Record<string, unknown>): string {
        if (this.i18nInstance && typeof this.i18nInstance.t === "function") {
            const [area, namespace, ...keyParts] = key.split(":");
            const i18nextKey = `${area}/${namespace}:${keyParts.join(":")}`;
            return this.i18nInstance.t(i18nextKey, options);
        }
        return fallbackTranslate(key, this.resources, options);
    }

    static async createInstance(rawLanguage: string, customResources?: typeof BUNDLED_RESOURCES): Promise<LanguageHelper> {
        const lng = normalizeLanguage(rawLanguage);
        const resources = customResources || BUNDLED_RESOURCES;
        let i18nInstance: I18nextInstance | null = null;

        try {
            const activeNs = listNamespaces(lng, resources);
            const fallbackNs = lng === "en" ? [] : listNamespaces("en", resources);
            const ns = Array.from(new Set([...activeNs, ...fallbackNs]));

            // Create i18next instance directly (no dynamic imports needed)
            const instance = createInstance();

            await instance.init({
                lng,
                fallbackLng: "en",
                ns,
                defaultNS: ns[0] || "common",
                resources: resources, // Use provided resources (bundled or custom)
                interpolation: { escapeValue: false },
                returnNull: false,
                returnEmptyString: false,
                keySeparator: ".",
                nsSeparator: ":",
            });

            i18nInstance = instance as unknown as I18nextInstance;
        } catch (error) {
            console.warn("i18next initialization failed, using fallback:", error);
            i18nInstance = null;
        }

        return new LanguageHelper(i18nInstance, lng, resources);
    }

    static setForContext(context: Record<string, unknown>, instance: LanguageHelper): void {
        (context as Record<string | symbol, unknown>)[TRANSLATOR_SYMBOL] = instance;
    }

    static getFromContext(context: Record<string, unknown>): LanguageHelper | undefined {
        return (context as Record<string | symbol, unknown>)[TRANSLATOR_SYMBOL] as LanguageHelper | undefined;
    }
}

const contextStore = new AsyncLocalStorage();

export function setCurrentContext(context: Record<string, unknown> | null): void {
    contextStore.enterWith(context);
}

export function getCurrentContext(): Record<string, unknown> | null {
    return contextStore.getStore() as Record<string, unknown> | null;
}

function fallbackTranslate(key: TranslationKey, customResources?: typeof BUNDLED_RESOURCES, options?: Record<string, unknown>): string {
    const [area, namespace, ...keyPath] = key.split(":");

    const language = getLocale();
    const normalizedLang = language.toLowerCase().startsWith("de") ? "de" : "en";

    const resources = customResources?.[normalizedLang] || BUNDLED_RESOURCES[normalizedLang];

    const resourceKey = `${area}/${namespace}` as keyof typeof resources;
    const namespaceData = resources[resourceKey];

    if (namespaceData) {
        let value: unknown = namespaceData;

        const fullKeyPath = keyPath.join(":");
        for (const part of fullKeyPath.split(".")) {
            if (value && typeof value === "object" && value !== null) {
                value = (value as Record<string, unknown>)[part];
            } else {
                return key;
            }
        }

        if (typeof value === "string") {
            // Perform simple variable interpolation for placeholders like {{count}}
            if (options) {
                return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
                    const replacement = options[varName];
                    return replacement !== undefined ? String(replacement) : match;
                });
            }
            return value;
        }
        return key;
    }

    return key;
}

export function translate(key: TranslationKey, options?: Record<string, unknown>): string {
    const context = getCurrentContext();
    if (context) {
        const translator = LanguageHelper.getFromContext(context);
        if (translator) {
            return translator.translate(key, options);
        }
    }

    // No context available (e.g., called from page object constructors)
    // Use fallback translation with interpolation support
    return fallbackTranslate(key, undefined, options);
}

// No global translator initialization needed - fallback translate reads locale dynamically
