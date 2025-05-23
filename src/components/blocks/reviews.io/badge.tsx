import { BlockComponentProps } from '@src/components/blocks';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';

import { useEffect } from 'react';
import { useEffectOnce } from 'usehooks-ts';

// Define the interface for the window object with reviewsBadgeModern
interface ReviewsIoWindow extends Window {
  reviewsBadgeModern?: (
    elementId: string,
    options: {
      store: string;
      primaryClr: string;
      starsClr: string;
      lang: string;
    }
  ) => void;
}

export const ReviewsIoBadge = ({ block }: BlockComponentProps) => {
  const blockName = getBlockName(block);

  const params = blockName?.split('-') || [];
  const store = params[1] || 'gruum';
  const primaryClr = params[2] || '#07D083';
  const starsClr = params[3] || '#000000';
  const lang = params[4] || 'en';

  useEffectOnce(() => {
    // Check if the script already exists to prevent duplicate loading
    const scriptId = 'reviews-io-badge-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    // Cast window to our custom interface
    const reviewsWindow = window as unknown as ReviewsIoWindow;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://widget.reviews.io/badge-modern/dist.js';
      script.async = true;
      script.onload = () => {
        if (reviewsWindow.reviewsBadgeModern) {
          reviewsWindow.reviewsBadgeModern('badge-modern', {
            store: store,
            primaryClr: primaryClr,
            starsClr: starsClr,
            lang: lang,
          });
        }
      };
      document.body.appendChild(script);
    } else if (reviewsWindow.reviewsBadgeModern) {
      // If script already exists and reviewsBadgeModern is available, initialize it
      reviewsWindow.reviewsBadgeModern('badge-modern', {
        store: store,
        primaryClr: primaryClr,
        starsClr: starsClr,
        lang: lang,
      });
    }

    return () => {
      // Only remove the script if it exists and we were the ones who added it
      if (script && script.id === scriptId) {
        document.body.removeChild(script);
      }
    };
  });

  if (!blockName?.startsWith('ReviewsIoBadge')) {
    return null;
  }

  return <div id="badge-modern"></div>;
};
