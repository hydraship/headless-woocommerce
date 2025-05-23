import { ParsedBlock } from '@src/components/blocks';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { BlockAttributes } from '@src/lib/block/types';
import { CarouselPrevious } from '@src/components/ui/carousel';
import { cn } from '@src/lib/utils';

type Props = {
  block: ParsedBlock;
};

export const CarouselPreviousButtonBlock = ({ block }: Props) => {
  const svgContent = getSvgContent(block.innerHTML);
  const attribute = block.attrs as BlockAttributes;

  return (
    <CarouselPrevious
      className={cn(
        'carousel-prev-button absolute left-0 top-1/2 -translate-y-1/2 md:left-14',
        attribute.className
      )}
      variant="ghost"
      svg={svgContent}
    />
  );
};
