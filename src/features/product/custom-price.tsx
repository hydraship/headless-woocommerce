import { useProductContext } from '@src/context/product-context';

export const CustomPrice = () => {
  const {
    modifyPrice: [customPrice],
  } = useProductContext();
  return (
    <div className="variable-product-price-matched">
      <span className="price">{customPrice}</span>
    </div>
  );
};
