import { Tab } from '@headlessui/react';
import { Image } from '@src/components/common/image';
import { Image as ImageType } from '@src/models/product/types';
import { cn, isMp4 } from '@src/lib/helpers/helper';
import { Play } from '@src/components/svg/video-controls';

interface IImageGallery {
  images: ImageType[];
}

export const ImageGallery = (props: IImageGallery) => {
  const { images } = props;
  return (
    <>
      {images.length > 1 ? (
        <div className="mt-5 lg:mt-3 w-full">
          <Tab.List className="space-x-0 justify-normal grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <Tab
                key={`image-gallery-${image.id}-${index}`}
                className="product-image-galler-item lg:relative lg:h-[82px] xl:h-[155px] lg:bg-white flex lg:items-center lg:justify-center lg:text-sm lg:font-medium lg:uppercase lg:text-gray-900 lg:cursor-pointer lg:hover:bg-gray-50 lg:focus:outline-none lg:focus:ring-0 lg:focus:ring-offset-0"
              >
                {({ selected }) => (
                  <>
                    <span className="lg:absolute lg:inset-0 overflow-hidden">
                      {isMp4(image?.src) ? (
                        <div
                          className={cn(
                            'absolute w-full h-full bg-black flex items-center justify-center',
                            {
                              'opacity-50': !selected,
                            }
                          )}
                        >
                          <Play className="fill-white !w-10 !h-10" />
                        </div>
                      ) : (
                        <>
                          <Image
                            width="155"
                            height="155"
                            src={image?.src}
                            alt={(image.altText || image.title) as string}
                            className={cn(
                              'w-full h-full object-center object-contain lg:w-full lg:h-full',
                              { 'opacity-50': !selected }
                            )}
                          />
                        </>
                      )}
                    </span>
                    <span
                      className={cn('absolute pointer-events-none', {
                        'ring-transparent': !selected,
                        'ring-indigo-500': selected,
                      })}
                      aria-hidden="true"
                    />
                  </>
                )}
              </Tab>
            ))}
          </Tab.List>
        </div>
      ) : null}
    </>
  );
};
