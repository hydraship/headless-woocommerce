import { ParsedBlock } from '@src/components/blocks';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { useSiteContext } from '@src/context/site-context';
import { useContentContext } from '@src/context/content-context';
import { CouponCode } from '@src/lib/hooks/cart';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REMOVE_COUPONS } from '@src/lib/graphql/queries';
import { v4 } from 'uuid';
import { cn } from '@src/lib/utils';

type RemoveAppliedCouponProps = {
  block: ParsedBlock;
};

export const RemoveAppliedCoupon = ({ block }: RemoveAppliedCouponProps) => {
  const { fetchCart, setCartUpdating } = useSiteContext();

  const { type, data } = useContentContext();

  const [, setError] = useState('');

  const [removeCoupon, { loading: removeCouponLoading }] = useMutation(REMOVE_COUPONS, {
    onCompleted: () => {
      fetchCart();
    },
    onError: (error) => {
      if (error) {
        setError(error?.graphQLErrors?.[0]?.message ?? '');
      }
    },
  });

  const blockName = getBlockName(block);
  if ('RemoveAppliedCoupon' !== blockName || !data || 'coupon-code' !== type) {
    return null;
  }

  const handleRemoveCoupon = (code: string) => {
    if (removeCouponLoading) return;
    setCartUpdating(true);
    removeCoupon({
      variables: {
        input: {
          clientMutationId: v4(),
          codes: [code],
        },
      },
    });
  };

  const coupon = data as CouponCode;
  const attributes = block.attrs as BlockAttributes;
  const innnerHtml: string = block.innerHTML;
  const match = innnerHtml.match(/<p[^>]*>(.*?)<\/p>/);

  return (
    <a
      className={cn(
        'cursor-pointer block text-right text-xs text-black',
        removeCouponLoading && 'pointer-events-none',
        attributes.className
      )}
      onClick={() => handleRemoveCoupon(coupon.code)}
    >
      {match ? match[1] : 'Remove'}
    </a>
  );
};
