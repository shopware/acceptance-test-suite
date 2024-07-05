import { createRandomImage } from './ImageHelper';
import type { AdminApiContext } from './AdminApiContext';
import type { IdProvider } from './IdProvider';
import type {
    Product,
    PropertyGroup,
    Category,
    Media,
    Tag,
    Rule,
    Order,
    Currency,
    Customer,
    CustomerAddress,
    PaymentMethod,
    ShippingMethod,
    StateMachine,
    StateMachineState,
    Promotion,
    SalesChannel,
} from '../types/ShopwareTypes';

export interface CreatedRecord {
    resource: string;
    payload: Record<string, string>;
}

export interface SimpleLineItem {
    product: Product;
    quantity?: number;
    position?: number;
}

export interface SyncApiOperation {
    entity: string;
    action: 'upsert' | 'delete';
    payload: Record<string, unknown>[];
}

export interface DataServiceOptions {
    namePrefix?: string;
    nameSuffix?: string;
    defaultSalesChannel: SalesChannel;
    defaultTaxId: string;
    defaultCurrencyId: string;
    defaultCategoryId: string;
    defaultLanguageId: string;
    defaultCountryId: string;
    defaultCustomerGroupId: string;
}

export class TestDataService {

    public readonly AdminApiClient: AdminApiContext;
    public readonly IdProvider: IdProvider;

    public readonly namePrefix: string = 'Test-';
    public readonly nameSuffix: string = '';

    public readonly defaultSalesChannel: SalesChannel;
    public readonly defaultTaxId: string;
    public readonly defaultCurrencyId: string;
    public readonly defaultCategoryId: string;
    public readonly defaultLanguageId: string;
    public readonly defaultCountryId: string;
    public readonly defaultCustomerGroupId: string;

    /**
     * Configures if an automated cleanup of the data should be executed.
     *
     * @private
     */
    private shouldCleanUp = true;

    /**
     * Configuration of higher priority entities for the cleanup operation.
     * These entities will be deleted before others.
     * This will prevent restricted delete operations of associated entities.
     *
     * @private
     */
    private highPriorityEntities = ['order', 'product'];

    /**
     * A registry of all created records.
     *
     * @private
     */
    private createdRecords: CreatedRecord[] = [];


    constructor(AdminApiClient: AdminApiContext, IdProvider: IdProvider, options: DataServiceOptions) {
        this.AdminApiClient = AdminApiClient;
        this.IdProvider = IdProvider;

        this.defaultSalesChannel = options.defaultSalesChannel;

        this.defaultTaxId = options.defaultTaxId;
        this.defaultCurrencyId = options.defaultCurrencyId;
        this.defaultCategoryId = options.defaultCategoryId;
        this.defaultLanguageId = options.defaultLanguageId;
        this.defaultCountryId = options.defaultCountryId;
        this.defaultCustomerGroupId = options.defaultCustomerGroupId;

        if (options.namePrefix) {
            this.namePrefix = options.namePrefix;
        }

        if (options.nameSuffix) {
            this.nameSuffix = options.nameSuffix;
        }
    }

    /**
     * Creates a basic product without images or other special configuration.
     * The product will be added to the default sales channel category if configured.
     *
     * @param overrides - Specific data overrides that will be applied to the product data struct.
     * @param taxId - The uuid of the tax rule to use for the product pricing.
     * @param currencyId - The uuid of the currency to use for the product pricing.
     */
    async createBasicProduct(
        overrides: Partial<Product> = {},
        taxId = this.defaultTaxId,
        currencyId = this.defaultCurrencyId,
    ): Promise<Product> {
        if (!taxId) {
            return Promise.reject('Missing tax ID for creating product.');
        }

        if (!currencyId) {
            return Promise.reject('Missing currency ID for creating product.');
        }

        const basicProduct = this.getBasicProductStruct(taxId, currencyId, overrides);

        const productResponse = await this.AdminApiClient.post('./product?_response=detail', {
            data: basicProduct,
        });

        const { data: product } = (await productResponse.json()) as { data: Product };

        this.addCreatedRecord('product', product.id);

        return product;
    }

