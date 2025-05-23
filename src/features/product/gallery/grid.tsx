import { useState } from 'react';
import { Image } from '@src/components/common/image';
import { Image as ImageType } from '@src/models/product/types';
import { cn } from '@src/lib/helpers/helper';
import { SlideImages } from '@src/features/product/slide-images';
import { useSiteContext } from '@src/context/site-context';

import { OnSaleBadgeGallery } from '@src/features/product/gallery/sale-badge';
import { NewBadgeGallery } from '@src/features/product/gallery/new-badge';

interface IGridGallery {
  id?: string;
  className?: string;
  images: ImageType[];
  isNew: boolean;
  onSale: boolean;
  badgeType?: number;
  saleBadgeColor?: string;
  newBadgeColor?: string;
  selectedImageIndex: number | undefined;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
}
export const GridGallery = (props: IGridGallery) => {
  const {
    id,
    className,
    images,
    isNew,
    onSale,
    badgeType,
    saleBadgeColor,
    newBadgeColor,
    selectedImageIndex,
    setSelectedImageIndex,
  } = props;
  const { settings } = useSiteContext();

  const [lightBoxOpen, setLightBoxOpen] = useState(false);

  return (
    <div className="product-thumbnails grid-style">
      <div className="relative overflow-hidden h-full grid grid-cols-2 gap-x-1 gap-y-1">
        {images.slice(0, 6).map((image, index) => (
          <div
            key={`grid-gallery-${image.id}-${index}`}
            className={cn(
              'grid-gallery-image aspect-w-1 relative h-[82px] w-full lg:h-[237px] xl:h-[300px] 2xl:h-[365px] bg-white flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0',
              settings?.productCardAspectRatioClasses
            )}
            onClick={() => {
              setLightBoxOpen(true);
              setSelectedImageIndex(index);
            }}
          >
            <span className="absolute inset-0 overflow-hidden object-cover">
              <Image
                width="500"
                height="500"
                src={image?.src}
                alt={(image.altText || image.title) as string}
                className={cn('w-full h-full object-center object-cover lg:w-full lg:h-full')}
              />
            </span>
            {images?.length > 1 && index === 1 && (
              <div className="absolute flex justify-between align-middle w-full h-full z-[7]">
                <SlideImages
                  images={images}
                  lightBox={[lightBoxOpen, setLightBoxOpen]}
                  imageIndex={selectedImageIndex}
                />
              </div>
            )}
          </div>
        ))}
        <OnSaleBadgeGallery
          onSale={onSale}
          badgeType={badgeType}
          saleBadgeColor={saleBadgeColor}
        />
        <NewBadgeGallery
          id={id}
          className={className}
          isNew={isNew}
          badgeType={badgeType}
          newBadgeColor={newBadgeColor}
        />
      </div>
    </div>
  );
};
