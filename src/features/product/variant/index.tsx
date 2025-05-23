import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { useProductContext } from '@src/context/product-context';
import { Attribute } from '@src/models/product/types';

const BoxedVariant = dynamic(() =>
  import('@src/features/product/variant/boxed-variant').then((mod) => mod.BoxedVariant)
);

const SelectVariant = dynamic(() =>
  import('@src/features/product/variant/select-variant').then((mod) => mod.SelectVariant)
);

const ImageVariant = dynamic(() =>
  import('@src/features/product/variant/image-variant').then((mod) => mod.ImageVariant)
);

const ColorVariant = dynamic(() =>
  import('@src/features/product/variant/color-variant').then((mod) => mod.ColorVariant)
);

export const Variant = () => {
  const {
    product,
    state: { selectedAttributes },
    actions: { onAttributeSelect },
  } = useProductContext();

  const availableAttributes = product?.getAvailableAttributes();

  const [theAttributes, setTheAttributes] = useState<Attribute[]>(availableAttributes ?? []);

  useEffect(() => {
    const filteredSelectedAttributes = Object.fromEntries(
      Object.entries(selectedAttributes).filter(([_, value]) => value !== undefined)
    ) as { [key: string]: string };

    const updatedAttributes = product?.getAvailableAttributesBasedOnSelection(
      filteredSelectedAttributes
    );
    setTheAttributes(updatedAttributes ?? []);
  }, [product, selectedAttributes]);

  const handleAttributeChange = (attributeName: string, optionValue: string) => {
    if (!product?.attributes) return;

    const newSelectedAttributes = { ...selectedAttributes, [attributeName]: optionValue };

    // Reset subsequent attributes
    const attributeNames = Array.isArray(product?.attributes)
      ? product.attributes.map((attr) => attr.name)
      : [];
    const attributeIndex = attributeNames.indexOf(attributeName);
    for (let i = attributeIndex + 1; i < attributeNames.length; i++) {
      delete newSelectedAttributes[attributeNames[i]];
    }

    onAttributeSelect(attributeName, optionValue);

    const filteredNewSelectedAttributes = Object.fromEntries(
      Object.entries(newSelectedAttributes).filter(([_, value]) => value !== undefined)
    ) as { [key: string]: string };

    setTheAttributes(
      product?.getAvailableAttributesBasedOnSelection(filteredNewSelectedAttributes) ?? []
    );
  };

  if (!availableAttributes || Object.keys(availableAttributes).length === 0) return null;

  if (theAttributes.length === 0) {
    return null;
  }

  return (
    <div className="product-variant-container">
      {theAttributes?.map((attribute: Attribute, key: Number) => {
        if (product?.metaData?.wsc_gift_card) {
          return (
            <SelectVariant
              attribute={attribute}
              key={`select-variant-${key}`}
              onChange={handleAttributeChange}
              firstOption={key === 0}
            />
          );
        }
        switch (attribute.type) {
          case 'boxed':
          case 'button':
          case 'select':
            return (
              <BoxedVariant
                attribute={attribute}
                key={`boxed-variant-${key}`}
                onChange={handleAttributeChange}
                firstOption={key === 0}
              />
            );
          case 'image':
            return (
              <ImageVariant
                attribute={attribute}
                key={`image-variant-${key}`}
                onChange={handleAttributeChange}
                firstOption={key === 0}
              />
            );
          case 'color':
            return (
              <ColorVariant
                attribute={attribute}
                key={`color-variant-${key}`}
                firstOption={key === 0}
              />
            );
          default:
            return (
              <BoxedVariant
                attribute={attribute}
                key={`boxed-variant-${key}`}
                onChange={handleAttributeChange}
                firstOption={key === 0}
              />
            );
        }
      })}
    </div>
  );
};
