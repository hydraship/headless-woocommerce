import { useProductContext } from '@src/context/product-context';
import { useAttributeParams } from '@src/lib/hooks/product';
import { cn } from '@src/lib/utils';
import { Attribute } from '@src/models/product/types';
import { find, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

type Props = {
  attribute: Attribute;
  firstOption?: boolean;
};

export const ColorVariant: React.FC<Props> = ({ attribute, firstOption }) => {
  const attributeParams = useAttributeParams();

  const {
    product,
    actions: { onAttributeSelect },
  } = useProductContext();
  const { name, label, options } = attribute;

  const [currentAttributeLabel, setCurrentAttributeLabel] = useState('');

  useEffect(() => {
    if (!isEmpty(attributeParams[name]) && !isEmpty(name)) {
      const foundLabel = find(options, { slug: attributeParams[name] });
      if (!isEmpty(foundLabel)) {
        setCurrentAttributeLabel(foundLabel.label);
      }
      onAttributeSelect(name, attributeParams[name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributeParams]);

  if (isEmpty(product?.variantImageSrc)) return null;

  const handleOnChange = (value: string, label: string) => {
    setCurrentAttributeLabel(label);
    onAttributeSelect(name, value);
  };

  useEffectOnce(() => {
    if (firstOption) {
      const firstOption = options[0];
      if (firstOption) {
        handleOnChange(firstOption.name, firstOption.label);
      }
    }
  });

  if (isEmpty(product?.variantImageSrc)) return null;

  return (
    <>
      <label className="text-foreground text-base md:text-lg leading-7 font-semibold">
        Choose {label}: {currentAttributeLabel}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <label
            htmlFor={`${name}-${option.name}`}
            key={`color-variant-${option.name}-${index}`}
          >
            <input
              className="peer hidden"
              type="radio"
              name={name}
              id={`${name}-${option.name}`}
              checked={currentAttributeLabel === option.label}
              value={option.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleOnChange(e.target.value, option.label);
              }}
            />
            <div className="h-8 p-1 rounded-full border border-[#ebeced] cursor-pointer inline-flex justify-start items-center gap-2.5 peer-checked:outline peer-checked:outline-2 peer-checked:outline-[#DAA6B1]">
              <div className="w-6 h-6 flex justify-start items-start gap-2">
                <div
                  className={cn('h-6 w-6 relative rounded-full', {
                    'border-[#f5f5f5] border': option.name === 'white',
                  })}
                  style={{ backgroundColor: option.value }}
                />
              </div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
};
