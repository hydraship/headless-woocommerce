import { ParsedBlock } from '@src/components/blocks';
import { useContentContext } from '@src/context/content-context';
import { useSiteContext } from '@src/context/site-context';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { Product } from '@src/models/product';
import { isHotSale } from '@src/lib/helpers/product';
import { Settings } from '@src/models/settings';

type Props = {
  block: ParsedBlock;
};

export const CardBestSellerBadge = ({ block }: Props) => {
  const { type, data } = useContentContext();
  const { settings } = useSiteContext();
  if (type !== 'product' || !data) {
    return null;
  }

  const blockName = getBlockName(block);
  if ('CardBestSellerBadge' !== blockName) {
    return null;
  }

  const product = data as Product;
  if (!isHotSale(product, settings as Settings)) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;
  return (
    <div className={attributes.className ? attributes.className : 'badge best-seller-badge'}>
      BEST SELLER
    </div>
  );
};
