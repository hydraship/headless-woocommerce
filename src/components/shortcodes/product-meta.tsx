import dynamic from 'next/dynamic';
import { type ShortcodeAttribute } from '@src/components/blocks/shortcode';

const ProductTerm = dynamic(() =>
  import('@src/features/product/product-term').then((mod) => mod.ProductTerm)
);

const ProductAttribute = dynamic(() =>
  import('@src/features/product/product-attribute').then((mod) => mod.ProductAttribute)
);

export function ProductMeta({ attributes }: { attributes: ShortcodeAttribute[] }) {
  const defaultAttributes: { [key: string]: string } = {
    type: 'taxonomy',
    term: 'brand',
  };

  attributes.forEach((attribute: ShortcodeAttribute) => {
    const name = String(attribute.name);
    if (name in defaultAttributes) {
      defaultAttributes[name] = String(attribute.value) ?? '';
    }
  });

  const { type, term } = defaultAttributes;

  switch (type) {
    case 'taxonomy':
      return <ProductTerm term={term} />;
    case 'product-attribute':
      return <ProductAttribute term={term} />;
    default:
      return null;
  }
}
