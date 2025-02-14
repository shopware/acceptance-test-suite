import { createRandomImage } from './ImageHelper';
import { getLanguageData, getSnippetSetId, getPromotionWithDiscount } from './ShopwareDataHelpers';
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
    Manufacturer,
    OrderDelivery,
    OrderLineItem,
    PropertyGroupOption,
    DeliveryTime,
    CmsPage,
    Country,
    CustomerGroup,
    SalesChannelAnalytics,
    SalesChannelDomain,
    Language,
    CustomFieldSet,
    CustomField,
    Tax,
    ProductCrossSelling,
    ProductReview,
} from '../types/ShopwareTypes';
import { expect } from '@playwright/test';
import { clearDelayedCache } from './Cache';

export interface SalesChannelRecord {
    salesChannelId: string;
    field: string;
}

export interface CreatedRecord {
    resource: string;
    payload: Record<string, string>;
}

export interface SimpleLineItem {
    product: Product | Promotion;
    quantity?: number;
    position?: number;
    overrides?: Partial<OrderLineItem>;
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
    private highPriorityEntities = ['order', 'product', 'product_cross_selling', 'landing_page', 'shipping_method', 'sales_channel_domain', 'sales_channel_currency', 'sales_channel_country', 'sales_channel_payment_method', 'customer'];

    /**
     * A registry of all created records.
     *
     * @private
     */
    private createdRecords: CreatedRecord[] = [];

    private restoreSystemConfig: Record<string, unknown> = {};

    /**
     * A registry of all created sales channel records.
     *
     * @private
     */
    private createdSalesChannelRecords: SalesChannelRecord[] = [];

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
    async createBasicProduct(overrides: Partial<Product> = {}, taxId = this.defaultTaxId, currencyId = this.defaultCurrencyId): Promise<Product> {
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
        expect(productResponse.ok()).toBeTruthy();

        const { data: product } = (await productResponse.json()) as { data: Product };

        this.addCreatedRecord('product', product.id);

        return product;
    }

    /**
     * Creates a basic product cross-selling entity without products.
     *
     * @param productId - The uuid of the product to which the pproduct cross-selling should be assigned.
     * @param overrides - Specific data overrides that will be applied to the property group data struct.
     */
    async createProductCrossSelling(productId: string, overrides: Partial<ProductCrossSelling> = {}): Promise<ProductCrossSelling> {
        const crossSellingStruct = this.getBasicCrossSellingStruct(productId, overrides);

        const response = await this.AdminApiClient.post('product-cross-selling?_response=detail', {
            data: crossSellingStruct,
        });
        expect(response.ok()).toBeTruthy();

        const { data: productCrossSelling } = (await response.json()) as { data: ProductCrossSelling };

        this.addCreatedRecord('product_cross_selling', productCrossSelling.id);

        return productCrossSelling;
    }

