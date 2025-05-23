import { ParsedBlock } from '@wordpress/block-serialization-default-parser';

import { useSearchContext } from '@src/context/search-context';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { useRouter } from 'next/router';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { BlockAttributes } from '@src/lib/block/types';

type SearchIconProps = {
  block: ParsedBlock;
};

export const SearchIcon = ({ block }: SearchIconProps) => {
  const { searchTermState, categoryPermalink } = useSearchContext();
  const router = useRouter();

  const [searchTerm] = searchTermState;

  const allowedBlocks = ['outermost/icon-block', 'core/html'];
  if (block.blockName && !allowedBlocks.includes(block.blockName)) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (searchTerm) {
      const destinationUrl =
        categoryPermalink || `/search-results?s=${encodeURIComponent(searchTerm)}`;
      if (router.asPath !== destinationUrl) {
        router.push(destinationUrl);
      }
    }
  };
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
