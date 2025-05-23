/**
 * CurrencySwitcher Component
 *
 * This component renders a currency switcher dropdown based on a WordPress block structure.
 * It takes a Group block with metadata.name="CurrencySwitcher" and renders:
 * - A select element with options from a List block inside the group
 * - A custom arrow from an Icon block inside the group
 */

import { useSiteContext } from '@src/context/site-context';
import { BlockComponentProps, ParsedBlock } from '@src/components/blocks';
import { cn } from '@src/lib/helpers/helper';
import { isBlockNameA } from '@src/lib/block';
import { getRegionByCountry } from '@src/lib/helpers/country';
import regionSettings from '@public/region.json';
import { useState, useRef, useEffect } from 'react';
import { lookupCountryCode } from './country-utils';
import { IconBlock } from '../../outermost/IconBlock';

// Helper function to find a block by name in the innerBlocks array
const findBlockByName = (blocks: ParsedBlock[], name: string): ParsedBlock | undefined => {
  for (const block of blocks) {
    if (block.blockName === name) {
      return block;
    }
  }
  return undefined;
};

// Helper function to extract text from a block
const getTextFromBlock = (block: ParsedBlock): string => {
  if (block.blockName === 'core/list-item') {
    // First try to get the text content from the innerHTML
    if (block.innerHTML) {
      // Remove HTML tags but preserve the content
      return block.innerHTML.replace(/<[^>]*>/g, '') || '';
    }

    // If no innerHTML, try to get text from innerBlocks (paragraph blocks)
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      const paragraphBlock = block.innerBlocks.find((b) => b.blockName === 'core/paragraph');
      if (paragraphBlock && paragraphBlock.innerHTML) {
        return paragraphBlock.innerHTML.replace(/<[^>]*>/g, '') || '';
      }
    }
  }
  return '';
};

// Helper function to extract the display name from a formatted string
// Format: "{countryCode} - {CountryName}"
const getDisplayName = (formattedString: string): string => {
  // Handle empty strings
  if (!formattedString || formattedString.trim() === '') {
    return '';
  }

  // Extract country name from the formatted string
  const parts = formattedString.split('-');
  if (parts.length >= 2) {
    // Return everything after the first dash, trimmed
    return parts.slice(1).join('-').trim();
  }

  // If no dash is found, return the original string
  return formattedString;
};

// Use the lookupCountryCode function from country-utils.ts