    /**
     * Creates a basic product with one randomly generated image.
     * The product will be added to the default sales channel category if configured.
     *
     * @param overrides - Specific data overrides that will be applied to the product data struct.
     * @param taxId - The uuid of the tax rule to use for the product pricing.
     * @param currencyId - The uuid of the currency to use for the product pricing.
     */
    async createProductWithImage(overrides: Partial<Product> = {}, taxId = this.defaultTaxId, currencyId = this.defaultCurrencyId): Promise<Product> {
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
    async createDigitalProduct(content = 'Lorem ipsum dolor', overrides: Partial<Product> = {}, taxId = this.defaultTaxId, currencyId = this.defaultCurrencyId): Promise<Product> {
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
    async createProductWithPriceRange(overrides: Partial<Product> = {}, taxId = this.defaultTaxId, currencyId = this.defaultCurrencyId): Promise<Product> {
        if (!currencyId) {
            return Promise.reject('Missing currency ID for creating product.');
        }

        const rule = await this.getRule('Always valid (Default)');

        const priceRange = this.getProductPriceRangeStruct(currencyId, rule.id);
        const productOverrides = Object.assign({}, priceRange, overrides);

        return this.createBasicProduct(productOverrides, taxId, currencyId);
    }

    /**
     * Creates basic variant products based on property group.
     *
     * @param parentProduct Parent product of the variants
     * @param propertyGroups Property group collection which contain options
     * @param overrides - Specific data overrides that will be applied to the variant data struct.
     */
    async createVariantProducts(parentProduct: Product, propertyGroups: PropertyGroup[], overrides: Partial<Product> = {}): Promise<Product[]> {
        const productVariantCandidates: Record<string, string>[][] = [];

        for (const propertyGroup of propertyGroups) {
            const propertyGroupOptions = await this.getPropertyGroupOptions(propertyGroup.id);
            const propertyGroupOptionsCollection: Record<string, string>[] = [];
            for (const propertyGroupOption of propertyGroupOptions) {
                propertyGroupOptionsCollection.push({ id: propertyGroupOption.id });

                const productConfiguratorResponse = await this.AdminApiClient.post('product-configurator-setting?_response=detail', {
                    data: {
                        id: this.IdProvider.getIdPair().uuid,
                        productId: parentProduct.id,
                        optionId: propertyGroupOption.id,
                    },
                });
                expect(productConfiguratorResponse.ok()).toBeTruthy();
            }
            productVariantCandidates.push(propertyGroupOptionsCollection);
        }

        const productVariantCombinations = this.combineAll(productVariantCandidates);
        const variantProducts: Product[] = [];
        let index = 1;

        for (const productVariantCombination of productVariantCombinations) {
            const variantOverrides = {
                parentId: parentProduct.id,
                productNumber: parentProduct.productNumber + '.' + index,
                options: productVariantCombination,
            };

            const overrideCollection = Object.assign({}, overrides, variantOverrides);
            variantProducts.push(await this.createBasicProduct(overrideCollection));
            index++;
        }

        await this.AdminApiClient.post('_action/indexing/product.indexer?_response=detail', {
            data: {
                offset: 0,
            },
        });

        return variantProducts;
    }

    /**
     * Creates a product review
     *
     * @param productId - The uuid of the product to which the review should be assigned.
     * @param overrides - Specific data overrides that will be applied to the review data struct.
     */
    async createProductReview(productId: string, overrides: Partial<ProductReview> = {}): Promise<ProductReview> {
        const basicProductReview = this.getBasicProductReviewStruct(productId, overrides);

        const productReviewResponse = await this.AdminApiClient.post('product-review?_response=detail', {
            data: Object.assign({}, basicProductReview, overrides),
        });
        expect(productReviewResponse.ok()).toBeTruthy();
        const { data: review } = (await productReviewResponse.json()) as { data: ProductReview };
        this.addCreatedRecord('product_review', review.id);
        return review;
    }

    /**
     * Creates a basic manufacturer without images or other special configuration.
     *
     * @param overrides - Specific data overrides that will be applied to the manufacturer data struct.
     */
    async createBasicManufacturer(overrides: Partial<Manufacturer> = {}): Promise<Manufacturer> {
        const basicManufacturer = this.getBasicManufacturerStruct(overrides);

        const manufacturerResponse = await this.AdminApiClient.post('./product-manufacturer?_response=detail', {
            data: basicManufacturer,
        });
        expect(manufacturerResponse.ok()).toBeTruthy();

        const { data: manufacturer } = (await manufacturerResponse.json()) as { data: Manufacturer };

        this.addCreatedRecord('product_manufacturer', manufacturer.id);

        return manufacturer;
    }

    /**
     * Creates a basic manufacturer with one randomly generated image.
     *
     * @param overrides - Specific data overrides that will be applied to the manufacturer data struct.
     */
    async createManufacturerWithImage(overrides: Partial<Manufacturer> = {}): Promise<Manufacturer> {
        const manufacturer = await this.createBasicManufacturer(overrides);
        const media = await this.createMediaPNG();

        await this.assignManufacturerMedia(manufacturer.id, media.id);

        return manufacturer;
    }

    /**
     * Creates a basic product category to assign products to.
     *
     * @param parentId - The uuid of the parent category.
     * @param overrides - Specific data overrides that will be applied to the category data struct.
     */
    async createCategory(overrides: Partial<Category> = {}, parentId = this.defaultCategoryId): Promise<Category> {
        const basicCategory = this.getBasicCategoryStruct(overrides, parentId);

        const response = await this.AdminApiClient.post('category?_response=detail', {
            data: basicCategory,
        });
        expect(response.ok()).toBeTruthy();

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
    async createMediaPNG(width = 800, height = 600): Promise<Media> {
        const image = createRandomImage(width, height);
        const media = await this.createMediaResource();
        const filename = `${this.namePrefix}Media-${media.id}${this.nameSuffix}`;

        const response = await this.AdminApiClient.post(`_action/media/${media.id}/upload?extension=png&fileName=${filename}`, {
            data: Buffer.from(image.toBuffer()),
            headers: { 'content-type': 'image/png' },
        });
        expect(response.ok()).toBeTruthy();

        this.addCreatedRecord('media', media.id);

        return media;
    }

    /**
     * Creates a new media resource containing a text file.
     *
     * @param content - The content of the text file.
     */
    async createMediaTXT(content = 'Lorem ipsum dolor'): Promise<Media> {
        const media = await this.createMediaResource();
        const filename = `${this.namePrefix}Media-${media.id}${this.nameSuffix}`;

        const response = await this.AdminApiClient.post(`_action/media/${media.id}/upload?extension=txt&fileName=${filename}`, {
            data: content,
            headers: { 'content-type': 'application/octet-stream' },
        });
        expect(response.ok()).toBeTruthy();

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
        expect(mediaResponse.ok()).toBeTruthy();

        const { data: media } = (await mediaResponse.json()) as { data: Media };

        return media;
    }

    /**
     * Creates a new property group with color type options.
     *
     * @param overrides - Specific data overrides that will be applied to the property group data struct.
     */
    async createColorPropertyGroup(overrides: Partial<PropertyGroup> = {}): Promise<PropertyGroup> {
        const id = this.IdProvider.getIdPair().id;
        const colorPropertyGroup = {
            name: `${this.namePrefix}Color-${id}${this.nameSuffix}`,
            description: 'Color',
            displayType: 'color',
            sortingType: 'name',
            options: [
                {
                    name: 'Blue',
                    colorHexCode: '#2148d6',
                },
                {
                    name: 'Red',
                    colorHexCode: '#bf0f2a',
                },
                {
                    name: 'Green',
                    colorHexCode: '#12bf0f',
                },
            ],
        };

        const propertyGroupResponse = await this.AdminApiClient.post('property-group?_response=detail', {
            data: Object.assign({}, colorPropertyGroup, overrides),
        });
        expect(propertyGroupResponse.ok()).toBeTruthy();

        const { data: propertyGroup } = (await propertyGroupResponse.json()) as { data: PropertyGroup };

        this.addCreatedRecord('property_group', propertyGroup.id);

        return propertyGroup;
    }

    /**
     * Creates a new property group with text type options.
     *
     * @param overrides - Specific data overrides that will be applied to the property group data struct.
     */
    async createTextPropertyGroup(overrides: Partial<PropertyGroup> = {}): Promise<PropertyGroup> {
        const id = this.IdProvider.getIdPair().id;
        const textPropertyGroup = {
            name: `${this.namePrefix}Size-${id}${this.nameSuffix}`,
            description: 'Size',
            displayType: 'text',
            sortingType: 'name',
            options: [
                {
                    name: 'Small',
                },
                {
                    name: 'Medium',
                },
                {
                    name: 'Large',
                },
            ],
        };

        const propertyGroupResponse = await this.AdminApiClient.post('property-group?_response=detail', {
            data: Object.assign({}, textPropertyGroup, overrides),
        });
        expect(propertyGroupResponse.ok()).toBeTruthy();

        const { data: propertyGroup } = (await propertyGroupResponse.json()) as { data: PropertyGroup };

        this.addCreatedRecord('property_group', propertyGroup.id);

        return propertyGroup;
    }

    /**
     * Creates a new tag which can be assigned to other entities.
     *
     * @param tagName - The name of the tag.
     */
    async createTag(tagName: string): Promise<Tag> {
        const response = await this.AdminApiClient.post('tag?_response=detail', {
            data: {
                id: this.IdProvider.getIdPair().uuid,
                name: tagName,
            },
        });
        expect(response.ok()).toBeTruthy();

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
    async createCustomer(overrides: Partial<Customer> = {}, salutationKey = 'mr', salesChannel: SalesChannel = this.defaultSalesChannel): Promise<Customer> {
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
        expect(response.ok()).toBeTruthy();

        const customerData = (await response.json()) as { data: Customer };

        let customer: Customer;

        if (typeof basicCustomerStruct.password !== 'string') {
            customer = { ...customerData.data };
        } else {
            customer = {
                ...customerData.data,
                password: basicCustomerStruct.password,
            };
        }

        this.addCreatedRecord('customer', customer.id);

        return customer;
    }

    /**
     * Creates a new order. This order is created on pure data and prices are not guaranteed to be calculated correctly.
     *
     * @param lineItems - Products that should be added to the order.
     * @param customer - The customer to which the order should be assigned.
     * @param overrides - Specific data overrides that will be applied to the order data struct.
     * @param salesChannel - The sales channel in which the order should be created.
     */
    async createOrder(lineItems: SimpleLineItem[], customer: Customer, overrides: Partial<Order> = {}, salesChannel: SalesChannel = this.defaultSalesChannel): Promise<Order> {
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
            overrides
        );

        const orderResponse = await this.AdminApiClient.post('order?_response=detail', {
            data: basicOrder,
        });
        expect(orderResponse.ok()).toBeTruthy();

        const { data: order } = (await orderResponse.json()) as { data: Order };

        this.addCreatedRecord('order', order.id);

        return order;
    }

    /**
     * Creates a new promotion with a promotion code and only single discount option.
     *
     * @param overrides - Specific data overrides that will be applied to the promotion data struct.
     * @param salesChannelId - The uuid of the sales channel in which the promotion should be active.
     */
    async createPromotionWithCode(overrides: Partial<Promotion> = {}, salesChannelId = this.defaultSalesChannel.id): Promise<Promotion> {
        const basicPromotion = this.getBasicPromotionStruct(salesChannelId, overrides);

        // Create a new promotion with code via admin API context
        const promotionResponse = await this.AdminApiClient.post('promotion?_response=detail', {
            data: basicPromotion,
        });
        expect(promotionResponse.ok()).toBeTruthy();

        const { data: promotion } = (await promotionResponse.json()) as { data: Promotion };

        const promotionWithDiscount = await getPromotionWithDiscount(promotion.id, this.AdminApiClient);

        this.addCreatedRecord('promotion', promotion.id);

        return promotionWithDiscount;
    }

    /**
     * Creates a new basic payment method.
     *
     * @param overrides - Specific data overrides that will be applied to the payment method data struct.
     */
    async createBasicPaymentMethod(overrides: Partial<PaymentMethod> = {}): Promise<PaymentMethod> {
        const basicPaymentMethod = this.getBasicPaymentMethodStruct(overrides);

        const paymentMethodResponse = await this.AdminApiClient.post('payment-method?_response=detail', {
            data: basicPaymentMethod,
        });
        expect(paymentMethodResponse.ok()).toBeTruthy();

        const { data: paymentMethod } = (await paymentMethodResponse.json()) as { data: PaymentMethod };

        this.addCreatedRecord('payment_method', paymentMethod.id);

        return paymentMethod;
    }

    /**
     * Creates a payment method with one randomly generated image.
     *
     * @param overrides - Specific data overrides that will be applied to the payment method data struct.
     */
    async createPaymentMethodWithImage(overrides: Partial<PaymentMethod> = {}): Promise<PaymentMethod> {
        const paymentMethod = await this.createBasicPaymentMethod(overrides);
        const media = await this.createMediaPNG();

        await this.assignPaymentMethodMedia(paymentMethod.id, media.id);

        return paymentMethod;
    }

    /**
     * Creates a new basic shipping method with random delivery time.
     *
     * @param overrides - Specific data overrides that will be applied to the shipping method data struct.
     */
    async createBasicShippingMethod(overrides: Partial<ShippingMethod> = {}): Promise<ShippingMethod> {
        const deliveryTime = await this.getAllDeliveryTimeResources();

        overrides.availabilityRuleId ??= (await this.getRule('Always valid (Default)')).id;
        const basicShippingMethod = this.getBasicShippingMethodStruct(deliveryTime[0].id, overrides);

        const shippingMethodResponse = await this.AdminApiClient.post('shipping-method?_response=detail', {
            data: basicShippingMethod,
        });
        expect(shippingMethodResponse.ok()).toBeTruthy();

        const { data: shippingMethod } = (await shippingMethodResponse.json()) as { data: ShippingMethod };

        this.addCreatedRecord('shipping_method', shippingMethod.id);

        return shippingMethod;
    }

    /**
     * Creates a shipping method with one randomly generated image.
     *
     * @param overrides - Specific data overrides that will be applied to the shipping method data struct.
     */
    async createShippingMethodWithImage(overrides: Partial<ShippingMethod> = {}): Promise<ShippingMethod> {
        const shippingMethod = await this.createBasicShippingMethod(overrides);
        const media = await this.createMediaPNG();

        await this.assignShippingMethodMedia(shippingMethod.id, media.id);

        return shippingMethod;
    }

    /**
     * Creates a new basic rule with the condition cart amount >= 1.
     *
     * @param overrides - Specific data overrides that will be applied to the payment method data struct.
     */
    async createBasicRule(overrides: Partial<Rule> = {}, conditionType = 'cartCartAmount', operator = '>=', amount = 1): Promise<Rule> {
        const basicRule = this.getBasicRuleStruct(overrides, conditionType, operator, amount);

        const ruleResponse = await this.AdminApiClient.post('rule?_response=detail', {
            data: basicRule,
        });
        expect(ruleResponse.ok()).toBeTruthy();

        const { data: rule } = (await ruleResponse.json()) as { data: Rule };

        this.addCreatedRecord('rule', rule.id);

        return rule;
    }

    /**
     * Creates a new basic page layout.
     *
     * @param cmsPageType - The type of the cms page layout (page/landingpage/product_detail/product_list).
     * @param overrides - Specific data overrides that will be applied to the cms page layout data struct.
     */
    async createBasicPageLayout(cmsPageType: string, overrides: Partial<CmsPage> = {}): Promise<CmsPage> {
        const basicLayout = this.getBasicCmsStruct(cmsPageType, overrides);

        const layoutResponse = await this.AdminApiClient.post('cms-page?_response=detail', {
            data: basicLayout,
        });
        expect(layoutResponse.ok()).toBeTruthy();

        const { data: layout } = (await layoutResponse.json()) as { data: CmsPage };

        this.addCreatedRecord('cms_page', layout.id);

        return layout;
    }

    /**
     * Creates a random country
     *
     * @param overrides - Specific data overrides that will be applied to the country data struct.
     */
    async createCountry(overrides: Partial<Country> = {}): Promise<Country> {
        const basicCountry = this.getCountryStruct(overrides);

        const countryResponse = await this.AdminApiClient.post('country?_response=detail', {
            data: basicCountry,
        });
        expect(countryResponse.ok()).toBeTruthy();

        const { data: country } = (await countryResponse.json()) as { data: Country };

        this.addCreatedRecord('country', country.id);

        return country;
    }

    /**
     * Creates a random currency with default rounding of 2 decimals
     *
     * @param roundingDecimals - Decimals of the rounding shown in Storefront, default value 2
     * @param overrides - Specific data overrides that will be applied to the currency data struct.
     */
    async createCurrency(overrides: Partial<Currency> = {}, roundingDecimals = 2): Promise<Currency> {
        const basicCurrency = this.getCurrencyStruct(overrides, roundingDecimals);

        const currencyResponse = await this.AdminApiClient.post('currency?_response=detail', {
            data: basicCurrency,
        });
        expect(currencyResponse.ok()).toBeTruthy();

        const { data: currency } = (await currencyResponse.json()) as { data: Currency };

        this.addCreatedRecord('currency', currency.id);

        return currency;
    }

    /**
     * Creates a random customer group
     *
     * @param overrides - Specific data overrides that will be applied to the customer group data struct.
     */
    async createCustomerGroup(overrides: Partial<CustomerGroup> = {}): Promise<CustomerGroup> {
        const basicCustomerGroup = this.getBasicCustomerGroupStruct(overrides);

        const response = await this.AdminApiClient.post('customer-group?_response=detail', {
            data: basicCustomerGroup,
        });
        expect(response.ok()).toBeTruthy();

        const { data: customerGroup } = (await response.json()) as { data: CustomerGroup };

        this.addCreatedRecord('customer_group', customerGroup.id);

        return customerGroup;
    }

    /**
     * Set system config for default sales channel
     *
     * @param configs - Key value pairs to set
     */
    async setSystemConfig(configs: Record<string, unknown>): Promise<void> {
        const response = await this.AdminApiClient.post(`_action/system-config?_response=detail&salesChannelId=${this.defaultSalesChannel.id}`, {
            data: configs,
        });
        expect(response.ok()).toBeTruthy();

        // we just unset all configs with this.defaultSalesChannel.id
        // the defaults should take effect again
        for (const key of Object.keys(configs)) {
            this.restoreSystemConfig[key] = null;
        }

        await this.clearCaches();
    }

    /**
     * Creates a random sales channel analytics entity
     *
     * @param overrides - Specific data overrides that will be applied to the sales channel analytics data struct.
     */
    async createSalesChannelAnalytics(overrides: Partial<SalesChannelAnalytics> = {}): Promise<SalesChannelAnalytics> {
        const basicSalesChannelAnalyticsStruct = this.getSalesChannelAnalyticsStruct(overrides);

        const response = await this.AdminApiClient.post('sales-channel-analytics?_response=detail', {
            data: basicSalesChannelAnalyticsStruct,
        });
        expect(response.ok()).toBeTruthy();

        const { data: salesChannelAnalytics } = (await response.json()) as { data: SalesChannelAnalytics };

        this.addCreatedRecord('sales_channel_analytics', salesChannelAnalytics.id);

        return salesChannelAnalytics;
    }

    /**
     * Creates a custom field
     *
     * @param customFieldSetId - The uuid of the custom field set.
     * @param overrides - Specific data overrides that will be applied to the custom field data struct.
     */
    async createCustomField(customFieldSetId: string, overrides: Partial<CustomField> = {}): Promise<CustomField> {
        const customFieldStruct = this.getBasicCustomFieldStruct(overrides);

        const response = await this.AdminApiClient.post(`custom-field-set/${customFieldSetId}/custom-fields?_response=detail`, {
            data: customFieldStruct,
        });
        expect(response.ok()).toBeTruthy();

        const { data: customField } = (await response.json()) as { data: CustomField };

        this.addCreatedRecord('custom_field', customField.id);

        return customField;
    }

    /**
     * Creates a custom field set
     *
     * @param overrides - Specific data overrides that will be applied to the custom field set data struct.
     */
    async createCustomFieldSet(overrides: Partial<CustomFieldSet> = {}): Promise<CustomFieldSet> {
        const customFieldSetStruct = this.getBasicCustomFieldSetStruct(overrides);

        const response = await this.AdminApiClient.post('custom-field-set?_response=detail', {
            data: customFieldSetStruct,
        });
        expect(response.ok()).toBeTruthy();

        const { data: customFieldSet } = (await response.json()) as { data: CustomFieldSet };

        this.addCreatedRecord('custom_field_set', customFieldSet.id);

        return customFieldSet;
    }

    /**
     * Creates a new domain for a sales channel.
     *
     * @param overrides - Specific data overrides that will be applied to the sales channel domain data struct.
     */
    async createSalesChannelDomain(overrides: Partial<SalesChannelDomain> = {}): Promise<SalesChannelDomain> {
        const salesChannelId = this.defaultSalesChannel.id;
        const currencyId = this.defaultCurrencyId;
        const languageId = this.defaultLanguageId;
        const snippetSetId = await getSnippetSetId('en-GB', this.AdminApiClient);

        const salesChannelDomainStruct = this.getSalesChannelDomainStruct(salesChannelId, currencyId, languageId, snippetSetId, overrides);

        const response = await this.AdminApiClient.post(`sales-channel-domain?_response=detail`, {
            data: salesChannelDomainStruct,
        });

        expect(response.ok()).toBeTruthy();

        const { data: salesChannelDomain } = (await response.json()) as { data: SalesChannelDomain };

        this.addCreatedRecord('sales_channel_domain', salesChannelDomain.id);

        return salesChannelDomain;
    }

    /**
     * Creates a new tax rate (19%) with a random name.
     *
     * @param overrides - Specific data overrides that will be applied to the tax data struct.
     */
    async createTaxRate(overrides: Partial<Tax> = {}): Promise<Tax> {
        const taxStruct = this.getTaxStruct(overrides);

        const response = await this.AdminApiClient.post('tax?_response=detail', {
            data: taxStruct,
        });
        expect(response.ok()).toBeTruthy();

        const { data: tax } = (await response.json()) as { data: Tax };

        this.addCreatedRecord('tax', tax.id);

        return tax;
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
        expect(downloadResponse.ok()).toBeTruthy();

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
        expect(mediaResponse.ok()).toBeTruthy();

        const { data: productMedia } = await mediaResponse.json();

        return productMedia;
    }

    /**
     * Assigns a manufacturer to a product.
     *
     * @param productId - The uuid of the product.
     * @param manufacturerId - The uuid of the manufacturer.
     */
    async assignProductManufacturer(productId: string, manufacturerId: string) {
        await this.AdminApiClient.patch(`product/${productId}?_response=basic`, {
            data: {
                manufacturerId: manufacturerId,
            },
        });
    }

    /**
     * Assigns a country to a currency with default roundings of 2.
     *
     * @param currencyId - The uuid of currency.
     * @param countryId - The uuid of country.
     * @param roundingDecimals - The roundings of item and total values in storefront, default 2 decimals
     */
    async assignCurrencyCountryRounding(currencyId: string, countryId: string, roundingDecimals = 2) {
        const syncCurrencyCountryRoundingResponse = await this.AdminApiClient.post('./_action/sync', {
            data: {
                'write-currency-country-rounding': {
                    entity: 'currency_country_rounding',
                    action: 'upsert',
                    payload: [
                        {
                            id: this.IdProvider.getIdPair().uuid,
                            currencyId: currencyId,
                            countryId: countryId,
                            itemRounding: {
                                decimals: roundingDecimals,
                                interval: 0.01,
                                roundForNet: true,
                            },
                            totalRounding: {
                                decimals: roundingDecimals,
                                interval: 0.01,
                                roundForNet: true,
                            },
                        },
                    ],
                },
            },
        });
        expect(syncCurrencyCountryRoundingResponse.ok()).toBeTruthy();

        const { data: currencyCountry } = await syncCurrencyCountryRoundingResponse.json();

        return currencyCountry;
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
                categories: [
                    {
                        id: categoryId,
                    },
                ],
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
                tags: [
                    {
                        id: tagId,
                    },
                ],
            },
        });
    }