    /**
     * Creates a basic product with one randomly generated image.
     * The product will be added to the default sales channel category if configured.
     *
     * @param overrides - Specific data overrides that will be applied to the product data struct.
     * @param taxId - The uuid of the tax rule to use for the product pricing.
     * @param currencyId - The uuid of the currency to use for the product pricing.
     */
    async createProductWithImage(
        overrides: Partial<Product> = {},
        taxId = this.defaultTaxId,
        currencyId = this.defaultCurrencyId,
    ): Promise<Product> {

        const product = await this.createBasicProduct(overrides, taxId, currencyId);
        const media = await this.createMediaPNG();

        await this.assignProductMedia(product.id, media.id);

        return product;
    }

    /**
     * Creates a digital product with a text file as its download.
     * The product will be added to the default sales channel category if configured.
     *
     * @param content - The content of the text file for the product download.
     * @param overrides - Specific data overrides that will be applied to the product data struct.
     * @param taxId - The uuid of the tax rule to use for the product pricing.
     * @param currencyId - The uuid of the currency to use for the product pricing.
     */
    async createDigitalProduct(
        content = 'Lorem ipsum dolor',
        overrides: Partial<Product> = {},
        taxId = this.defaultTaxId,
        currencyId = this.defaultCurrencyId,
    ): Promise<Product> {

        const product = await this.createBasicProduct(overrides, taxId, currencyId);
        const media = await this.createMediaTXT(content);

        await this.assignProductDownload(product.id, media.id);

        return product;
    }

    /**
     * Creates a basic product with a price range matrix.
     * The product will be added to the default sales channel category if configured.
     *
     * @param overrides - Specific data overrides that will be applied to the product data struct.
     * @param taxId - The uuid of the tax rule to use for the product pricing.
     * @param currencyId - The uuid of the currency to use for the product pricing.
     */
    async createProductWithPriceRange(
        overrides: Partial<Product> = {},
        taxId = this.defaultTaxId,
        currencyId = this.defaultCurrencyId,
    ): Promise<Product> {

        if (!currencyId) {
            return Promise.reject('Missing currency ID for creating product.');
        }

        const rule = await this.getRule('Always valid (Default)');

        const priceRange = this.getProductPriceRangeStruct(currencyId, rule.id);
        const productOverrides = Object.assign({}, priceRange, overrides);

        return this.createBasicProduct(productOverrides, taxId, currencyId);
    }

    /**
     * Creates a basic product category to assign products to.
     *
     * @param parentId - The uuid of the parent category.
     * @param overrides - Specific data overrides that will be applied to the category data struct.
     */
    async createCategory(
        overrides: Partial<Category> = {},
        parentId = this.defaultCategoryId,
    ): Promise<Category> {
        const basicCategory = this.getBasicCategoryStruct(overrides, parentId);

        const response = await this.AdminApiClient.post('category?_response=detail', {
            data: basicCategory,
        });

        const { data: category } = (await response.json()) as { data: Category };

        this.addCreatedRecord('category', category.id);

        return category;
    }

    /**
     * Creates a new media resource containing a random generated PNG image.
     *
     * @param width - The width of the image in pixel. Default is 800.
     * @param height - The height of the image in pixel. Default is 600.
     */
    async createMediaPNG(
        width = 800,
        height = 600,
    ): Promise<Media> {

        const image = createRandomImage(width, height);
        const media = await this.createMediaResource();
        const filename = `${this.namePrefix}Media-${media.id}${this.nameSuffix}`;

        await this.AdminApiClient.post(`_action/media/${media.id}/upload?extension=png&fileName=${filename}`, {
            data: Buffer.from(image.toBuffer()),
            headers: { 'content-type': 'image/png' },
        });

        this.addCreatedRecord('media', media.id);

        return media;
    }

    /**
     * Creates a new media resource containing a text file.
     *
     * @param content - The content of the text file.
     */
    async createMediaTXT(
        content = 'Lorem ipsum dolor',
    ): Promise<Media> {

        const media = await this.createMediaResource();
        const filename = `${this.namePrefix}Media-${media.id}${this.nameSuffix}`;

        await this.AdminApiClient.post(`_action/media/${media.id}/upload?extension=txt&fileName=${filename}`, {
            data: content,
            headers: { 'content-type': 'application/octet-stream' },
        });

        this.addCreatedRecord('media', media.id);

        return media;
    }

