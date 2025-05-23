import { ParsedBlock } from '@wordpress/block-serialization-default-parser';
import { WPShortcodes, IResult, IShortcode } from '@src/lib/helpers/shortcode';
import { ShortcodeName, shortcodes } from '@src/components/shortcodes';
import React from 'react';

type EmbedProps = {
  block: ParsedBlock;
};

export type ShortcodeAttribute = {
  [key: string]: string | number | boolean | null | undefined;
};

type ShortcodeData = {
  attributes: ShortcodeAttribute[];
  code: string;
  raw: string;
  attributeKeys: string[];
  attributeString: string;
  attributeStringWithoutHTML: string;
  attributeStringWithoutValues: string;
};

export const Shortcode = ({ block }: EmbedProps) => {
  if ('core/shortcode' !== block.blockName) {
    return null;
  }

  const checkShortcodes: IResult = WPShortcodes(block.innerHTML);

  if (typeof checkShortcodes === 'undefined') return null;

  const { shortcodes: theShortcodes } = checkShortcodes;

  if (theShortcodes.length === 0) return null;

  return (
    <>
      {theShortcodes.map((shortcode: any | ShortcodeData, index: number) => {
        const ShortcodeComponent = shortcodes[shortcode.code as ShortcodeName];
        if (!ShortcodeComponent || typeof ShortcodeComponent === 'undefined') {
          return null;
        }

        return (
          <ShortcodeComponent
            key={`shortcode-component-${index}`}
            attributes={shortcode.attributes}
          />
        );
      })}
    </>
  );
};
