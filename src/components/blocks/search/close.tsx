import { ParsedBlock } from '@wordpress/block-serialization-default-parser';

import { useSearchContext } from '@src/context/search-context';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';

type SearchCloseProps = {
  block: ParsedBlock;
};

export const SearchClose = ({ block }: SearchCloseProps) => {
  const { showResultState } = useSearchContext();

  const allowedBlocks = ['outermost/icon-block', 'core/html'];
  if (block.blockName && !allowedBlocks.includes(block.blockName)) {
    return null;
  }

  const [, setShowResult] = showResultState;

  return (
    <button onClick={() => setShowResult((prev) => !prev)}>
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