    /**
     * Creates a new empty media resource.
     * This method is mostly used to combine it with a certain file upload.
     */
    async createMediaResource(): Promise<Media> {

        const id = this.IdProvider.getIdPair().id;

        const mediaResponse = await this.AdminApiClient.post('media?_response=detail', {
            data: {
                private: false,
                alt: `Alt-${id}`,
                title: `Title-${id}`,
            },
        });

        const { data: media } = (await mediaResponse.json()) as { data: Media };

        return media;
    }

    /**
     * Creates a new property group with color type options.
     *
     * @param overrides - Specific data overrides that will be applied to the property group data struct.
     */
    async createColorPropertyGroup(
        overrides: Partial<PropertyGroup> = {},
    ): Promise<PropertyGroup> {

        const id = this.IdProvider.getIdPair().id;
        const colorPropertyGroup = {
            name: `${this.namePrefix}Color-${id}${this.nameSuffix}`,
            description: 'Color',
            displayType: 'color',
            sortingType: 'name',
            options: [{
                name: 'Blue',
                colorHexCode: '#2148d6',
            }, {
                name: 'Red',
                colorHexCode: '#bf0f2a',
            }, {
                name: 'Green',
                colorHexCode: '#12bf0f',
            }],
        };

        const propertyGroupResponse = await this.AdminApiClient.post('property-group?_response=detail', {
            data: Object.assign({}, colorPropertyGroup, overrides),
        });

        const { data: propertyGroup } = (await propertyGroupResponse.json()) as { data: PropertyGroup };

        this.addCreatedRecord('property_group', propertyGroup.id);

        return propertyGroup;
    }

    /**
     * Creates a new property group with text type options.
     *
     * @param overrides - Specific data overrides that will be applied to the property group data struct.
     */
    async createTextPropertyGroup(
        overrides: Partial<PropertyGroup> = {},
    ): Promise<PropertyGroup> {

        const id = this.IdProvider.getIdPair().id;
        const textPropertyGroup = {
            name: `${this.namePrefix}Size-${id}${this.nameSuffix}`,
            description: 'Size',
            displayType: 'text',
            sortingType: 'name',
            options: [{
                name: 'Small',
            }, {
                name: 'Medium',
            }, {
                name: 'Large',
            }],
        };

        const propertyGroupResponse = await this.AdminApiClient.post('property-group?_response=detail', {
            data: Object.assign({}, textPropertyGroup, overrides),
        });

        const { data: propertyGroup } = (await propertyGroupResponse.json()) as { data: PropertyGroup };

        this.addCreatedRecord('property_group', propertyGroup.id);

        return propertyGroup;
    }

    /**
     * Creates a new tag which can be assigned to other entities.
     *
     * @param tagName - The name of the tag.
     */
    async createTag(
        tagName: string,
    ): Promise<Tag> {

        const response = await this.AdminApiClient.post('tag?_response=detail', {
            data: {
                id: this.IdProvider.getIdPair().uuid,
                name: tagName,
            },
        });

        const { data: tag } = (await response.json()) as { data: Tag };

        this.addCreatedRecord('tag', tag.id);

        return tag;
    }

    /**
     * Creates a new shop customer.
     *
     * @param overrides - Specific data overrides that will be applied to the customer data struct.
     * @param salutationKey - The key of the salutation that should be used for the customer. Default is "mr".
     * @param salesChannel - The sales channel for which the customer should be registered.
     */
    async createCustomer(
        overrides: Partial<Customer> = {},
        salutationKey = 'mr',
        salesChannel: SalesChannel = this.defaultSalesChannel,
    ): Promise<Customer> {
        const salutation = await this.getSalutation(salutationKey);

        const basicCustomerStruct = this.getBasicCustomerStruct(
            salesChannel.id,
            salesChannel.customerGroupId,
            salesChannel.languageId,
            salesChannel.countryId,
            salesChannel.paymentMethodId,
            salutation.id,
            overrides
        );

        const response = await this.AdminApiClient.post('customer?_response=detail', {
            data: basicCustomerStruct,
        });

        const { data: customer } = (await response.json()) as { data: Customer };

        this.addCreatedRecord('customer', customer.id);

        return customer;
    }

