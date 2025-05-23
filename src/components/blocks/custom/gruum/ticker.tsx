import { BlockAttributes } from '@src/lib/block/types';
import { BlockComponentProps } from '@src/components/blocks';
import { cn } from '@src/lib/utils';
import Link from 'next/link';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { useSiteContext } from '@src/context/site-context';
import Image from 'next/image';

export const GruumTicker = ({ block }: BlockComponentProps) => {
  if ('sg-gutenberg-customisations/ticker' !== block.blockName) {
    return null;
  }

  const attrs = block.attrs as BlockAttributes;

  const images = block.innerBlocks.map((innerBlock, index) => {
    const innerBlockAttrs = innerBlock.attrs as BlockAttributes;

    // Extract the src attribute using regex
    const srcRegex = /src="([^"]*)"/;
    const match = innerBlock.innerHTML.match(srcRegex);
    const relativePath = match ? match[1] : null;
    const wordpressSiteUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;
    const src = `${wordpressSiteUrl}${relativePath}`;

    // Extract the alt attribute using regex
    const altRegex = /alt="([^"]*)"/;
    const altMatch = innerBlock.innerHTML.match(altRegex);
    const alt = altMatch ? altMatch[1] : '';

    return {
      id: innerBlockAttrs.id,
      width: parseInt(innerBlockAttrs.width || '0'),
      height: parseInt(innerBlockAttrs.height || '0'),
      src,
      alt,
    };
  });

  return (
    <div className="ticker w-full overflow-hidden">
      <div
        className="flex animate-marquee gap-12 hover:[animation-play-state:paused]"
        style={{ animationDuration: '20s' }}
      >
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="flex-shrink-0"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="object-contain"
              style={{
                width: image.width,
                height: image.height,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
