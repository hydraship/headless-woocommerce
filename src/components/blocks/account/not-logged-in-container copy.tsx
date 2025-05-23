import { ParsedBlock } from '@src/components/blocks';
import { getBlockName } from '@src/lib/block';
import { Content } from '@src/components/blocks/content';
import { BlockAttributes } from '@src/lib/block/types';
import { useContentContext } from '@src/context/content-context';
import { useUserContext } from '@src/context/user-context';

type NotLoggedInContainerProps = {
  block: ParsedBlock;
};

export const NotLoggedInContainer = ({ block }: NotLoggedInContainerProps) => {
  const { type, data } = useContentContext();
  const { isLoggedIn } = useUserContext();
  const blockName = getBlockName(block);
  if (('NotLoggedInContainer' !== blockName && block.innerBlocks) || isLoggedIn) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;

  return (
    <div className={attributes.className}>
      <Content
        type={type}
        content={block.innerBlocks}
        globalData={data}
      />
    </div>
  );
};
