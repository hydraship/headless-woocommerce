import React from 'react';
import { ParsedBlock } from '@src/components/blocks';
import { cn } from '@src/lib/utils';
import { BlockAttributes } from '@src/lib/block/types';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getBlockName } from '@src/lib/block';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { useContentContext } from '@src/context/content-context';

export const TaxonomySortByClose = ({ block }: { block: ParsedBlock }) => {
  const {
    data: { actions },
  } = useContentContext();

  const blockName = getBlockName(block);
  if ('TaxonomySortByClose' !== blockName) {
    return null;
  }

  const svgContent = getSvgContent(block.innerHTML);
  const attributes = block.attrs as BlockAttributes;

  return (
    <button
      type="button"
      className={cn('button-close-minicart', attributes.className)}
      onClick={() => actions?.setSortByOpen(false)}
    >
      <ReactHTMLParser html={svgContent} />
    </button>
  );
};
