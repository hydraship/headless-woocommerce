import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSiteContext } from '@src/context/site-context';
import { makeLinkRelative } from '@src/lib/helpers/helper';

/**
 * Custom hook for handling menu link functionality
 * 
 * @param href The original href from WordPress
 * @returns Object containing relativeLink, isActive, and prefetchLink
 */
export function useMenuLink(href: string | undefined) {
  const { currentCountry } = useSiteContext();
  const { asPath, prefetch, isReady } = useRouter();
  
  // Convert to relative path
  const relativeLink = useMemo(() => {
    if (!href) return '#';
    return makeLinkRelative(href);
  }, [href]);
  
  // Check if link is active
  const isActive = useMemo(() => {
    if (!isReady || !relativeLink || relativeLink === '#') return false;
    
    // Normalize current path for comparison
    const currentPath = asPath.split('?')[0].replace(/\/$/, '');
    return currentPath === relativeLink;
  }, [asPath, isReady, relativeLink]);
  
  // Prefetch the link for better performance
  useEffect(() => {
    if (href && relativeLink !== '#' && isReady) {
      prefetch(`/${currentCountry}${relativeLink}`);
    }
  }, [currentCountry, href, isReady, prefetch, relativeLink]);
  
  return {
    relativeLink,
    isActive,
    prefetchLink: `/${currentCountry}${relativeLink}`
  };
}
