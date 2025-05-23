import { Dictionary } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { v4 } from 'uuid';

import { PrefetchLink } from '@src/components/common/prefetch-link';
import { cn } from '@src/lib/utils';

type ImageItem = {
  classes?: string;
  imageUrl?: string;
  altText?: string;
  redirectUrl?: string;
  redirectType?: '_blank' | undefined;
};

type Props = {
  images: ImageItem[];
  config?: Dictionary<string>;
};

export const MultipleImage = ({ images, config }: Props) => {
  if (isEmpty(images)) return null;

  const containerClass = cn(config?.containerClass, {
    'grid grid-cols-3 md:flex gap-y-8 gap-x-6 w-full relative md:px-4': !config?.containerClass,
  });

  return (
    <div className={containerClass}>
      {images?.map((image) => {
        if (isEmpty(image)) return null;

        const classNames = cn(image?.classes);
        const splitSrc = image?.imageUrl?.split('/');
        const srcName = splitSrc?.[splitSrc?.length - 1];
        const newImageUrl = `/images/homepage/${srcName}`;

        const renderImage = (
          <Image
            src={newImageUrl as string}
            alt={image?.altText || 'image'}
            width={500}
            height={500}
            className={classNames}
          />
        );

        if (image?.redirectUrl) {
          return (
            <PrefetchLink
              key={v4()}
              unstyled
              href={image?.redirectUrl}
            >
              {renderImage}
            </PrefetchLink>
          );
        }

        return renderImage;
      })}
    </div>
  );
};