    /**
     * Assigns a media resource to a manufacturer as a logo.
     *
     * @param manufacturerId - The uuid of the manufacturer.
     * @param mediaId - The uuid of the media resource.
     */
    async assignManufacturerMedia(manufacturerId: string, mediaId: string) {
        const mediaResponse = await this.AdminApiClient.patch(`product-manufacturer/${manufacturerId}?_response=basic`, {
            data: {
                mediaId: mediaId,
            },
        });
        expect(mediaResponse.ok()).toBeTruthy();

        const { data: manufacturerMedia } = await mediaResponse.json();

        return manufacturerMedia;
    }

    /**
     * Assigns a manufacturer to a product.
     *
     * @deprecated - Use `assignProductManufacturer` instead.
     *
     * @param manufacturerId - The uuid of the manufacturer.
     * @param productId - The uuid of the product.
     */
    async assignManufacturerProduct(manufacturerId: string, productId: string) {
        await this.assignProductManufacturer(productId, manufacturerId);
    }

    /**
     * Assigns a currency to a sales channel.
     *
     * @param salesChannelId - The uuid of the sales channel.
     * @param currencyId - The uuid of the currency.
     */
    async assignSalesChannelCurrency(salesChannelId: string, currencyId: string) {
        const syncSalesChannelResponse = await this.AdminApiClient.post('./_action/sync', {
            data: {
                'write-sales-channel-currency': {
                    entity: 'sales_channel_currency',
                    action: 'upsert',
                    payload: [
                        {
                            salesChannelId: salesChannelId,
                            currencyId: currencyId,
                        },
                    ],
                },
            },
        });
        expect(syncSalesChannelResponse.ok()).toBeTruthy();

        const { data: salesChannel } = await syncSalesChannelResponse.json();

        this.addCreatedRecord('sales_channel_currency', {
            salesChannelId: salesChannelId,
            currencyId: currencyId,
        });

        return salesChannel;
    }

