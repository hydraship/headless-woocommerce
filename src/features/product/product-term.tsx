import { useProductContext } from '@src/context/product-context';

interface IProductTerm {
  term: string;
}

export function ProductTerm(props: IProductTerm) {
  const { term } = props;
  const { product } = useProductContext();

  console.log({ taxo: product?.taxonomies });
  return (
    <>
      contoh
      <span>term</span>
      <span>{term}</span>
    </>
  );
}
