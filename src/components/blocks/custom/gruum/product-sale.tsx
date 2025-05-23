import { BlockAttributes } from '@src/lib/block/types';
import { BlockComponentProps } from '@src/components/blocks';
import { cn } from '@src/lib/utils';

export const GruumProductSale = ({ block }: BlockComponentProps) => {
  if ('sg-gutenberg-customisations/theme-blocks-product-sale' !== block.blockName) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;
  if (attributes.blockVisibility && attributes.blockVisibility.hideBlock) {
    return null;
  }

  return <div className={cn('', attributes.className)}>Implement Parsing</div>;
};
