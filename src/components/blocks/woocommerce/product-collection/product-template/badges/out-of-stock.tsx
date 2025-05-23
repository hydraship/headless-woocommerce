import { ParsedBlock } from '@wordpress/block-serialization-default-parser';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/utils';
import { Product } from '@src/models/product';
import parse from 'html-react-parser'; // Add this import at the top

type WooCommerceProductTemplateCardOutOfStockBadgeProps = {
  block: ParsedBlock;
};

export const WooCommerceProductTemplateCardOutOfStockBadge = ({
  block,
}: WooCommerceProductTemplateCardOutOfStockBadgeProps) => {
  const { type, data } = useContentContext();
  if (type !== 'product' || !data) {
    return null;
  }

  const blockName = getBlockName(block);
  if ('CardOutOfStockBadge' !== blockName) {
    return null;
  }

  const product = data as Product;
  const unavailable = product?.stockStatus === 'outofstock';

  if (!unavailable) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;

  return (
    <div className={cn('out-of-stock-badge', attributes.className)}>
      {block.innerBlocks.map((innerBlock: ParsedBlock) => {
        return parse(innerBlock.innerHTML);
      })}
    </div>
  );
};
