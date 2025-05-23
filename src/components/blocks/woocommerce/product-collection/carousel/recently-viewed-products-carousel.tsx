import { ParsedBlock } from '@src/components/blocks';
import { CarouselProducts } from '@src/components/blocks/woocommerce/product-collection/carousel/carousel-products';
import { useProductContext } from '@src/context/product-context';
import { getBlockName } from '@src/lib/block';
import { useFetchRecentlyViewedProducts } from '@src/lib/hooks';
import { Product, ProductTypesenseResponse } from '@src/models/product';

export const RecentlyViewedProductsCarousel = ({ block }: { block: ParsedBlock }) => {
  const { data: recentlyViewedProducts, loading: fetchingRecentlyViewedProducts } =
    useFetchRecentlyViewedProducts();

  if (
    fetchingRecentlyViewedProducts ||
    !recentlyViewedProducts ||
    recentlyViewedProducts.length === 0
  ) {
    return null;
  }

  return (
    <CarouselProducts
      block={block}
      products={recentlyViewedProducts}
    />
  );
};
