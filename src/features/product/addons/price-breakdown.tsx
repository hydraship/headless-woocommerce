import { useAddToCartContext } from '@src/context/add-to-cart-context';
import { useProductContext } from '@src/context/product-context';
import { useSiteContext } from '@src/context/site-context';
import { useCallback, useEffect, useState } from 'react';

export const AddOnsPriceBreakdown = () => {
  const { currentCurrency: currency } = useSiteContext();
  const {
    product,
    state: { matchedVariant },
    fields,
  } = useProductContext();
  const { addons } = useAddToCartContext();
  const [addonsItems] = addons;
  const [optionalFee, setOptionalFee] = useState<number>(0);
  const [fieldsValue] = fields.value;
  let productPrice = 0.0;

  const calculateOptionalCost = useCallback(() => {
    if (!addonsItems) return 0;

    // find addonItems that has name attribute "I need custom work"
    const customWorkItem = addonsItems.find((item) =>
      ['I NEED CUSTOM WORK', 'CUSTOM WORK'].includes(item.name.toUpperCase())
    );

    if (customWorkItem?.options?.length === 0) return 0;

    return addonsItems.reduce((total, item) => {
      if (item.isCalculated) {
        if (item?.options && item.options.length > 0) {
          return (
            total +
            item.options.reduce((optionTotal, option) => {
              return optionTotal + Number(option.price);
            }, 0)
          );
        } else {
          return total + item.price * item.quantity;
        }
      }
      return total;
    }, 0);
  }, [addonsItems]);

  useEffect(() => {
    setOptionalFee(calculateOptionalCost());
  }, [calculateOptionalCost, setOptionalFee, fieldsValue]);

  if (product?.stockStatus === 'outofstock') return null;

  if (!product?.price) return null;

  if (product?.productType === 'simple') productPrice = product.price[currency];

  if (product?.productType === 'variable' && matchedVariant && matchedVariant.price) {
    productPrice = matchedVariant.price[currency];
  }

  return (
    <div className="addons-price-breakdown">
      <span>Options Total: ${optionalFee.toFixed(2)}</span>
      <span>Grand Total: ${(productPrice + optionalFee).toFixed(2)}</span>
    </div>
  );
};
