import { APIResponse } from '@playwright/test';
import { AdminApiContext } from './AdminApiContext';
import type { components } from '@shopware/api-client/admin-api-types';
import { Promotion } from '../types/ShopwareTypes';

type Language = components['schemas']['Language'] & {
    id: string,
    translationCode: components['schemas']['Locale'] & { id: string },
}

export const getLanguageData = async (
    languageCode: string,
    adminApiContext: AdminApiContext
): Promise<Language> => {

    const resp = await adminApiContext.post('search/language', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'translationCode.code',
                value: languageCode,
            }],
            associations: { translationCode: {} },
        },
    });

    const result = await resp.json();

    if (result.data.length === 0) {
        throw new Error(`Language ${languageCode} not found`);
    }

    return result.data[0];
};

export const getSnippetSetId = async (languageCode: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/snippet-set', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'iso',
                value: languageCode,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };

    return result.data[0].id;
};

type Currency = components['schemas']['Currency'] & {
    id: string,
}

export const getCurrency = async (isoCode: string, adminApiContext: AdminApiContext): Promise<Currency> => {
    const resp = await adminApiContext.post('search/currency', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'isoCode',
                value: isoCode,
            }],
        },
    });

    const result = await resp.json();

    if (result.data.length === 0) {
        throw new Error(`Currency ${isoCode} not found`);
    }

    return result.data[0];
};

export const getTaxId = async (adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/tax', {
        data: { limit: 1 },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };

    return result.data[0].id;
};

export const getPaymentMethodId = async (adminApiContext: AdminApiContext, handlerId?: string): Promise<string> => {
    const handler = handlerId || 'Shopware\\Core\\Checkout\\Payment\\Cart\\PaymentHandler\\InvoicePayment';

    const resp = await adminApiContext.post('search/payment-method', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'handlerIdentifier',
                value: handler,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string; active: boolean }[]; total: number };

    return result.data[0].id;
};

export const getDefaultShippingMethodId = async (adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/shipping-method', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'name',
                value: 'Standard',
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string; active: boolean }[]; total: number };

    return result.data[0].id;
};

export const getCountryId = async (iso2: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/country', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'iso',
                value: iso2,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };

    return result.data[0].id;
};

export const getThemeId = async (technicalName: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/theme', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'technicalName',
                value: technicalName,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };

    return result.data[0].id;
};

export const getSalutationId = async (salutationKey: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/salutation', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'salutationKey',
                value: salutationKey,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };

    return result.data[0].id;
};

export const getStateMachineId = async (technicalName: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/state-machine', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'technicalName',
                value: technicalName,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };

    return result.data[0].id;
};

export const getStateMachineStateId = async (stateMachineId: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('search/state-machine-state', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'stateMachineId',
                value: stateMachineId,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };

    return result.data[0].id;
};

export const getFlowId = async (flowName: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('./search/flow', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'name',
                value: flowName,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };
    return result.data[0].id;
};

export const getOrderTransactionId = async (orderId: string, adminApiContext: AdminApiContext): Promise<{ id: string }> => {
    const orderTransactionResponse = await adminApiContext.get(`order/${orderId}/transactions?_response`);

    const { data: orderTransaction } = await orderTransactionResponse.json();

    return orderTransaction[0].id;
};

export const getMediaId = async (fileName: string, adminApiContext: AdminApiContext): Promise<string> => {
    const resp = await adminApiContext.post('./search/media', {
        data: {
            limit: 1,
            filter: [{
                type: 'equals',
                field: 'fileName',
                value: fileName,
            }],
        },
    });

    const result = (await resp.json()) as { data: { id: string }[]; total: number };
    return result.data[0].id;
};

export function extractIdFromUrl(url: string): string | null {
    const segments = url.split('/');
    return segments.length > 0 ? segments[segments.length - 1] : null;
}

type OrderStatus = 'cancel' | 'complete' | 'reopen' | 'process';
export const setOrderStatus = async (orderId: string, orderStatus: OrderStatus, adminApiContext: AdminApiContext): Promise<APIResponse> => {
    return await adminApiContext.post(`./_action/order/${orderId}/state/${orderStatus}`);
};

/**
 * Return a single promotion entity with a fetched single discount entity
 */
export const getPromotionWithDiscount = async (promotionId: string, adminApiContext: AdminApiContext): Promise<Promotion> => {
    const resp = await adminApiContext.post('search/promotion', {
        data: {
            limit: 1,
            associations: {
              discounts: {
                  limit: 10,
                  type: 'equals',
                  field: 'promotionId',
                  value: promotionId,
              },
            },
            filter: [{
                type: 'equals',
                field: 'id',
                value: promotionId,
            }],
        },
    });

    const { data: promotion } = (await resp.json()) as { data: Promotion[] };
    return promotion[0];
};