import { getBlockName, isBlockNameA } from '@src/lib/block';
import { Hamburger } from '@src/components/blocks/maxmegamenu/hamburger';
import { ParsedBlock } from '@src/components/blocks';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { SearchClose } from '@src/components/blocks/search/close';
import { SearchIcon } from '@src/components/blocks/search/search-icon';
import { ReviewsIoBadge } from '@src/components/blocks/reviews.io/badge';
type Props = {
  block: ParsedBlock;
};

export const Html = ({ block }: Props) => {
  if ('core/html' !== block.blockName) {
    return null;
  }

  if (isBlockNameA(block, 'MenuHamburger')) {
    return <Hamburger block={block} />;
  }

  if (isBlockNameA(block, 'SearchClose')) {
    return <SearchClose block={block} />;
  }

  if (isBlockNameA(block, 'SearchIcon')) {
    return <SearchIcon block={block} />;
  }

  const blockName = getBlockName(block);
  if (blockName?.startsWith('ReviewsIoBadge')) {
    return <ReviewsIoBadge block={block} />;
  }

  if (blockName?.startsWith('no-render')) {
    return null;
  }

  return <ReactHTMLParser html={block.innerHTML} />;
};
