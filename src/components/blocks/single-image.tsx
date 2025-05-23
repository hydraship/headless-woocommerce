import Image from 'next/image';

import { PrefetchLink } from '@src/components/common/prefetch-link';
import { cn } from '@src/lib/utils';

type Props = {
  classes: string;
  imageUrl: string;
  altText: string;
  redirectUrl: string;
  redirectType?: '_blank' | undefined;
};

export const SingleImage = ({ classes, imageUrl, altText, redirectUrl, redirectType }: Props) => {
  if (!imageUrl) return null;

  const classNames = cn(classes);
  const image = (
    <Image
      src={imageUrl}
      alt={altText || 'image'}
      width={500}
      height={500}
      className={classNames}
    />
  );

  if (redirectUrl) {
    return (
      <PrefetchLink
        unstyled
        href={redirectUrl}
        target={redirectType || '_self'}
      >
        {image}
      </PrefetchLink>
    );
  }
  return image;
};
