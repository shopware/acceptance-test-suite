import { mergeTests } from '@playwright/test';
import type { components } from '@shopware/api-client/admin-api-types';
import type { Product, Category, Order } from '../types/ShopwareTypes';
import { ProductData } from './Product/Product';
import { CategoryData } from './Category/Category';
import { DigitalProductData } from './Product/DigitalProduct';
import { PropertiesData } from './Product/Properties';
import { CartWithProductData } from './Checkout/CartWithProduct';
import { PromotionWithCodeData } from './Checkout/PromotionWithCode';
import { MediaData } from './Media/Media';
import { OrderData } from './Order/Order';
import { TagData } from './Tag/Tag';

export interface DataFixtureTypes {
    ProductData: Product,
    CategoryData: Category,
    DigitalProductData: {
        product: Product,
        fileContent: string
    },
    PromotionWithCodeData: components['schemas']['Promotion'],
    CartWithProductData: Record<string, unknown>,
    PropertiesData: {
        propertyGroupColor: components['schemas']['PropertyGroup']
        propertyGroupSize: components['schemas']['PropertyGroup']
    },
    MediaData: components['schemas']['Media'],
    OrderData: Order,
    TagData: components['schemas']['Tag'],
}

export const test = mergeTests(
    ProductData,
    CategoryData,
    DigitalProductData,
    CartWithProductData,
    PromotionWithCodeData,
    PropertiesData,
    MediaData,
    OrderData,
    TagData,
);
