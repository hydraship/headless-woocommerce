import { BlockComponentProps } from '@src/components/blocks';
import { cn } from '@src/lib/helpers/helper';
import { Content } from '@src/components/blocks/content';
import { BlockAttributes } from '@src/lib/block/types';

export const Columns = ({ block }: BlockComponentProps) => {
  if ('core/columns' !== block.blockName) {
    return null;
  }

  const attr = block.attrs as BlockAttributes;
  return (
    <div className={cn('core-columns', attr.className)}>
      <Content content={block.innerBlocks} />
    </div>
  );
};
