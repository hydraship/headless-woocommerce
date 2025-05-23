import dynamic from 'next/dynamic';

import { useProductContext } from '@src/context/product-context';
import { useProductBundle } from '@src/lib/hooks/product';
import { BundlePriceBreakdown } from '@src/features/product/bundles/price-breakdown';

const ProductVariationBundle = dynamic(() =>
  import('@src/features/product/bundles/variation').then((mod) => mod.ProductVariationBundle)
);

const ProductSimpleBundle = dynamic(() =>
  import('@src/features/product/bundles/simple').then((mod) => mod.ProductSimpleBundle)
);

export const AddToCartBundle = () => {
  const { product } = useProductContext();
  const bundles = useProductBundle(product);

  if (!product || !product.hasBundle) return null;

  return (
    <>
      {bundles &&
        bundles?.products?.map((bundle, key) => {
          if (bundle?.variations) {
            return (
              <ProductVariationBundle
                key={`variation-bundle-${key}-${bundle.product.id}`}
                bundle={bundle}
              />
            );
          } else {
            return (
              <ProductSimpleBundle
                key={`simple-bundle-${key}-${bundle.product.id}`}
                bundle={bundle}
              />
            );
          }
        })}
      {bundles === null && <div className="loading-placeholder w-full h-24"></div>}
      <BundlePriceBreakdown />
    </>
  );
};
