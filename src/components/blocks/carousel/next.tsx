import { ParsedBlock } from '@src/components/blocks';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { BlockAttributes } from '@src/lib/block/types';
import { CarouselNext } from '@src/components/ui/carousel';
import { cn } from '@src/lib/utils';

type Props = {
  block: ParsedBlock;
};

export const CarouselNextButtonBlock = ({ block }: Props) => {
  const svgContent = getSvgContent(block.innerHTML);
  const attribute = block.attrs as BlockAttributes;

  return (
    <CarouselNext
      className={cn(
        'carousel-next-button absolute right-0 top-1/2 -translate-y-1/2 md:right-14',
        attribute.className
      )}
      svg={svgContent}
    />
  );
};
