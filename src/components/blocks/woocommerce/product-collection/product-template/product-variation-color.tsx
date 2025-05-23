import { ParsedBlock } from '@src/components/blocks';
import { useContentContext } from '@src/context/content-context';
import { VariationColorSwatches } from '@src/features/product/card-elements/variation-color-swatches';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';

interface ProductVariationColorProps {
  block: ParsedBlock;
}

export const ProductVariationColor = ({ block }: ProductVariationColorProps) => {
  const { data } = useContentContext();
  const attributes = block.attrs as BlockAttributes;
  const product = data;

  if (!product?.hasVariations) {
    return null;
  }

  return (
    <div
      className={cn('product-variation-color', attributes.className)}
      aria-label="Product color variations"
    >
      <VariationColorSwatches
        product={product}
        detailsAlignment="left"
        setShowColorVariant={() => {}}
      />
    </div>
  );
};

// Add display name for better debugging
ProductVariationColor.displayName = 'ProductVariationColor';
