import { BlockComponentProps } from '@src/components/blocks';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import Link from 'next/link';

export const NavigationLink = ({ block }: BlockComponentProps) => {
  const attrs = block.attrs as BlockAttributes;

  // Extract navigation link attributes
  const { label, url, opensInNewTab, isTopLevelLink, className } = attrs;

  // If no URL is provided, render just the label
  if (!url) {
    return (
      <span className={cn('navigation-link', className)}>
        {label && <ReactHTMLParser html={label} />}
      </span>
    );
  }

  // Check if it's an external link or special type (tel, email, etc.)
  const isExternal = url.startsWith('http') || url.startsWith('https');
  const isTelOrEmail = /^(tel|email):.*/gm.test(url);

  // For external links or tel/email links, use a regular anchor tag
  if (isExternal || isTelOrEmail) {
    return (
      <a
        href={url}
        target={opensInNewTab ? '_blank' : '_self'}
        rel={opensInNewTab ? 'noopener noreferrer' : undefined}
        className={cn('navigation-link', className, {
          'is-top-level': isTopLevelLink,
        })}
      >
        {label && <ReactHTMLParser html={label} />}
      </a>
    );
  }

  // For internal links, use PrefetchLink
  return (
    <Link
      href={url}
      target={opensInNewTab ? '_blank' : '_self'}
      className={cn('navigation-link', className, {
        'is-top-level': isTopLevelLink,
      })}
    >
      {label && <ReactHTMLParser html={label} />}
    </Link>
  );
};
