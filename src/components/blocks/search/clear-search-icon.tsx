import { ParsedBlock } from '@wordpress/block-serialization-default-parser';

import { useSearchContext } from '@src/context/search-context';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { BlockAttributes } from '@src/lib/block/types';

type SearchIconProps = {
  block: ParsedBlock;
};

export const ClearSearchIcon = ({ block }: SearchIconProps) => {
  const { searchTermState } = useSearchContext();
  const [searchTerm, setSearchTerm] = searchTermState;

  const allowedBlocks = ['outermost/icon-block', 'core/html'];
  if (block.blockName && !allowedBlocks.includes(block.blockName)) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (searchTerm) {
      setSearchTerm('');
    }
  };

  if (searchTerm.length <= 0) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;
  return (
    <button
      onClick={handleClick}
      className={attributes.className}
    >
      <ReactHTMLParser
        html={
          'outermost/icon-block' === block.blockName
            ? getSvgContent(block.innerHTML)
            : block.innerHTML
        }
      />
    </button>
  );
};
