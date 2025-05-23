import { ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { CarouselContent } from '@src/components/ui/carousel';
import { BlockAttributes } from '@src/lib/block/types';
import { RealWooCommerceProductCollectionQueryResponse } from '@src/components/blocks/woocommerce/product-collection/real-product-collection';
import { transformProductsForDisplay } from '@src/lib/helpers/product';
import { ProductCartItem } from '@src/lib/hooks/cart';
import { Product } from '@src/models/product';
import { cn } from '@src/lib/utils';

type Props = {
  block: ParsedBlock;
};

export const CarouselContentBlock = ({ block }: Props) => {
  const { type, data } = useContentContext();
  const blockName = getBlockName(block);
  const allowedBlocks = ['CarouselContent', 'sg-gutenberg-customisations/static-carousel'];
  if (blockName && !allowedBlocks.includes(blockName)) {
    return null;
  }
  const attribute = block.attrs as BlockAttributes;
  return (
    <CarouselContent className={attribute.className}>
      <Content
        type={type}
        content={block.innerBlocks}
        globalData={data}
      />
    </CarouselContent>
  );
};

export const ProductCarouselContent = ({ block }: Props) => {
  const { type, data } = useContentContext();
  const blockName = getBlockName(block);
  if ('ProductCarouselContent' !== blockName || !data) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;

  if ('products' === type || 'products-query-response' === type) {
    const products: Product[] =
      type === 'products'
        ? (data as Product[])
        : (data as RealWooCommerceProductCollectionQueryResponse).products;

    const productsForDisplay = transformProductsForDisplay(products);

    return (
      <CarouselContent className={cn('flex', attributes.className)}>
        {productsForDisplay.map((product, index: number) => (
          <Content
            key={`${product.id}-${index}`}
            type="product"
            globalData={product}
            content={block.innerBlocks}
          />
        ))}
      </CarouselContent>
    );
  }

  if ('product-cart-items' === type) {
    const cartItems = data as ProductCartItem[];
    if (cartItems.length === 0) {
      return null;
    }

    return (
      <div className={attributes.className}>
        {cartItems.map((cartItem, index: number) => (
          <Content
            key={`${cartItem.cartKey}-${index}`}
            type="product-cart-item"
            globalData={cartItem}
            content={block.innerBlocks}
          />
        ))}
      </div>
    );
  }

  return null;
};