    /**
     * Creates a new order. This order is created on pure data and prices are not guaranteed to be calculated correctly.
     *
     * @param lineItems - Products that should be added to the order.
     * @param customer - The customer to which the order should be assigned.
     * @param salesChannel - The sales channel in which the order should be created.
     * @param overrides - Specific data overrides that will be applied to the order data struct.
     */
    async createOrder(
        lineItems: SimpleLineItem[],
        customer: Customer,
        overrides: Partial<Order> = {},
        salesChannel: SalesChannel = this.defaultSalesChannel,
    ): Promise<Order> {
        const orderStateMachine = await this.getOrderStateMachine();
        const deliveryStateMachine = await this.getDeliveryStateMachine();
        const transactionStateMachine = await this.getTransactionStateMachine();

        const orderState = await this.getStateMachineState(orderStateMachine.id);
        const deliveryState = await this.getStateMachineState(deliveryStateMachine.id);
        const transactionState = await this.getStateMachineState(transactionStateMachine.id);

        const currencyResponse = await this.AdminApiClient.get(`currency/${salesChannel.currencyId}`);
        const { data: currency } = (await currencyResponse.json()) as { data: Currency };

        const shippingMethod = await this.getShippingMethod();
        const paymentMethod = await this.getPaymentMethod();
        const customerAddress = await this.getCustomerAddress(customer.defaultBillingAddressId);

        const basicOrder = this.getBasicOrderStruct(
            lineItems,
            salesChannel.languageId,
            currency,
            paymentMethod,
            shippingMethod,
            orderState,
            deliveryState,
            transactionState,
            customer,
            customerAddress,
            salesChannel.id,
            overrides,
        );

        const orderResponse = await this.AdminApiClient.post('order?_response=detail', {
            data: basicOrder,
        });

        const { data: order } = (await orderResponse.json()) as { data: Order };

        this.addCreatedRecord('order', order.id);

        return order;
    }

    /**
     * Creates a new promotion with a promotion code.
     *
     * @param overrides - Specific data overrides that will be applied to the promotion data struct.
     * @param salesChannelId - The uuid of the sales channel in which the promotion should be active.
     */
    async createPromotionWithCode(
        overrides: Partial<Promotion> = {},
        salesChannelId = this.defaultSalesChannel.id,
    ): Promise<Promotion> {

        const basicPromotion = this.getBasicPromotionStruct(salesChannelId, overrides);

        // Create a new promotion with code via admin API context
        const promotionResponse = await this.AdminApiClient.post('promotion?_response=detail', {
            data: basicPromotion,
        });

        const { data: promotion } = (await promotionResponse.json()) as { data: Promotion };

        this.addCreatedRecord('promotion', promotion.id);

        return promotion;
    }

    /**
     * Assigns a media resource as the download of a digital product.
     *
     * @param productId - The uuid of the product.
     * @param mediaId - The uuid of the media resource.
     */
    async assignProductDownload(productId: string, mediaId: string) {

        const downloadResponse = await this.AdminApiClient.post(`product-download?_response=basic`, {
            data: {
                productId: productId,
                mediaId: mediaId,
            },
        });

        const { data: productDownload } = await downloadResponse.json();

        return productDownload;
    }

    /**
     * Assigns a media resource to a product as the product image.
     *
     * @param productId - The uuid of the product.
     * @param mediaId - The uuid of the media resource.
     */
    async assignProductMedia(productId: string, mediaId: string) {

        const productMediaId = this.IdProvider.getIdPair().uuid;

        const mediaResponse = await this.AdminApiClient.patch(`product/${productId}?_response=basic`, {
            data: {
                coverId: productMediaId,
                media: [
                    {
                        id: productMediaId,
                        media: {
                            id: mediaId,
                        },
                    },
                ],
            },
        });

        const { data: productMedia } = await mediaResponse.json();

        return productMedia;
    }

    /**
     * Assigns a product to a category.
     *
     * @param productId - The uuid of the product.
     * @param categoryId - The uuid of the category.
     */
    async assignProductCategory(productId: string, categoryId: string) {

        return await this.AdminApiClient.patch(`product/${productId}?_response=basic`, {
            data: {
                categories: [{
                    id: categoryId,
                }],
            },
        });
    }

    /**
     * Assigns a tag to a product.
     *
     * @param productId - The uuid of the product.
     * @param tagId - The uuid of the tag.
     */
    async assignProductTag(productId: string, tagId: string) {

        return await this.AdminApiClient.patch(`product/${productId}?_response=basic`, {
            data: {
                tags: [{
                    id: tagId,
                }],
            },
        });
    }

