import { ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { Group } from '@src/components/blocks/core/group';
import { useProductContext } from '@src/context/product-context';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';
import { uniqueId } from 'lodash';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface ProductDescriptionContentProps {
  block: ParsedBlock;
}

export const ProductDescriptionContent = ({ block }: ProductDescriptionContentProps) => {
  const { product } = useProductContext();
  const attributes = block.attrs as BlockAttributes;
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const checkHash = () => {
      setIsExpanded(window.location.hash === '#expand-description');
    };

    checkHash(); // Check on first load
    window.addEventListener('hashchange', checkHash);

    return () => window.removeEventListener('hashchange', checkHash);
  }, [router.isReady]);

  if (!product?.description) {
    return null;
  }

  return (
    <div
      className={cn('product-description-content', attributes.className, {
        '[&_.see-more-button]:!hidden': isExpanded,
        '[&_.see-less-button]:!hidden': !isExpanded,
      })}
    >
      {block.innerBlocks.map((innerBlock) => {
        if (innerBlock.blockName === 'core/post-content') {
          return (
            <div
              key={uniqueId()}
              className={cn(innerBlock.attrs.className, {
                '!line-clamp-none': isExpanded,
              })}
            >
              <ReactHTMLParser html={`${product.description}`} />
            </div>
          );
        } else if (innerBlock.blockName === 'core/group') {
          return (
            <Group
              key={uniqueId()}
              block={innerBlock}
            />
          );
        } else {
          return (
            <Content
              key={uniqueId()}
              content={innerBlock.innerHTML}
            />
          );
        }
      })}
    </div>
  );
};
// Add display name for better debugging
ProductDescriptionContent.displayName = 'ProductDescriptionContent';
