import { ParsedBlock } from '@src/components/blocks';
import React from 'react';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getBlockName } from '@src/lib/block';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { useContentContext } from '@src/context/content-context';
import { CartItemGlobalProps } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item';
import { isFreeProduct } from '@src/lib/helpers/product';
import { CartItemSkeletonRemoveItem } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-skeleton';

type RemoveCartItemButtonProps = {
  block: ParsedBlock;
};

export const RemoveCartItemButton = ({ block }: RemoveCartItemButtonProps) => {
  const { type, data } = useContentContext();

  const blockName = getBlockName(block);
  if ('RemoveCartItem' !== blockName || 'product-cart-item' !== type || !data) {
    return null;
  }

  const { cartItem, removeCartItem, loading } = data as CartItemGlobalProps;
  if (isFreeProduct(cartItem)) return null;
  if (loading) {
    return <CartItemSkeletonRemoveItem />;
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
