import type { components } from '@shopware/api-client/admin-api-types';

export type SalesChannel = components['schemas']['SalesChannel'] & {
    id: string,
}

export type Customer = components['schemas']['Customer'] & {
    id: string,
    password: string,
}

export type CustomerAddress = components['schemas']['CustomerAddress'] & {
    id: string,
}

export type Salutation = components['schemas']['Salutation'] & {
    id: string,
}

export interface Price {
    gross: number;
    net: number;
    linked: boolean;
    currencyId: string;
}

export interface ProductPrice {
    productId?: string;
    ruleId: string;
    price: Price[];
    quantityStart: number;
    quantityEnd: number;
}

export type Product = Omit<components['schemas']['Product'], 'price' | 'prices'> & {
    id: string,
    price: Price[],
    prices?: ProductPrice[],
    translated: {
        name: string,
    }
}

export type PropertyGroup = components['schemas']['PropertyGroup'] & {
    id: string,
}

export type Category = components['schemas']['Category'] & {
    id: string,
}

export type Media = components['schemas']['Media'] & {
    id: string,
}

export type Tag = components['schemas']['Tag'] & {
    id: string,
};

export type Rule = components['schemas']['Rule'] & {
    id: string,
}

export type Currency = components['schemas']['Currency'] & {
    id: string,
}

export type Order = components['schemas']['Order'] & {
    id: string,
    orderCustomer: {
        firstName: string,
        lastName: string,
        email: string,
    },
    price: {
        netPrice: number;
        positionPrice: number;
        rawTotal: number;
        taxStatus: string;
        totalPrice: number;
    };
}

export type ShippingMethod = components['schemas']['ShippingMethod'] & {
    id: string,
};

export type PaymentMethod = components['schemas']['PaymentMethod'] & {
    id: string,
};

export type StateMachine = components['schemas']['StateMachine'] & {
    id: string,
};

export type StateMachineState = components['schemas']['StateMachineState'] & {
    id: string,
};

export type Promotion = components['schemas']['Promotion'] & {
    id: string,
}