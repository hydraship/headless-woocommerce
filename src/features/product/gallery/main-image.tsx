import { useState } from 'react';

import { Image } from '@src/components/common/image';
import { Image as ImageType } from '@src/models/product/types';
import { Tab } from '@headlessui/react';
import { cn, isMp4 } from '@src/lib/helpers/helper';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Video } from '@components/video';
import { emptyImagePlaceholder } from '@src/lib/constants/image';
import { SlideImages } from '@src/features/product/slide-images';

import { OnSaleBadgeGallery } from '@src/features/product/gallery/sale-badge';
import { NewBadgeGallery } from '@src/features/product/gallery/new-badge';

interface IMainImage {
  id?: string;
  className?: string;
  images: ImageType[];
  isNew: boolean;
  onSale: boolean;
  badgeType?: number;
  saleBadgeColor?: string;
  newBadgeColor?: string;
  zoomType?: string;
  imageThumbnailAttribute: ImageType;
  selectedImageIndex: number | undefined;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const MainImage = (props: IMainImage) => {
  const {
    id,
    className,
    images,
    isNew,
    onSale,
    badgeType,
    saleBadgeColor,
    newBadgeColor,
    zoomType,
    imageThumbnailAttribute,
    selectedImageIndex,
    setSelectedImageIndex,
  } = props;
  const lastIndex = images.length - 1;

  const [lightBoxOpen, setLightBoxOpen] = useState(false);

  return (
    <Tab.Panels className="w-full aspect-w-1 h-[285px] md:h-[450px] overflow-hidden relative">
      {images.length > 0 &&
        images.map((image, index) => {
          const currentImageSrc = imageThumbnailAttribute?.src
            ? imageThumbnailAttribute.src
            : image.src;
          const currentAltText = imageThumbnailAttribute?.altText
            ? imageThumbnailAttribute.altText
            : image.altText;
          return (
            <Tab.Panel key={`desktop-image-${image.id}-${index}`}>
              <div className="relative h-full main-product-image">
                {isMp4(image?.src) ? (
                  <Video src={image?.src} />
                ) : (
                  <>
                    {image?.src ? (
                      <>
                        <Image
                          fill
                          blur={false}
                          src={currentImageSrc}
                          alt={(currentAltText || image.title) as string}
                          className="w-full h-full lg:object-center object-contain cursor-pointer"
                          hasZoomHover={zoomType === '1'}
                        />
                      </>
                    ) : (
                      <Image
                        src={emptyImagePlaceholder}
                        alt="Thumbnail"
                        width={100}
                        height={100}
                        className="h-full w-full p-20 bg-gray-200 object-contain object-center"
                      />
                    )}
                  </>
                )}
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
                <div className="product-gallery-arrows">
                  <button
                    className={cn('arrow arrow-left', {
                      invisible: index === 0,
                    })}
                    onClick={() => setSelectedImageIndex(index - 1)}
                  >
                    <span>
                      <FaArrowLeft className="w-6 h-6" />
                    </span>
                  </button>
                  <button
                    className={cn('arrow arrow-right', {
                      invisible: index === lastIndex,
                    })}
                    onClick={() => setSelectedImageIndex(index + 1)}
                  >
                    <span>
                      <FaArrowRight className="w-6 h-6" />
                    </span>
                  </button>
                </div>
                {images?.length > 1 && (
                  <div className="absolute flex justify-between align-middle w-full h-full z-4">
                    <SlideImages
                      images={images}
                      lightBox={[lightBoxOpen, setLightBoxOpen]}
                      imageIndex={selectedImageIndex}
                    />
                  </div>
                )}
              </div>
            </Tab.Panel>
          );
        })}
    </Tab.Panels>
  );
};
