import { ParsedBlock } from '@src/components/blocks';
import { useContentContext } from '@src/context/content-context';
import { getHeadingTag } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';
import { Product } from '@src/models/product';
import { RawLink } from '@src/components/common/raw-link';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { seoUrlParser } from '@src/components/page-seo';
import { CartItemGlobalProps } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item';
import { CartItemSkeletonName } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-skeleton';

type WooCommerceProductNameTemplateProps = {
  block: ParsedBlock;
};

export const WooCommerceProductNameTemplate = ({ block }: WooCommerceProductNameTemplateProps) => {
  const { type, data } = useContentContext();
  if ('core/post-title' !== block.blockName || !data) {
    return null;
  }

  const attribute = block.attrs as BlockAttributes;
  if (attribute.__woocommerceNamespace !== 'woocommerce/product-collection/product-title') {
    return null;
  }

  const { level, className } = attribute;
  const TagName = getHeadingTag(level as number);

  if ('product-cart-item' === type) {
    const { cartItem, loading } = data as CartItemGlobalProps;
    if (loading) {
      return <CartItemSkeletonName />;
    }
    const productType = cartItem.type.toLowerCase();

    return (
      <TagName
        className={cn(`product-name ${productType} text-base font-bold font-secondary`, className)}
      >
        <RawLink href={`/product/${cartItem.slug}`}>
          <ReactHTMLParser html={cartItem.name as string} />
        </RawLink>
      </TagName>
    );
  }

  if ('product' !== type) {
    return null;
  }

  // Below are the default component when type is product
  const product = data as Product;
  const productLink = seoUrlParser(product?.permalink || '');
  const productName = product?.metaData?.acf?.product_code
    ? `${product.name} - ${product.metaData?.acf?.product_code}`
    : product.name;

  return (
    <TagName className={cn('product-name', className)}>
      <RawLink href={productLink}>
        <span
          aria-hidden="true"
          className=" absolute inset-x-auto inset-y-5 z-[8] cursor-pointer"
        />
        <ReactHTMLParser html={productName as string} />
      </RawLink>
    </TagName>
  );
};
