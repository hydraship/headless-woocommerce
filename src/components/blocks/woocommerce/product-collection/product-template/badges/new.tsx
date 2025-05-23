import { ParsedBlock } from '@src/components/blocks';
import { useContentContext } from '@src/context/content-context';
import { useSiteContext } from '@src/context/site-context';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { Product } from '@src/models/product';
import { toDateTime, isWithInMonthsAgo } from '@src/lib/helpers/date';

type Props = {
  block: ParsedBlock;
};

export const CardNewBadge = ({ block }: Props) => {
  const { type, data } = useContentContext();
  const { settings } = useSiteContext();
  if (type !== 'product' || !data) {
    return null;
  }

  const blockName = getBlockName(block);
  if ('CardNewBadge' !== blockName) {
    return null;
  }

  const product = data as Product;
  const newBadgeThreshold =
    +(settings?.product?.productGallery?.newProductBadgeThreshold ?? 0) / 30;
  const publishedDate = toDateTime(product.publishedAt as number);
  const isNew = isWithInMonthsAgo(publishedDate, newBadgeThreshold);
  if (!isNew) {
    return null;
  }

  const attributes = block.attrs as BlockAttributes;
  return (
    <div className={attributes.className ? attributes.className : 'badge new-badge'}>NEW!</div>
  );
};