    /**
     * Assigns a sales channel analytics entity to a sales channel.
     *
     * @param salesChannelId - The uuid of the sales channel.
     * @param salesChannelAnalyticsId - The uuid of the sales channel analytics entity.
     */
    async assignSalesChannelAnalytics(salesChannelId: string, salesChannelAnalyticsId: string) {
        const syncSalesChannelResponse = await this.AdminApiClient.post('./_action/sync', {
            data: {
                'write-sales-channel-analytics': {
                    entity: 'sales_channel_analytics',
                    action: 'upsert',
                    payload: [
                        {
                            salesChannel: { id: salesChannelId },
                            id: salesChannelAnalyticsId,
                        },
                    ],
                },
            },
        });
        expect(syncSalesChannelResponse.ok()).toBeTruthy();

        const { data: salesChannel } = (await syncSalesChannelResponse.json()) as { data: SalesChannel };

        this.addCreatedSalesChannelRecord(salesChannelId, 'analyticsId');

        return salesChannel;
    }

    /**
     * Assigns a country to a sales channel.
     *
     * @param salesChannelId - The uuid of the sales channel.
     * @param countryId - The uuid of the country.
     */
    async assignSalesChannelCountry(salesChannelId: string, countryId: string) {
        const syncSalesChannelResponse = await this.AdminApiClient.post('./_action/sync', {
            data: {
                'write-sales-channel-country': {
                    entity: 'sales_channel_country',
                    action: 'upsert',
                    payload: [
                        {
                            salesChannelId: salesChannelId,
                            countryId: countryId,
                        },
                    ],
                },
            },
        });
        expect(syncSalesChannelResponse.ok()).toBeTruthy();

        const { data: salesChannel } = await syncSalesChannelResponse.json();

        this.addCreatedRecord('sales_channel_country', {
            salesChannelId: salesChannelId,
            countryId: countryId,
        });

        return salesChannel;
    }

