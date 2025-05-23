import parse from 'html-react-parser';
import { env } from '@src/lib/env';
const { NEXT_PUBLIC_MENU_LINK_RELATIVE, NEXT_PUBLIC_WORDPRESS_SITE_URL } = env();

type Props = {
  html: string;
};

/**
 * Processes HTML content to handle relative URLs based on configuration
 * @param html The HTML content to process
 * @returns Processed HTML with updated URLs if needed
 */
export const processHtmlLinks = (html: string): string => {
  // If NEXT_PUBLIC_MENU_LINK_RELATIVE is truthy, keep links as they are
  if (NEXT_PUBLIC_MENU_LINK_RELATIVE === 'true' || NEXT_PUBLIC_MENU_LINK_RELATIVE === '1') {
    return html;
  }

  const baseUrl = NEXT_PUBLIC_WORDPRESS_SITE_URL || '';

  // Replace all href values that are **not** full URLs
  return html.replace(/href="([^"]*)"/g, (match, hrefValue) => {
    // Check if it's a full URL (starts with http or https)
    const isAbsolute = /^https?:\/\//.test(hrefValue);
    if (isAbsolute) return match;

    // It's a relative URL, prepend the base URL
    return `href="${baseUrl}${hrefValue}"`;
  });
};

export const ReactHTMLParser = (props: Props) => {
  const updatedHtml = processHtmlLinks(props.html);
  return <>{parse(updatedHtml)}</>;
};

export const htmlParser = (html: string) => {
  const updatedHtml = processHtmlLinks(html);
  return parse(updatedHtml);
};
