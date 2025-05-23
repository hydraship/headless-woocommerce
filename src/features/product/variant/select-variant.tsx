import { isEmpty, sortBy } from 'lodash';
import { useEffect, useRef } from 'react';

import { useProductContext } from '@src/context/product-context';
import { Attribute, AttributeOptions, Image } from '@src/models/product/types';
import { useAttributeParams } from '@src/lib/hooks/product';
import { useEffectOnce } from 'usehooks-ts';

type Props = {
  attribute: Attribute;
  image?: Image[];
  onChange: (attributeName: string, optionValue: string) => void;
  firstOption?: boolean;
};

export const SelectVariant: React.FC<Props> = ({ attribute, onChange, firstOption }) => {
  const attributeParams = useAttributeParams();

  const {
    product,
    actions: { onAttributeSelect },
    state: { selectedAttributes },
  } = useProductContext();

  const { name, label, options } = attribute;
  // const attributeImageSrc = product?.variantImageSrc;
  const selectedRef = useRef(!isEmpty(selectedAttributes[name]) ? selectedAttributes[name] : '');

  useEffect(() => {
    if (!isEmpty(attributeParams[name]) && !isEmpty(name)) {
      onAttributeSelect(name, attributeParams[name]);
      selectedRef.current = attributeParams[name];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributeParams]);

  useEffectOnce(() => {
    if (firstOption) {
      const firstOption = options[0];
      if (firstOption) {
        onAttributeSelect(name, firstOption.name);
      }
    }
  });

  if (isEmpty(product?.variantImageSrc)) return null;

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(name, e.target.value);
    selectedRef.current = e.target.value;
  };

  const sortOptions = (options: AttributeOptions[]) => {
    if (product?.metaData?.wsc_gift_card) {
      return sortBy(options, (option) => parseInt(option.name));
    }

    return options;
  };

  return (
    <div className="product-variant-select">
      <label
        className="product-variant-select__label"
        htmlFor={name}
      >
        {label}:
      </label>
      <select
        className="product-variant-select__select"
        name={name}
        id={name}
        onChange={handleOnChange}
        value={selectedRef.current}
      >
        <option value="">Select Variant</option>
        {sortOptions(options).map((option) => (
          <option
            key={option.name}
            value={option.name}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
