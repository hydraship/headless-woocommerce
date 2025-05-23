import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useProductContext } from '@src/context/product-context';
import { Image as ImageType } from '@src/models/product/types';

import { cn } from '@src/lib/helpers/helper';

import { ImageGallery } from '@src/features/product/gallery/image';
import { GridGallery } from '@src/features/product/gallery/grid';
import { MainImage } from '@src/features/product/gallery/main-image';

type Props = {
  id?: string;
  className?: string;
  images?: ImageType[];
  onSale?: boolean;
  isNew?: boolean;
  isHotSale?: boolean;
  isGrid?: boolean;
  zoomType?: string;
  badgeType?: number;
  saleBadgeColor?: string;
  newBadgeColor?: string;
};

export const Gallery: React.FC<Props> = (props) => {
  const {
    id,
    className,
    images,
    isNew,
    isHotSale,
    onSale,
    isGrid,
    zoomType,
    badgeType,
    saleBadgeColor,
    newBadgeColor,
  } = props;

  const {
    variation: {
      image: [imageThumbnailAttribute, setImageThumbnailAttribute],
    },
    state: { matchedVariant },
  } = useProductContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | undefined>(0);
  const { asPath } = useRouter();

  useEffect(() => {
    // On component mount reset the selected index of the image to the first element
    setSelectedImageIndex(0);
  }, [asPath]);

  useEffect(() => {
    // reset the image thumbnail attribute when the selected image index changes
    setImageThumbnailAttribute({} as ImageType);
  }, [selectedImageIndex, setImageThumbnailAttribute]);

  useEffect(() => {
    if (!matchedVariant) return;

    setImageThumbnailAttribute(matchedVariant.thumbnail as ImageType);
    setSelectedImageIndex(undefined);
  }, [matchedVariant, setImageThumbnailAttribute, setSelectedImageIndex]);

  if (!images) return null;

  return (
    <Tab.Group
      as="div"
      className="product-gallery"
      selectedIndex={selectedImageIndex}
      onChange={setSelectedImageIndex}
    >
      {isGrid && images.length > 1 && (
        <GridGallery
          id={id}
          className={className}
          images={images}
          isNew={isNew ?? false}
          onSale={onSale ?? false}
          badgeType={badgeType}
          saleBadgeColor={saleBadgeColor}
          newBadgeColor={newBadgeColor}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
      )}

      <div
        className={cn('product-thumbnails default', {
          'lg:hidden': images.length > 1 && isGrid,
        })}
      >
        <MainImage
          className={className}
          images={images}
          isNew={isNew ?? false}
          onSale={onSale ?? false}
          zoomType={zoomType}
          badgeType={badgeType}
          saleBadgeColor={saleBadgeColor}
          newBadgeColor={newBadgeColor}
          imageThumbnailAttribute={imageThumbnailAttribute}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
        <ImageGallery images={images} />
      </div>
    </Tab.Group>
  );
};
