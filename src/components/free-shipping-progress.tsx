import { ParsedBlock } from '@src/components/blocks';
import { useSiteContext } from '@src/context/site-context';
import { getBlockByName } from '@src/lib/block';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { BlockAttributes } from '@src/lib/block/types';
import { getCurrencySymbol } from '@src/lib/helpers/helper';
import { numberFormat } from '@src/lib/helpers/product';
import siteSettings from '@public/config.json';

export const FreeShippingProgress = ({ block }: { block: ParsedBlock }) => {
  const { cart, availableFreeShippingMethod, currentCurrency } = useSiteContext();

  if (!siteSettings.showFreeShippingMinicartComponent) return null;
  const treshold = parseFloat(availableFreeShippingMethod?.minAmount || '');

  if (!treshold) return null;

  const cartSubtotal = parseFloat(cart?.subtotal || '0');
  const totalTax = parseFloat(cart?.totalTax || '0');
  const percentage = Math.ceil((cartSubtotal / treshold) * 100);

  if (!availableFreeShippingMethod || cartSubtotal === 0) {
    return null;
  }

  const getCustomerCurrencyMapping = () => {
    switch (currentCurrency) {
      case 'USD':
        return 'US';
      default:
        return 'AU';
    }
  };

  const messageBlock = getBlockByName(block.innerBlocks, 'Message');

  const renderMessage = () => {
    const remaining = Math.floor(treshold - cartSubtotal - totalTax);

    if (messageBlock) {
      const attr = messageBlock.attrs as BlockAttributes;
      if (cartSubtotal + totalTax >= treshold) {
        return <p className={attr.className}>Congrats! You get free shipping!</p>;
      }

      const htmlMessage = messageBlock.innerHTML.replace(
        '{{remainingAmount}}',
        `${getCurrencySymbol(currentCurrency)}${remaining}`
      );
      return <ReactHTMLParser html={htmlMessage} />;
    }

    let message = `${getCustomerCurrencyMapping()} customers, You're ${numberFormat(
      remaining
    )} away from free shipping!`;

    if (cartSubtotal + totalTax >= treshold) {
      message = 'Congrats! You get free shipping!';
    }

    return (
      <div className="text-black/50 font-bold text-left font-secondary text-base py-4">
        {message}
      </div>
    );
  };

  return (
    <div className="free-shipping-progress">
      {renderMessage()}
      <div className="progress-bar w-full bg-gray-200 h-1.5 mb-4 dark:bg-gray-200">
        <div
          className="bg-black/80 h-full rounded-md"
          style={{
            width: `${percentage < 100 ? percentage : 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