export const CurrencySwitcher = ({ block }: BlockComponentProps) => {
  const { handleCountryChange, currentCountry } = useSiteContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Verify this is a CurrencySwitcher block
  const isCurrencySwitcher = isBlockNameA(block, 'CurrencySwitcher');
  if (!isCurrencySwitcher) {
    return null;
  }

  // Ensure we have the required context
  if (!handleCountryChange) {
    console.warn('CurrencySwitcher: handleCountryChange is not available in site context');
    return null;
  }

  // If there's only one region available, don't show the switcher
  if (!regionSettings || regionSettings.length <= 1) {
    return null;
  }

  // Get block attributes
  const attributes = block.attrs || {};
  const className = attributes.className || '';

  // Find the list block for options
  const listBlock = findBlockByName(block.innerBlocks, 'core/list');

  // Get the class name from the list block if available
  // Include both the custom class name and the default wp-block-list class
  // Prioritize the custom class name over the default class
  const listClassName = cn(
    listBlock?.attrs?.className || '',
    'wp-block-list' // Add the default WordPress list block class
  );

  // Create a custom handler for radio buttons
  const handleRadioChange = (countryCode: string) => {
    // Verify the country code exists in region settings
    const region = getRegionByCountry(countryCode);
    if (!region) {
      return;
    }

    const event = {
      target: {
        value: countryCode,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    handleCountryChange(event);
    setIsOpen(false); // Close dropdown after selection
  };

  // Helper function to get the current country name
  const getCurrentCountryName = () => {
    // If using list block
    if (listBlock && listBlock.innerBlocks && listBlock.innerBlocks.length > 0) {
      for (const item of listBlock.innerBlocks) {
        const text = getTextFromBlock(item);
        const countryCode = lookupCountryCode(text);
        // Only match if the country code is valid and exists in region settings
        if (countryCode && getRegionByCountry(countryCode) && countryCode === currentCountry) {
          return getDisplayName(text);
        }
      }
    }

    // Fallback to region settings
    const region = regionSettings.find((r) => r.baseCountry === currentCountry);
    if (region) {
      return region.baseCountry;
    }

    // Default fallback
    return currentCountry || 'Select Country';
  };

  // Helper function to render the fallback currency switcher using region settings
  const renderFallbackOptions = () => {
    // If we have a list block, try to get class names from it
    const listItemClassNames: Record<string, string> = {};

    if (listBlock && listBlock.innerBlocks) {
      // Get class names from list items
      listBlock.innerBlocks.forEach((item) => {
        const text = getTextFromBlock(item);
        const countryCode = lookupCountryCode(text);
        // Only use country codes that are valid and exist in region settings
        if (countryCode && getRegionByCountry(countryCode) && item.attrs?.className) {
          listItemClassNames[countryCode] = item.attrs.className;
        }
      });
    }

    return regionSettings.map((region, index) => {
      // Try to get class name from list item if available
      const itemClassName = listItemClassNames[region.baseCountry] || '';

      return (
        <li
          key={index}
          className={cn(itemClassName, 'flex items-center cursor-pointer w-full')}
        >
          <input
            type="radio"
            name="currency-switcher"
            id={`currency-${region.baseCountry}`}
            value={region.baseCountry}
            checked={currentCountry === region.baseCountry}
            onChange={() => handleRadioChange(region.baseCountry)}
            className="mr-2 flex-shrink-0"
          />
          <label
            htmlFor={`currency-${region.baseCountry}`}
            className="cursor-pointer flex-1 whitespace-nowrap pr-2"
          >
            {region.baseCountry}
          </label>
        </li>
      );
    });
  };

  // Render options from list block
  const renderListOptions = () => {
    if (!listBlock || !listBlock.innerBlocks) {
      return [];
    }

    // Track country codes to detect duplicates (like International and USA both using US)
    const usedCountryCodes = new Set<string>();
    const duplicateCountryCodes = new Set<string>();

    // First pass: identify duplicate country codes
    listBlock.innerBlocks.forEach((item) => {
      const text = getTextFromBlock(item);
      const countryCode = lookupCountryCode(text);

      if (countryCode && getRegionByCountry(countryCode)) {
        if (usedCountryCodes.has(countryCode)) {
          duplicateCountryCodes.add(countryCode);
        } else {
          usedCountryCodes.add(countryCode);
        }
      }
    });

    return listBlock.innerBlocks
      .map((item, index) => {
        // Extract the text from the list item
        const text = getTextFromBlock(item);

        // Get country code using our utility function
        const countryCode = lookupCountryCode(text);

        // Skip items that don't have a valid country code or don't exist in region settings
        if (!countryCode || !getRegionByCountry(countryCode)) {
          return null;
        }

        // We no longer need special handling for "International" since it will have its own country code
        // in the new format: "{countryCode} - International"

        // Get the class name from the list item if available
        const itemClassName = item.attrs?.className || '';

        return (
          <li
            key={index}
            className={cn(itemClassName, 'flex items-center cursor-pointer w-full')}
          >
            <input
              type="radio"
              name="currency-switcher"
              id={`currency-${countryCode}`}
              value={countryCode}
              checked={currentCountry === countryCode}
              onChange={() => handleRadioChange(countryCode)}
              className="mr-2 flex-shrink-0"
            />
            <label
              htmlFor={`currency-${countryCode}`}
              className="cursor-pointer flex-1 whitespace-nowrap pr-2"
            >
              {getDisplayName(text)}
            </label>
          </li>
        );
      })
      .filter(Boolean);
  };

  // Determine which options to render
  const renderOptions = () => {
    if (!listBlock || !listBlock.innerBlocks || listBlock.innerBlocks.length === 0) {
      return renderFallbackOptions();
    }

    const options = renderListOptions();
    if (options.length === 0) {
      return renderFallbackOptions();
    }

    return options;
  };

  // Check if we have the required blocks
  const iconBlock = findBlockByName(block.innerBlocks, 'outermost/icon-block');

  // If list block is missing, return null
  if (!listBlock) {
    console.warn('CurrencySwitcher: List block not found');
    return null;
  }

  // We'll use a fallback SVG if the icon block isn't found

  return (
    <div
      ref={dropdownRef}
      className="currency-switcher-dropdown relative"
    >
      {/* Dropdown trigger */}
      <div
        className={cn(
          attributes.className || '',
          'flex justify-between bg-transparent text-background cursor-pointer min-w-[120px] w-auto'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {getCurrentCountryName()}
        </span>
        <span className={cn('transition-transform flex-shrink-0', isOpen ? 'rotate-180' : '')}>
          {/* Icon block */}
          {iconBlock ? (
            <IconBlock block={iconBlock} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.2636 9.86358C6.61508 9.51211 7.18492 9.51211 7.5364 9.86358L12 14.3272L16.4636 9.86358C16.8151 9.51211 17.3849 9.51211 17.7364 9.86358C18.0879 10.2151 18.0879 10.7849 17.7364 11.1364L12.6364 16.2364C12.4676 16.4052 12.2387 16.5 12 16.5C11.7613 16.5 11.5324 16.4052 11.3636 16.2364L6.2636 11.1364C5.91213 10.7849 5.91213 10.2151 6.2636 9.86358Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
        </span>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <ul
          className={cn(
            listClassName,

            'absolute z-10 min-w-full'
          )}
        >
          {renderOptions()}
        </ul>
      )}
    </div>
  );
};
