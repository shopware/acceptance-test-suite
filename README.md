[![NPM Version](https://img.shields.io/npm/v/%40shopware-ag%2Facceptance-test-suite)](https://www.npmjs.com/package/@shopware-ag/acceptance-test-suite)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![License](https://img.shields.io/github/license/shopware/acceptance-test-suite.svg)](https://github.com/shopware/acceptance-test-suite/blob/trunk/LICENSE)  

# Shopware Acceptance Test Suite
This test suite is an extension to [Playwright](https://playwright.dev/) to easily create end-to-end and API acceptance tests for [Shopware](https://github.com/shopware/shopware). It provides several useful Playwright [fixtures](https://playwright.dev/docs/test-fixtures) to start testing with Shopware right away, including page contexts and [page objects](https://playwright.dev/docs/pom) for Storefront and Administration, API clients, test data creation and reusable test logic.

## Table of contents

* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [General Fixtures](#general-fixtures)
* [Page Objects](#page-objects)
* [Actor Pattern](#actor-pattern)
* [Data Fixtures](#data-fixtures)
* [Code Contribution](#code-contribution)

## Installation
Start by creating your own [Playwright](https://playwright.dev/docs/intro) project.

```
npm init playwright@latest
```

Add the package for the Shopware Acceptance Test Suite to your project.

```
npm install @shopware-ag/acceptance-test-suite
```

Make sure to install Playwright and it's dependencies.
```
npm install
npx playwright install
npx playwright install-deps
```

## Configuration
The test suite is designed to test against any Shopware instance with pure API usage. To grant access to the instance under test you can use the following environment variables. You can decide between two authentication options - admin user or shopware integration (recommended).

```apacheconf
# .env

APP_URL="<url-to-the-shopware-instance>"

# Authentication via integration
SHOPWARE_ACCESS_KEY_ID="<your-shopware-integration-id>"
SHOPWARE_SECRET_ACCESS_KEY="<your-shopware-integration-secret>"

# Autentication via admin user
SHOPWARE_ADMIN_USERNAME="<administrator-user-name>"
SHOPWARE_ADMIN_PASSWORD="<administrator-user-password>"
```

To ensure Playwright is referencing the right instance, you can use the same environment variable in your Playwright configuration.

```TypeScript
// playwright.config.ts

import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: process.env['APP_URL'],
    }
});
```

For more information about how to configure your Playwright project, have a look into the [official documentation](https://playwright.dev/docs/test-configuration).

## Usage
The test suite uses the [extension system](https://playwright.dev/docs/extensibility) of Playwright and can be used as a full drop-in for Playwright. But, as you might also want to add your own extensions, the best way to use it is to create your own base test file and use it as the central reference for your test files. Add it to your project root or a specific fixture directory and name it whatever you like.

```TypeScript
// BaseTestFile.ts

import { test as base } from '@shopware-ag/acceptance-test-suite';
import type { FixtureTypes } from '@shopware-ag/acceptance-test-suite';

export * from '@shopware-ag/acceptance-test-suite';

export const test = base.extend<FixtureTypes>({
    
    // Your own fixtures 
    
});
```

Within your tests you can import the necessary dependencies from your base file.

```TypeScript
// tests/MyFirstTest.spec.ts

import { test, expect } from './../BaseTestFile';

test('My first test scenario.', async ({ AdminApiContext, DefaultSalesChannel }) => {
    
    // Your test logic
    
});
```

In the example above you can see two Shopware specific fixtures that are used in the test, `AdminApiContext` and `DefaultSalesChannel`. Every fixture can be used as an argument within the test method. Read more about available fixtures in the next section.

## General Fixtures

### DefaultSalesChannel
We try to encapsulate test execution within the system under test and make tests as deterministic as possible. The idea is, to have a separate sales channel created which is used to do tests within the standard Storefront. The `DefaultSalesChannel` fixture is a worker scoped fixture and is there to achieve exactly that. Using it will provide you with a new sales channel with default settings, including a default Storefront customer.

**Properties**  
* `salesChannel`: The Shopware sales channel reference.
* `customer`: A default Storefront customer reference.
* `url`: The url to the sales channel Storefront.

### AdminApiContext
This context provides a ready to use client for the Admin-API of Shopware. It is based on the standard Playwright [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext), but will handle authentication for you, so you can start doing API request to the Shopware instance under test right away. You can use it, for example, for test data creation or API testing. Learn more about the usage of the Shopware Admin-API in the [API documentation](https://shopware.stoplight.io/docs/admin-api).

**Methods**  
* `get`
* `post`
* `patch`
* `delete`
* `fetch`
* `head`

**Usage**  
```TypeScript
import { test, expect } from './../BaseTestFile';

test('Property group test scenario', async ({ AdminApiContext }) => {

    const response = await AdminApiContext.post('property-group?_response=1', {
        data: {
            name: 'Size',
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
        },
    });

    expect(response.ok()).toBeTruthy();
});
```

### StoreApiContext
This context provides a ready to use client for the Store-API of Shopware and is based on the standard Playwright [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext). You can do API calls on behalf of a Storefront user. Learn more about the usage of the Shopware Store-API in the [documentation](https://shopware.stoplight.io/docs/store-api/).

Note that, other than the AdminApiContext, the StoreApiContext won't do an automated login of the shop customer. This is, because a Storefront user isn't always a registered user by default, and you might want to test this behaviour explicitly. You can use the `login` method to simply login as a registered shop customer.

**Methods**  
* `login(user)`: Does a login of a customer and will store the login state for future requests. 
* `get`
* `post`
* `patch`
* `delete`
* `fetch`
* `head`

**Usage**  
```TypeScript
import { test, expect } from './../BaseTestFile';

test('Store customer test scenario', async ({ StoreApiContext, DefaultSalesChannel }) => {

    // Login as the default customer.
    await StoreApiContext.login(DefaultSalesChannel.customer);

    // Create a new cart for the customer.
    const response = await StoreApiContext.post('checkout/cart', {
        data: { name: 'default-customer-cart' },
    });

    expect(response.ok()).toBeTruthy();
});
```

### AdminPage
This fixture provides a Playwright [page](https://playwright.dev/docs/api/class-page) context for the Shopware Administration. It creates a new admin user with an authenticated session. You can start testing within the Administration using this page right away.

**Usage**  
```TypeScript
import { test, expect } from './../BaseTestFile';

test('Shopware admin test scenario', async ({ AdminPage }) => {

    await AdminPage.goto('#/sw/product/index');
    await expect(AdminPage.locator('.sw-product-list__add-physical-button')).toBeVisible();
});
```

Note that this is just a very rough example. In most cases you won't use this page context directly, but maybe a [page-object](#page-objects) using this page.

### StorefrontPage
This fixture provides a Playwright [page](https://playwright.dev/docs/api/class-page) context for the Shopware Storefront of the default sales channel.

## Page Objects
Page objects can be helpful to simplify the usage of element selectors and make them available in a reusable way. They help you to organize page specific locators and provide helpers for interacting with a given page. Within our test suite we try to keep the page objects very simple and not to add too much logic to them. So most of the page objects resemble just a collection of element locators and maybe some little helper methods.

There are several page objects to navigate the different pages of the Administration and Storefront. You can use them as any other fixture within your test. There is also a guide on page objects in the official Playwright [documentation](https://playwright.dev/docs/pom).

**Usage**  
```TypeScript
import { test, expect } from './../BaseTestFile';

test('Storefront cart test scenario', async ({ StorefrontCheckoutCart }) => {

    await StorefrontCheckoutCart.goTo();
    await expect(StorefrontCheckoutCart.grandTotalPrice).toHaveText('€100.00*');
});
```

You can get an overview of all available page objects in the [repository](https://github.com/shopware/acceptance-test-suite/tree/trunk/src/page-objects) of this test suite.

## Actor Pattern
The actor pattern is a very simple concept that we added to our test suite. It is something that is not related to Playwright, but similar concepts exist in other testing frameworks. We implemented it, because we want to have reusable test logic that can be used in a human-readable form, without abstracting away Playwright as a framework. So you are totally free to use it or not. Any normal Playwright functionality will still be usable in your tests.

The concept adds two new entities besides the already mentioned page objects.

* **Actor**: A specific user with a given context performing actions (tasks) inside the application.
* **Task**: A certain action performed by an actor.
* **Pages**: A page of the application on which an actor performs a task.

### Actors
The actor class is just a lightweight solution to simplify the execution of reusable test logic or the navigation to a certain page.

**Properties**  
* `name`: The human-readable name of the actor.
* `page`: A Playwright page context the actor is navigating.

**Methods**  
* `goesTo`: Accepts a page object the actor should be navigating to.
* `attemptsTo`: Accepts a "task" function with reusable test logic the actor should perform.
* `expects`: A one-to-one export of the Playwright `expect` method to use it in the actor pattern.

These methods lead to the following pattern:

* The **actor** *goes to* a **page**.
* The **actor** *attempts to* perform a certain **task**.
* The **actor** *expects* a certain result.

Translated into test code this pattern can look like this:

```TypeScript
import { test } from './../BaseTestFile';

test('Product detail test scenario', async ({ 
    ShopCustomer, 
    StorefrontProductDetail, 
    ProductData 
}) => {

    await ShopCustomer.goesTo(StorefrontProductDetail);
    await ShopCustomer.attemptsTo(AddProductToCart(ProductData));
    await ShopCustomer.expects(StorefrontProductDetail.offCanvasSummaryTotalPrice).toHaveText('€99.99*');
});
```

In this example you can see that this pattern creates tests that are very comprehensible, even for non-tech people. They also make it easier to abstract simple test logic that might be used in different scenarios into executable tasks, like adding a product to the cart. You can also see the usage of a data fixture (`ProductData`), which we will cover in a later chapter.

The test suite offers two different actors by default:

* `ShopCustomer`: A user that is navigating the Storefront and buying products.
* `ShopAdmin`: A user that is managing Shopware via the Administration.

### Tasks
Tasks are small chunks of reusable test logic that can be passed to the `attemptsTo` method of an actor. They are created via Playwright fixtures and have access to the same dependencies. Every executed task will automatically be wrapped in a test step of Playwright, so you get nicely structured reports of your tests.

**Example**  
```TypeScript
import { test as base } from '@playwright/test';
import type { FixtureTypes, Task } from '@shopware-ag/acceptance-test-suite';

export const Login = base.extend<{ Login: Task }, FixtureTypes>({
    Login: async ({
        ShopCustomer,
        DefaultSalesChannel,
        StorefrontAccountLogin,
        StorefrontAccount,
    }, use)=> {
        const task = () => {
            return async function Login() {
                const { customer } = DefaultSalesChannel;

                await ShopCustomer.goesTo(StorefrontAccountLogin);

                await StorefrontAccountLogin.emailInput.fill(customer.email);
                await StorefrontAccountLogin.passwordInput.fill(customer.password);
                await StorefrontAccountLogin.loginButton.click();

                await ShopCustomer.expects(StorefrontAccount.personalDataCardTitle).toBeVisible();
            }
        };

        await use(task);
    },
});
```

This fixture is the "login" task and performs a simple Storefront login of the default customer. Everytime we need a logged in shop customer, we can simply reuse this logic in our test.

```TypeScript
import { test } from './../BaseTestFile';

test('Customer login test scenario', async ({ ShopCustomer, Login }) => {
    
    await ShopCustomer.attemptsTo(Login());
});
```

You can create your own tasks in the same way to make them available for the actor pattern. Every task is just a simple Playwright fixture containing a function call with the corresponding test logic. Make sure to merge your task fixtures with other fixtures you created in your base test file. You can use the `mergeTests` method of Playwright to combine several fixtures into one test extension.

## Data Fixtures
We already covered a lot of interesting fixtures you can use to create your test scenario. One topic which is missing is test data. Most test scenarios will need some predefined state within the system under test to validate a certain behaviour. Within this test suite we use Playwright fixtures also to create necessary test data via API. The goal is to have no direct system dependencies like a database connection to the system under test.

**Example**  
```TypeScript
import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '@shopware-ag/acceptance-test-suite';

export const PropertiesData = base.extend<FixtureTypes>({
    PropertiesData: async ({ AdminApiContext }, use) => {

        const response = await AdminApiContext.post('property-group?_response=1', {
            data: {
                name: 'Size',
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
            },
        });

        expect(response.ok()).toBeTruthy();

        const { data: propertyGroup } = await response.json();

        await use(propertyGroup);

        const deleteResponse = await AdminApiContext.delete(`property-group/${propertyGroup.id}`);
        expect(deleteResponse.ok()).toBeTruthy();
    },
});
```

Here you can see a simple data fixture which will create a new property group in the Shopware instance under test via the Admin-API. The nice thing about Playwright fixtures is, that we can create some data and make it available within our test using the `use()` method and right afterward already clean up the data with a delete call. This enables us to have all operations regarding specific test data in one place with the opportunity to automatically clean up the data after test execution.

You can simply make test data available in your test by using the fixture in your test method.

```TypeScript
import { test } from './../BaseTestFile';

test('Property group test scenario', async ({ PropertiesData }) => {
    
    // Do some testing with the property group from PropertiesData
});
```

If you create your own data fixtures make sure to import and merge them in your base test file with other fixtures you created.

## Code Contribution
You can contribute to this project via its [official repository](https://github.com/shopware/acceptance-test-suite/) on GitHub.  

This project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Please make sure to form your commits accordingly to the spec.