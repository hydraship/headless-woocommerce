import { ParsedBlock } from '@src/components/blocks';
import { useContentContext } from '@src/context/content-context';
import { Product } from '@src/models/product';
import { CardGalleryThumbnail } from '@src/features/product/card-elements/slideshow-thumbnail';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';

type Props = {
  block: ParsedBlock;
};

export const VariationThumbnail = ({ block }: Props) => {
  const { data } = useContentContext();
  const attribute = block.attrs as BlockAttributes;
  const product = data as Product;

  if (!product.hasVariations) return null;

  return (
    <span className={cn('price', attribute.className)}>
      <CardGalleryThumbnail
        product={product}
        detailsAlignment={'left'}
        setShowImageVariant={() => {}}
      />
    </span>
  );
};
