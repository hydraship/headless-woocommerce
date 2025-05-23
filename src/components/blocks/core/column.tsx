import { BlockComponentProps } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { cn } from '@src/lib/helpers/helper';

export const Column = ({ block }: BlockComponentProps) => {
  if ('core/column' !== block.blockName) {
    return null;
  }

  return (
    <div className={cn('core-column', block.attrs?.className)}>
      <Content content={block.innerBlocks} />
    </div>
  );
};