    /**
     * Assigns a language to a sales channel.
     *
     * @param salesChannelId - The uuid of the sales channel.
     * @param languageId - The uuid of the language.
     */
    async assignSalesChannelLanguage(salesChannelId: string, languageId: string) {
        const syncSalesChannelResponse = await this.AdminApiClient.post('./_action/sync', {
            data: {
                'write-sales-channel-language': {
                    entity: 'sales_channel_language',
                    action: 'upsert',
                    payload: [
                        {
                            salesChannelId: salesChannelId,
                            languageId: languageId,
                        },
                    ],
                },
            },
        });
        expect(syncSalesChannelResponse.ok()).toBeTruthy();

        const { data: salesChannel } = await syncSalesChannelResponse.json();

        this.addCreatedRecord('sales_channel_language', {
            salesChannelId: salesChannelId,
            languageId: languageId,
        });

        return salesChannel;
    }

    /**
     * Assigns a payment method to a sales channel.
     *
     * @param salesChannelId - The uuid of the sales channel.
     * @param paymentMethodId - The uuid of the currency.
     */
    async assignSalesChannelPaymentMethod(salesChannelId: string, paymentMethodId: string) {
        const syncSalesChannelResponse = await this.AdminApiClient.post('./_action/sync', {
            data: {
                'write-sales-channel-payment-method': {
                    entity: 'sales_channel_payment_method',
                    action: 'upsert',
                    payload: [
                        {
                            salesChannelId: salesChannelId,
                            paymentMethodId: paymentMethodId,
                        },
                    ],
                },
            },
        });
        expect(syncSalesChannelResponse.ok()).toBeTruthy();

        const { data: salesChannel } = await syncSalesChannelResponse.json();

        this.addCreatedRecord('sales_channel_payment_method', {
            salesChannelId: salesChannelId,
            paymentMethodId: paymentMethodId,
        });

        return salesChannel;
    }

    /**
     * Assigns a media resource to a payment method as a logo.
     *
     * @param paymentMethodId - The uuid of the payment method.
     * @param mediaId - The uuid of the media resource.
     */
    async assignPaymentMethodMedia(paymentMethodId: string, mediaId: string) {
        const paymentMethodResponse = await this.AdminApiClient.patch(`payment-method/${paymentMethodId}?_response=basic`, {
            data: {
                mediaId: mediaId,
            },
        });
        expect(paymentMethodResponse.ok()).toBeTruthy();

        const { data: paymentMethodMedia } = await paymentMethodResponse.json();

        return paymentMethodMedia;
    }

    /**
     * Assigns a media resource to a shipping method as a logo.
     *
     * @param shippingMethodId - The uuid of the shipping method.
     * @param mediaId - The uuid of the media resource.
     */
    async assignShippingMethodMedia(shippingMethodId: string, mediaId: string) {
        const shippingMethodResponse = await this.AdminApiClient.patch(`shipping-method/${shippingMethodId}?_response=basic`, {
            data: {
                mediaId: mediaId,
            },
        });
        expect(shippingMethodResponse.ok()).toBeTruthy();

        const { data: shippingMethodMedia } = await shippingMethodResponse.json();

        return shippingMethodMedia;
    }

