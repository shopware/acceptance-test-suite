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
    quantityEnd: number | null;
}

export type Product = Omit<components['schemas']['Product'], 'price' | 'prices' | 'options'> & {
    id: string,
    price: Price[],
    prices?: ProductPrice[],
    translated: {
        name: string,
    }
    options?: Record<string, string>[],
}

export type OrderDelivery = Omit<components['schemas']['OrderDelivery'], 'shippingOrderAddress' | 'shippingCosts'> & {
    id: string,
    shippingOrderAddress: Partial<components['schemas']['OrderAddress']>
    shippingCosts: {
        unitPrice: number,
        totalPrice: number,
        quantity: number,
        calculatedTaxes: CalculatedTaxes[],
        taxRules: TaxRules[],
    }
}

export type Manufacturer = components['schemas']['ProductManufacturer'] & {
    id: string,
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

export interface CalculatedTaxes {
    tax: number,
    taxRate: number,
    price: number,
}

export interface TaxRules {
    taxRate: number,
    percentage: number,
}

export type Order = Omit<components['schemas']['Order'], 'deliveries' | 'price'> & {
    id: string,
    orderCustomer: {
        firstName: string,
        lastName: string,
        email: string,
    },
    price: {
        netPrice: number,
        positionPrice: number,
        rawTotal: number,
        taxStatus: string,
        totalPrice: number,
        calculatedTaxes: CalculatedTaxes[],
        taxRules: TaxRules[],

    },
    deliveries: Record<string, unknown>[],
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

export type Promotion = Omit<components['schemas']['Promotion'], 'discounts'> & {
    id: string,
    discounts: [{
        id?: string,
        scope: string,
        type: string,
        value: number,
        considerAdvancedRules: boolean,
    }],
};

export type PromotionDiscount = components['schemas']['PromotionDiscount'] & {
    id: string,
};

export type OrderLineItem = components['schemas']['OrderLineItem'] & {
    id: string,
};

export type PropertyGroupOption = components['schemas']['PropertyGroupOption'] & {
    id: string,
};

export type DeliveryTime = components['schemas']['DeliveryTime'] & {
    id: string,
};