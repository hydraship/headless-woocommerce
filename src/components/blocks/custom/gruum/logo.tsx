import { BlockAttributes } from '@src/lib/block/types';
import { BlockComponentProps } from '@src/components/blocks';
import { cn } from '@src/lib/utils';
import Link from 'next/link';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';

export const GruumLogo = ({ block }: BlockComponentProps) => {
  if ('sg-gutenberg-customisations/theme-blocks-logo' !== block.blockName) {
    return null;
  }

  const attrs = block.attrs as BlockAttributes;
  if (attrs.blockVisibility && attrs.blockVisibility.hideBlock) {
    return null;
  }

  return <ReactHTMLParser html={block.innerHTML} />;
};