    /**
     * Retrieves a language based on its code.
     * @param languageCode
     */
    async getLanguageData(languageCode: string): Promise<Language> {
        return await getLanguageData(languageCode, this.AdminApiClient);
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
                filter: [
                    {
                        type: 'equals',
                        field: 'isoCode',
                        value: isoCode,
                    },
                ],
            },
        });
        expect(currencyResponse.ok()).toBeTruthy();

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
                filter: [
                    {
                        type: 'equals',
                        field: 'name',
                        value: name,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

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
                filter: [
                    {
                        type: 'equals',
                        field: 'name',
                        value: name,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

        const { data: result } = (await response.json()) as { data: ShippingMethod[] };

        return result[0];
    }

    /**
     * Retrieves all delivery time resources.
     */
    async getAllDeliveryTimeResources(): Promise<DeliveryTime[]> {
        const response = await this.AdminApiClient.get('delivery-time');
        expect(response.ok()).toBeTruthy();

        const { data: deliveryTimeResources } = (await response.json()) as { data: DeliveryTime[] };

        return deliveryTimeResources;
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
                filter: [
                    {
                        type: 'equals',
                        field: 'name',
                        value: name,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

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
        expect(response.ok()).toBeTruthy();

        const { data: address } = (await response.json()) as { data: CustomerAddress };

        return address;
    }

    /**
     * Retrieves a customer by its email address.
     *
     * @param email - The email address of the customer.
     * @returns The customer object.
     */
    async getCustomerByEmail(email: string): Promise<Customer> {
        const response = await this.AdminApiClient.post('search/customer', {
            data: {
                limit: 1,
                filter: [
                    {
                        type: 'equals',
                        field: 'email',
                        value: email,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

        const { data: result } = (await response.json()) as { data: Customer[] };

        return result[0];
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
                filter: [
                    {
                        type: 'equals',
                        field: 'salutationKey',
                        value: key,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

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
                filter: [
                    {
                        type: 'equals',
                        field: 'technicalName',
                        value: name,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

        const { data: result } = (await response.json()) as { data: StateMachine[] };

        return result[0];
    }

    /**
     * Retrieves the state of a state machine.
     *
     * @param stateMachineId - The uuid of the state machine.
     * @param stateName - The name of the state. Default is "open".
     */
    async getStateMachineState(stateMachineId: string, stateName: 'open' | 'completed' | 'in_progress' | 'cancelled' = 'open'): Promise<StateMachineState> {
        const response = await this.AdminApiClient.post('search/state-machine-state', {
            data: {
                limit: 1,
                filter: [
                    {
                        type: 'equals',
                        field: 'stateMachineId',
                        value: stateMachineId,
                    },
                    {
                        type: 'equals',
                        field: 'technicalName',
                        value: stateName,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

        const { data: result } = (await response.json()) as { data: StateMachineState[] };

        return result[0];
    }

    /**
     * Retrieves all corresponding property group options.
     *
     * @param propertyGroupId - The uuid of the property group.
     */
    async getPropertyGroupOptions(propertyGroupId: string): Promise<PropertyGroupOption[]> {
        const response = await this.AdminApiClient.post('search/property-group-option', {
            data: {
                limit: 50,
                filter: [
                    {
                        type: 'equals',
                        field: 'groupId',
                        value: propertyGroupId,
                    },
                ],
            },
        });
        expect(response.ok()).toBeTruthy();

        const { data: result } = (await response.json()) as { data: PropertyGroupOption[] };

        return result;
    }

    /**
     * Retrieves a customer group by its id.
     *
     * @param customerGroupId - The id of the property group.
     */
    async getCustomerGroupById(customerGroupId: string): Promise<CustomerGroup> {
        const response = await this.AdminApiClient.get(`customer-group/${customerGroupId}`);
        expect(response.ok()).toBeTruthy();

        const { data: customerGroup } = (await response.json()) as { data: CustomerGroup };

        return customerGroup;
    }

    /**
     * Retrieves list of customer groups
     */
    async getCustomerGroups(): Promise<CustomerGroup[]> {
        const response = await this.AdminApiClient.get('customer-group');
        expect(response.ok()).toBeTruthy();

        const { data: customerGroups } = (await response.json()) as { data: CustomerGroup[] };

        return customerGroups;
    }

    /**
     * Retrieves a language by its id.
     *
     * @param languageId - The id of the property group.
     */
    async getLanguageById(languageId: string): Promise<Language> {
        const response = await this.AdminApiClient.get(`language/${languageId}`);
        expect(response.ok()).toBeTruthy();

        const { data: language } = (await response.json()) as { data: Language };

        return language;
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
     * Adds a sales channel related property to the registry of created sales channel records.
     * The property added to the registry will be overridden with null value by the cleanup call.
     *
     * @param salesChannelId - The sales channel id where the property pair is located
     * @param field - The database field which has to be overridden
     */
    addCreatedSalesChannelRecord(salesChannelId: string, field: string) {
        this.createdSalesChannelRecords.push({
            salesChannelId: salesChannelId,
            field: field,
        });
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
            return null;
        }

        const deleteOperations: Record<string, SyncApiOperation> = {};
        const priorityDeleteOperations: Record<string, SyncApiOperation> = {};

        if (this.createdSalesChannelRecords) {
            for (const salesChannelRecord of this.createdSalesChannelRecords) {
                const salesChannelResponse = await this.AdminApiClient.patch(`sales-channel/${salesChannelRecord.salesChannelId}`, {
                    data: {
                        [salesChannelRecord.field]: null,
                    },
                });
                expect(salesChannelResponse.ok()).toBeTruthy();
            }
        }

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

        await this.AdminApiClient.post(`_action/system-config?_response=detail&salesChannelId=${this.defaultSalesChannel.id}`, {
            data: this.restoreSystemConfig,
        });

        await this.clearCaches();

        return this.AdminApiClient.post('_action/sync', {
            data: deleteOperations,
        });
    }

    isProduct(item: Product | Promotion): item is Product {
        return (item as Product).productNumber !== undefined;
    }

    isPromotion(item: Product | Promotion): item is Promotion {
        return (item as Promotion).code !== undefined;
    }

    /**
     * Convert a JS date object into a date-time compatible string.
     *
     * @param date - The JS date object from which the date-time should be retrieved.
     */
    convertDateTime(date: Date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    /**
     * Function that generates combinations from n number of arrays
     * with m number of elements in them.
     * @param array
     */
    combineAll = (array: Record<string, string>[][]) => {
        const result: Record<string, string>[][] = [];
        const max = array.length - 1;
        const helper = (tmpArray: Record<string, string>[], i: number) => {
            for (let j = 0, l = array[i].length; j < l; j++) {
                const copy = tmpArray.slice(0);
                copy.push(array[i][j]);
                if (i == max) result.push(copy);
                else helper(copy, i + 1);
            }
        };
        helper([], 0);
        return result;
    };

    /**
     * @deprecated Use `getCountry` instead.
     * Retrieves a country Id based on its iso2 code.
     *
     * @param iso2 - The iso2 code of the country, for example "DE".
     */
    async getCountryId(iso2: string): Promise<Country> {
        return await this.getCountry(iso2);
    }

    /**
     * Retrieves a country based on its iso2 code.
     *
     * @param iso2 - The iso2 code of the country, for example "DE".
     */
    async getCountry(iso2: string): Promise<Country> {
        const countryResponse = await this.AdminApiClient.post('search/country', {
            data: {
                limit: 1,
                filter: [
                    {
                        type: 'equals',
                        field: 'iso',
                        value: iso2,
                    },
                ],
            },
        });

        const { data: result } = (await countryResponse.json()) as { data: Country[] };

        return result[0];
    }

    getCountryStruct(overrides: Partial<Country> = {}): Partial<Country> {
        const { uuid: countryUuid, id: countryId } = this.IdProvider.getIdPair();

        const basicCountry = {
            id: countryUuid,
            name: 'Country-' + countryId,
            iso: '' + countryId.substring(0, 2),
            iso3: '' + countryId.substring(0, 3),
            active: true,
            shippingAvailable: true,
        };

        return Object.assign({}, basicCountry, overrides);
    }

    getCurrencyStruct(overrides: Partial<Currency> = {}, roundingDecimals: number): Partial<Currency> {
        const { uuid: currencyUuid, id: currencyId } = this.IdProvider.getIdPair();

        const basicCurrency = {
            id: currencyUuid,
            name: 'Currency-' + currencyId,
            shortName: 'CUR' + currencyId,
            isoCode: '' + currencyId.substring(0, 3),
            symbol: 'C$',
            factor: 2.4,
            itemRounding: {
                decimals: roundingDecimals,
                interval: 0.01,
                roundForNet: true,
            },
            totalRounding: {
                decimals: roundingDecimals,
                interval: 0.01,
                roundForNet: true,
            },
            taxFreeFrom: 0,
        };

        return Object.assign({}, basicCurrency, overrides);
    }

    getBasicProductStruct(taxId = this.defaultTaxId, currencyId = this.defaultCurrencyId, overrides: Partial<Product> = {}): Partial<Product> {
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
                categories: [
                    {
                        id: this.defaultCategoryId,
                    },
                ],
            });
        }

        if (this.defaultSalesChannel) {
            basicProduct = Object.assign({}, basicProduct, {
                visibilities: [
                    {
                        salesChannelId: this.defaultSalesChannel.id,
                        visibility: 30,
                    },
                ],
            });
        }

        return Object.assign({}, basicProduct, overrides);
    }

    getBasicRuleStruct(overrides: Partial<Rule> = {}, conditionType: string, operator: string, amount: number): Partial<Rule> {
        const { id: ruleId, uuid: ruleUuid } = this.IdProvider.getIdPair();
        const ruleName = `${this.namePrefix}Rule-${ruleId}${this.nameSuffix}`;

        const description = `
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`.trim();

        const basicRuleStruct = {
            id: ruleUuid,
            name: ruleName,
            priority: 1,
            description: description,
            conditions: [
                {
                    type: 'orContainer',
                    children: [
                        {
                            type: 'andContainer',
                            children: [
                                {
                                    type: conditionType,
                                    value: {
                                        operator: operator,
                                        amount: amount,
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        return Object.assign({}, basicRuleStruct, overrides);
    }

    getProductPriceRangeStruct(currencyId: string, ruleId: string): Partial<Product> {
        const p = (gross: number, net: number) => [
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
            prices: [
                {
                    ruleId: ruleId,
                    price: p(100, 84.03),
                    quantityStart: 1,
                    quantityEnd: 10,
                },
                {
                    ruleId: ruleId,
                    price: p(90, 75.63),
                    quantityStart: 11,
                    quantityEnd: 20,
                },
                {
                    ruleId: ruleId,
                    price: p(80, 67.23),
                    quantityStart: 21,
                    quantityEnd: 50,
                },
                {
                    ruleId: ruleId,
                    price: p(70, 58.82),
                    quantityStart: 51,
                    quantityEnd: null,
                },
            ],
        };
    }

    getBasicManufacturerStruct(overrides: Partial<Manufacturer> = {}): Partial<Manufacturer> {
        const { id: manufacturerId, uuid: manufacturerUuid } = this.IdProvider.getIdPair();
        const manufacturerName = `${this.namePrefix}Manufacturer-${manufacturerId}${this.nameSuffix}`;

        const description = `
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`.trim();

        const basicManufacturer = {
            id: manufacturerUuid,
            name: manufacturerName,
            description: description,
        };

        return Object.assign({}, basicManufacturer, overrides);
    }

    getBasicPaymentMethodStruct(overrides: Partial<PaymentMethod> = {}) {
        const { id: paymentMethodId, uuid: paymentMethodUuid } = this.IdProvider.getIdPair();
        const paymentMethodName = `${this.namePrefix}PaymentMethod-${paymentMethodId}${this.nameSuffix}`;

        const basicPaymentMethod = {
            id: paymentMethodUuid,
            name: paymentMethodName,
            technicalName: paymentMethodName.toLowerCase(),
            active: true,
        };

        return Object.assign({}, basicPaymentMethod, overrides);
    }

    getBasicCategoryStruct(overrides: Partial<Category> = {}, parentId = this.defaultCategoryId) {
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
        overrides: Partial<Customer> = {}
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

    getBasicOrderDeliveryStruct(deliveryState: StateMachineState, shippingMethod: ShippingMethod, customerAddress: CustomerAddress): Partial<OrderDelivery> {
        const date = new Date();
        const shippingDate = new Date(date);
        shippingDate.setDate(shippingDate.getDate() + 3);
        const shippingDateTime = this.convertDateTime(shippingDate);
        const shippingCosts = 8.99;

        return {
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
        };
    }

    getBasicShippingMethodStruct(deliveryTimeId: string, overrides: Partial<ShippingMethod> = {}) {
        const { id: shippingMethodId, uuid: shippingMethodUuid } = this.IdProvider.getIdPair();
        const shippingMethodName = `${this.namePrefix}ShippingMethod-${shippingMethodId}${this.nameSuffix}`;

        const basicShippingMethod = {
            id: shippingMethodUuid,
            name: shippingMethodName,
            technicalName: shippingMethodName.toLowerCase(),
            deliveryTimeId: deliveryTimeId,
            active: true,
        };

        return Object.assign({}, basicShippingMethod, overrides);
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
        overrides: Partial<Order> = {}
    ): Partial<Order> {
        const date = new Date();
        const orderDateTime = this.convertDateTime(date);

        let totalPrice = 0;
        const orderLineItems: Record<string, unknown>[] = [];
        lineItems.forEach((lineItem) => {
            if (this.isProduct(lineItem.product)) {
                const product = lineItem.product;
                orderLineItems.push(this.getBasicProductLineItemStruct(lineItem));
                totalPrice += product.price[0].gross * (lineItem.quantity || 1);
            }

            if (this.isPromotion(lineItem.product)) {
                const promotion = lineItem.product;
                orderLineItems.push(this.getBasicPromotionLineItemStruct(lineItem));
                const promotionDiscountValue = promotion.discounts[0].value;
                const promotionDiscountType = promotion.discounts[0].type;

                if (promotionDiscountType === 'absolute') {
                    totalPrice -= (promotionDiscountValue || 10) * (lineItem.quantity || 1);
                } else if (promotionDiscountType === 'percentage') {
                    totalPrice -= ((promotionDiscountValue * totalPrice) / 100) * (lineItem.quantity || 1);
                } else if (promotionDiscountType === 'fixed_unit') {
                    totalPrice = (promotionDiscountValue || 10) * (lineItem.quantity || 1);
                }
            }
        });

        const orderDelivery = this.getBasicOrderDeliveryStruct(deliveryState, shippingMethod, customerAddress);
        const shippingCosts = orderDelivery.shippingCosts?.totalPrice ?? 0;

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
                calculatedTaxes: [
                    {
                        tax: 0,
                        taxRate: 0,
                        price: totalPrice,
                    },
                ],
                taxRules: [
                    {
                        taxRate: 0,
                        percentage: 100,
                    },
                ],
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
            lineItems: orderLineItems,
            deliveries: [orderDelivery],
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
        };

        return Object.assign({}, basicOrder, overrides);
    }

    getBasicProductLineItemStruct(lineItem: SimpleLineItem) {
        if (!this.isProduct(lineItem.product)) {
            console.error('Error: Object is not of type Product');
        }

        const product = lineItem.product as Product;
        const unitPrice = product.price[0].gross || 10;
        const totalPrice = unitPrice * (lineItem.quantity || 1);

        const basicProductLineItemStruct = {
            productId: product.id,
            referencedId: product.id,
            payload: {
                productNumber: product.productNumber,
            },
            identifier: product.id,
            type: 'product',
            label: product.name,
            quantity: lineItem.quantity || 1,
            position: lineItem.position || 1,
            price: {
                unitPrice: unitPrice,
                totalPrice: totalPrice,
                quantity: lineItem.quantity,
                calculatedTaxes: [
                    {
                        tax: 0,
                        taxRate: 0,
                        price: totalPrice,
                    },
                ],
                taxRules: [
                    {
                        taxRate: 0,
                        percentage: 100,
                    },
                ],
            },
            priceDefinition: {
                type: 'quantity',
                price: totalPrice,
                quantity: lineItem.quantity || 1,
                taxRules: [
                    {
                        taxRate: 0,
                        percentage: 100,
                    },
                ],
                listPrice: 8.0,
                isCalculated: true,
                referencePriceDefinition: null,
            },
        };

        return Object.assign({}, basicProductLineItemStruct, lineItem.overrides);
    }

    getBasicPromotionLineItemStruct(lineItem: SimpleLineItem) {
        if (!this.isPromotion(lineItem.product)) {
            console.error('Error: Object is not of type Promotion');
        }

        const promotion = lineItem.product as Promotion;
        const promotionDiscountValue = promotion.discounts[0].value;
        const promotionDiscountType = promotion.discounts[0].type;
        const promotionDiscountId = promotion.discounts[0].id;

        const unitPrice = -Math.abs(promotionDiscountValue || 10);
        const totalPrice = unitPrice * (lineItem.quantity || 1);

        const basicPromotionLineItemStruct = {
            promotionId: promotion.id,
            referencedId: promotion.code,
            payload: {
                code: promotion.code,
            },
            identifier: promotionDiscountId,
            type: 'promotion',
            label: promotion.name,
            description: promotion.name,
            quantity: lineItem.quantity || 1,
            position: lineItem.position || 1,
            price: {
                unitPrice: unitPrice,
                totalPrice: totalPrice,
                quantity: lineItem.quantity,
                calculatedTaxes: [
                    {
                        tax: 0,
                        taxRate: 0,
                        price: totalPrice,
                    },
                ],
                taxRules: [
                    {
                        taxRate: 0,
                        percentage: 100,
                    },
                ],
            },
            priceDefinition: {
                type: promotionDiscountType,
                price: totalPrice,
                percentage: promotionDiscountType === 'percentage' ? promotionDiscountValue : null,
            },
        };

        return Object.assign({}, basicPromotionLineItemStruct, lineItem.overrides);
    }

    getBasicPromotionStruct(salesChannelId = this.defaultSalesChannel.id, overrides: Partial<Promotion> = {}): Partial<Promotion> {
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
            discounts: [
                {
                    scope: 'cart',
                    type: 'percentage',
                    value: 10,
                    considerAdvancedRules: false,
                },
            ],
            salesChannels: [
                {
                    salesChannelId: salesChannelId,
                    priority: 1,
                },
            ],
        };

        return Object.assign({}, basicPromotion, overrides);
    }

    getBasicCmsStruct(cmsType: string, overrides: Partial<CmsPage>): Partial<CmsPage> {
        const cmsPageUuid = this.IdProvider.getIdPair().uuid;
        const cmsPageName = `${this.namePrefix}Cms-${cmsPageUuid}${this.nameSuffix}`;

        const basicCmsPage = {
            id: cmsPageUuid,
            type: cmsType,
            name: cmsPageName,
            sections: [
                {
                    id: this.IdProvider.getIdPair().uuid,
                    pageId: this.IdProvider.getIdPair().uuid,
                    position: 0,
                    type: 'full_width',
                    blocks: [
                        {
                            id: this.IdProvider.getIdPair().uuid,
                            sectionId: this.IdProvider.getIdPair().uuid,
                            type: 'text',
                            position: 0,
                            slots: [
                                {
                                    id: this.IdProvider.getIdPair().uuid,
                                    type: 'text',
                                    blockId: this.IdProvider.getIdPair().uuid,
                                    slot: 'content',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        return Object.assign({}, basicCmsPage, overrides);
    }

    getBasicCustomerGroupStruct(overrides: Partial<CustomerGroup> = {}): Partial<CustomerGroup> {
        const customerGroupUuid = this.IdProvider.getIdPair().uuid;
        const customerGroupName = `${this.namePrefix}CustomerGroup-${customerGroupUuid}${this.nameSuffix}`;

        const basicCustomerGroup = {
            id: customerGroupUuid,
            name: customerGroupName,
            displayGross: true,
            registrationActive: true,
            registrationTitle: customerGroupName,
            registrationIntroduction: `${customerGroupName}-Introduction`,
            registrationSeoMetaDescription: `${customerGroupName}-SEO-Description`,
            registrationOnlyCompanyRegistration: false,
            customFields: {},
            registrationSalesChannels: [
                {
                    id: this.defaultSalesChannel.id,
                },
            ],
        };
        return Object.assign({}, basicCustomerGroup, overrides);
    }

    getSalesChannelAnalyticsStruct(overrides: Partial<SalesChannelAnalytics> = {}): Partial<SalesChannelAnalytics> {
        const salesChannelAnalyticsUuid = this.IdProvider.getIdPair().uuid;
        const trackingId = this.IdProvider.getIdPair().id;

        const basicSalesChannelAnalyticsStruct = {
            id: salesChannelAnalyticsUuid,
            trackingId: trackingId,
            active: true,
            trackOrders: false,
            anonymizeIp: true,
        };
        return Object.assign({}, basicSalesChannelAnalyticsStruct, overrides);
    }

    async clearCaches() {
        await clearDelayedCache(this.AdminApiClient);
    }

    getBasicCustomFieldSetStruct(overrides: Partial<CustomFieldSet> = {}): Partial<CustomFieldSet> {
        const customFieldSetUuid = this.IdProvider.getIdPair().uuid;
        const customFieldSetName = `${this.namePrefix}CustomFieldSet-${customFieldSetUuid}${this.nameSuffix}`;

        const basicCustomFieldSet = {
            id: customFieldSetUuid,
            name: customFieldSetName,
            config: {
                label: {
                    'en-GB': null,
                },
            },
            position: 1,
            relations: [
                {
                    id: this.IdProvider.getIdPair().uuid,
                    entityName: 'customer',
                },
            ],
        };
        return Object.assign({}, basicCustomFieldSet, overrides);
    }

    getBasicCustomFieldStruct(overrides: Partial<CustomField> = {}): Partial<CustomField> {
        const customFieldUuid = this.IdProvider.getIdPair().uuid;
        const customFieldName = `${this.namePrefix}CustomField-${customFieldUuid}${this.nameSuffix}`;

        const basicCustomField = {
            id: customFieldUuid,
            name: customFieldName,
            type: 'text',
            config: {
                componentName: 'sw-field',
                type: 'text',
                customFieldType: 'text',
                customFieldPosition: 1,
                label: {
                    'en-GB': null,
                },
                placeholder: {
                    'en-GB': null,
                },
                helpText: {
                    'en-GB': null,
                },
            },
        };
        return Object.assign({}, basicCustomField, overrides);
    }

    getSalesChannelDomainStruct(
        salesChannelId: string,
        currencyId: string,
        languageId: string,
        snippetSetId: string,
        overrides: Partial<SalesChannelDomain> = {}
    ): Partial<SalesChannelDomain> {
        const appUrl = process.env['APP_URL'];
        const baseUrl = `${appUrl}test-${this.IdProvider.getIdPair().uuid}/`;

        const basicSalesChannelDomain = {
            url: baseUrl,
            salesChannelId: salesChannelId,
            currencyId: currencyId,
            languageId: languageId,
            snippetSetId: snippetSetId,
        };

        return Object.assign({}, basicSalesChannelDomain, overrides);
    }

    getTaxStruct(overrides: Partial<Tax>): Partial<Tax> {
        const taxUuid = this.IdProvider.getIdPair().uuid;
        const taxName = `${this.namePrefix}Tax-${taxUuid}${this.nameSuffix}`;

        const basicTaxStruct = {
            id: taxUuid,
            name: taxName,
            taxRate: 19,
        };

        return Object.assign({}, basicTaxStruct, overrides);
    }

    getBasicCrossSellingStruct(productId: string, overrides: Partial<ProductCrossSelling> = {}) {

        const { id: productCrossSellingId, uuid: productCrossSellingUuid } = this.IdProvider.getIdPair();
        const productCrossSellingName = `${this.namePrefix}ProductCrossSelling-${productCrossSellingId}${this.nameSuffix}`;

        const defaultCrossSelling = {
            id: productCrossSellingUuid,
            productId: productId,
            name: productCrossSellingName,
            type: 'product_list',
            position: 1,
            active: true,
            productStreamId: null,
            sortingType: 'name',
            limit: 10,
            sortBy: 'name',
        }
        return Object.assign({}, defaultCrossSelling, overrides);
    }

    getBasicProductReviewStruct(productId: string, overrides: Partial<ProductReview> = {}): Partial<ProductReview> {
        const { id: productReviewId, uuid: productReviewUuid } = this.IdProvider.getIdPair();
        const productReviewName = `${this.namePrefix}ProductReview-${productReviewId}${this.nameSuffix}`;

        const defaultProductReview = {
            id: productReviewUuid,
            productId: productId,
            title: productReviewName,
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
            points: 5,
            status: true,
            salesChannelId: this.defaultSalesChannel.id,
        }
        return Object.assign({}, defaultProductReview, overrides);
    }
}
