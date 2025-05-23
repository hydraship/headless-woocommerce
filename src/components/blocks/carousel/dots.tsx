import { ParsedBlock } from '@src/components/blocks';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { BlockAttributes } from '@src/lib/block/types';
import { CarouselDots } from '@src/components/ui/carousel';
import { getBlockByName } from '@src/lib/block';

type Props = {
  block: ParsedBlock;
};

export const CarouselDotsBlock = ({ block }: Props) => {
  const attribute = block.attrs as BlockAttributes;
  const activeDot = getBlockByName(block.innerBlocks, 'ActiveDot');
  const activeSvg = activeDot && getSvgContent(activeDot.innerHTML);

  const inActiveDot = getBlockByName(block.innerBlocks, 'InactiveDot');
  const svg = inActiveDot && getSvgContent(inActiveDot.innerHTML);

  return (
    <CarouselDots
      svg={svg}
      activeSvg={activeSvg}
      className={attribute.className}
    />
  );
};
