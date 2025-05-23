import { useState, useRef } from 'react';
import { BlockComponentProps } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';
import { findBlock } from '@src/lib/block';
import { useOnClickOutside } from 'usehooks-ts';

export interface ClickDropDownProps extends BlockComponentProps {}

export const ClickDropDown = ({ block }: ClickDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  if (!block || !block.innerBlocks) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;

  // Find the dropdown items block by metadata name
  const dropdownItemsBlock = findBlock(block.innerBlocks, 'ClickDropDownItems');

  // Return null if dropdown items block is not found
  if (!dropdownItemsBlock) {
    console.warn('ClickDropDownItems block not found in ClickDropDownMenu');
    return null;
  }

  // Filter out the dropdown items block from the main content
  const mainContent = block.innerBlocks.filter(
    (innerBlock) => {
      const innerBlockAttrs = innerBlock.attrs as BlockAttributes;
      return innerBlockAttrs?.metadata?.name !== 'ClickDropDownItems';
    }
  );

  // Return null if there's no main content to display
  if (!mainContent.length) {
    console.warn('No main content found in ClickDropDownMenu');
    return null;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center"
    >
      {/* Main clickable content */}
      <div
        onClick={toggleDropdown}
        className={cn(
          attributes.className,
          'cursor-pointer flex items-center',
          { 'active': isOpen }
        )}
      >
        <Content content={mainContent} />
      </div>

      {/* Dropdown content */}
      {dropdownItemsBlock && dropdownItemsBlock.innerBlocks && dropdownItemsBlock.innerBlocks.length > 0 && (
        <div
          className={cn(
            (dropdownItemsBlock.attrs as BlockAttributes)?.className,
            { 'flex': isOpen, 'hidden': !isOpen }
          )}
        >
          <Content content={dropdownItemsBlock.innerBlocks} />
        </div>
      )}
    </div>
  );
};
