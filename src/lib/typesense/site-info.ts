import { env } from '@src/lib/env';
import { getTypesenseClient } from '@src/lib/typesense';
import { camelCase } from 'lodash';
const { NEXT_PUBLIC_STORE_ID } = env();

type SiteInfoTypesenseResponse = {
  name: string;
  value: string;
  updated_at?: number;
};

export class SiteInfo {
  static async find(name: string): Promise<SiteInfoTypesenseResponse | undefined> {
    const response = await getTypesenseClient()
      .collections<SiteInfoTypesenseResponse>(`site_info-${NEXT_PUBLIC_STORE_ID}`)
      .documents()
      .search({
        q: name as string,
        query_by: 'name',
        sort_by: '_text_match:desc',
      });
    return response.hits?.[0]?.document ?? undefined;
  }

  static async findMultiple(names: string[]): Promise<SiteInfoTypesenseResponse[]> {
    const response = await getTypesenseClient()
      .collections<SiteInfoTypesenseResponse>(`site_info-${NEXT_PUBLIC_STORE_ID}`)
      .documents()
      .search({
        q: '*' as string,
        query_by: 'name',
        filter_by: `name:${JSON.stringify(names)}`,
        per_page: 250,
      });
    const results = response.hits?.map((hit) => hit.document);
    return results || [];
  }
}

type ParsedSiteConfig = Record<string, unknown>;

const parseValue = (value: string): unknown => {
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    if (
      value.toLowerCase() === 'true' ||
      value.toLowerCase() === '1' ||
      value.toLowerCase() === 'yes'
    ) {
      return true;
    }
    if (
      value.toLowerCase() === 'false' ||
      value.toLowerCase() === '0' ||
      value.toLowerCase() === 'no'
    ) {
      return false;
    }

    if (!isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }
};

export const getSiteConfigs = async (): Promise<ParsedSiteConfig> => {
  try {
    const configNames = [
      'category',
      'product',
      'site_logo',
      'stock_display_format',
      'currencies',
      'homepage_slug',
      'shop_page_slug',
      'blog_page_slug',
      'cart_page_slug',
      'wp_page_headless',
      'wp_post_headless',
      'woocommerce_permalinks',
      'site_message',
      'woocommerce_calc_taxes',
      'woocommerce_prices_include_tax',
      'woocommerce_tax_setup',
      'free_shipping_threshold',
      'description_after_content',
      'woographql_is_composite_enabled',
      'woocommerce_is_afterpay_enabled',
      'show_free_shipping_banner',
      'show_free_shipping_minicart_component',
      'is_multicurrency',
      'gift_card_header_logo',
      'gift_card_header_text',
      'gift_card_footer_text',
      'regions',
      'show_variant_as_separate_product_cards',
      'judgeme_settings',
      'woocommerce_tax_setup',
      'business_reviews_bundle_settings',
      'reviews_plugin',
      'category_page_default_sort',
      'site_icon_url',
      'is_bundle_product_enabled',
      'is_subscription_enabled',
      'show_share_to_pinterest_button',
      'product_page_settings',
      'enable_geo_restrictions',
      'enable_override_best_seller',
      'allowedPermalinks',
      'cookie_domain',
    ];
    const siteConfigs = await SiteInfo.findMultiple(configNames);

    return siteConfigs.reduce((acc, { name, value }) => {
      const key = camelCase(name);
      const parsedValue = parseValue(value);
      acc[key] = parsedValue;
      return acc;
    }, {} as ParsedSiteConfig);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching site configs:', error);
    return {};
  }
};
