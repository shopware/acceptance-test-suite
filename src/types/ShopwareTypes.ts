import type { components } from '@shopware/api-client/admin-api-types';

export type Customer = components['schemas']['Customer'] & {
    id: string,
    password: string,
}

export type Product = components['schemas']['Product'] & {
    id: string,
    price: {
        gross: number,
        net: number,
        linked: boolean,
        currencyId: string,
    }[]
}

export type Category = components['schemas']['Category'] & {
    id: string,
}

export type Order = components['schemas']['Order'] & {
    id: string,
}