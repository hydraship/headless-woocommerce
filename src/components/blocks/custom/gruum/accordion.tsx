import { BlockComponentProps } from '@src/components/blocks';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/utils';
import { Content } from '@src/components/blocks/content';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@src/components/ui/accordion';

export const GruumAccordion = ({ block }: BlockComponentProps) => {
  if ('pb/accordion-item' !== block.blockName) {
    return null;
  }

  const attrs = block.attrs as BlockAttributes;
  if (attrs.blockVisibility && attrs.blockVisibility.hideBlock) {
    return null;
  }

  // Extract the title from the innerHTML
  const titleMatch = block.innerHTML.match(/<h2[^>]*>(.*?)<\/h2>/);
  const title = titleMatch ? titleMatch[1] : 'Terms & conditions';

  // Generate unique IDs for accessibility
  const accordionId = `accordion-${attrs.uuid || Math.random().toString(36).substring(2, 9)}`;
  const titleId = `at-${accordionId}`;
  const contentId = `ac-${accordionId}`;

  return (
    <Accordion
      type="single"
      collapsible
      className={cn(
        'wp-block-pb-accordion-item c-accordion__item js-accordion-item',
        attrs.className
      )}
    >
      <AccordionItem
        value={accordionId}
        className="border-0"
      >
        <AccordionTrigger
          id={titleId}
          className={cn(
            'c-accordion__title js-accordion-controller',
            'flex w-full justify-between bg-white px-4 py-3 text-black focus:outline-none'
          )}
          aria-controls={contentId}
        >
          <span>
            <ReactHTMLParser html={title} />
          </span>
        </AccordionTrigger>
        <AccordionContent
          id={contentId}
          className={cn('c-accordion__content', 'px-4 pb-4 pt-2 text-sm')}
        >
          {block.innerBlocks && block.innerBlocks.length > 0 && (
            <Content content={block.innerBlocks} />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
