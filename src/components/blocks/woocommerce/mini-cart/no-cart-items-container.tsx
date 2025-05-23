import { ParsedBlock } from '@src/components/blocks';
import { getBlockName } from '@src/lib/block';
import { Content } from '@src/components/blocks/content';
import { BlockAttributes } from '@src/lib/block/types';
import { useSiteContext } from '@src/context/site-context';
import { useContentContext } from '@src/context/content-context';
import { CartItemSkeleton } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-skeleton';

type NoCartItemsContainerProps = {
  block: ParsedBlock;
};

export const NoCartItemsContainer = ({ block }: NoCartItemsContainerProps) => {
  const { cart, fetchingCart } = useSiteContext();
  const { type, data } = useContentContext();
  const blockName = getBlockName(block);
  if ('NoCartItemsContainer' !== blockName && block.innerBlocks) {
    return null;
  }
  const hasCartItems = cart !== null && cart?.products?.length > 0 ? true : false;
  if (hasCartItems) {
    return null;
  }
  const attributes = block.attrs as BlockAttributes;

  if (fetchingCart) {
    return <CartItemSkeleton />;
  }

  return (
    <div className={attributes.className}>
      <Content
        type={type}
        globalData={data}
        content={block.innerBlocks}
      />
    </div>
  );
};
