import { ParsedBlock } from '@src/components/blocks';
import { CartItemGlobalProps } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { isFreeProduct } from '@src/lib/helpers/product';

type Props = {
  block: ParsedBlock;
};

export const CartItemFreeProductLabel = ({ block }: Props) => {
  const { data } = useContentContext();
  const blockName = getBlockName(block);
  if ('CartItemFreeProductLabel' !== blockName || !data) {
    return null;
  }
  const { cartItem } = data as CartItemGlobalProps;
  if (!isFreeProduct(cartItem)) return null;

  return <div className={block.attrs?.className}>Free Product</div>;
};
