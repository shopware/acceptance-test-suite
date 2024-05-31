import { AdminApiContext } from './AdminApiContext';

export const getLanguageData = async (
    languageCode: string,
    adminApiContext: AdminApiContext
): Promise<{ id: string; localeId: string }> => {

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

    const result = (await resp.json()) as { data: { id: string; translationCode: { id: string } }[]; total: number };

    return {
        id: result.data[0].id,
        localeId: result.data[0].translationCode.id,
    };
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

export const getCurrency = async (isoCode: 'EUR', adminApiContext: AdminApiContext) => {
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

export const getOrderTransactionId = async (orderId: string, adminApiContext: AdminApiContext): Promise<{ id: string }> =>{
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
export const setOrderStatus = async (orderId: string, orderStatus: OrderStatus , adminApiContext: AdminApiContext): Promise<void> => {
    await adminApiContext.post(`./_action/order/${orderId}/state/${orderStatus}`);
};