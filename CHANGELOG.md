# Changelog

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
