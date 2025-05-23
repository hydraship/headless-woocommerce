import { cn } from '@src/lib/utils';
import { useState, useEffect } from 'react';
import { formatPrice, sanitizeTitle } from '@src/lib/helpers/helper';
import { useProductContext } from '@src/context/product-context';
import { useSiteContext } from '@src/context/site-context';
import { ProductPrice } from '@src/models/product/types';

type TSubOption = {
  id: string;
  label: string;
};

export const AddToCartSubscriptionATT = () => {
  const {
    product,
    state: { matchedVariant },
    fields: { extra },
    modifyPrice: [, setCustomPrice],
  } = useProductContext();

  const [, setExtraFields] = extra;
  const { currentCurrency } = useSiteContext();
  const [selected, setSelected] = useState<string>('one-time');
  const [subOptions, setSubOptions] = useState<TSubOption[]>([]);
  const [subSelected, setSubSelected] = useState<string>('');

  const fieldKey = `convert_to_sub_${product?.productId}`;
  const subFieldKey = `convert_to_sub_dropdown${product?.productId}`;

  useEffect(() => {
    if (!product?.metaData?.subscriptionsATT?.schemes) return;

    const options: TSubOption[] = [];

    Object.keys(product?.metaData?.subscriptionsATT?.schemes).forEach((key) => {
      const option = product?.metaData?.subscriptionsATT?.schemes[key];

      let discountPrice = 0;
      let suffix = '';
      let productPrice = 0;

      if (option?.pricing_mode === 'inherit') {
        if (matchedVariant) {
          productPrice =
            matchedVariant?.price && matchedVariant.price[currentCurrency]
              ? parseFloat(matchedVariant.price[currentCurrency].toString())
              : 0;
        } else {
          productPrice =
            product?.price && product.price[currentCurrency]
              ? parseFloat(product.price[currentCurrency].toString())
              : 0;
        }
        discountPrice = parseFloat(
          (productPrice - (parseFloat(option?.discount) * productPrice) / 100).toFixed(2)
        );

        suffix = `(${option?.discount}% off)`;
      } else {
        discountPrice = parseFloat(option?.price);
      }
      const periodLabel =
        option?.interval === 1 ? option?.period : `${option?.interval} ${option?.period}s`;
      const label = `Every ${periodLabel} for $${discountPrice} ${suffix}`;

      options.push({
        id: option?.id,
        label,
      });
    });

    setSubOptions(options);
    setSubSelected((prev) => {
      if (prev !== '') return prev;
      return options[0].id;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedVariant]);

  useEffect(() => {
    setCustomPrice(() => {
      return selected === 'one-time'
        ? ''
        : String(subOptions.find((option) => option.id === subSelected)?.label);
    });
    setExtraFields((prev) => {
      return {
        ...prev,
        'subscribe-to-action-input': selected === 'one-time' ? 'no' : '',
        [fieldKey]: selected === 'one-time' ? '' : subSelected,
        [subFieldKey]: selected === 'one-time' ? '' : subSelected,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subSelected, selected]);

  if (!product || !product.hasSubscriptionsATT()) return null;

  if (product.hasVariations && !matchedVariant) return null;

  const mainField = 'subscriptions-att';
  const subField = 'subscriptions-att-options';

  const options = [
    {
      name: 'one-time',
      label: 'One-Time Purchase',
    },
    {
      name: 'subscribe-save',
      label: 'Subscribe & Save',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
    e.preventDefault();
  };

  const handleSubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubSelected(e.target.value);
    e.preventDefault();
  };

  return (
    <div className="product-addon-container">
      <div className={cn('addon-field-group radio-group', {})}>
        <p className="addon-field-title">
          Choose Variant: {options.find((option) => option.name === selected)?.label}
        </p>
        <div className="addon-field-options">
          {options?.map((option, key) => {
            const prefix = sanitizeTitle(`addon-${mainField}`);
            return (
              <label
                htmlFor={`${prefix}-${key}`}
                key={`${prefix}-${key}`}
                className={cn('addon-option', {
                  selected: selected === sanitizeTitle(option.name),
                })}
              >
                <input
                  type="radio"
                  id={`${prefix}-${key}`}
                  name={`addon-${product.productId}-subscriptions-att`}
                  value={sanitizeTitle(option.name)}
                  className={prefix}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>
      <div
        className={cn('addon-field-group radio-group', {
          '!hidden': selected !== 'subscribe-save',
        })}
      >
        <p className="addon-field-title">
          Deliver: {subOptions.find((option) => option.id === subSelected)?.label}
        </p>
        <div className="addon-field-options">
          {subOptions?.map((option, key) => {
            const prefix = sanitizeTitle(`addon-${subField}`);
            return (
              <label
                htmlFor={`${prefix}-${key}`}
                key={`${prefix}-${key}`}
                className={cn('addon-option', {
                  selected: subSelected === sanitizeTitle(option.id),
                })}
              >
                <input
                  type="radio"
                  id={`${prefix}-${key}`}
                  name={`addon-${product.productId}-subscriptions-att`}
                  value={sanitizeTitle(option.id)}
                  className={prefix}
                  onChange={handleSubChange}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
