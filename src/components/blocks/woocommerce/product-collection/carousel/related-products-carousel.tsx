import { ParsedBlock } from '@src/components/blocks';
import { CarouselProducts } from '@src/components/blocks/woocommerce/product-collection/carousel/carousel-products';
import { useProductContext } from '@src/context/product-context';
import { Product, ProductTypesenseResponse } from '@src/models/product';

export const RelatedProductsCarousel = ({ block }: { block: ParsedBlock }) => {
  const { linkedProducts } = useProductContext();
  const relatedProducts = (linkedProducts?.relatedProducts as ProductTypesenseResponse[]) ?? [];

  const products = Product.buildFromResponseArray(relatedProducts) ?? [];

  // return <div>lksdjfl</div>;
  return (
    <CarouselProducts
      block={block}
      products={products}
    />
  );
};
