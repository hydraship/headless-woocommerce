import { ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { Carousel } from '@src/components/ui/carousel';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/utils';
import { Product } from '@src/models/product';

export type CarouselProductsProps = {
  block: ParsedBlock;
  products: Product[];
};

export const CarouselProducts = ({ block, products }: CarouselProductsProps) => {
  const attributes = block.attrs as BlockAttributes;

  attributes.collection;
  return (
    <Carousel
      className={cn('w-full', attributes.className)}
      opts={{
        align: 'start',
      }}
    >
      <Content
        type="products"
        globalData={products}
        content={block.innerBlocks}
      />
    </Carousel>
  );
};
