import { ParsedBlock } from '@src/components/blocks';
import { CartItemGlobalProps } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item';
import { CartItemSkeletonInput } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-skeleton';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';
import { isFreeProduct } from '@src/lib/helpers/product';

type CartItemInputProps = {
  block: ParsedBlock;
};

export const CartItemInput = ({ block }: CartItemInputProps) => {
  const { type, data } = useContentContext();

  const blockName = getBlockName(block);
  if ('CartItemInput' !== blockName || !data) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;

  if ('product-cart-item' === type) {
    const { cartItem, updateCartItemQuantity, loading } = data as CartItemGlobalProps;
    if (isFreeProduct(cartItem)) return null;

    if (loading) {
      return <CartItemSkeletonInput />;
    }

    return (
      <input
        type="number"
        max={cartItem.stockQuantity}
        value={cartItem.qty || ''}
        step={1}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newQuantity = parseInt(e.target.value, 10);
          updateCartItemQuantity(cartItem.cartKey, newQuantity);
        }}
        className={cn(
          'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield] min-w-[2.25rem] max-w-[3rem] h-10 px-3 text-center border-x border-y-0 outline-none border-gray-200',
          attributes.className
        )}
      />
    );
  }

  return null;
};
