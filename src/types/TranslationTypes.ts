import { baseNamespaces } from '../locales';

/** Flatten nested JSON keys to "a.b.c" */
type Paths<T> = T extends object ? { [K in keyof T & string]: T[K] extends object ? `${K}` | `${K}.${Paths<T[K]>}` : K }[keyof T & string] : never;

export type TranslationKey<TNamespaces = typeof baseNamespaces> = TNamespaces extends Record<string, unknown>
    ? {
          [A in keyof TNamespaces]: {
              [N in keyof TNamespaces[A]]: `${A & string}:${N & string}:${Paths<TNamespaces[A][N]>}`;
          }[keyof TNamespaces[A]];
      }[keyof TNamespaces]
    : never;

export type TranslateFn<TKey extends string = TranslationKey> = (key: TKey, options?: Record<string, unknown>) => string;

export type Area = keyof typeof baseNamespaces;
export type Namespace = {
    [A in Area]: keyof (typeof baseNamespaces)[A];
}[Area];

export type I18nextInstance = {
    t: (key: string, options?: Record<string, unknown>) => string;
    changeLanguage: (lng: string) => Promise<void>;
    reloadResources?: (lngs: string[], ns: string[]) => Promise<void>;
    use: (backend: unknown) => I18nextInstance;
    init: (options: Record<string, unknown>) => Promise<void>;
};
