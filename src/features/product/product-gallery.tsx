import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import { Gallery } from '@src/features/product/gallery';
import { useSiteContext } from '@src/context/site-context';
import { useProductContext } from '@src/context/product-context';
import { Settings } from '@src/models/settings';
import { ProductSettings } from '@src/models/settings/product';
import { Shop, ProductCards } from '@src/models/settings/shop';
import { toDateTime, isWithInMonthsAgo } from '@src/lib/helpers/date';
import { isHotSale } from '@src/lib/helpers/product';
import { Image as ImageType } from '@src/models/product/types';
import siteConfig from '@public/config.json';

type TProps = {
  className?: string;
  id?: string;
};

export const ProductGallery = ({ className, id }: TProps) => {
  const { product } = useProductContext();
  const { settings } = useSiteContext();
  const [images, setImages] = useState<ImageType[]>([]);

  useEffectOnce(() => {
    if (!product?.galleryImages) return;

    if (!product?.metaData?.acf?.video_link) {
      setImages(product.galleryImages as ImageType[]);
      return;
    }

    const images = product.galleryImages as ImageType[];
    const videoSrc: ImageType = {
      src: product.metaData.acf.video_link,
    };

    //add videoSrc to the second position of the images array
    setImages([images[0], videoSrc, ...images.slice(1)]);

    // setImages([videoSrc, ...images]);
  });

  if (!product) return null;

  const { productGallery } = siteConfig.product;
  const { shop } = settings as Settings;
  const { layout } = shop as Shop;
  const { productCards } = layout;
  const {
    badgeType = 1,
    saleBadgeColor = '#4A5468',
    newBadgeColor = '#4A5468',
  } = productCards as ProductCards;
  const newBadgeThreshold = +productGallery.newProductBadgeThreshold / 30;
  const publishedDate = toDateTime(product.publishedAt as number);
  const isTwoMonthsAgo = isWithInMonthsAgo(publishedDate, newBadgeThreshold);

  return (
    <Gallery
      id={id}
      className={className}
      images={images}
      onSale={product.onSale}
      isNew={isTwoMonthsAgo}
      isHotSale={isHotSale(product, settings as Settings)}
      isGrid={productGallery?.isGrid}
      zoomType={productGallery?.zoomType}
      badgeType={badgeType}
      saleBadgeColor={saleBadgeColor}
      newBadgeColor={newBadgeColor}
    />
  );
};
