import type { components } from '@shopware/api-client/admin-api-types';

export type SalesChannel = components['schemas']['SalesChannel'] & {
    id: string,
}

export type SalesChannelDomain = components['schemas']['SalesChannelDomain'] & {
    id: string,
};

export type Customer = Omit<components['schemas']['Customer'], 'defaultShippingAddress' | 'defaultBillingAddress'> & {
    id: string,
    password: string,
    defaultShippingAddress: {
        firstName: string,
        lastName: string,
        city: string,
        street: string,
        zipcode: string,
        countryId: string,
        salutationId: string,
    },
    defaultBillingAddress: {
        firstName: string,
        lastName: string,
        city: string,
        street: string,
        zipcode: string,
        countryId: string,
        salutationId: string,
    }
}

export type User = components['schemas']['User'] & {
    id: string,
    password: string,
};

export type AclRole = components['schemas']['AclRole'] & {
    id: string,
    privileges: string[],
};

export type CustomerAddress = components['schemas']['CustomerAddress'] & {
    id: string,
}

export interface Address {
    salutation: string,
    firstName: string,
    lastName: string,
    company: string,
    department: string,
    street: string,
    city: string,
    zipCode: string,
    country: string,
    state: string,
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

export interface VariantListingConfig {
    displayParent: boolean;
}

export interface ProductPrice {
    productId?: string;
    ruleId: string;
    price: Price[];
    quantityStart: number;
    quantityEnd: number | null;
}

export type Product = Omit<components['schemas']['Product'], 'price' | 'prices' | 'options' | 'tags' | 'visibilities' | 'variantListingConfig' > & {
    id: string,
    price: Price[],
    prices?: ProductPrice[],
    translated: {
        name: string,
    }
    options?: Record<string, string>[],
    tags?: Record<string, string>[],
    visibilities?: Record<string, unknown>[],
    variantListingConfig?: VariantListingConfig,
}

export type ProductReview = components['schemas']['ProductReview'] & {
    id: string,
    productId: string,
    salesChannelId: string,
    title: string,
    content: string,
    points: number,
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

export type Country = Omit<components['schemas']['Country'], 'states'> & {
    id: string,
    states: [{
        name: string,
        shortCode: string,
    }],
}

export type SystemConfig = components['schemas']['SystemConfig'] & {
    id: string,
}

export type ProductCrossSelling = components['schemas']['ProductCrossSelling'] & {
    id: string,
};

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
    orderNumber: string,
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
    active: boolean,
    code: string,
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

export type CmsPage = components['schemas']['CmsPage'] & {
    id: string,
};

export type CustomerGroup = components['schemas']['CustomerGroup'] & {
    id: string,
};

export type SalesChannelAnalytics = components['schemas']['SalesChannelAnalytics'] & {
    id: string,
};

export interface RegistrationData {
    isCommercial: boolean;
    isGuest: boolean;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    company: string;
    department: string;
    vatRegNo: string;
}

export type Language = components['schemas']['Language'] & {
    id: string,
};

export type CustomFieldSet = components['schemas']['CustomFieldSet'] & {
    id: string,
};

export type CustomField = Omit<components['schemas']['CustomField'], 'config'> & {
    id: string,
    config: {
        label: {
            'en-GB': string,
        }
    };
};

export type Tax = components['schemas']['Tax'] &{
    id: string;
};

// custom types below
// Rule Types
export const RuleType = {
    shippingAvailability: 'shippingMethodAvailabilityRule',
    taxAvailability: 'taxProviderAvailabilityRule',
    paymentAvailability: 'paymentMethodAvailabilityRule',
    promotionOrder: 'promotionOrderRule',
    promotionCustomer: 'promotionCustomerRule',
    promotionCart: 'promotionCartRule',
} as const;

export type RuleType = typeof RuleType[keyof typeof RuleType];

export interface RuleAssignmentEntity {
    entity: {
    id: string;
    name: string;
}
    ruleType: RuleType
}

export interface FlowConfig {
    name: string;
    description: string;
    priority: string;
    active: boolean;
    triggerSearchTerm: string
    triggerLabel: string;
    condition: string;
    trueAction: string;
    trueActionIdentifier: string;
    falseAction: string;
    falseActionIdentifier: string;
}

export interface CategoryData {
    name: string;
    categoryType: 'Link' | 'Page / List' | 'Structuring element / Entry point';
    status: boolean;
}

export interface CategoryCustomizableLinkData {
    linkType: 'Internal' | 'External';
    entity: 'Category' | 'Product' | 'Landing page'; // Restrict entity values
    category?: string;
    product?: string;
    landingPage?: string;
    openInNewTab: boolean;
}

export interface AccountData {
    customerGroup?: string;
    accountStatus?: boolean;
    language?: string;
    replyToCustomerGroupRequest?: string;
}

export interface TagData {
    changeType: 'Overwrite' | 'Clear' | 'Add' | 'Remove';
    tags: string[];
}

export interface CustomFieldData {
    customFieldSetName: string;
    customFieldValue: string;
}

export enum RuleConditions {
    ShoppingCartTotal = 'cartCartAmount',
    DateRange = 'customerBillingCountry',
    TimeRange = 'timeRange',
    BillingStreet =  'customerBillingStreet',
    ItemMarkedAsNew = 'cartLineItemIsNew',
    SalesChannel = 'salesChannelIds',
    DayOfWeek = 'dayOfWeek',
    Languages = 'languageIds',
    Currencies = 'currencyIds',
    ItemUnitPrice = 'cartPositionPrice',
    ItemType = 'lineItemType',
    ItemInStock = 'cartLineItemStock',
    CustomerLastName = 'customerLastName',
    AdminOrder = 'orderCreatedByAdmin',

}

export type RuleOperators = '=' | '!=' | '<' | '>' | '<=' | '>=';

export type RuleValues = string | number | boolean | Date;

export interface FlowTemplate {
    id: string;
    name: string;
    config: {
        eventName: string;
        sequences: [{
            actionName: string;
            config: string;
        }]
    }
}

export interface Flow {
    id: string;
    name: string;
    eventName: string;
    sequences: [{
        actionName: string;
        config: string;
    }]
}
