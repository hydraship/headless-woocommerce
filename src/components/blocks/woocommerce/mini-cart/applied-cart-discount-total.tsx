import { ParsedBlock } from '@src/components/blocks';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { useSiteContext } from '@src/context/site-context';
import { useContentContext } from '@src/context/content-context';
import { getCurrencySymbol } from '@src/lib/helpers/helper';
import { numberFormat } from '@src/lib/helpers/product';
import { CouponCode } from '@src/lib/hooks/cart';

type AppliedCartDiscountTotalProps = {
  block: ParsedBlock;
};

export const AppliedCartDiscountTotal = ({ block }: AppliedCartDiscountTotalProps) => {
  const { currentCurrency } = useSiteContext();
  const { type, data } = useContentContext();
  const blockName = getBlockName(block);
  if ('AppliedCartDiscountTotal' !== blockName || !data || 'coupon-code' !== type) {
    return null;
  }

  const getAppliedCouponAmount = ({ discountAmount }: CouponCode) => {
    // const combinedCouponTotal = parseFloat(discountAmount || '') + parseFloat(discountTax || '');
    const combinedCouponTotal = parseFloat(discountAmount);
    return numberFormat(combinedCouponTotal);
  };

  const coupon = data as CouponCode;
  const attributes = block.attrs as BlockAttributes;

  return (
    <p className={attributes.className}>
      -{getCurrencySymbol(currentCurrency)}
      {getAppliedCouponAmount(coupon)}
    </p>
  );
};
