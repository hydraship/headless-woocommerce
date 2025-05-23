import { ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';

import { Carousel } from '@src/components/ui/carousel';
import { BlockAttributes } from '@src/lib/block/types';
type Props = {
  block: ParsedBlock;
};

export const CarouselBlock = ({ block }: Props) => {
  const { type, data } = useContentContext();
  const blockName = getBlockName(block);
  if ('Carousel' !== blockName) {
    return null;
  }
  const attribute = block.attrs as BlockAttributes;
  return (
    <Carousel className={attribute.className}>
      <Content
        type={type}
        content={block.innerBlocks}
        globalData={data}
      />
    </Carousel>
  );
};
