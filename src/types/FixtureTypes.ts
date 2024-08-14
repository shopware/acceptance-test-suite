import { ApiContextTypes } from '../fixtures/ApiContexts';
import { PageContextTypes } from '../fixtures/PageContexts';
import { ActorFixtureTypes } from '../fixtures/Actors';
import { TestDataFixtureTypes } from '../fixtures/TestData';
import { HelperFixtureTypes } from '../fixtures/HelperFixtures';
import { DefaultSalesChannelTypes } from '../fixtures/DefaultSalesChannel';
import { StorefrontPageTypes } from '../page-objects/StorefrontPages';
import { AdministrationPageTypes } from '../page-objects/AdministrationPages';
import { DataFixtureTypes } from '../data-fixtures/DataFixtures';
import { FeatureFixtureTypes } from '../fixtures/Feature';

export interface FixtureTypes extends
    ApiContextTypes,
    PageContextTypes,
    ActorFixtureTypes,
    TestDataFixtureTypes,
    HelperFixtureTypes,
    FeatureFixtureTypes,
    DefaultSalesChannelTypes,
    StorefrontPageTypes,
    AdministrationPageTypes,
    DataFixtureTypes {}