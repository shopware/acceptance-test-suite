import { test as base, type PlaywrightTestOptions, type PlaywrightWorkerOptions } from '@playwright/test';

export interface ConfigOptions {
  shopware: {
    appURL?: string;
    adminURL?: string;
    adminAPIURL?: string;
    auth?: {
      adminUsername?: string;
      adminPassword?: string;
      accessKeyId?: string;
      secretAccessKey?: string;
    };
    mailpitBaseURL?: string;
    data?: {
      cleanUp?: boolean;
      shopInfoJson?: string;
      bookablePlansJson?: string;
    };
  };
}

export interface ConfigOptionsWithDefaults extends ConfigOptions {
  shopware: {
    appURL: string;
    adminURL: string;
    adminAPIURL: string;
    auth: {
      adminUsername: string;
      adminPassword: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
    mailpitBaseURL: string;
    data: {
      cleanUp: boolean;
      shopInfoJson: string;
      bookablePlansJson: string;
    };
  };
}

const addSlashIfMissingAndNonEmpty = (url: string | null | undefined) => {
  if (!url) {
    return '';
  }
  return url.endsWith('/') && url.length > 0 ? url : `${url}/`;
};

const testWithConfig = base.extend<ConfigOptions>({
  shopware: [{}, { option: true }],
});

const applyDefaults = (options: ConfigOptions & PlaywrightTestOptions & PlaywrightWorkerOptions): ConfigOptionsWithDefaults => {
  const appURL = addSlashIfMissingAndNonEmpty(options.baseURL ?? options.shopware?.appURL ?? process.env.APP_URL ?? '');
  if (!appURL) {
    throw new Error('baseURL or shopware.appURL is not defined in the Playwright configuration. Please add it to playwright.config.ts');
  }

  const adminURL = addSlashIfMissingAndNonEmpty(options.shopware?.adminURL || process.env.ADMIN_URL || appURL + 'admin/');
  const adminAPIURL = addSlashIfMissingAndNonEmpty(options.shopware?.adminAPIURL || process.env.ADMIN_API_URL || appURL);

  return {
    shopware: {
      appURL,
      adminURL,
      adminAPIURL,
      auth: {
        adminUsername: options.shopware?.auth?.adminUsername || process.env.SHOPWARE_ADMIN_USERNAME || 'admin',
        adminPassword: options.shopware?.auth?.adminPassword || process.env.SHOPWARE_ADMIN_PASSWORD || 'shopware',
        accessKeyId: options.shopware?.auth?.accessKeyId || process.env.SHOPWARE_ACCESS_KEY_ID || '',
        secretAccessKey: options.shopware?.auth?.secretAccessKey || process.env.SHOPWARE_SECRET_ACCESS_KEY || '',
      },
      mailpitBaseURL: options.shopware?.mailpitBaseURL || process.env.SHOPWARE_MAILPIT_BASE_URL || '',
      data: {
        cleanUp: options.shopware?.data?.cleanUp || !['1', 'true'].includes(process.env['ATS_SKIP_CLEANUP'] || ''),
        shopInfoJson: options.shopware?.data?.shopInfoJson || process.env.SBP_SHOP_INFO_JSON || '{}',
        bookablePlansJson: options.shopware?.data?.bookablePlansJson || process.env.SBP_BOOKABLE_PLANS_JSON || '{}',
      },
    },
  };
};


const testWithBaseConfig = testWithConfig.extend<ConfigOptions & { BaseConfig: ConfigOptions }>({
  BaseConfig: [
    async ({ }, use, workerInfo) => {
      await use(
        applyDefaults(
          workerInfo.project.use as ConfigOptions & PlaywrightTestOptions & PlaywrightWorkerOptions
        )
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { scope: 'worker' } as any,
  ],
});

export const test = testWithBaseConfig.extend<ConfigOptions & { BaseConfig: ConfigOptions }>({
  shopware: async ({ BaseConfig }, use) => {
    await use(BaseConfig.shopware);
  },
});