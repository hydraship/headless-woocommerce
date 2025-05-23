import { ParsedBlock } from '@src/components/blocks';
import { CartItemGlobalProps } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item';
import { useContentContext } from '@src/context/content-context';
import { useSiteContext } from '@src/context/site-context';
import { BlockAttributes } from '@src/lib/block/types';
import { cn, formatPrice, getCurrencySymbol, removeCurrencySymbol } from '@src/lib/helpers/helper';
import { Product } from '@src/models/product';
import { ProductCartItem } from '@src/lib/hooks/cart';
import taxRates from '@public/tax-rates.json';
import { find } from 'lodash';
import { getCookie } from '@src/lib/helpers/cookie';
import { getDefaultCountry } from '@src/lib/helpers/country';
import { VariablePrice } from '@src/features/product/price/variant';

type WooCommerceProductPriceTemplateProps = {
  block: ParsedBlock;
};

const displaySuffix = (cartItem: ProductCartItem) => {
  // find in extraData under cartIte, if has key: wcsatt_data
  const extraData = cartItem.extraData;

  if (!extraData) {
    return '';
  }

  const wcsattData = extraData.find((data) => data.key === 'wcsatt_data');

  if (!wcsattData) {
    return '';
  }

  const wcsattDataValue = JSON.parse(wcsattData.value);

  if (!wcsattDataValue || !wcsattDataValue?.active_subscription_scheme) {
    return '';
  }

  const value = wcsattDataValue.active_subscription_scheme;
  const explodedValue = value.split('_');
  const [quantity, period] = explodedValue;

  const displayPeriod = (quantity: string, period: string) => {
    const qty = parseInt(quantity, 10);
    return `every ${qty} ${period}${qty > 1 ? 's' : ''}`;
  };

  return <>{` ${displayPeriod(quantity, period)} `}</>;
};

export const WooCommerceProductPriceTemplate = ({
  block,
}: WooCommerceProductPriceTemplateProps) => {
  const { type, data } = useContentContext();
  const { currentCurrency, settings } = useSiteContext();

  if (!data) {
    return null;
  }

  const attribute = block.attrs as BlockAttributes;

  if ('product-cart-item' === type) {
    const { cartItem, loading } = data as CartItemGlobalProps;
    const appliedTaxRule = find(taxRates.Standard, {
      tax_rate_country: getCookie('geoCountry') || getDefaultCountry(),
    }) as { tax_rate: string } | undefined;

    const showWithTax =
      appliedTaxRule &&
      typeof appliedTaxRule === 'object' &&
      'tax_rate' in appliedTaxRule &&
      parseInt(String(appliedTaxRule.tax_rate)) > 0;
    const price = removeCurrencySymbol(
      currentCurrency,
      showWithTax ? cartItem.total : cartItem.subTotal
    );

    if (loading) {
      return <div className="w-28 h-4 bg-gray-300"></div>;
    }
    return (
      <span
        className={cn(
          'minicart-item-price font-bold text-black/80 text-sm mb-2 block',
          attribute.className
        )}
      >
        {getCurrencySymbol(currentCurrency)}
        {removeCurrencySymbol(currentCurrency, `${price}`)}
        {displaySuffix(cartItem)}
      </span>
    );
  }

  if ('product' !== type) {
    return null;
  }
  const product = data as Product;

  if (product.productType === 'external') {
    return null;
  }

  const isTaxExclusive = !!settings?.isTaxExclusive;
  const price = product.priceForDisplay(currentCurrency, isTaxExclusive);

  if (product.hasVariations) {
    return (
      <VariablePrice
        product={product}
        isTaxExclusive={settings?.isTaxExclusive as boolean}
      />
    );
  }

  return (
    <span className={cn('price', attribute.className)}>{formatPrice(price, currentCurrency)}</span>
  );
};
