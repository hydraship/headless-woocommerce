import { ParsedBlock } from '@src/components/blocks';
import React from 'react';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getBlockName } from '@src/lib/block';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { useContentContext } from '@src/context/content-context';
import { CartItemGlobalProps } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item';
import { isFreeProduct } from '@src/lib/helpers/product';
import { CartItemSkeletonRemoveItem } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-skeleton';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/utils';

type RemoveCartItemButtonProps = {
  block: ParsedBlock;
};

export const RemoveCartItemButton = ({ block }: RemoveCartItemButtonProps) => {
  const { type, data } = useContentContext();

  const blockName = getBlockName(block);
  if ('RemoveCartItem' !== blockName || 'product-cart-item' !== type || !data) {
    return null;
  }

  const attribute = block.attrs as BlockAttributes;
  const { cartItem, removeCartItem, loading } = data as CartItemGlobalProps;
  if (isFreeProduct(cartItem)) return null;
  if (loading) {
    return <CartItemSkeletonRemoveItem className={attribute.className} />;
  }

  if ('core/paragraph' === block.blockName) {
    const paragraphText: string = block.innerHTML.replace(/.*<p[^>]*>(.*?)<\/p>.*/, '$1').trim();
    return (
      <button
        type="button"
        onClick={() => removeCartItem(cartItem.cartKey)}
        className={cn('text-muted text-xs underline', attribute.className)}
      >
        {paragraphText}
      </button>
    );
  }

  const svgContent = getSvgContent(block.innerHTML);

  return (
    <button
      type="button"
      onClick={() => removeCartItem(cartItem.cartKey)}
    >
      <ReactHTMLParser html={svgContent} />
    </button>
  );
};
