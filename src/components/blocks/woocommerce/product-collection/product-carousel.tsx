import { ParsedBlock } from '@src/components/blocks';
import { CarouselProducts } from '@src/components/blocks/woocommerce/product-collection/carousel/carousel-products';
import { RecentlyViewedProductsCarousel } from '@src/components/blocks/woocommerce/product-collection/carousel/recently-viewed-products-carousel';
import { RelatedProductsCarousel } from '@src/components/blocks/woocommerce/product-collection/carousel/related-products-carousel';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { ITSProductQueryResponse } from '@src/lib/typesense/types';
import { Product } from '@src/models/product';

type ProductCarouselProductCollectionProps = {
  block: ParsedBlock;
};

const woocommerceCollections = {
  'woocommerce/product-collection/related': RelatedProductsCarousel,
  'woocommerce/product-collection/recently-viewed': RecentlyViewedProductsCarousel,
};

export const ProductCarouselProductCollection = ({
  block,
}: ProductCarouselProductCollectionProps) => {
  const blockName = getBlockName(block);

  const attributes = block.attrs as BlockAttributes;
  const collection = attributes.collection ?? '';
  const GutenbergBlock = woocommerceCollections[collection as keyof typeof woocommerceCollections];

  if (GutenbergBlock || typeof GutenbergBlock !== 'undefined') {
    return <GutenbergBlock block={block as ParsedBlock} />;
  }

  if (!block.componentProps) {
    return null;
  }

  const queryResponse = JSON.parse(block.componentProps) as ITSProductQueryResponse;
  const products = Product.buildFromResponseArray(queryResponse?.products) ?? [];
  if ('ProductCarousel' !== blockName) {
    return null;
  }

  return (
    <CarouselProducts
      block={block}
      products={products}
    />
  );
};
