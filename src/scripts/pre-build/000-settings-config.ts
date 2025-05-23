import { env } from '@src/lib/env';
import { isDevEnvironment } from '@src/lib/helpers/helper';
import { getSiteConfigs, SiteInfo } from '@src/lib/typesense/site-info';
import { parseJSON } from '@src/scripts/utils';
import * as fs from 'fs';
import path from 'path';

const { VERCEL_ENV, VERCEL_URL, NEXT_PUBLIC_COOKIE_DOMAIN } = env();

export default async function execute() {
  try {
    const configObject = [
      {
        key: 'woocommerce_tax_settings',
        file: 'tax-settings.json',
      },
      {
        key: 'woocommerce_tax_rates',
        file: 'tax-rates.json',
      },
    ];

    const defaultConfigPath = path.resolve(process.cwd(), 'config', 'default-settings.json');
    const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'));

    const configs = await getSiteConfigs();
    const pageFilePath = path.join(process.cwd(), 'public', 'config.json');

    const mergedConfig = { ...defaultConfig, ...configs };

    if (VERCEL_ENV === 'preview') {
      mergedConfig.cookieDomain = VERCEL_URL;
    }

    if (NEXT_PUBLIC_COOKIE_DOMAIN && NEXT_PUBLIC_COOKIE_DOMAIN !== '') {
      mergedConfig.cookieDomain = NEXT_PUBLIC_COOKIE_DOMAIN;
    }

    // Create the final config.json by merging it to default config
    fs.writeFileSync(pageFilePath, JSON.stringify(mergedConfig), {
      encoding: 'utf-8',
    });

    configObject.forEach(async (config) => {
      const configData = await SiteInfo.find(config.key);
      const pageFilePath = path.join(process.cwd(), 'public', config.file);
      // Create an empty JSON object if configData.value is empty or undefined
      const valueToWrite = configData?.value ? parseJSON(JSON.stringify(configData.value)) : '{}';
      fs.writeFileSync(pageFilePath, valueToWrite, {
        encoding: 'utf-8',
      });
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating config.json:', error);
  }
}
