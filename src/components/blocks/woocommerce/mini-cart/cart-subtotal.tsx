import { ParsedBlock } from '@src/components/blocks';
import { getBlockName } from '@src/lib/block';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getCurrencySymbol } from '@src/lib/helpers/helper';
import { numberFormat } from '@src/lib/helpers/product';
import { getCookie } from '@src/lib/helpers/cookie';
import { getDefaultCountry } from '@src/lib/helpers/country';
import { useSiteContext } from '@src/context/site-context';
import taxRates from '@public/tax-rates.json';
import { find } from 'lodash';

type CartSubTotalProps = {
  block: ParsedBlock;
};

export const CartSubTotal = ({ block }: CartSubTotalProps) => {
  const { cart, currentCurrency, settings } = useSiteContext();

  // Handle case where taxRates or taxRates.Standard might not exist
  const standardTaxRates = taxRates?.Standard || [];
  const country = getCookie('geoCountry') || getDefaultCountry();
  const appliedTaxRule = find(standardTaxRates, { tax_rate_country: country });

  // Check if we should show prices with tax based on tax rate or store settings
  const hasTaxRate =
    appliedTaxRule &&
    typeof appliedTaxRule === 'object' &&
    'tax_rate' in appliedTaxRule &&
    parseInt(String((appliedTaxRule as { tax_rate: string | number }).tax_rate)) > 0;
  const showWithTax = hasTaxRate || settings?.store?.woocommercePricesIncludeTax;

  const blockName = getBlockName(block);
  if ('CartSubTotal' !== blockName && block.innerBlocks) {
    return null;
  }

  // Safely access cart properties with fallbacks
  const total = parseFloat(cart?.total || '0');
  const shippingTotal = parseFloat(cart?.shippingTotal || '0');
  const subtotal = cart?.subtotal || 0;

  const subtotalDisplay = showWithTax ? total - shippingTotal : subtotal;

  const theContent: string = block.innerHTML;
  const content = theContent.replace(
    '{{cartSubTotal}}',
    String(`${getCurrencySymbol(currentCurrency)}${numberFormat(Number(subtotalDisplay))}`)
  );

  return <ReactHTMLParser html={content} />;
};