    /**
     * Retrieves a currency based on its ISO code.
     *
     * @param isoCode - The ISO code of the currency, for example "EUR".
     */
    async getCurrency(isoCode: string): Promise<Currency> {
        const currencyResponse = await this.AdminApiClient.post('search/currency', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'isoCode',
                    value: isoCode,
                }],
            },
        });

        const { data: result } = (await currencyResponse.json()) as { data: Currency[] };

        return result[0];
    }

    /**
     * Retrieves a rule based on its name.
     *
     * @param name - The name of the rule.
     */
    async getRule(name: string): Promise<Rule> {
        const response = await this.AdminApiClient.post('search/rule', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'name',
                    value: name,
                }],
            },
        });

        const { data: result } = (await response.json()) as { data: Rule[] };

        return result[0];
    }

    /**
     * Retrieves a shipping method by its name.
     *
     * @param name - The name of the shipping method. Default is "Standard".
     */
    async getShippingMethod(name = 'Standard'): Promise<ShippingMethod> {
        const response = await this.AdminApiClient.post('search/shipping-method', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'name',
                    value: name,
                }],
            },
        });

        const { data: result } = (await response.json()) as { data: ShippingMethod[] };

        return result[0];
    }

    /**
     * Retrieves a payment method by its name.
     *
     * @param name - The name of the payment method. Default is "Invoice".
     */
    async getPaymentMethod(name = 'Invoice'): Promise<PaymentMethod> {
        const response = await this.AdminApiClient.post('search/payment-method', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'name',
                    value: name,
                }],
            },
        });

        const { data: result } = (await response.json()) as { data: PaymentMethod[] };

        return result[0];
    }

    /**
     * Retrieves the address of a customer by its uuid.
     *
     * @param addressId - The uuid of the customer address.
     */
    async getCustomerAddress(addressId: string): Promise<CustomerAddress> {
        const response = await this.AdminApiClient.get(`customer-address/${addressId}`);

        const { data: address } = (await response.json()) as { data: CustomerAddress };

        return address;
    }

    /**
     * Retrieves a customer salutations by its key.
     *
     * @param key - The key of the salutation. Default is "mr".
     */
    async getSalutation(key = 'mr') {
        const response = await this.AdminApiClient.post('search/salutation', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'salutationKey',
                    value: key,
                }],
            },
        });

        const { data: result } = await response.json();

        return result[0];
    }

    /**
     * Retrieves the state machine for order states.
     */
    async getOrderStateMachine(): Promise<StateMachine> {
        return await this.getStateMachine('order.state');
    }

    /**
     * Retrieves the state machine for delivery states.
     */
    async getDeliveryStateMachine(): Promise<StateMachine> {
        return await this.getStateMachine('order_delivery.state');
    }

    /**
     * Retrieves the state machine for transaction states.
     */
    async getTransactionStateMachine(): Promise<StateMachine> {
        return await this.getStateMachine('order_transaction.state');
    }

    /**
     * Retrieves a state machine by its name.
     *
     * @param name - The name of the state machine.
     */
    async getStateMachine(name: string): Promise<StateMachine> {
        const response = await this.AdminApiClient.post('search/state-machine', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'technicalName',
                    value: name,
                }],
            },
        });

        const { data: result } = (await response.json()) as { data: StateMachine[] };

        return result[0];
    }

    /**
     * Retrieves the state of a state machine.
     *
     * @param stateMachineId - The uuid of the state machine.
     * @param stateName - The name of the state. Default is "open".
     */
    async getStateMachineState(
        stateMachineId: string,
        stateName: 'open' | 'completed' | 'in_progress' | 'cancelled' = 'open',
    ): Promise<StateMachineState> {
        const response = await this.AdminApiClient.post('search/state-machine-state', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'stateMachineId',
                    value: stateMachineId,
                }, {
                    type: 'equals',
                    field: 'technicalName',
                    value: stateName,
                }],
            },
        });

        const { data: result } = (await response.json()) as { data: StateMachineState[] };

        return result[0];
    }

    /**
     * Adds an entity reference to the registry of created records.
     * All entities added to the registry will be deleted by the cleanup call.
     *
     * @param resource - The resource name of the entity.
     * @param payload - You can pass a payload object for the delete operation or simply pass the uuid of the entity.
     */
    addCreatedRecord(resource: string, payload: string | Record<string, string>) {
        const res = resource.replace('-', '_');

        if (typeof payload === 'string') {
            this.createdRecords.push({
                resource: res,
                payload: { id: payload },
            });
        } else {
            this.createdRecords.push({ resource: res, payload });
        }
    }

    /**
     * Set the configuration of automated data clean up.
     * If set to "true" the data service will delete all entities created by it.
     *
     * @param shouldCleanUp - The config setting for the automated data clean up. Default is "true".
     */
    setCleanUp(shouldCleanUp = true) {
        this.shouldCleanUp = shouldCleanUp;
    }

    /**
     * Will delete all entities created by the data service via sync API.
     */
    async cleanUp() {
        if (!this.shouldCleanUp) {
            return Promise.reject();
        }

        const priorityDeleteOperations: Record<string, SyncApiOperation> = {};
        const deleteOperations: Record<string, SyncApiOperation> = {};

        this.createdRecords.forEach((record) => {
            if (this.highPriorityEntities.includes(record.resource)) {
                if (!priorityDeleteOperations[`delete-${record.resource}`]) {
                    priorityDeleteOperations[`delete-${record.resource}`] = {
                        entity: record.resource,
                        action: 'delete',
                        payload: [],
                    };
                }

                priorityDeleteOperations[`delete-${record.resource}`].payload.push(record.payload);

            } else {
                if (!deleteOperations[`delete-${record.resource}`]) {
                    deleteOperations[`delete-${record.resource}`] = {
                        entity: record.resource,
                        action: 'delete',
                        payload: [],
                    };
                }

                deleteOperations[`delete-${record.resource}`].payload.push(record.payload);
            }
        });

        await this.AdminApiClient.post('_action/sync', {
            data: priorityDeleteOperations,
        });

        return await this.AdminApiClient.post('_action/sync', {
            data: deleteOperations,
        });
    }

    /**
     * Convert a JS date object into a date-time compatible string.
     *
     * @param date - The JS date object from which the date-time should be retrieved.
     */
    convertDateTime(date: Date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    getBasicProductStruct(
        taxId = this.defaultTaxId,
        currencyId = this.defaultCurrencyId,
        overrides: Partial<Product> = {},
    ): Partial<Product> {

        const { id: productId, uuid: productUuid } = this.IdProvider.getIdPair();
        const productName = `${this.namePrefix}Product-${productId}${this.nameSuffix}`;
        const productNumber = 'Product-' + productId;

        const description = `
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`.trim();

        const prices = [
            {
                currencyId: this.defaultSalesChannel.currencyId,
                gross: 10,
                linked: false,
                net: 8.4,
            },
            {
                currencyId: currencyId,
                gross: 10,
                linked: false,
                net: 8.4,
            },
        ];

        let basicProduct = {
            id: productUuid,
            name: productName,
            description: description,
            productNumber: productNumber,
            taxId: taxId,
            active: true,
            stock: 10,
            price: prices,
            purchasePrices: prices,
        };

        if (this.defaultCategoryId) {
            basicProduct = Object.assign({}, basicProduct, {
                categories: [{
                    id: this.defaultCategoryId,
                }],
            });
        }

        if (this.defaultSalesChannel) {
            basicProduct = Object.assign({}, basicProduct, {
                visibilities: [{
                    salesChannelId: this.defaultSalesChannel.id,
                    visibility: 30,
                }],
            });
        }

        return Object.assign({}, basicProduct, overrides);
    }

    getProductPriceRangeStruct(
        currencyId: string,
        ruleId: string,
    ): Partial<Product> {
        const p = (gross: number, net: number,) => [
            {
                currencyId: this.defaultSalesChannel.currencyId,
                gross,
                net,
                linked: false,
            },
            {
                currencyId: currencyId,
                gross,
                net,
                linked: false,
            },
        ];

        return {
            price: p(100, 84.03),
            prices: [{
                ruleId: ruleId,
                price: p(100, 84.03),
                quantityStart: 1,
                quantityEnd: 10,
            }, {
                ruleId: ruleId,
                price: p(90, 75.63),
                quantityStart: 11,
                quantityEnd: 20,
            }, {
                ruleId: ruleId,
                price: p(80, 67.23),
                quantityStart: 21,
                quantityEnd: 50,
            }],
        }
    }

    getBasicCategoryStruct(
        overrides: Partial<Category> = {},
        parentId = this.defaultCategoryId,
    ) {
        const { id: categoryId, uuid: categoryUuid } = this.IdProvider.getIdPair();
        const categoryName = `${this.namePrefix}Category-${categoryId}${this.nameSuffix}`;

        const basicCategory = {
            id: categoryUuid,
            name: categoryName,
            parentId: parentId || null,
            displayNestedProducts: true,
            type: 'page',
            productAssignmentType: 'product',
            visible: true,
            active: true,
        };

        return Object.assign({}, basicCategory, overrides);
    }

    getBasicCustomerStruct(
        salesChannelId: string,
        customerGroupId: string,
        languageId: string,
        countryId: string,
        defaultPaymentMethodId: string,
        salutationId: string,
        overrides: Partial<Customer> = {},
    ): Partial<Customer> {

        const { id: id, uuid: customerUuid } = this.IdProvider.getIdPair();
        const firstName = 'John';
        const lastName = 'Goldblum';

        const basicCustomer = {
            id: customerUuid,
            email: `customer_${id}@example.com`,
            password: 'shopware',
            salutationId: salutationId,
            languageId: languageId,

            defaultShippingAddress: {
                firstName: firstName,
                lastName: lastName,
                city: 'Schöppingen',
                street: 'Ebbinghoff 10',
                zipcode: '48624',
                countryId: countryId,
                salutationId: salutationId,
            },
            defaultBillingAddress: {
                firstName: firstName,
                lastName: lastName,
                city: 'Schöppingen',
                street: 'Ebbinghoff 10',
                zipcode: '48624',
                countryId: countryId,
                salutationId: salutationId,
            },

            firstName: firstName,
            lastName: lastName,

            salesChannelId: salesChannelId,
            groupId: customerGroupId,
            customerNumber: `${customerUuid}`,
            defaultPaymentMethodId: defaultPaymentMethodId,
        };

        return Object.assign({}, basicCustomer, overrides);
    }

    getBasicOrderStruct(
        lineItems: SimpleLineItem[],
        languageId: string,
        currency: Currency,
        paymentMethod: PaymentMethod,
        shippingMethod: ShippingMethod,
        orderState: StateMachineState,
        deliveryState: StateMachineState,
        transactionState: StateMachineState,
        customer: Customer,
        customerAddress: CustomerAddress,
        salesChannelId = this.defaultSalesChannel.id,
        overrides: Partial<Order> = {},
    ): Partial<Order> {

        const date = new Date();
        const orderDateTime = this.convertDateTime(date);
        const shippingDate = new Date(date.getDate() + 3);
        const shippingDateTime = this.convertDateTime(shippingDate);

        let totalPrice = 0;
        const lineItemProducts: Record<string, unknown>[] = [];
        lineItems.forEach((lineItem) => {
            lineItemProducts.push(this.getBasicProductLineItemStruct(lineItem));
            totalPrice += lineItem.product.price[0].gross * (lineItem.quantity || 1);
        });

        const shippingCosts = 8.99;
        totalPrice += shippingCosts;

        const basicOrder = {
            orderNumber: this.IdProvider.getIdPair().id,
            stateId: orderState.id,
            orderDateTime: orderDateTime,
            currencyId: currency.id,
            currencyFactor: currency.factor,
            languageId: languageId,
            salesChannelId: salesChannelId,
            billingAddressId: customerAddress.id,
            itemRounding: {
                decimals: 2,
                interval: 0.01,
                roundForNet: true,
            },
            totalRounding: {
                decimals: 2,
                interval: 0.01,
                roundForNet: true,
            },
            price: {
                totalPrice: totalPrice,
                positionPrice: totalPrice,
                rawTotal: totalPrice,
                netPrice: totalPrice,
                taxStatus: 'gross',
                calculatedTaxes: [{
                    tax: 0,
                    taxRate: 0,
                    price: totalPrice,
                }],
                taxRules: [{
                    taxRate: 0,
                    percentage: 100,
                }],
            },
            orderCustomer: {
                customerId: customer.id,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                salutationId: customer.salutationId,
            },
            shippingCosts: {
                unitPrice: shippingCosts,
                totalPrice: shippingCosts,
                quantity: 1,
                calculatedTaxes: [{
                    tax: 0,
                    taxRate: 0,
                    price: shippingCosts,
                }],
                taxRules: [{
                    taxRate: 0,
                    percentage: 100,
                }],
            },
            lineItems: lineItemProducts,
            deliveries: [
                {
                    stateId: deliveryState.id,
                    shippingMethodId: shippingMethod.id,
                    shippingOrderAddress: {
                        id: customerAddress.id,
                        salutationId: customerAddress.salutationId,
                        firstName: customerAddress.firstName,
                        lastName: customerAddress.lastName,
                        street: customerAddress.street,
                        zipcode: customerAddress.zipcode,
                        city: customerAddress.city,
                        countryId: customerAddress.countryId,
                        phoneNumber: customerAddress.phoneNumber,
                    },
                    shippingDateEarliest: shippingDateTime,
                    shippingDateLatest: shippingDateTime,
                    shippingCosts: {
                        unitPrice: shippingCosts,
                        totalPrice: shippingCosts,
                        quantity: 1,
                        calculatedTaxes: [
                            {
                                tax: 0,
                                taxRate: 0,
                                price: shippingCosts,
                            },
                        ],
                        taxRules: [
                            {
                                taxRate: 0,
                                percentage: 100,
                            },
                        ],
                    },
                },
            ],
            transactions: [
                {
                    paymentMethodId: paymentMethod.id,
                    stateId: transactionState.id,
                    amount: {
                        unitPrice: totalPrice,
                        totalPrice: totalPrice,
                        quantity: 1,
                        calculatedTaxes: [
                            {
                                tax: 0,
                                taxRate: 0,
                                price: 0,
                            },
                        ],
                        taxRules: [
                            {
                                taxRate: 0,
                                percentage: 100,
                            },
                        ],
                    },
                },
            ],
        }

        return Object.assign({}, basicOrder, overrides);
    }

    getBasicProductLineItemStruct(lineItem: SimpleLineItem) {
        const unitPrice = lineItem.product.price[0].gross || 10;
        const totalPrice = unitPrice * (lineItem.quantity || 1);

        return {
            productId: lineItem.product.id,
            referencedId: lineItem.product.id,
            payload: {
                productNumber: lineItem.product.productNumber,
            },
            identifier: lineItem.product.id,
            type: 'product',
            label: lineItem.product.name,
            quantity: lineItem.quantity || 1,
            position: lineItem.position || 1,
            price: {
                unitPrice: unitPrice,
                totalPrice: totalPrice,
                quantity: lineItem.quantity,
                calculatedTaxes: [{
                    tax: 0,
                    taxRate: 0,
                    price: totalPrice,
                }],
                taxRules: [{
                    taxRate: 0,
                    percentage: 100,
                }],
            },
            priceDefinition: {
                type: 'quantity',
                price: totalPrice,
                quantity: lineItem.quantity || 1,
                taxRules: [{
                    taxRate: 0,
                    percentage: 100,
                }],
                listPrice: 8.00,
                isCalculated: true,
                referencePriceDefinition: null,
            },
        };
    }

    getBasicPromotionStruct(
        salesChannelId = this.defaultSalesChannel.id,
        overrides: Partial<Promotion> = {},
    ): Partial<Promotion> {

        const promotionCode = `${this.IdProvider.getIdPair().id}`;
        const promotionName = `${this.namePrefix}Promotion-${promotionCode}${this.nameSuffix}`;

        const basicPromotion = {
            name: promotionName,
            active: true,
            maxRedemptionsGlobal: 100,
            maxRedemptionsPerCustomer: 10,
            priority: 1,
            exclusive: false,
            useCodes: true,
            useIndividualCodes: false,
            useSetGroups: false,
            preventCombination: true,
            customerRestriction: false,
            code: promotionCode,
            discounts: [{
                scope: 'cart',
                type: 'percentage',
                value: 10,
                considerAdvancedRules: false,
            }],
            salesChannels: [{
                salesChannelId: salesChannelId,
                priority: 1,
            }],
        }

        return Object.assign({}, basicPromotion, overrides);
    }
}