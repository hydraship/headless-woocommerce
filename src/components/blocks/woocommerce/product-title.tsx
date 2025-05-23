import { useProductContext } from '@src/context/product-context';

export const ProductTitle = () => {
  const { product } = useProductContext();

  if (!product) {
    return null;
  }

  const productName = product?.metaData?.acf?.product_code
    ? `${product.name} - ${product.metaData?.acf?.product_code}`
    : product.name;

  return <>{productName}</>;
};
