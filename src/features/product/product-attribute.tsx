import { useProductContext } from '@src/context/product-context';
import { cn } from '@src/lib/utils';
import HTMLReactParser from 'html-react-parser';

interface IProductTerm {
  term: string;
}

export function ProductAttribute(props: IProductTerm) {
  const { term } = props;
  const { product } = useProductContext();

  if (!product) return null;

  if (!product.taxonomies) return null;

  const theTerms = product.taxonomies?.find((product_term) => product_term.type === 'pa_' + term);

  if (!theTerms) return null;

  return (
    <span
      className={cn('product-attribute', [
        `product-attribute--${term}`,
        `product-attribute--${term}-${theTerms.slug}`,
      ])}
    >
      {HTMLReactParser(theTerms.name)}
    </span>
  );
}
