# Changelog


## [3.11.4](https://github.com/shopware/acceptance-test-suite/compare/v3.11.4...v3.11.4) (2024-11-08)


### ⚠ BREAKING CHANGES

* change discount to promo property in page object 2 ([#161](https://github.com/shopware/acceptance-test-suite/issues/161))
* change discount text to promo text
* `email` parameter is required in `getRenderMessageTxt()`,`getLinkFromMail()` and `getEmailBody()`
* Removed dependency between data fixtures and page objects.

### Features

* add a page object for the off canvas cart ([#115](https://github.com/shopware/acceptance-test-suite/issues/115)) ([5a8f163](https://github.com/shopware/acceptance-test-suite/commit/5a8f163968f771f8c4a7628af094b4b29ef4907e))
* Add additional page objects for storefront account ([77a1698](https://github.com/shopware/acceptance-test-suite/commit/77a1698652a0f7fa7b0c1e39b935921ce5476947))
* add basic delivery struct to use it for overriding ([#73](https://github.com/shopware/acceptance-test-suite/issues/73)) ([1a1340b](https://github.com/shopware/acceptance-test-suite/commit/1a1340b1501c96456d3d725f06c70d88bba15100))
* add dashboard and data sharing fixture ([8f140f8](https://github.com/shopware/acceptance-test-suite/commit/8f140f8001b90a1dc35723ba419e0447d3dddf09))
* Add EmailApiContext ([aa20749](https://github.com/shopware/acceptance-test-suite/commit/aa20749991c5abc2710cb770920bd18c0094611b))
* Add EmailApiContext ([c3a6092](https://github.com/shopware/acceptance-test-suite/commit/c3a6092faf27aaa1f4f40dcb321c86e3a06750c5))
* add feature service ([0d7b80f](https://github.com/shopware/acceptance-test-suite/commit/0d7b80ff7528d1b63e6f663ef1d3ebf82a7aeffc))
* add flowbuilder properties ([#131](https://github.com/shopware/acceptance-test-suite/issues/131)) ([92df111](https://github.com/shopware/acceptance-test-suite/commit/92df111d41e7cf4530fe12cb142edf329ed916f3))
* add function to get the line items on the checkout cart page ([#109](https://github.com/shopware/acceptance-test-suite/issues/109)) ([4b32baa](https://github.com/shopware/acceptance-test-suite/commit/4b32baa24cbce3d596bd735b16ce97ae2e40aa3b))
* add isSaaSInstance helper function ([43e08cd](https://github.com/shopware/acceptance-test-suite/commit/43e08cdcc65ee1759987bf6fbef2c77825d30d4c))
* add landing page and category helpers ([24b14e4](https://github.com/shopware/acceptance-test-suite/commit/24b14e4f0550697d1e7b7c03b3c65886139d3e72))
* add locators to home and product detail page ([#103](https://github.com/shopware/acceptance-test-suite/issues/103)) ([d58e786](https://github.com/shopware/acceptance-test-suite/commit/d58e7860cabecd3d79791955c115114b519be743))
* Add order status helper method ([565c355](https://github.com/shopware/acceptance-test-suite/commit/565c355f3ac832a5a3389207c81685c910f2c58f))
* Add page object and data fixture for category ([40eddaf](https://github.com/shopware/acceptance-test-suite/commit/40eddafb3a3319c6257b39d93067ce2b918c5950))
* add payment method creation possibility and small refactorings ([#95](https://github.com/shopware/acceptance-test-suite/issues/95)) ([ad4633e](https://github.com/shopware/acceptance-test-suite/commit/ad4633e19066af75c726ca1e30517762fdb3daf5))
* add possibility to add a basic rule with predefined container ([#96](https://github.com/shopware/acceptance-test-suite/issues/96)) ([b9aef01](https://github.com/shopware/acceptance-test-suite/commit/b9aef01c0b23d5bce2ec4cdb785b3a60a4c5e951))
* add possibility to create variants out of property groups ([#110](https://github.com/shopware/acceptance-test-suite/issues/110)) ([ee8ee43](https://github.com/shopware/acceptance-test-suite/commit/ee8ee43e34d46424f0fdebeb180e8d53bdc3ce7c))
* Add possibility to use custom customer for Login task ([#78](https://github.com/shopware/acceptance-test-suite/issues/78)) ([4d99053](https://github.com/shopware/acceptance-test-suite/commit/4d99053ed0c5b7f899996dd6d3944f3b2b0c875b))
* add promotion to order ([#75](https://github.com/shopware/acceptance-test-suite/issues/75)) ([50fa05d](https://github.com/shopware/acceptance-test-suite/commit/50fa05d38584adcdc538e3b7ff788e3e3582ad45))
* add quantity task in cart and new cart locator ([#101](https://github.com/shopware/acceptance-test-suite/issues/101)) ([45f4a8d](https://github.com/shopware/acceptance-test-suite/commit/45f4a8deebd972cd8e124146511e73b088c1c401))
* add release automation release please ([3aa7dee](https://github.com/shopware/acceptance-test-suite/commit/3aa7dee25877aea05651996a1245d61cd3692bc1))
* add shipping listing page ([#133](https://github.com/shopware/acceptance-test-suite/issues/133)) ([fcf9e55](https://github.com/shopware/acceptance-test-suite/commit/fcf9e5548090f3c8b64f1ee546d30f6b6499fcc8))
* Add Single Price Locator on PDP ([#82](https://github.com/shopware/acceptance-test-suite/issues/82)) ([a223d67](https://github.com/shopware/acceptance-test-suite/commit/a223d67d6dc43bfe96261ecd20758012591d9b92))
* Add task for accessibility testing with axe core ([55cf6ec](https://github.com/shopware/acceptance-test-suite/commit/55cf6ec45c6c3f9fc41e466457269779e9381bde))
* Add the postal code on registratio ([5e3f39c](https://github.com/shopware/acceptance-test-suite/commit/5e3f39cf847e77e8b3abe80b5a741790d8e1f715))
* adjust page object property BREAKING CHANGE: change discount text to promo text ([ea3d3da](https://github.com/shopware/acceptance-test-suite/commit/ea3d3da6c7bd132b093ad16e077c0aa579d0ffd8))
* adjust the shipping method documenation ([#136](https://github.com/shopware/acceptance-test-suite/issues/136)) ([70e7c94](https://github.com/shopware/acceptance-test-suite/commit/70e7c94e18c4c77ca8060d67f7b7ca293b8adeb5))
* admin - add notification await ([8dc0f56](https://github.com/shopware/acceptance-test-suite/commit/8dc0f56192653dceb8ff687971606c7e71105715))
* admin - hide symfony toolbar on page reload ([bb4ec9a](https://github.com/shopware/acceptance-test-suite/commit/bb4ec9a164db3ecad34fad189ce4ea4d2dbfc609))
* cache theme compile and make async theme compile more reliable ([5d1a49e](https://github.com/shopware/acceptance-test-suite/commit/5d1a49e8e663c5080bf760c0df3f520741f0e3c2))
* change discount to promo property in page object 2 ([#161](https://github.com/shopware/acceptance-test-suite/issues/161)) ([ad3b78e](https://github.com/shopware/acceptance-test-suite/commit/ad3b78ef7b4da9fd0243b653312f53e67813538d))
* change discount to promote code  BREAKING CHANGE: change discount to promote code ([bee7c78](https://github.com/shopware/acceptance-test-suite/commit/bee7c78c0e5901a463bf43e631986bfe74be425f))
* create manufacturer test data ([#70](https://github.com/shopware/acceptance-test-suite/issues/70)) ([6aef819](https://github.com/shopware/acceptance-test-suite/commit/6aef81909a3a2ed9f1dd85946d7c1d98d2185930))
* define page and context from AdminPage ([cbe6e57](https://github.com/shopware/acceptance-test-suite/commit/cbe6e57a05c2ec4719bbb3b666e9e6d009a9b512))
* extend SimpleLineItem interface to use overrides in lineItem ([#91](https://github.com/shopware/acceptance-test-suite/issues/91)) ([409614d](https://github.com/shopware/acceptance-test-suite/commit/409614d125430621243c4d8d26e7cca89dc80ec2))
* First iteration of a new Test Data Service ([abf72ed](https://github.com/shopware/acceptance-test-suite/commit/abf72edafd2aeeba7a03cb676dbb1cfada3fbbe5))
* Improve MailpitApiContext ([#79](https://github.com/shopware/acceptance-test-suite/issues/79)) ([9e99e7c](https://github.com/shopware/acceptance-test-suite/commit/9e99e7c4cdc1ce3d307aa823d9b3a0d26a3f309d))
* Improved accessibility testing ([984e787](https://github.com/shopware/acceptance-test-suite/commit/984e78729fd4cb7494f62961f890a0ad28a5b4d2))
* make theme compilation compatible with SaaS instances ([3b6fcf9](https://github.com/shopware/acceptance-test-suite/commit/3b6fcf902ae9bf7b4e622a0db001ddc3f163a1eb))
* release try ([#158](https://github.com/shopware/acceptance-test-suite/issues/158)) ([e249e5d](https://github.com/shopware/acceptance-test-suite/commit/e249e5d5a94c9b1553816d10fdb199d32cca1643))
* Update Playwright to version 1.45.0 ([2c0161e](https://github.com/shopware/acceptance-test-suite/commit/2c0161ed7be6fc03cd8521f8445553f4a54962e8))


### Bug Fixes

* add last price range with infinity validity ([#105](https://github.com/shopware/acceptance-test-suite/issues/105)) ([e547f50](https://github.com/shopware/acceptance-test-suite/commit/e547f5050fd144d6b86f3a5ff8758fc211882c3e))
* Add local type overrides ([870931c](https://github.com/shopware/acceptance-test-suite/commit/870931cac9cb02b1fb4838d1d0e4ae1c5fca6d8f))
* add product configuration entity creation to variants operation ([#120](https://github.com/shopware/acceptance-test-suite/issues/120)) ([f47e1e7](https://github.com/shopware/acceptance-test-suite/commit/f47e1e78fae1b10794beb3e8d2cdc36c93b90572))
* add shipping method creation within test data service ([#114](https://github.com/shopware/acceptance-test-suite/issues/114)) ([5265dff](https://github.com/shopware/acceptance-test-suite/commit/5265dffc1a4e730079a78d6b5021be0b1cd18ebe))
* adjust package-lock ([#157](https://github.com/shopware/acceptance-test-suite/issues/157)) ([b6950bb](https://github.com/shopware/acceptance-test-suite/commit/b6950bb2e49bb210b6925042c554fba837ac3caa))
* adjust page object property ([9cfe07d](https://github.com/shopware/acceptance-test-suite/commit/9cfe07d1fb591643ef4665ea71e4936fb5449686))
* adjust page object property BREAKING CHANGE: change discount text to promo text ([9cfe07d](https://github.com/shopware/acceptance-test-suite/commit/9cfe07d1fb591643ef4665ea71e4936fb5449686))
* always add default language to sales channel to avoid issues ([2cfa199](https://github.com/shopware/acceptance-test-suite/commit/2cfa19986a8d3d1d389f3a3f47e6ba1f5dd7d3f5))
* always set prices with the defaul sales channel currency ([cda11fc](https://github.com/shopware/acceptance-test-suite/commit/cda11fc621c5b4628be990b1c0bfcdd62c9f71fc))
* Cart quantity select locator ([2e8eed0](https://github.com/shopware/acceptance-test-suite/commit/2e8eed0022167822dcf68569443685d6acf65c26))
* Cart quantity select locator ([366d148](https://github.com/shopware/acceptance-test-suite/commit/366d1486ceb1844608e1286e8773e4c5f70eb5cb))
* Change AccountOrder orderExpandButton to locator ([c4facc9](https://github.com/shopware/acceptance-test-suite/commit/c4facc9958974447e8452bafe38f2ba85eedc071))
* code style ([42b0b7f](https://github.com/shopware/acceptance-test-suite/commit/42b0b7f08efa6f3d52bc5bdae6389438b2ea8ddb))
* correct locator and some refactors ([4983e82](https://github.com/shopware/acceptance-test-suite/commit/4983e82a875feb819ea19c66a4f6bc13b5164493))
* correct locator and some refactors ([4983e82](https://github.com/shopware/acceptance-test-suite/commit/4983e82a875feb819ea19c66a4f6bc13b5164493))
* correct version ([5b51c51](https://github.com/shopware/acceptance-test-suite/commit/5b51c51ce6395fb35eac5d3421a09a428e98e1f5))
* create version 4.0.0 ([4933b78](https://github.com/shopware/acceptance-test-suite/commit/4933b78c80f696e1831e74e267a692b86c3ba0fb))
* data dependency between fixtures ([43474ee](https://github.com/shopware/acceptance-test-suite/commit/43474ee170766029f798dba9fc0d653207c40df1))
* delete th from price range locator ([#107](https://github.com/shopware/acceptance-test-suite/issues/107)) ([9ca0945](https://github.com/shopware/acceptance-test-suite/commit/9ca0945a2151560f7f119772eb84edaa43846b43))
* disable feedback prompt by mocking nps/active-trigger ([44963d1](https://github.com/shopware/acceptance-test-suite/commit/44963d18e9b7c7276ba410b2e09332386969288e))
* discount text to promo text ([dfc15fe](https://github.com/shopware/acceptance-test-suite/commit/dfc15feea608080ba2c862c8206def1ac75b7754))
* discount text to promo text ([2bfa648](https://github.com/shopware/acceptance-test-suite/commit/2bfa64808cb10e8168502e86792accdb0c73d1b2))
* feature service ([1986b8c](https://github.com/shopware/acceptance-test-suite/commit/1986b8c2f952611ef37e9d9925743868f1e8a860))
* fix login on saas instances ([4af4ce4](https://github.com/shopware/acceptance-test-suite/commit/4af4ce48dad633493db82b68471ff50d490f735e))
* fix saas instance setup ([d5d3e74](https://github.com/shopware/acceptance-test-suite/commit/d5d3e7465db0945d3ad5d4988af45e62c63f81d6))
* fix type errors ([beca984](https://github.com/shopware/acceptance-test-suite/commit/beca9849121e9454a0469958fcc16ba8fb35cd2f))
* hold class name - add admin prefix to reference only ([0594e0a](https://github.com/shopware/acceptance-test-suite/commit/0594e0a2b15002f292a4f50d73bd471567821788))
* Home page object url ([8330e78](https://github.com/shopware/acceptance-test-suite/commit/8330e7888c72dc67980a3a66374f6996274d0cbc))
* Improve product type definition ([4c20b9b](https://github.com/shopware/acceptance-test-suite/commit/4c20b9b461b34165269adcc4731394c327c7078a))
* Improved data cleanup of TestDataService ([b7c2d3c](https://github.com/shopware/acceptance-test-suite/commit/b7c2d3c838fee0015f1485b5cc88b6883a7ef9e3))
* make ATS compatible with 6.5.x ([1b9cc9e](https://github.com/shopware/acceptance-test-suite/commit/1b9cc9e3e74f84f152cd3ccde48d204c74796c6d))
* make page object props public ([a85ff8d](https://github.com/shopware/acceptance-test-suite/commit/a85ff8d4731881ac8cfcca7017cdec825c18f10d))
* missing installer page context for installer test ([bddb8ab](https://github.com/shopware/acceptance-test-suite/commit/bddb8ab4446503d10318184d0e84926cb62d4251))
* move sections to getBasicStruct ([42b0b7f](https://github.com/shopware/acceptance-test-suite/commit/42b0b7f08efa6f3d52bc5bdae6389438b2ea8ddb))
* move the theme compilation into the StorefrontPage fixture ([89470a0](https://github.com/shopware/acceptance-test-suite/commit/89470a008ddf19f32896dce396cd938c946a41ac))
* npm registry ([#155](https://github.com/shopware/acceptance-test-suite/issues/155)) ([161828e](https://github.com/shopware/acceptance-test-suite/commit/161828e37359674b84d4395c61516df1d863c25b))
* product fixture with non-standard currency ([bfca54d](https://github.com/shopware/acceptance-test-suite/commit/bfca54d77e1cfc6bcc243593b03ccf039144c3d6))
* Refactor digital product and order fixture ([c277755](https://github.com/shopware/acceptance-test-suite/commit/c27775523b816d4b98905772e2bac0c47c47d7d4))
* refactor getFlowId helper method ([b76e2cf](https://github.com/shopware/acceptance-test-suite/commit/b76e2cf107fb8c86ac3c11db19681f496a887690))
* refactor task interface ([ac19c91](https://github.com/shopware/acceptance-test-suite/commit/ac19c917f759f588008ba2c3bd2f8ee62596cc58))
* Remove the order deletion after each DefaultSalesChannel fixture initialization ([#76](https://github.com/shopware/acceptance-test-suite/issues/76)) ([b3f450a](https://github.com/shopware/acceptance-test-suite/commit/b3f450a9098da2f5a75e991278d4bc79d14ad0b4))
* return type of variant product function to product ([#112](https://github.com/shopware/acceptance-test-suite/issues/112)) ([9da5607](https://github.com/shopware/acceptance-test-suite/commit/9da5607e243249f1df24f82e13f5fe8ee81dfad2))
* return value leads to aborts of test projects ([b0322d6](https://github.com/shopware/acceptance-test-suite/commit/b0322d64ec47b7213ad515b3136ccba52a182b15))
* revert 4.0.0 ([3163e13](https://github.com/shopware/acceptance-test-suite/commit/3163e13baf4f43015010ea592c4aae5268122b11))
* revert breaking change as 3.11.3 ([c2dda17](https://github.com/shopware/acceptance-test-suite/commit/c2dda1746ed12d21298e899cb8d6633e40a8ebbe))
* revert promo code definition ([#159](https://github.com/shopware/acceptance-test-suite/issues/159)) ([6c0ca35](https://github.com/shopware/acceptance-test-suite/commit/6c0ca35749fe29d3597d1553ee4b84db7d66c4db))
* run product indexer after generating variants ([cc928ec](https://github.com/shopware/acceptance-test-suite/commit/cc928ec035bdb0ba41c90eec39709e26781732cc))
* Update playwright and use compatible version prefix ([11ffd1b](https://github.com/shopware/acceptance-test-suite/commit/11ffd1be649706f24d00216ac25f894734c8966b))
* update version to 3.11.2 ([42b0b7f](https://github.com/shopware/acceptance-test-suite/commit/42b0b7f08efa6f3d52bc5bdae6389438b2ea8ddb))
* use correct api route to generate access keys ([8d588ed](https://github.com/shopware/acceptance-test-suite/commit/8d588edaf5cb0cee4283bf5e3ff887dda8d9b87f))
* Use regex for button content instead of class selector ([2f1eec4](https://github.com/shopware/acceptance-test-suite/commit/2f1eec4ab333743a74c111dd631e35ce09cc1173))
* use sales channel language id for default customer ([1b1bdf1](https://github.com/shopware/acceptance-test-suite/commit/1b1bdf130399155ad1975cc5cc2fb1c9bfc1d99a))
* wait for all plugin js files ([d5ee65b](https://github.com/shopware/acceptance-test-suite/commit/d5ee65b5330074eb6d4d5d1a145aef321c5bdf12))
* wait for js scripts to load in admin ([02525bd](https://github.com/shopware/acceptance-test-suite/commit/02525bd3053dcfeef0b2ba9d24b0f5c8a2f17437))
* wait for plugins/apps that actually have js ([ab9b732](https://github.com/shopware/acceptance-test-suite/commit/ab9b7327cdfe29df1e7c7aa41db0a9e325a4825f))


### Miscellaneous Chores

* release 2.3.6 ([275c568](https://github.com/shopware/acceptance-test-suite/commit/275c5689214094ecaa2ab76457ab8baf1d58a6a3))
* release 3.11.4 ([2bddd8b](https://github.com/shopware/acceptance-test-suite/commit/2bddd8bcfa5844f0125acb221227020841f6b13e))
* release 3.11.4 ([#163](https://github.com/shopware/acceptance-test-suite/issues/163)) ([47f6ed7](https://github.com/shopware/acceptance-test-suite/commit/47f6ed7fd879e3037920c68f680c145a21b65baa))
* release 3.11.4 ([#165](https://github.com/shopware/acceptance-test-suite/issues/165)) ([6272437](https://github.com/shopware/acceptance-test-suite/commit/6272437383586bf4b4b99f44a979bdeabf6aa2ed))


### Code Refactoring

* Removed dependency between data fixtures and page objects. ([7879c5a](https://github.com/shopware/acceptance-test-suite/commit/7879c5a5c9c15701da86f9ee5afe9fad25a32578))

## [3.11.3](https://github.com/shopware/acceptance-test-suite/compare/v3.11.2...v3.11.3) (2024-11-07)
        

### Bug Fixes

* Cart quantity select locator ([366d148](https://github.com/shopware/acceptance-test-suite/commit/366d1486ceb1844608e1286e8773e4c5f70eb5cb))
* revert breaking change as 3.11.3 ([c2dda17](https://github.com/shopware/acceptance-test-suite/commit/c2dda1746ed12d21298e899cb8d6633e40a8ebbe))

## [3.11.2](https://github.com/shopware/acceptance-test-suite/compare/v3.11.1...v3.11.2) (2024-11-06)


### Bug Fixes

* discount text to promo text ([2bfa648](https://github.com/shopware/acceptance-test-suite/commit/2bfa64808cb10e8168502e86792accdb0c73d1b2))

## [3.11.1](https://github.com/shopware/acceptance-test-suite/compare/v3.11.0...v3.11.1) (2024-10-31)


### Bug Fixes

* missing installer page context for installer test ([bddb8ab](https://github.com/shopware/acceptance-test-suite/commit/bddb8ab4446503d10318184d0e84926cb62d4251))

## [3.11.0](https://github.com/shopware/acceptance-test-suite/compare/v3.10.0...v3.11.0) (2024-10-25)


### Features

* add shipping listing page ([#133](https://github.com/shopware/acceptance-test-suite/issues/133)) ([fcf9e55](https://github.com/shopware/acceptance-test-suite/commit/fcf9e5548090f3c8b64f1ee546d30f6b6499fcc8))


### Bug Fixes

* hold class name - add admin prefix to reference only ([0594e0a](https://github.com/shopware/acceptance-test-suite/commit/0594e0a2b15002f292a4f50d73bd471567821788))

## [3.10.0](https://github.com/shopware/acceptance-test-suite/compare/v3.9.0...v3.10.0) (2024-10-24)


### Features

* add flowbuilder properties ([#131](https://github.com/shopware/acceptance-test-suite/issues/131)) ([92df111](https://github.com/shopware/acceptance-test-suite/commit/92df111d41e7cf4530fe12cb142edf329ed916f3))
* adjust the shipping method documenation ([#136](https://github.com/shopware/acceptance-test-suite/issues/136)) ([70e7c94](https://github.com/shopware/acceptance-test-suite/commit/70e7c94e18c4c77ca8060d67f7b7ca293b8adeb5))

## [3.9.0](https://github.com/shopware/acceptance-test-suite/compare/v3.8.4...v3.9.0) (2024-10-15)


### Features

* define page and context from AdminPage ([cbe6e57](https://github.com/shopware/acceptance-test-suite/commit/cbe6e57a05c2ec4719bbb3b666e9e6d009a9b512))

## [3.8.4](https://github.com/shopware/acceptance-test-suite/compare/v3.8.3...v3.8.4) (2024-09-19)


### Bug Fixes

* Change AccountOrder orderExpandButton to locator ([c4facc9](https://github.com/shopware/acceptance-test-suite/commit/c4facc9958974447e8452bafe38f2ba85eedc071))
* Use regex for button content instead of class selector ([2f1eec4](https://github.com/shopware/acceptance-test-suite/commit/2f1eec4ab333743a74c111dd631e35ce09cc1173))

## [3.8.3](https://github.com/shopware/acceptance-test-suite/compare/v3.8.2...v3.8.3) (2024-09-12)


### Bug Fixes

* run product indexer after generating variants ([cc928ec](https://github.com/shopware/acceptance-test-suite/commit/cc928ec035bdb0ba41c90eec39709e26781732cc))

## [3.8.2](https://github.com/shopware/acceptance-test-suite/compare/v3.8.1...v3.8.2) (2024-09-12)


### Bug Fixes

* add product configuration entity creation to variants operation ([#120](https://github.com/shopware/acceptance-test-suite/issues/120)) ([f47e1e7](https://github.com/shopware/acceptance-test-suite/commit/f47e1e78fae1b10794beb3e8d2cdc36c93b90572))
* make ATS compatible with 6.5.x ([1b9cc9e](https://github.com/shopware/acceptance-test-suite/commit/1b9cc9e3e74f84f152cd3ccde48d204c74796c6d))

## [3.8.1](https://github.com/shopware/acceptance-test-suite/compare/v3.8.0...v3.8.1) (2024-09-10)


### Bug Fixes

* add shipping method creation within test data service ([#114](https://github.com/shopware/acceptance-test-suite/issues/114)) ([5265dff](https://github.com/shopware/acceptance-test-suite/commit/5265dffc1a4e730079a78d6b5021be0b1cd18ebe))

## [3.8.0](https://github.com/shopware/acceptance-test-suite/compare/v3.7.0...v3.8.0) (2024-09-09)


### Features

* add a page object for the off canvas cart ([#115](https://github.com/shopware/acceptance-test-suite/issues/115)) ([5a8f163](https://github.com/shopware/acceptance-test-suite/commit/5a8f163968f771f8c4a7628af094b4b29ef4907e))

## [3.7.0](https://github.com/shopware/acceptance-test-suite/compare/v3.6.2...v3.7.0) (2024-09-06)


### Features

* add function to get the line items on the checkout cart page ([#109](https://github.com/shopware/acceptance-test-suite/issues/109)) ([4b32baa](https://github.com/shopware/acceptance-test-suite/commit/4b32baa24cbce3d596bd735b16ce97ae2e40aa3b))
* add possibility to create variants out of property groups ([#110](https://github.com/shopware/acceptance-test-suite/issues/110)) ([ee8ee43](https://github.com/shopware/acceptance-test-suite/commit/ee8ee43e34d46424f0fdebeb180e8d53bdc3ce7c))


### Bug Fixes

* return type of variant product function to product ([#112](https://github.com/shopware/acceptance-test-suite/issues/112)) ([9da5607](https://github.com/shopware/acceptance-test-suite/commit/9da5607e243249f1df24f82e13f5fe8ee81dfad2))

## [3.6.2](https://github.com/shopware/acceptance-test-suite/compare/v3.6.1...v3.6.2) (2024-09-03)


### Bug Fixes

* delete th from price range locator ([#107](https://github.com/shopware/acceptance-test-suite/issues/107)) ([9ca0945](https://github.com/shopware/acceptance-test-suite/commit/9ca0945a2151560f7f119772eb84edaa43846b43))

## [3.6.1](https://github.com/shopware/acceptance-test-suite/compare/v3.6.0...v3.6.1) (2024-09-02)


### Bug Fixes

* add last price range with infinity validity ([#105](https://github.com/shopware/acceptance-test-suite/issues/105)) ([e547f50](https://github.com/shopware/acceptance-test-suite/commit/e547f5050fd144d6b86f3a5ff8758fc211882c3e))

## [3.6.0](https://github.com/shopware/acceptance-test-suite/compare/v3.5.0...v3.6.0) (2024-08-30)


### Features

* add locators to home and product detail page ([#103](https://github.com/shopware/acceptance-test-suite/issues/103)) ([d58e786](https://github.com/shopware/acceptance-test-suite/commit/d58e7860cabecd3d79791955c115114b519be743))

## [3.5.0](https://github.com/shopware/acceptance-test-suite/compare/v3.4.0...v3.5.0) (2024-08-30)


### Features

* add quantity task in cart and new cart locator ([#101](https://github.com/shopware/acceptance-test-suite/issues/101)) ([45f4a8d](https://github.com/shopware/acceptance-test-suite/commit/45f4a8deebd972cd8e124146511e73b088c1c401))

## [3.4.0](https://github.com/shopware/acceptance-test-suite/compare/v3.3.0...v3.4.0) (2024-08-29)


### Features

* Add the postal code on registratio ([5e3f39c](https://github.com/shopware/acceptance-test-suite/commit/5e3f39cf847e77e8b3abe80b5a741790d8e1f715))

## [3.3.0](https://github.com/shopware/acceptance-test-suite/compare/v3.2.0...v3.3.0) (2024-08-23)


### Features

* add possibility to add a basic rule with predefined container ([#96](https://github.com/shopware/acceptance-test-suite/issues/96)) ([b9aef01](https://github.com/shopware/acceptance-test-suite/commit/b9aef01c0b23d5bce2ec4cdb785b3a60a4c5e951))

## [3.2.0](https://github.com/shopware/acceptance-test-suite/compare/v3.1.0...v3.2.0) (2024-08-22)


### Features

* add payment method creation possibility and small refactorings ([#95](https://github.com/shopware/acceptance-test-suite/issues/95)) ([ad4633e](https://github.com/shopware/acceptance-test-suite/commit/ad4633e19066af75c726ca1e30517762fdb3daf5))
* Add possibility to use custom customer for Login task ([#78](https://github.com/shopware/acceptance-test-suite/issues/78)) ([4d99053](https://github.com/shopware/acceptance-test-suite/commit/4d99053ed0c5b7f899996dd6d3944f3b2b0c875b))

## [3.0.0](https://github.com/shopware/acceptance-test-suite/compare/v2.8.1...v3.0.0) (2024-08-14)


### ⚠ BREAKING CHANGES

* `email` parameter is required in `getRenderMessageTxt()`,`getLinkFromMail()` and `getEmailBody()`

### Features

* Improve MailpitApiContext ([#79](https://github.com/shopware/acceptance-test-suite/issues/79)) ([9e99e7c](https://github.com/shopware/acceptance-test-suite/commit/9e99e7c4cdc1ce3d307aa823d9b3a0d26a3f309d))

## [2.8.1](https://github.com/shopware/acceptance-test-suite/compare/v2.8.0...v2.8.1) (2024-08-14)


### Bug Fixes

* feature service ([1986b8c](https://github.com/shopware/acceptance-test-suite/commit/1986b8c2f952611ef37e9d9925743868f1e8a860))

## [2.8.0](https://github.com/shopware/acceptance-test-suite/compare/v2.7.0...v2.8.0) (2024-08-13)


### Features

* add feature service ([0d7b80f](https://github.com/shopware/acceptance-test-suite/commit/0d7b80ff7528d1b63e6f663ef1d3ebf82a7aeffc))
* admin - add notification await ([8dc0f56](https://github.com/shopware/acceptance-test-suite/commit/8dc0f56192653dceb8ff687971606c7e71105715))

## [2.7.0](https://github.com/shopware/acceptance-test-suite/compare/v2.6.0...v2.7.0) (2024-08-13)


### Features

* Add Single Price Locator on PDP ([#82](https://github.com/shopware/acceptance-test-suite/issues/82)) ([a223d67](https://github.com/shopware/acceptance-test-suite/commit/a223d67d6dc43bfe96261ecd20758012591d9b92))
* admin - hide symfony toolbar on page reload ([bb4ec9a](https://github.com/shopware/acceptance-test-suite/commit/bb4ec9a164db3ecad34fad189ce4ea4d2dbfc609))

## [2.6.0](https://github.com/shopware/acceptance-test-suite/compare/v2.5.0...v2.6.0) (2024-08-02)


### Features

* add basic delivery struct to use it for overriding ([#73](https://github.com/shopware/acceptance-test-suite/issues/73)) ([1a1340b](https://github.com/shopware/acceptance-test-suite/commit/1a1340b1501c96456d3d725f06c70d88bba15100))
* add promotion to order ([#75](https://github.com/shopware/acceptance-test-suite/issues/75)) ([50fa05d](https://github.com/shopware/acceptance-test-suite/commit/50fa05d38584adcdc538e3b7ff788e3e3582ad45))


### Bug Fixes

* Remove the order deletion after each DefaultSalesChannel fixture initialization ([#76](https://github.com/shopware/acceptance-test-suite/issues/76)) ([b3f450a](https://github.com/shopware/acceptance-test-suite/commit/b3f450a9098da2f5a75e991278d4bc79d14ad0b4))

## [2.5.0](https://github.com/shopware/acceptance-test-suite/compare/v2.4.0...v2.5.0) (2024-07-31)


### Features

* create manufacturer test data ([#70](https://github.com/shopware/acceptance-test-suite/issues/70)) ([6aef819](https://github.com/shopware/acceptance-test-suite/commit/6aef81909a3a2ed9f1dd85946d7c1d98d2185930))
* Improved accessibility testing ([984e787](https://github.com/shopware/acceptance-test-suite/commit/984e78729fd4cb7494f62961f890a0ad28a5b4d2))

## [2.4.0](https://github.com/shopware/acceptance-test-suite/compare/v2.3.11...v2.4.0) (2024-07-29)


### Features

* Add EmailApiContext ([aa20749](https://github.com/shopware/acceptance-test-suite/commit/aa20749991c5abc2710cb770920bd18c0094611b))
* Add EmailApiContext ([c3a6092](https://github.com/shopware/acceptance-test-suite/commit/c3a6092faf27aaa1f4f40dcb321c86e3a06750c5))

## [2.3.11](https://github.com/shopware/acceptance-test-suite/compare/v2.3.10...v2.3.11) (2024-07-19)


### Bug Fixes

* return value leads to aborts of test projects ([b0322d6](https://github.com/shopware/acceptance-test-suite/commit/b0322d64ec47b7213ad515b3136ccba52a182b15))

## [2.3.10](https://github.com/shopware/acceptance-test-suite/compare/v2.3.9...v2.3.10) (2024-07-16)


### Bug Fixes

* wait for all plugin js files ([d5ee65b](https://github.com/shopware/acceptance-test-suite/commit/d5ee65b5330074eb6d4d5d1a145aef321c5bdf12))

## [2.3.9](https://github.com/shopware/acceptance-test-suite/compare/v2.3.8...v2.3.9) (2024-07-15)


### Bug Fixes

* wait for plugins/apps that actually have js ([ab9b732](https://github.com/shopware/acceptance-test-suite/commit/ab9b7327cdfe29df1e7c7aa41db0a9e325a4825f))

## [2.3.8](https://github.com/shopware/acceptance-test-suite/compare/v2.3.7...v2.3.8) (2024-07-15)


### Bug Fixes

* disable feedback prompt by mocking nps/active-trigger ([44963d1](https://github.com/shopware/acceptance-test-suite/commit/44963d18e9b7c7276ba410b2e09332386969288e))
* wait for js scripts to load in admin ([02525bd](https://github.com/shopware/acceptance-test-suite/commit/02525bd3053dcfeef0b2ba9d24b0f5c8a2f17437))

## [2.3.7](https://github.com/shopware/acceptance-test-suite/compare/v2.3.6...v2.3.7) (2024-07-05)


### Bug Fixes

* always add default language to sales channel to avoid issues ([2cfa199](https://github.com/shopware/acceptance-test-suite/commit/2cfa19986a8d3d1d389f3a3f47e6ba1f5dd7d3f5))

## [2.3.6](https://github.com/shopware/acceptance-test-suite/compare/v2.3.5...v2.3.6) (2024-07-05)


### Miscellaneous Chores

* release 2.3.6 ([275c568](https://github.com/shopware/acceptance-test-suite/commit/275c5689214094ecaa2ab76457ab8baf1d58a6a3))

## [2.3.5](https://github.com/shopware/acceptance-test-suite/compare/v2.3.4...v2.3.5) (2024-07-05)


### Bug Fixes

* always set prices with the defaul sales channel currency ([cda11fc](https://github.com/shopware/acceptance-test-suite/commit/cda11fc621c5b4628be990b1c0bfcdd62c9f71fc))

## [2.3.4](https://github.com/shopware/acceptance-test-suite/compare/v2.3.3...v2.3.4) (2024-07-04)


### Bug Fixes

* fix type errors ([beca984](https://github.com/shopware/acceptance-test-suite/commit/beca9849121e9454a0469958fcc16ba8fb35cd2f))

## [2.3.3](https://github.com/shopware/acceptance-test-suite/compare/v2.3.2...v2.3.3) (2024-07-04)


### Bug Fixes

* fix saas instance setup ([d5d3e74](https://github.com/shopware/acceptance-test-suite/commit/d5d3e7465db0945d3ad5d4988af45e62c63f81d6))

## [2.3.2](https://github.com/shopware/acceptance-test-suite/compare/v2.3.1...v2.3.2) (2024-06-28)


### Bug Fixes

* move the theme compilation into the StorefrontPage fixture ([89470a0](https://github.com/shopware/acceptance-test-suite/commit/89470a008ddf19f32896dce396cd938c946a41ac))

## [2.3.1](https://github.com/shopware/acceptance-test-suite/compare/v2.3.0...v2.3.1) (2024-06-27)


### Bug Fixes

* Improved data cleanup of TestDataService ([b7c2d3c](https://github.com/shopware/acceptance-test-suite/commit/b7c2d3c838fee0015f1485b5cc88b6883a7ef9e3))

## [2.3.0](https://github.com/shopware/acceptance-test-suite/compare/v2.2.0...v2.3.0) (2024-06-26)


### Features

* cache theme compile and make async theme compile more reliable ([5d1a49e](https://github.com/shopware/acceptance-test-suite/commit/5d1a49e8e663c5080bf760c0df3f520741f0e3c2))

## [2.2.0](https://github.com/shopware/acceptance-test-suite/compare/v2.1.0...v2.2.0) (2024-06-25)


### Features

* Update Playwright to version 1.45.0 ([2c0161e](https://github.com/shopware/acceptance-test-suite/commit/2c0161ed7be6fc03cd8521f8445553f4a54962e8))

## [2.1.0](https://github.com/shopware/acceptance-test-suite/compare/v2.0.1...v2.1.0) (2024-06-25)


### Features

* First iteration of a new Test Data Service ([abf72ed](https://github.com/shopware/acceptance-test-suite/commit/abf72edafd2aeeba7a03cb676dbb1cfada3fbbe5))
* make theme compilation compatible with SaaS instances ([3b6fcf9](https://github.com/shopware/acceptance-test-suite/commit/3b6fcf902ae9bf7b4e622a0db001ddc3f163a1eb))

## [2.0.1](https://github.com/shopware/acceptance-test-suite/compare/v2.0.0...v2.0.1) (2024-06-12)


### Bug Fixes

* Home page object url ([8330e78](https://github.com/shopware/acceptance-test-suite/commit/8330e7888c72dc67980a3a66374f6996274d0cbc))

## [2.0.0](https://github.com/shopware/acceptance-test-suite/compare/v1.5.0...v2.0.0) (2024-06-11)


### ⚠ BREAKING CHANGES

* Removed dependency between data fixtures and page objects.

### Bug Fixes

* Add local type overrides ([870931c](https://github.com/shopware/acceptance-test-suite/commit/870931cac9cb02b1fb4838d1d0e4ae1c5fca6d8f))
* Improve product type definition ([4c20b9b](https://github.com/shopware/acceptance-test-suite/commit/4c20b9b461b34165269adcc4731394c327c7078a))
* Update playwright and use compatible version prefix ([11ffd1b](https://github.com/shopware/acceptance-test-suite/commit/11ffd1be649706f24d00216ac25f894734c8966b))


### Code Refactoring

* Removed dependency between data fixtures and page objects. ([7879c5a](https://github.com/shopware/acceptance-test-suite/commit/7879c5a5c9c15701da86f9ee5afe9fad25a32578))

## [1.5.0](https://github.com/shopware/acceptance-test-suite/compare/v1.4.0...v1.5.0) (2024-06-07)


### Features

* add dashboard and data sharing fixture ([8f140f8](https://github.com/shopware/acceptance-test-suite/commit/8f140f8001b90a1dc35723ba419e0447d3dddf09))
* Add order status helper method ([565c355](https://github.com/shopware/acceptance-test-suite/commit/565c355f3ac832a5a3389207c81685c910f2c58f))

## [1.4.0](https://github.com/shopware/acceptance-test-suite/compare/v1.3.2...v1.4.0) (2024-06-05)


### Features

* add isSaaSInstance helper function ([43e08cd](https://github.com/shopware/acceptance-test-suite/commit/43e08cdcc65ee1759987bf6fbef2c77825d30d4c))


### Bug Fixes

* fix login on saas instances ([4af4ce4](https://github.com/shopware/acceptance-test-suite/commit/4af4ce48dad633493db82b68471ff50d490f735e))

## [1.3.2](https://github.com/shopware/acceptance-test-suite/compare/v1.3.1...v1.3.2) (2024-06-05)


### Bug Fixes

* product fixture with non-standard currency ([bfca54d](https://github.com/shopware/acceptance-test-suite/commit/bfca54d77e1cfc6bcc243593b03ccf039144c3d6))

## [1.3.1](https://github.com/shopware/acceptance-test-suite/compare/v1.3.0...v1.3.1) (2024-06-03)


### Bug Fixes

* Refactor digital product and order fixture ([c277755](https://github.com/shopware/acceptance-test-suite/commit/c27775523b816d4b98905772e2bac0c47c47d7d4))
* use sales channel language id for default customer ([1b1bdf1](https://github.com/shopware/acceptance-test-suite/commit/1b1bdf130399155ad1975cc5cc2fb1c9bfc1d99a))

## [1.3.0](https://github.com/shopware/acceptance-test-suite/compare/v1.2.0...v1.3.0) (2024-05-28)


### Features

* Add task for accessibility testing with axe core ([55cf6ec](https://github.com/shopware/acceptance-test-suite/commit/55cf6ec45c6c3f9fc41e466457269779e9381bde))

## [1.2.0](https://github.com/shopware/acceptance-test-suite/compare/v1.1.4...v1.2.0) (2024-05-27)


### Features

* Add additional page objects for storefront account ([77a1698](https://github.com/shopware/acceptance-test-suite/commit/77a1698652a0f7fa7b0c1e39b935921ce5476947))
* Add page object and data fixture for category ([40eddaf](https://github.com/shopware/acceptance-test-suite/commit/40eddafb3a3319c6257b39d93067ce2b918c5950))


### Bug Fixes

* data dependency between fixtures ([43474ee](https://github.com/shopware/acceptance-test-suite/commit/43474ee170766029f798dba9fc0d653207c40df1))

## [1.1.4](https://github.com/shopware/acceptance-test-suite/compare/v1.1.3...v1.1.4) (2024-05-23)


### Bug Fixes

* use correct api route to generate access keys ([8d588ed](https://github.com/shopware/acceptance-test-suite/commit/8d588edaf5cb0cee4283bf5e3ff887dda8d9b87f))

## [1.1.3](https://github.com/shopware/acceptance-test-suite/compare/v1.1.2...v1.1.3) (2024-05-23)


### Bug Fixes

* refactor task interface ([ac19c91](https://github.com/shopware/acceptance-test-suite/commit/ac19c917f759f588008ba2c3bd2f8ee62596cc58))

## [1.1.2](https://github.com/shopware/acceptance-test-suite/compare/v1.1.1...v1.1.2) (2024-05-23)


### Bug Fixes

* refactor getFlowId helper method ([b76e2cf](https://github.com/shopware/acceptance-test-suite/commit/b76e2cf107fb8c86ac3c11db19681f496a887690))

## [1.1.1](https://github.com/shopware/acceptance-test-suite/compare/v1.1.0...v1.1.1) (2024-05-22)


### Bug Fixes

* make page object props public ([a85ff8d](https://github.com/shopware/acceptance-test-suite/commit/a85ff8d4731881ac8cfcca7017cdec825c18f10d))

## [1.1.0](https://github.com/shopware/acceptance-test-suite/compare/v1.0.0...v1.1.0) (2024-05-22)


### Features

* add release automation release please ([3aa7dee](https://github.com/shopware/acceptance-test-suite/commit/3aa7dee25877aea05651996a1245d61cd3692bc1))
