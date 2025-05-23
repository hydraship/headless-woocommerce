import { ParsedBlock } from '@src/components/blocks';
import { useSiteContext } from '@src/context/site-context';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { parseLink } from '@src/lib/helpers/helper';
import { env } from '@src/lib/env';

const { NEXT_PUBLIC_CHECKOUT_URL, NEXT_PUBLIC_WORDPRESS_SITE_URL } = env();

type ProceedToCheckoutButtonProps = {
  block: ParsedBlock;
};

export const ProceedToCheckoutButton = ({ block }: ProceedToCheckoutButtonProps) => {
  const { cartUpdating, fetchingCart, wooCustomerId } = useSiteContext();
  const blockName = getBlockName(block);
  if ('ProceedToCheckoutButton' !== blockName) {
    return null;
  }

  const plainText = block.innerHTML.replace(/<[^>]+>/g, '').trim();
  const attributes = block.attrs as BlockAttributes;
  // Extract href from plainText if it exists
  const extractedHref = parseLink(block.innerHTML);

  // Determine the href to use
  let checkoutUrl = NEXT_PUBLIC_CHECKOUT_URL || '';

  if (extractedHref) {
    // Replace {{session_id}} with wooCustomerId if present
    if (extractedHref.includes('{{session_id}}') && wooCustomerId) {
      checkoutUrl = extractedHref.replace(/{{session_id}}/g, wooCustomerId);
    } else {
      checkoutUrl = extractedHref;
    }

    // Use NEXT_PUBLIC_WORDPRESS_SITE_URL for return URL
    if (NEXT_PUBLIC_WORDPRESS_SITE_URL) {
      checkoutUrl = `${NEXT_PUBLIC_WORDPRESS_SITE_URL}${checkoutUrl}`;
    }
  }

  if (cartUpdating || fetchingCart) {
    return <div className="animate-pulse w-full h-14 bg-gray-300"></div>;
  }

  return (
    <a
      href={checkoutUrl}
      className={attributes.className}
    >
      {plainText}
    </a>
  );
};
