import { ShortcodeAttribute } from '@src/components/blocks/shortcode';
import React from 'react';

export const WPSLStoreLocator = ({ attributes }: { attributes: ShortcodeAttribute[] }) => {
  return (
    <div className="h-screen overflow-hidden max-w-7xl mx-auto">
      <iframe
        src="/api/proxy?urlPath=/dealer-locator-frame/"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};
