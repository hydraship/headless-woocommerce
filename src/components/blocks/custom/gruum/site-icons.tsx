import Image from 'next/image';
import { last } from 'lodash';

import { BlockAttributes } from '@src/lib/block/types';
import { BlockComponentProps } from '@src/components/blocks';
import { PrefetchLink } from '@src/components/common/prefetch-link';
import { useSiteContext } from '@src/context/site-context';
import { cn } from '@src/lib/utils';
import Link from 'next/link';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';

export const GruumSiteIcons = ({ block }: BlockComponentProps) => {
  if ('sg-gutenberg-customisations/theme-blocks-site-icons' !== block.blockName) {
    return null;
  }

  const attrs = block.attrs as BlockAttributes;
  if (attrs.blockVisibility && attrs.blockVisibility.hideBlock) {
    return null;
  }
  const svg = getSvgContent(block.innerHTML);
  return (
    <div className={cn('site-icons', attrs.className)}>
      <div className="inner">
        <span className="icon">
          <ReactHTMLParser html={svg} />
        </span>
        {attrs.slideUrl && <Link href={attrs.slideUrl}>{attrs.slideText}</Link>}
      </div>
    </div>
  );
};
