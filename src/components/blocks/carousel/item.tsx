import { ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { CarouselItem } from '@src/components/ui/carousel';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/utils';

type Props = {
  block: ParsedBlock;
};

export const CarouselItemBlock = ({ block }: Props) => {
  const { type, data } = useContentContext();
  const blockName = getBlockName(block);

  const allowedBlocks = ['CarouselItem', 'sg-gutenberg-customisations/static-carousel-slide'];
  if (blockName && !allowedBlocks.includes(blockName)) {
    return null;
  }

  const attribute = block.attrs as BlockAttributes;
  return (
    <CarouselItem className={cn('carousel-item', attribute.className)}>
      <Content
        type={type}
        content={block.innerBlocks}
        globalData={data}
      />
    </CarouselItem>
  );
};
