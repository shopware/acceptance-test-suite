[![NPM Version](https://img.shields.io/npm/v/%40shopware-ag%2Facceptance-test-suite)](https://www.npmjs.com/package/@shopware-ag/acceptance-test-suite)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![License](https://img.shields.io/github/license/shopware/acceptance-test-suite.svg)](https://github.com/shopware/acceptance-test-suite/blob/trunk/LICENSE)  

# Shopware Acceptance Test Suite
This test suite is an extension to [Playwright](https://playwright.dev/) to easily create end-to-end and API acceptance tests for [Shopware](https://github.com/shopware/shopware). It provides several useful Playwright [fixtures](https://playwright.dev/docs/test-fixtures) to start testing with Shopware right away, including page contexts and [page objects](https://playwright.dev/docs/pom) for Storefront and Administration, API clients, test data creation and reusable test logic.

## Table of contents

* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Deployment Process](#deployment-process)
* [General fixtures](#general-fixtures)
* [Page Objects](#page-objects)
* [Actor Pattern](#actor-pattern)
* [Types](#types-in-the-test-suite)
* [Testing](#testing-within-the-test-suite)
* [Running tests](#running-tests-in-the-test-suite)
* [Local development with ATS](#local-development-with-ats)
* [Best practices](#best-practices)
* [Code contribution](#code-contribution)
* [Services](#services)
  * [Test Data Service](#test-data-service)
    * [When to use](#when-to-use-the-testdataservice-in-tests)
    * [When and why to extend](#when-and-why-to-extend-the-testdataservice)
    * [Available methods](#available-create-methods-in-testdataservice)
    * [Writing new methods](#writing-new-methods-in-testdataservice)
    * [Automatic cleanup](#automatic-cleanup-of-test-data-and-system-configurations)
    * [Extending the TestDataService](#extending-the-testdataservice-in-external-projects)

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

### Mailpit configuration
Set up your local Mailpit instance by following the instructions at [Mailpit GitHub repository](https://github.com/axllent/mailpit).  
By default, Mailpit starts a web interface at `http://localhost:8025` and listens for SMTP on port `1025`.  
Set the `MAILPIT_BASE_URL` environment variable in `playwright.config.ts` to `http://localhost:8025`. You can now run email tests, such as `tests/Mailpit.spec.ts`.



## Usage
The test suite uses the [extension system](https://playwright.dev/docs/extensibility) of Playwright and can be used as a full drop-in for Playwright. But, as you might also want to add your own extensions, the best way to use it is to create your own base test file and use it as the central reference for your test files. Add it to your project root or a specific fixture directory and name it whatever you like.

Make sure to set `"type": "module",` in your `package.json`.

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

## Deployment Process

To deploy a new version of the Acceptance Test Suite, follow the steps below:

1. **Create a Pull Request**  
   Open a new pull request with your changes. Ensure that all commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to support automated versioning and changelog generation.

2. **Approval and Merge**  
   Once the pull request has been reviewed and approved, merge it into the main branch.

3. **Automated Deployment PR Creation**  
   After the merge, the [`release-please`](https://github.com/googleapis/release-please) tool will automatically open a new pull request. This deployment PR will include version bumps and a generated changelog.

4. **Review and Approve the Deployment PR**  
   The deployment pull request requires an additional approval before it can be merged.

5. **Merge the Deployment PR**  
   Once the deployment PR is approved and merged, a new release of the Acceptance Test Suite will be created in the GitHub repository. This action will also publish a new package version to NPM under  
   [@shopware-ag/acceptance-test-suite](https://www.npmjs.com/package/@shopware-ag/acceptance-test-suite).

6. **Use the New Version**  
   After a short delay, the newly published version will be available on NPM. You can then reference it in your individual project folders as needed.

### Troubleshooting
If you encounter any issues with the automated deployment process, please check the following [troubleshooting page of release-please](https://github.com/googleapis/release-please?tab=readme-ov-file#release-please-bot-does-not-create-a-release-pr-why).

In the most cases, the problem is related to the commit messages not following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Make sure to check your commit messages and rebase your branch if necessary. If your PR is merged with a commit message that does not follow the specification you can do the following:

1. **Create an empty commit to the main branch**  
   ```bash
   git commit --allow-empty -m "chore: release 2.0.0" -m "Release-As: 2.0.0"
   ```
When a commit to the main branch has Release-As: x.x.x (case insensitive) in the commit body, Release Please will open a new pull request for the specified version.   

2. **Push the changes**  
   ```bash
   git push origin <your-branch>
   ```
   
3. **Adjust the release notes**

Don't forget to adjust the release notes in the deployment PR.


## General fixtures

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

### Add new fixtures
To add new general fixtures create them inside the `src/fixtures` folder. Keep in mind, that you need to merge your new fixture inside the `/src/index.ts` file.

## Page Objects
Page objects can be helpful to simplify the usage of element selectors and make them available in a reusable way. They help you to organize page specific locators and provide helpers for interacting with a given page. Within our test suite we try to keep the page objects very simple and not to add too much logic to them. So most of the page objects resemble just a collection of element locators and maybe some little helper methods.

There are several page objects to navigate the different pages of the Administration and Storefront. You can use them as any other fixture within your test. There is also a guide on page objects in the official Playwright [documentation](https://playwright.dev/docs/pom).

**Usage**  
```TypeScript
import { test, expect } from './../BaseTestFile';

test('Storefront cart test scenario', async ({ StorefrontPage, StorefrontCheckoutCart }) => {

    await StorefrontPage.goto(StorefrontCheckoutCart.url());
    await expect(StorefrontCheckoutCart.grandTotalPrice).toHaveText('€100.00*');
});
```

You can get an overview of all available page objects in the [repository](https://github.com/shopware/acceptance-test-suite/tree/trunk/src/page-objects) of this test suite.

### Page Object module
The `modules` folder is designed to house reusable utility functions that operate on a `Page` object (from Playwright). These functions dynamically interact with different browser pages or contexts using the `page` parameter.
For example, utility functions like `getCustomFieldCardLocators` or `getSelectFieldListitem` are used across multiple page objects to handle specific functionality (e.g., managing custom fields or select field list items). Centralizing these utilities in the `modules` folder improves code organization, readability, and reduces duplication.
Create a new class inside module when it helps to streamline the codebase and avoid repetitive logic across page objects.

You can find how `getCustomFieldCardLocators` is defined in the [modules folder ](./src/page-objects/administration/modules/CustomFieldCard.ts) and used in other page object class [here](./src/page-objects/administration/ProductDetail.ts).


### Add new Page Objects
Page objects are organized mainly by their usage in the administration or storefront. To add a new page object just add it in the respective subfolder and reference it in the `AdministrationPages.ts` or `StorefrontPages.ts`.

**Usage**  
```TypeScript
import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

import { ProductDetail } from './administration/ProductDetail';
import { OrderDetail } from './administration/OrderDetail';
import { CustomerListing } from './administration/CustomerListing';
// [...]
import { MyNewPage } from './administration/MyNewPage';

export interface AdministrationPageTypes {
    AdminProductDetail: ProductDetail;
    AdminOrderDetail: OrderDetail;
    AdminCustomerListing: CustomerListing;
    // [...]
    AdminMyNewPage: MyNewPage;
}

export const AdminPageObjects = {
    ProductDetail,
    OrderDetail,
    CustomerListing,
    // [...]
    MyNewPage,
}
```

## Actor pattern
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
* `goesTo`: Accepts an url of a page the actor should navigate to.
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

    await ShopCustomer.goesTo(StorefrontProductDetail.url(ProductData));
    await ShopCustomer.attemptsTo(AddProductToCart(ProductData));
    await ShopCustomer.expects(StorefrontProductDetail.offCanvasSummaryTotalPrice).toHaveText('€99.99*');
});
```

In this example you can see that this pattern creates tests that are very comprehensible, even for non-tech people. They also make it easier to abstract simple test logic that might be used in different scenarios into executable tasks, like adding a product to the cart.

The test suite offers two different actors by default:

* `ShopCustomer`: A user that is navigating the Storefront.
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

                await ShopCustomer.goesTo(StorefrontAccountLogin.url());

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

You can create your own tasks in the same way to make them available for the actor pattern. Every task is just a simple Playwright fixture containing a function call with the corresponding test logic. Make sure to merge your task fixtures with other fixtures you created in your base test file. You can use the `mergeTests` method of Playwright to combine several fixtures into one test extension. Use `/src/tasks/shop-customer-tasks.ts` or `/src/tasks/shop-admin-tasks.ts` for that.

To keep tests easily readable, use names for your tasks so that in the test itself the code line resembles the `Actor.attemptsTo(doSomething)` pattern as good as possible.

**Example**
```TypeScript
// Bad example
await ShopCustomer.attemptsTo(ProductCart);

// Better example
await ShopCustomer.attemptsTo(PutProductIntoCart);
```

## Types in the Test Suite

The Shopware Acceptance Test Suite leverages TypeScript’s static typing to ensure that test data structures, API interactions, and test logic are consistent and error-resistant.

### Shopware Types

The centralized type definition file, [ShopwareTypes.ts](https://github.com/shopware/acceptance-test-suite/blob/trunk/src/types/ShopwareTypes.ts) is tightly coupled with the TestDataService, which defines the shape and default data of all supported Shopware entities. Each supported entity—such as Product, Customer, Media, etc.—is defined with its properties and default values. These types are then referenced throughout the TestDataService to provide IntelliSense, validation, and consistent data structures.

```
export type ProductReview = components['schemas']['ProductReview'] & {
    id: string,
    productId: string,
    salesChannelId: string,
    title: string,
    content: string,
    points: number,
}
```
Within that example above you are importing the auto-generated type for `ProductReview` from the Shopware Admin API OpenAPI schema and extending it with additional or overridden fields using & { ... }.

Sometimes, you might want to remove fields from a type. TypeScript provides the Omit<T, K> utility to exclude fields from a type:

```
export type Country = Omit<components['schemas']['Country'], 'states'> & {
  id: string,
  states: [{
    name: string,
    shortCode: string,
  }],
}
```

For custom use cases, simply define a custom type:

```
export type CustomShippingMethod = {
  name: string;
  active: boolean;
  deliveryTimeId: string;
}
```

## Testing within the Test Suite
The `tests` folder ensures the reliability of the testing framework by validating the functionality of tools and data used in tests. Add tests to verify any new features or changes you introduce:

- **Page Objects**: Ensure they are correctly implemented and interact with the application as expected, including navigation, element visibility, and user interactions.
- **TestDataService Methods**: Verify that methods for creating, getting, and cleaning up test data (e.g., products, customers, orders) work correctly and produce consistent results.

```TypeScript
//Example for page objects

await ShopAdmin.goesTo(AdminManufacturerCreate.url());
await ShopAdmin.expects(AdminManufacturerCreate.nameInput).toBeVisible();
await ShopAdmin.expects(AdminManufacturerCreate.saveButton).toBeVisible();
```

```TypeScript
//Example for TestDataService

const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
expect(product.description).toEqual('Test Description');
expect(product.coverId).toBeDefined();
```

## Running tests in the Test Suite
If you want to work on the test suite and try to execute tests from within this repository, you have to run a corresponding docker image for a specific Shopware version.

We publish pre-built images at the [GitHub container registry](https://github.com/orgs/shopware/packages/container/package/acceptance-test-suite%2Ftest-image). The images are built on a daily basis, check to see which versions are available.

In order to select an image, export the corresponding tag as `SHOPWARE_VERSION` and start the containers:

```bash
SHOPWARE_VERSION=trunk docker compose up --wait shopware
```

<details>
<summary>ℹ️ What if the version I'd like to test is not available as a pre-built image?</summary>

If you want to test with an image that's not available already, you can build it yourself by exporting a few more variables:

```bash
export PHP_VERSION="8.3" # PHP version of the base image
export SHOPWARE_VERSION="v6.5.8.0" # Shopware version to check out. This may bei either a branch or a tag, depending on the value of SHOPWARE_BUILD_SOURCE
export SHOPWARE_BUILD_SOURCE="tag" # Either "branch" or "tag"

docker compose up --attach-dependencies shopware # This will build the image if it's not available
```
</details>

Afterwards you can execute the normal playwright commands:

```bash
npx playwright test --ui
```

## Local development with ATS
To work locally with the Acceptance Test Suite (ATS) and your development setup, follow these steps:

### Create your Page Objects and TestDataService methods

In the ATS repository ([shopware/acceptance-test-suite](https://github.com/shopware/acceptance-test-suite)), create or modify your custom page objects, TestDataService methods, or any related files.

After making your changes, build the project by running the following command in the ATS repository:
```bash
npm run build
```
This will generate the necessary artifacts in the `dist` folder.

Copy the generated artifacts (e.g., all files in the `dist` folder) from the ATS repository to your local Shopware instance's `node_modules` folder, specifically under the ATS package path:
```bash
cp -R dist/* <path-to-your-shopware-instance>/tests/acceptance/node_modules/@shopware-ag/acceptance-test-suite/dist
````
### Adjust tests, Page Objects, and methods

In your Shopware instance, adjust any tests, page objects, TestDataService methods, or other related files to align them with the changes made in the ATS repository.

### Run the tests

Execute the tests to verify your changes. Use the following command from your Shopware project's acceptance test directory:
```bash
cd tests/acceptance
npx playwright test --ui
```
This will launch the Playwright Test Runner UI where you can select and run specific tests.
By following these steps, you can work locally with the ATS and test your changes in your Shopware instance.

## Best practices

A good first read about this is the official [playwright best practices page](https://playwright.dev/docs/best-practices). It describes the most important practices which should also be followed when writing acceptance tests for Shopware.

The most important part is [test isolation](https://playwright.dev/docs/best-practices#make-tests-as-isolated-as-possible) which helps to prevent flaky behavior and enables the test to be run in parallel and on systems with an unknown state.

### Dos

- use the [`TestDataService`](./src/services/TestDataService.ts) for creating test data
- create all the data that is required for your test case. That includes sales channels, customers and users (the page fixtures handle most of the common use cases)...
- ...and clean it up if you don't need it anymore. The TestDataService will take care of it if you used it to create the test data
- if you need specific settings for your test, set it explicitly for the user/customer/sales channel
- directly jump to detail pages with the id of the entities you've created
    - if that's no possible, use the search with a unique name to filter lists to just that single entity
- if you need to skip tests, comment any relevant github issues as part of the skip method: `test.skip('Blocked by https://[...])`

### Don'ts

- do not expect lists/tables to only contain one item, leverage unique ids/names to open or find your entity instead
- same with helper functions, do not expect to only get one item back from the API. Always use unique criteria to the API call
- avoid unused fixtures: if you request a fixture but don't use any data from the fixture, the test or fixture should be refactored
- do not depend on implicit configuration and existing data. Examples:
    - rules
    - flows
    - categories
- do not expect the shop to have the defaults en_GB and EUR
- do not change global settings (sales channel is ok, because it's created by us)
  - basically everything in Settings that is not specific to a sales channel (tax, search, etc.)
 
### Sensitive Data / Credentials
Sometimes you have to provide sensitie data or credentials for your tests to run, for example credentials for a sandbox environment for a payment provider. Apart from avoiding to have those credentials in the acutal code, you should also prevent them from appearing in logs or traces. To achieve that you should outsource steps using sensitive data to another project, running before the actual test project, and disable traces for it.

**Example**
```Typescript
projects: [
    // Init project using sensitive data
    {
      name: 'init', 
      testMatch: /.*\.init\.ts/,
      use : {trace : 'off'}
    },

    {
      // actual test project
      // [...]
      dependencies: ['init'],
    }]
```
 
### Debugging API calls
Debugging API calls may not be an easy task at first glance, because if the call you made returns an error, it is not directly visible to you. But you can use the `errors[]`-array of the response and log that on the console.

**Example**
```Typescript
const response = await this.AdminApiClient.post('some/route', {
    data: {
        limit: 1,
        filter: [
            {
                type: 'equals',
                field: 'someField',
                value: 'someValue',
            },
        ],
    },
});
const responseData = await response.json();
console.log(responseData.errors[0]);
```

## Code contribution
You can contribute to this project via its [official repository](https://github.com/shopware/acceptance-test-suite/) on GitHub.

This project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Please make sure to form your commits accordingly to the spec.

## Services

The test suite provides several services that can be used to simplify your test code. These services are designed to be reusable and can be easily extended to fit your specific needs.

### Test Data Service
The `TestDataService` is a powerful utility designed to simplify test data creation, management, and cleanup when writing acceptance and API tests for Shopware. It provides ready-to-use functions for common data needs and ensures reliable, isolated test environments.
 For detailed documentation of the methods you can have a look at the [service class](https://github.com/shopware/acceptance-test-suite/blob/trunk/src/services/TestDataService.ts) or simply use the auto-completion of your IDE.

### When to use the TestDataService in tests

You should use the `TestDataService` whenever you need **test data** that matches common Shopware structures, such as:

- Creating a **basic product**, **customer**, **order**, **category**, etc.
- Setting up **media** resources like product images or digital downloads.
- Creating **promotions**, **rules**, or **payment/shipping methods**.
- Fetching existing entities via helper methods (`getCurrency()`, `getShippingMethod()`, etc.).
- **Assigning relations** between entities (e.g., linking a product to a category).

**Typical examples include:**

```typescript
const product = await TestDataService.createBasicProduct();
const customer = await TestDataService.createCustomer();
const shipping = await TestDataService.createBasicShippingMethod();
```

### When and why to extend the TestDataService

You should add new functions to the TestDataService (or extend it) when:

- Your project or plugin introduces **new entity types** (e.g., `CommercialCustomerGroup`, `CustomProductType`).
- You need a **specialized creation logic** (e.g., a shipping method with multiple rules, a pre-configured product bundle).
- Existing methods require **modifications** that should not affect the core service.
- You want to **reuse the same setup across multiple tests** without duplicating logic.
- You require **special cleanup handling** for newly created entities.

Using and extending the `TestDataService` properly ensures your acceptance tests stay **readable**, **maintainable**, and **scalable** even as your Shopware project grows.

### Available `create*` methods in TestDataService

These methods are designed to streamline the setup of test data, ensuring consistency and efficiency in your testing processes. They are much more available than listed below, but these are the most common ones. Please use your IDE auto-completion to find all available methods.

- `createBasicProduct(): Promise<Product>`
- `createVariantProducts(parentProduct: Product, propertyGroups: PropertyGroup[]): Promise<Product[]>`
- `createCustomer(): Promise<Customer>`
- `createCustomerGroup(): Promise<CustomerGroup>`
- `createOrder(lineItems: SimpleLineItem[], customer: Customer): Promise<Order>`
- `createCategory(): Promise<Category>`
- `createColorPropertyGroup(): Promise<PropertyGroup>`
- `createBasicPaymentMethod(): Promise<PaymentMethod>`
- `createBasicShippingMethod(): Promise<ShippingMethod>`

- [...]


### Available `assign*` methods in TestDataService

These methods are designed to establish associations between entities, such as linking products to categories or assigning media to manufacturers, ensuring that your test data reflects realistic scenarios. They are much more available than listed below, but these are the most common ones. Please use your IDE auto-completion to find all available methods.

- `assignProductCategory(productId: string, categoryIds: string[]): Promise<void>`
- `assignProductManufacturer(productId: string, manufacturerId: string): Promise<void>`
- `assignProductMedia(productId: string, mediaId: string): Promise<void>`

- [...]

### Available `get*` methods in TestDataService
They are much more available than listed below, but these are the most common ones. Please use your IDE auto-completion to find all available methods.

- `getCountry(iso2: string): Promise<Country>`
- `getCurrency(isoCode: string): Promise<Currency>`
- `getCustomerGroups(): Promise<CustomerGroup[]>`
- `getPaymentMethod(name = 'Invoice'): Promise<PaymentMethod>`

- [...]

### Writing new methods in `TestDataService`

If you want to add new functionality to this service — such as a new type of entity creation — you can follow this approach:

#### 1. Define the purpose

Decide whether you're creating, assigning, or retrieving data. Most methods fall into one of the following patterns:
- `create*`: Creates a new entity (e.g. product, customer, category)
- `assign*`: Links existing entities (e.g. assign media to product)
- `get*`: Retrieves specific or filtered data from the system

#### 2. Implement the method

Use the `AdminApiContext` to interact with the Shopware Admin API. Here's a simplified example of adding a method to [create a new shipping method](https://github.com/shopware/acceptance-test-suite/blob/e8d2a5e8cee2194b914aa35aa87fe7cf04060834/src/services/TestDataService.ts#L679)

#### 3. Follow naming conventions

Be consistent in naming:
- Use `createBasic*` for standardized, default setups with predefined values (e.g. `createBasicProduct`)
- Use `create*With*` for variations (e.g. `createProductWithImage`)
- Use `assign*` for methods that associate two entities (e.g. `assignProductMedia`)
- Use `get*` to retrieve specific entities or lists (e.g. `getCurrency`)

#### 4. Add a return type

Always define a return type (typically a `Promise<...>`) to improve autocompletion and documentation support.

#### 5. Add cleanup logic

Make sure to clean up the entity via code after test run by putting the entity to a record. See example below:

```typescript
async createBasicRule(): Promise<Rule> {
        [...]
                
        this.addCreatedRecord('rule', rule.id);

        [...]
    }
```

Further information you can explore in the chapter: [Automatic Cleanup](#automatic-cleanup-of-test-data-and-system-configurations)

#### 6. Test the method

Once added, use your new method inside a test to verify it works as expected (`/tests/TestDataService.spec.ts`):

```typescript
test('Verify new shipping method creation', async ({ TestDataService }) => {
    const shippingMethod = await TestDataService.createShippingMethod({
        name: 'Express Delivery'
    });

    expect(shippingMethod.name).toEqual('Express Delivery');
});
```

### Automatic cleanup of test data and system configurations

The `TestDataService` includes a built-in mechanism to ensure that any test data & system configuration entries created during a test run is automatically deleted afterward. This ensures that the Shopware instance remains clean and consistent between tests, helping to maintain **test isolation** and prevent **state leakage**.

#### How cleanup works

When you create an entity using a `create*` method (e.g., `createBasicProduct`, `createCustomer`), the service automatically registers that entity for deletion by calling the `addCreatedRecord()` method:
```typescript
this.addCreatedRecord('product', product.id);
```

These records are stored in a cleanup queue that is processed at the end of each test using the Playwright lifecycle.

#### Cleanup execution

The `cleanup()` method handles the deletion of all registered entities and system config changes. All created records are grouped into two categories: 
* Priority Deletions (`priorityDeleteOperations`) – for entities with dependencies that must be deleted first (e.g. orders, customers)
* Standard Deletions (`deleteOperations`) – for all other entities

This prioritization prevents errors when deleting interdependent data. Any modified system configurations are reset to their previous state after deleting priority records.
The priority entities can be found in the `TestDataService` class. If you want to add a new entity to the priority deletion list, you can do so by adding it to the `priorityDeleteOperations` array.

#### Skipping cleanup

In rare scenarios, such as performance testing or debugging, you may want to prevent cleanup for specific entities. You can simply skip the cleanUp by calling `TestDataService.setCleanUp(false)` within your test.


### Extending the TestDataService in external projects

The `TestDataService` is designed to be **easily extendable**. This allows you to add project-specific data generation methods while still benefiting from the existing, standardized base functionality.

#### 1. Create a new subclass

You can create a new TypeScript class that **extends** the base `TestDataService`.

```typescript
import { TestDataService } from '@shopware-ag/acceptance-test-suite';

export class CustomTestDataService extends TestDataService {
    
    async createCustomCustomerGroup(data: Partial<CustomerGroup>) {
        const response = await this.adminApi.post('customer-group?_response=true', {
            data: {
                ...
            },
        });

        const { data: createdGroup } = await response.json();
        this.addCreatedRecord('customer-group', createdGroup.id);

        return createdGroup;
    }
}
```

#### 2. Provide the extended service as a fixture

Following the Playwright [fixture system](https://playwright.dev/docs/test-fixtures) described in the README, you create a new fixture that initializes your extended service.

Example from `AcceptanceTest.ts`:

```typescript
import { test as base } from '@shopware-ag/acceptance-test-suite';
import type { FixtureTypes } from '@shopware-ag/acceptance-test-suite';
import { CustomTestDataService } from './CustomTestData';

export * from '@shopware-ag/acceptance-test-suite';

export const test = base.extend<FixtureTypes & CustomTestDataService>({
    TestDataService: async ({ AdminApiContext, DefaultSalesChannel }, use) => {
        const service = new CustomTestDataService(AdminApiContext, DefaultSalesChannel);
        await use(service);
        await service.cleanUp();
    },
});
```

In this setup:
- The `TestDataService` fixture is **overridden** with your custom `CustomTestDataService`.
- Now all tests that use `TestDataService` will have access to both the original and your extended methods.
- The automated cleanup is still in place, ensuring that any test data created during the test run is removed afterward.

