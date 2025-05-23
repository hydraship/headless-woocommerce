import { useAddToCartContext } from '@src/context/add-to-cart-context';
import { useProductContext } from '@src/context/product-context';
import { useSiteContext } from '@src/context/site-context';
import { useCallback, useEffect, useState } from 'react';

export const BundlePriceBreakdown = () => {
  const { currentCurrency: currency } = useSiteContext();
  const {
    product,
    state: { matchedVariant },
  } = useProductContext();
  const { bundles } = useAddToCartContext();
  const [items] = bundles;
  const [optionalFee, setOptionalFee] = useState<number>(0);
  const [productPrice, setProductPrice] = useState<number>(0);

  const calculateOptionalCost = useCallback(() => {
    if (!items) return 0;

    return items.reduce((total, item) => {
      // calculate total cost of all selected options
      return total + item.price * item.quantity;
    }, 0);
  }, [items]);

  useEffect(() => {
    setOptionalFee(calculateOptionalCost());
  }, [calculateOptionalCost, setOptionalFee, items]);

  useEffect(() => {
    if ((product?.productType === 'simple' || product?.productType === 'bundle') && product.price) {
      setProductPrice(product.price[currency]);
    }
    if (product?.productType === 'variable' && matchedVariant && matchedVariant.price) {
      setProductPrice(matchedVariant.price[currency]);
    }
  }, [product, matchedVariant, currency]);

  if (product?.stockStatus === 'outofstock') return null;

  if (!product?.price) return null;

  return (
    <div className="addons-price-breakdown">
      <span>Options Total: ${optionalFee.toFixed(2)}</span>
      <span>Grand Total: ${(productPrice + optionalFee).toFixed(2)}</span>
    </div>
  );
};
