import { useSiteContext } from '@src/context/site-context';
import { HamburgerIcon } from '@src/components/svg/hamburger';
import { BlockComponentProps } from '@src/components/blocks';
import { find } from 'lodash';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';
import React from 'react';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';

export const MaxMegaMenuCloseButton = ({ block }: BlockComponentProps) => {
  const { setShowMenu } = useSiteContext();

  const attributes = block?.attrs as BlockAttributes;

  const svgContent = block.innerHTML.match(/<svg[\s\S]*<\/svg>/)?.[0] || '';
  const renderHtmlBlock = 'outermost/icon-block' !== block.blockName ? block.innerHTML : svgContent;

  const allowedBlocks = ['outermost/icon-block', 'core/html'];
  if (block.blockName && !allowedBlocks.includes(block.blockName)) {
    return null;
  }

  return (
    <button
      className={cn(attributes?.className)}
      onClick={() => setShowMenu(false)}
    >
      <ReactHTMLParser html={renderHtmlBlock} />
    </button>
  );
};
