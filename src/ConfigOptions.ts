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

const addSlashIfMissingAndNonEmpty = (url: string) => {
  return url.endsWith('/') && url.length > 0 ? url : `${url}/`;
};

const getAppURL = () => {
  return addSlashIfMissingAndNonEmpty(process.env.APP_URL || '');
};

const getAdminURL = () => {
  if (process.env.SHOPWARE_ADMIN_URL) {
    return addSlashIfMissingAndNonEmpty(process.env.SHOPWARE_ADMIN_URL);
  } else if (getAppURL()) {
    return addSlashIfMissingAndNonEmpty(`${getAppURL()}admin/`);
  }
  return '';
};

const getAdminAPIURL = () => {
  return addSlashIfMissingAndNonEmpty(process.env.SHOPWARE_ADMIN_API_URL || `${getAppURL()}`);
};

const testWithConfig = base.extend<ConfigOptions>({
  shopware: [{
    appURL: getAppURL(),
    adminURL: getAdminURL(),
    adminAPIURL: getAdminAPIURL(),
    auth: {
      adminUsername: process.env.SHOPWARE_ADMIN_USERNAME || 'admin',
      adminPassword: process.env.SHOPWARE_ADMIN_PASSWORD || 'shopware',
      accessKeyId: process.env.SHOPWARE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.SHOPWARE_SECRET_ACCESS_KEY || '',
    },
    mailpitBaseURL: process.env.SHOPWARE_MAILPIT_BASE_URL || '',
    data: {
      cleanUp: !['1', 'true'].includes(process.env['ATS_SKIP_CLEANUP'] || ''),
      shopInfoJson: process.env.SBP_SHOP_INFO_JSON || '{}',
      bookablePlansJson: process.env.SBP_BOOKABLE_PLANS_JSON || '{}',
    },
  }, { option: true }],
});

const testWithBaseConfig = testWithConfig.extend<ConfigOptions & { BaseConfig: ConfigOptions }>({
  BaseConfig: [
    async ({ }, use, workerInfo) => {
        const options = workerInfo.project.use as ConfigOptions & PlaywrightTestOptions & PlaywrightWorkerOptions;
        const shopwareAppURL = addSlashIfMissingAndNonEmpty(options.baseURL ?? options.shopware.appURL ?? '');
        if (!shopwareAppURL) {
            throw new Error('baseURL or shopware.appURL is not defined in the Playwright configuration. Please add it to playwright.config.ts');
        }

        const shopwareAdminURL = addSlashIfMissingAndNonEmpty(options.shopware.adminURL || shopwareAppURL + 'admin/');
        const shopwareAdminAPIURL = addSlashIfMissingAndNonEmpty(options.shopware.adminAPIURL || shopwareAppURL);

        await use({
          shopware: {
            appURL: shopwareAppURL,
            adminURL: shopwareAdminURL,
            adminAPIURL: shopwareAdminAPIURL,
            auth: {
              adminUsername: options.shopware?.auth?.adminUsername || 'admin',
              adminPassword: options.shopware?.auth?.adminPassword || 'shopware',
              accessKeyId: options.shopware?.auth?.accessKeyId || '',
              secretAccessKey: options.shopware?.auth?.secretAccessKey || '',
            },
            mailpitBaseURL: options.shopware.mailpitBaseURL || '',
            data: {
              cleanUp: options.shopware?.data?.cleanUp || true,
              shopInfoJson: options.shopware?.data?.shopInfoJson || '{}',
              bookablePlansJson: options.shopware?.data?.bookablePlansJson || '{}',
            },
          },
        });
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