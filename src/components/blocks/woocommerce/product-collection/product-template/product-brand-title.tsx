import { ParsedBlock } from '@src/components/blocks';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { makeLinkRelative } from '@src/lib/helpers/helper';
import { Product } from '@src/models/product';
import HTMLReactParser from 'html-react-parser';

type WooCommerceProductBrandTitleTemplateProps = {
  block: ParsedBlock;
};

export const WooCommerceProductBrandTitleTemplate = ({
  block,
}: WooCommerceProductBrandTitleTemplateProps) => {
  const { type, data } = useContentContext();

  if (!data || type !== 'product') return null;

  const blockName = getBlockName(block);

  if (blockName !== 'ProductBrandTitle') return null;

  const product = data as Product;
  const attribute = block.attrs as BlockAttributes;

  const brand = product.taxonomies?.find(
    (taxonomy) => taxonomy.type.includes('brand') || taxonomy.type.includes('pa_brand')
  );

  if (!brand) return null;

  return (
    <>
      {brand.name && brand.url && (
        <p className={attribute.className}>
          {/* <a href={makeLinkRelative(brand.url)}>{HTMLReactParser(brand.name)}</a> */}
          {HTMLReactParser(brand.name)}
        </p>
      )}
    </>
  );
};
